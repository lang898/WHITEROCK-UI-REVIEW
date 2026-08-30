import React, { useState } from 'react';
import { Check, CheckCircle2, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react';
import { WhatsAppIcon } from '../components/SocialIcons';
import { siteConfig } from '../data';
import { FaqSectionWithSchema } from '../components/FaqSectionWithSchema';
import type { LocaleConfig } from '../types';
import type { ShareContent } from '../components/SocialShareModal';

interface ContactViewProps {
  currentLocale: LocaleConfig;
  onOpenShareModal?: (content: ShareContent) => void;
}

export const ContactView: React.FC<ContactViewProps> = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', country: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const formConfigured = Boolean(siteConfig.web3FormsAccessKey);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionError('');
    if (!formConfigured) {
      setSubmissionError(`Online form submission is being configured. Please email ${siteConfig.email} or contact us by WhatsApp.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: siteConfig.web3FormsAccessKey,
          subject: `WHITEROCK website inquiry from ${formData.company || formData.name}`,
          from_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          destination: formData.country,
          message: formData.message,
          botcheck: '',
        }),
      });
      if (!response.ok) throw new Error('Submission failed');
      setIsSubmitted(true);
    } catch {
      setSubmissionError(`The form could not be sent. Please email ${siteConfig.email}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wr-contact-v2">
      <header className="wr-contact-v2__header wr-section-band">
        <span className="wr-eyebrow">Direct factory contact</span>
        <h1>Send the drawing. Define the stone package.</h1>
        <p>For quotation or project review, share the material direction, dimensions, quantity, destination and required timing with the WHITEROCK team in Vietnam.</p>
      </header>

      <section className="wr-contact-v2__main wr-section-band wr-section-band--mist" aria-label="Contact and quotation information">
        <div className="wr-contact-v2__details">
          <div>
            <span className="wr-eyebrow">Legal entity & factory contact</span>
            <h2>WHITEROCK COMPANY LIMITED</h2>
            <p className="wr-contact-v2__legal">CÔNG TY TNHH WHITEROCK</p>
          </div>
          <address>
            <span><MapPin />{siteConfig.address}</span>
            <a href={`mailto:${siteConfig.email}`}><Mail />{siteConfig.email}</a>
            <a href={`tel:${siteConfig.telHref}`}><Phone />{siteConfig.tel}</a>
            <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />WhatsApp {siteConfig.whatsapp}</a>
          </address>
          <div className="wr-contact-v2__prepare">
            <h3>For quotation, please prepare</h3>
            <ul>
              <li><Check />Drawing or specification</li>
              <li><Check />Material / color reference</li>
              <li><Check />Dimensions and quantity</li>
              <li><Check />Destination</li>
              <li><Check />Required timing</li>
              <li><Check />Packing or labeling requirements, if applicable</li>
            </ul>
          </div>
          <div className="wr-contact-v2__direct-actions">
            <a className="wr-button wr-button--primary" href={`mailto:${siteConfig.email}`}><Mail />Email WHITEROCK</a>
            <a className="wr-button wr-button--secondary" href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />WhatsApp</a>
          </div>
        </div>

        <div className="wr-contact-v2__form-card">
          {isSubmitted ? (
            <div className="wr-contact-v2__success">
              <CheckCircle2 />
              <h2>Inquiry received.</h2>
              <p>Your inquiry was submitted. The WHITEROCK team will review the information and confirm the appropriate next step.</p>
              <button className="wr-button wr-button--secondary" onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', phone: '', company: '', country: '', message: '' }); }}>Send another inquiry</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} aria-busy={isSubmitting}>
              <div className="wr-contact-v2__form-heading"><MessageSquare /><div><span>PROJECT INQUIRY</span><h2>Send project information</h2></div></div>
              {!formConfigured && <div className="wr-contact-v2__form-notice" role="status"><strong>Online form setup pending.</strong><span>Until the secure submission key is configured, please use the email or WhatsApp links shown on this page.</span></div>}
              <div className="wr-contact-v2__fields">
                <label>Full Name *<input required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} autoComplete="name" /></label>
                <label>Work Email *<input required type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} autoComplete="email" /></label>
                <label>Company<input value={formData.company} onChange={(event) => setFormData({ ...formData, company: event.target.value })} autoComplete="organization" /></label>
                <label>Phone / WhatsApp<input type="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} autoComplete="tel" /></label>
                <label className="wr-contact-v2__wide">Destination / Country<input value={formData.country} onChange={(event) => setFormData({ ...formData, country: event.target.value })} autoComplete="country-name" /></label>
                <label className="wr-contact-v2__wide">Project details *<textarea required rows={7} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="Product, material/color, dimensions, quantity, destination, timing and any drawing/specification references." /></label>
              </div>
              {submissionError && <p className="wr-contact-v2__error" role="alert">{submissionError}</p>}
              <button className="wr-button wr-button--primary" type="submit" disabled={isSubmitting || !formConfigured}><Send />{isSubmitting ? 'Sending…' : 'Submit Inquiry'}</button>
            </form>
          )}
        </div>
      </section>

      <section className="wr-section-band"><FaqSectionWithSchema /></section>
    </div>
  );
};
