# WHITEROCK Studio Hybrid

Static React and Vite website for WHITEROCK COMPANY LIMITED.

## Local development

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

No API key or server-side runtime is required.

Without a form key, Contact, RFQ, and Samples show direct email/copy and
WhatsApp actions. Selected products and colors remain available to copy.
No submission button opens an email draft or reports an unsubmitted request as sent.

To enable online text inquiries, configure `VITE_WEB3FORMS_ACCESS_KEY` with a
verified key for the sales inbox, then rebuild. All three forms require a
successful API response and stop waiting after 15 seconds. Failed requests keep
the entered details and provide direct contact actions.

File attachments are disabled by default. Set
`VITE_WEB3FORMS_ATTACHMENTS_ENABLED=true` only after confirming paid Web3Forms
attachment support. The direct attachment endpoint supports one file up to 5 MB;
the earlier three-file/30 MB specification requires a separately configured
advanced uploader. Buyers can share a drawing link or send larger sets by email
or WhatsApp. See the [official upload documentation](https://docs.web3forms.com/getting-started/pro-features/advanced-file-uploader).

Public locale availability is defined in `src/data/site.ts` and currently
includes English only. Vietnamese translations are retained for later review.

The shared 1200 x 630 social image is generated from the owner-supplied
waterfall kitchen image with `npm run images:social`.

## Production build

```bash
npm run build
```

Publish the generated `dist/` directory. For Cloudflare Pages use:

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: none required

The Vite build creates static fallback entry files for the public routes and `/admin/`.
