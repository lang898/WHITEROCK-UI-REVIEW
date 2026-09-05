export const INQUIRY_TIMEOUT_MS = 15_000;
export const MAX_DRAWING_SIZE = 5 * 1024 * 1024;
export const DRAWING_UPLOAD_HELPER = 'One JPG, PNG, or PDF, up to 5 MB. Send larger drawing sets by email or WhatsApp.';

interface InquiryRequest {
  accessKey: string;
  fields: Record<string, string>;
  files?: File[];
}

export async function submitInquiry({ accessKey, fields, files = [] }: InquiryRequest): Promise<void> {
  if (!accessKey.trim()) throw new Error('Online submission is unavailable.');
  if (files.length > 1 || files.some((file) => file.size > MAX_DRAWING_SIZE)) {
    throw new Error(DRAWING_UPLOAD_HELPER);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), INQUIRY_TIMEOUT_MS);
  const body = new FormData();
  Object.entries(fields).forEach(([key, value]) => body.append(key, value));
  body.set('access_key', accessKey);
  body.set('botcheck', '');
  files.forEach((file) => body.append('attachment', file, file.name));

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body,
      signal: controller.signal,
    });
    const result: unknown = await response.json();
    if (!response.ok || !result || typeof result !== 'object' || !('success' in result) || result.success !== true) {
      throw new Error('Submission was not accepted.');
    }
  } finally {
    clearTimeout(timeout);
  }
}
