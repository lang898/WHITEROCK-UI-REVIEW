import React, { useEffect, useId, useState } from 'react';
import { Check, Copy, Mail, MessageCircle } from 'lucide-react';
import { siteConfig } from '../data/site';

interface DirectInquiryContactProps {
  title?: string;
  headingId?: string;
  instructions?: string;
  summary?: string;
}

export function DirectInquiryContact({
  title = 'Send your drawings and requirements.',
  headingId,
  instructions = 'Please include: drawing or specification, material, dimensions, quantity, destination, and timing.',
  summary,
}: DirectInquiryContactProps) {
  const id = useId();
  const [copied, setCopied] = useState<'email' | 'summary' | null>(null);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    setCopied(null);
    setCopyError(false);
  }, [summary]);

  const copy = async (value: string, kind: 'email' | 'summary') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      setCopyError(false);
    } catch {
      setCopied(null);
      setCopyError(true);
    }
  };

  return (
    <section className="wr-direct-contact" aria-labelledby={headingId || `${id}-title`}>
      <span className="wr-eyebrow">Contact the sales team</span>
      <h2 id={headingId || `${id}-title`}>{title}</h2>
      <p>{instructions}</p>
      <div className="wr-direct-contact__email">
        <label htmlFor={`${id}-email`}>Email</label>
        <div>
          <input id={`${id}-email`} readOnly value={siteConfig.email} onFocus={(event) => event.currentTarget.select()} />
          <button type="button" className="wr-icon-button" title="Copy email" aria-label="Copy email" onClick={() => copy(siteConfig.email, 'email')}>
            {copied === 'email' ? <Check /> : <Copy />}
          </button>
        </div>
      </div>
      <div className="wr-direct-contact__actions">
        <a className="wr-button wr-button--primary" href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" />Chat on WhatsApp
        </a>
        <a className="wr-button wr-button--secondary" href={`mailto:${siteConfig.email}`}><Mail aria-hidden="true" />Email the team</a>
      </div>
      <p className="wr-direct-contact__phone">WhatsApp: {siteConfig.whatsapp}</p>
      {summary && (
        <div className="wr-direct-contact__summary">
          <label htmlFor={`${id}-summary`}>Your selected list</label>
          <textarea id={`${id}-summary`} readOnly rows={5} value={summary} onFocus={(event) => event.currentTarget.select()} />
          <button type="button" className="wr-button wr-button--secondary" onClick={() => copy(summary, 'summary')}><Copy aria-hidden="true" />Copy selected list</button>
        </div>
      )}
      <p className={copyError ? 'wr-form-error' : 'wr-direct-contact__status'} role="status">
        {copyError ? 'Copy is unavailable. Select the email address or list above to copy it manually.' : copied === 'email' ? 'Email copied.' : copied === 'summary' ? 'Selected list copied.' : ''}
      </p>
    </section>
  );
}
