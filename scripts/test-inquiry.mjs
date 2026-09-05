import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { transform } from 'esbuild';

const { code } = await transform(await readFile('src/lib/submitInquiry.ts', 'utf8'), { loader: 'ts', format: 'esm' });
const { submitInquiry, INQUIRY_TIMEOUT_MS, MAX_DRAWING_SIZE } = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
const request = { accessKey: 'LOCAL-TEST-ONLY', fields: { email: 'test@example.com', message: 'Test inquiry', access_key: 'should-not-override' } };

test('rejects an unconfigured form without sending anything', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', () => { throw new Error('Unexpected network call'); });
  await assert.rejects(submitInquiry({ ...request, accessKey: ' ' }));
  assert.equal(fetch.mock.callCount(), 0);
});

test('requires acknowledgement and preserves the complete inquiry payload', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://api.web3forms.com/submit');
    assert.equal(options.method, 'POST');
    assert.equal(options.body.get('email'), request.fields.email);
    assert.equal(options.body.get('message'), request.fields.message);
    assert.equal(options.body.get('access_key'), request.accessKey);
    assert.ok(options.signal instanceof AbortSignal);
    return Response.json({ success: true });
  });
  await submitInquiry(request);
});

for (const [name, response] of [
  ['HTTP failure', () => Response.json({ success: true }, { status: 500 })],
  ['API rejection despite HTTP 200', () => Response.json({ success: false })],
  ['nonboolean success', () => Response.json({ success: 'true' })],
  ['malformed response', () => new Response('not JSON')],
  ['network failure', () => { throw new TypeError('Offline'); }],
]) {
  test(`does not report success after ${name}`, async (t) => {
    t.mock.method(globalThis, 'fetch', response);
    await assert.rejects(submitInquiry(request));
  });
}

test('aborts an unresponsive request at 15 seconds', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  let signal;
  t.mock.method(globalThis, 'fetch', (_, options) => {
    signal = options.signal;
    return new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }));
  });
  const pending = assert.rejects(submitInquiry(request), { name: 'AbortError' });
  t.mock.timers.tick(INQUIRY_TIMEOUT_MS - 1);
  assert.equal(signal.aborted, false);
  t.mock.timers.tick(1);
  await pending;
  assert.equal(signal.aborted, true);
});

test('rejects unsupported drawing sets before the network request', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', () => { throw new Error('Unexpected network call'); });
  const file = new File(['drawing'], 'drawing.pdf', { type: 'application/pdf' });
  await assert.rejects(submitInquiry({ ...request, files: [file, file] }));
  await assert.rejects(submitInquiry({ ...request, files: [new File([new Uint8Array(MAX_DRAWING_SIZE + 1)], 'large.pdf')] }));
  assert.equal(fetch.mock.callCount(), 0);
});

test('sends an enabled attachment using the documented field name', async (t) => {
  t.mock.method(globalThis, 'fetch', async (_, options) => {
    assert.equal(options.body.get('attachment').name, 'drawing.pdf');
    assert.equal(options.body.has('attachment_1'), false);
    return Response.json({ success: true });
  });
  await submitInquiry({ ...request, files: [new File(['drawing'], 'drawing.pdf', { type: 'application/pdf' })] });
});
