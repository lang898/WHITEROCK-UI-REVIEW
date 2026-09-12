import React, { useState } from 'react';
import { ArrowRight, ArrowUpRight, Building2, Check, CheckCircle2, Copy, FileText, HelpCircle, Mail, MapPin, MessageSquare, Package, Phone, Send } from 'lucide-react';
import { FaqSectionWithSchema } from '../components/FaqSectionWithSchema';
import { WhatsAppIcon } from '../components/SocialIcons';
import { Input } from '../components/ui/Input';
import { DirectInquiryContact } from '../components/DirectInquiryContact';
import { submitInquiry } from '../lib/submitInquiry';
import { openRfqBuilder } from '../lib/uiEvents';
import { siteConfig } from '../data';
import { routePath } from '../routes';
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
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${siteConfig.email}`;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !siteConfig.web3FormsAccessKey) return;
    setSubmissionError('');
    setIsSubmitting(true);
    const payload = { access_key: siteConfig.web3FormsAccessKey, subject: `${siteConfig.displayBrand} ${formData.inquiryType || 'website'} inquiry from ${formData.company || formData.name}`, from_name: formData.name, email: formData.email, company: formData.company, inquiry_type: formData.inquiryType, message: formData.message, botcheck: '' };
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
      <header className="wr-landing-hero wr-landing-hero--contact"><span className="wr-eyebrow">Contact</span><h1>One direct line to the Vietnam manufacturing team.</h1><p>Use this page for technical questions, supplier qualification, samples, documents, or existing-order support. New project pricing belongs in the RFQ Builder so the drawing and specifications stay with the inquiry.</p><div className="wr-landing-hero__actions"><button className="wr-button wr-button--primary" type="button" onClick={openRfqBuilder}><FileText />Open RFQ Builder</button><a className="wr-button wr-button--secondary" href={routePath('samples')}><Package />Request samples</a></div></header>

      <section className="wr-contact-cards wr-section-band" aria-label="Direct contact options">
        <article><Mail /><span className="wr-eyebrow">Email</span><h2>{siteConfig.email}</h2><p>For drawings, documents, samples, and general manufacturing communication.</p><div><a className="wr-button wr-button--secondary" href={`mailto:${siteConfig.email}`}>Email us</a><button className="wr-button wr-button--ghost" type="button" onClick={copyEmail}>{copied ? <Check /> : <Copy />}{copied ? 'Copied' : 'Copy email'}</button></div></article>
        <article><WhatsAppIcon /><span className="wr-eyebrow">WhatsApp</span><h2>Direct conversation</h2><p>Use WhatsApp for quick production, sample, document, or project follow-up.</p><a className="wr-button wr-button--secondary" href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">Open WhatsApp<ArrowUpRight /></a></article>
        <article><MapPin /><span className="wr-eyebrow">Factory</span><h2>Dong Nai, Vietnam</h2><p>{siteConfig.address}</p><small>{siteConfig.legalName}</small></article>
      </section>

      <section className="wr-contact-main wr-section-band wr-section-band--mist" aria-labelledby="contact-form-title">
        <aside className="wr-contact-details"><div><Building2 /><span className="wr-eyebrow">Vietnam manufacturing</span><h2>Direct factory contact.</h2><p>Vanity tops, kitchen countertops, furniture surfaces, and project components are fabricated in Dong Nai Province.</p></div><address><span><MapPin />{siteConfig.address}</span><span><Building2 />Contact: {siteConfig.contactPerson}</span><a href={`tel:${siteConfig.telHref}`}><Phone />{siteConfig.tel}<ArrowUpRight /></a></address><button className="wr-button wr-button--primary" type="button" onClick={openRfqBuilder}><FileText />Request project pricing</button>{onOpenShareModal && <button className="wr-button wr-button--secondary" onClick={() => onOpenShareModal({ title: `${siteConfig.displayBrand} contact`, text: 'Contact the Vietnam manufacturing team for stone samples, technical support, documentation, and project communication.', type: 'site' })}><MessageSquare />Share contact page</button>}</aside>

        <div className="wr-contact-form-panel">
          {!siteConfig.web3FormsAccessKey ? <DirectInquiryContact headingId="contact-form-title" /> : isSubmitted ? <div className="wr-contact-success" role="status"><CheckCircle2 /><span className="wr-eyebrow">Message received</span><h2>Thank you, {formData.name}.</h2><p className="wr-submission-notice wr-submission-notice--success">{submissionNote}</p><button className="wr-button wr-button--secondary" onClick={() => setIsSubmitted(false)}>Send another message</button></div> : <form onSubmit={handleSubmit} aria-labelledby="contact-form-title" aria-busy={isSubmitting}><div className="wr-contact-form-heading"><span className="wr-eyebrow">General inquiry</span><h2 id="contact-form-title">How can we help?</h2><p>For pricing, quantities, destination, and production drawings, use the RFQ Builder instead.</p></div><div className="wr-form-grid"><Input id="contact-name" label="Full name *" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} /><Input id="contact-email" label="Work email *" type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} /><Input id="contact-company" label="Company" value={formData.company} onChange={(event) => setFormData({ ...formData, company: event.target.value })} /><label className="wr-contact-field" htmlFor="contact-inquiry-type"><span>Inquiry type *</span><select id="contact-inquiry-type" required value={formData.inquiryType} onChange={(event) => setFormData({ ...formData, inquiryType: event.target.value })}><option value="">Select an inquiry type</option><option>General question</option><option>Samples and material review</option><option>Technical documents</option><option>Supplier qualification</option><option>Existing order or production support</option><option>Other</option></select></label><label className="wr-contact-field wr-form-grid__wide" htmlFor="contact-message"><span>Message *</span><textarea id="contact-message" required rows={6} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="Tell us what you need and include any relevant order, product, material, or document reference." /></label></div>{submissionError && <><p className="wr-submission-notice wr-submission-notice--error" role="alert">{submissionError}</p><DirectInquiryContact title="Contact us directly." /></>}<button className="wr-button wr-button--primary wr-contact-submit" type="submit" disabled={isSubmitting}><Send />{isSubmitting ? 'Sending…' : 'Send message'}</button></form>}
        </div>
      </section>

      <section className="wr-contact-shortcuts wr-section-band"><a href={routePath('samples')}><Package /><div><h3>Sample program</h3><p>Build a physical material shortlist.</p></div><ArrowRight /></a><a href={routePath('resources-faq')}><HelpCircle /><div><h3>FAQ</h3><p>Materials, documents, production, and export answers.</p></div><ArrowRight /></a></section>
      <section className="wr-contact-faq wr-section-band"><FaqSectionWithSchema currentLocale={currentLocale} title="Procurement and manufacturing FAQ" subtitle="Direct answers about materials, drawings, samples, packing, and order-specific documents." showSchemaInspector={false} /></section>
    </div>
  );
};
