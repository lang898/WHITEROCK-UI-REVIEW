import React, { useState } from 'react';
import { ArrowUpRight, Building2, CheckCircle2, FileText, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { FaqSectionWithSchema } from '../components/FaqSectionWithSchema';
import { WhatsAppIcon } from '../components/SocialIcons';
import { Input } from '../components/ui/Input';
import { DirectInquiryContact } from '../components/DirectInquiryContact';
import { submitInquiry } from '../lib/submitInquiry';
import { openRfqBuilder } from '../lib/uiEvents';
import { siteConfig } from '../data';
import type { ShareContent } from '../components/SocialShareModal';
import type { LocaleConfig } from '../types';

interface ContactViewProps {
  currentLocale: LocaleConfig;
  onOpenShareModal?: (content: ShareContent) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ currentLocale, onOpenShareModal }) => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', inquiryType: '', message: '' });
  const [submissionError, setSubmissionError] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !siteConfig.web3FormsAccessKey) return;
    setSubmissionError('');
    setIsSubmitting(true);
    const payload = {
      access_key: siteConfig.web3FormsAccessKey,
      subject: `${siteConfig.displayBrand} ${formData.inquiryType || 'website'} inquiry from ${formData.company || formData.name}`,
      from_name: formData.name,
      email: formData.email,
      company: formData.company,
      inquiry_type: formData.inquiryType,
      message: formData.message,
      botcheck: '',
    };
    try {
      await submitInquiry({ accessKey: siteConfig.web3FormsAccessKey, fields: payload, files: [] });
      setSubmissionNote('Thank you. We will reply by email shortly.');
      setIsSubmitted(true);
    } catch {
      setSubmissionError(`Something went wrong or the request timed out. Please email ${siteConfig.email} directly.`);
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="wr-contact-page">
      <header className="wr-contact-hero wr-section-band">
        <span className="wr-eyebrow">{siteConfig.displayBrand}</span>
        <h1>Direct contact for samples, technical questions, and ongoing programs.</h1>
        <p>Use this page for general communication, documentation, supplier qualification, samples, or existing-order support. For a new project quotation, use the RFQ Builder so specifications stay with the inquiry.</p>
        <div className="mt-6 flex flex-wrap gap-3"><button className="wr-button wr-button--primary" type="button" onClick={openRfqBuilder}><FileText aria-hidden="true" />Open RFQ Builder</button><a className="wr-button wr-button--secondary" href={`mailto:${siteConfig.email}`}><Mail aria-hidden="true" />Email the team</a></div>
      </header>

      <section className="wr-contact-main wr-section-band wr-section-band--mist" aria-labelledby="contact-form-title">
        <aside className="wr-contact-details">
          <div><Building2 aria-hidden="true" /><span className="wr-eyebrow">Vietnam manufacturing</span><h2>Direct factory contact.</h2><p>Vanity tops, kitchen countertops, furniture surfaces, and project components are fabricated in Dong Nai Province.</p></div>
          <address><span><MapPin aria-hidden="true" />{siteConfig.address}</span><span><Building2 aria-hidden="true" />Legal entity: {siteConfig.legalName}</span><span><Building2 aria-hidden="true" />Contact: {siteConfig.contactPerson}</span><a href={`mailto:${siteConfig.email}`}><Mail aria-hidden="true" />{siteConfig.email}<ArrowUpRight aria-hidden="true" /></a><a href={`tel:${siteConfig.telHref}`}><Phone aria-hidden="true" />{siteConfig.tel}<ArrowUpRight aria-hidden="true" /></a><a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />WhatsApp<ArrowUpRight aria-hidden="true" /></a></address>
          <button className="wr-button wr-button--primary" type="button" onClick={openRfqBuilder}><FileText aria-hidden="true" />Request project pricing</button>
          {onOpenShareModal && <button className="wr-button wr-button--secondary" onClick={() => onOpenShareModal({ title: `${siteConfig.displayBrand} contact`, text: 'Contact the Vietnam manufacturing team for stone samples, technical support, documentation, and project communication.', type: 'site' })}><MessageSquare aria-hidden="true" />Share contact page</button>}
        </aside>

        <div className="wr-contact-form-panel">
          {!siteConfig.web3FormsAccessKey ? <DirectInquiryContact headingId="contact-form-title" /> : isSubmitted ? (
            <div className="wr-contact-success" role="status"><CheckCircle2 aria-hidden="true" /><span className="wr-eyebrow">Message received</span><h2>Thank you, {formData.name}.</h2><p className="wr-submission-notice wr-submission-notice--success">{submissionNote}</p><button className="wr-button wr-button--secondary" onClick={() => setIsSubmitted(false)}>Send another message</button></div>
          ) : (
            <form onSubmit={handleSubmit} aria-labelledby="contact-form-title" aria-busy={isSubmitting}>
              <div className="wr-contact-form-heading"><span className="wr-eyebrow">General inquiry</span><h2 id="contact-form-title">How can we help?</h2><p>For pricing, quantities, destination, and production drawings, use the RFQ Builder instead.</p></div>
              <div className="wr-form-grid">
                <Input id="contact-name" label="Full name *" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
                <Input id="contact-email" label="Work email *" type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} />
                <Input id="contact-company" label="Company" value={formData.company} onChange={(event) => setFormData({ ...formData, company: event.target.value })} />
                <label className="wr-contact-field" htmlFor="contact-inquiry-type"><span>Inquiry type *</span><select id="contact-inquiry-type" required value={formData.inquiryType} onChange={(event) => setFormData({ ...formData, inquiryType: event.target.value })}><option value="">Select an inquiry type</option><option>General question</option><option>Samples and material review</option><option>Technical documents</option><option>Supplier qualification</option><option>Existing order or production support</option><option>Other</option></select></label>
                <label className="wr-contact-field wr-form-grid__wide" htmlFor="contact-message"><span>Message *</span><textarea id="contact-message" required rows={6} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="Tell us what you need and include any relevant order, product, material, or document reference." /></label>
              </div>
              {submissionError && <><p className="wr-submission-notice wr-submission-notice--error" role="alert">{submissionError}</p><DirectInquiryContact title="Contact us directly." /></>}
              <button className="wr-button wr-button--primary wr-contact-submit" type="submit" disabled={isSubmitting}><Send aria-hidden="true" />{isSubmitting ? 'Sending…' : 'Send message'}</button>
            </form>
          )}
        </div>
      </section>

      <section className="wr-contact-faq wr-section-band"><FaqSectionWithSchema currentLocale={currentLocale} title="Procurement and manufacturing FAQ" subtitle="Direct answers about materials, drawings, samples, packing, and order-specific documents." showSchemaInspector={false} /></section>
    </div>
  );
};
