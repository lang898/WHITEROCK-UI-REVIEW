import React, { useState } from 'react';
import { ArrowUpRight, Building2, CheckCircle2, File, Mail, MapPin, MessageSquare, Phone, Send, UploadCloud, X } from 'lucide-react';
import { FaqSectionWithSchema } from '../components/FaqSectionWithSchema';
import { WhatsAppIcon } from '../components/SocialIcons';
import { Input } from '../components/ui/Input';
import { DirectInquiryContact } from '../components/DirectInquiryContact';
import { DRAWING_UPLOAD_HELPER, MAX_DRAWING_SIZE, submitInquiry } from '../lib/submitInquiry';
import { siteConfig } from '../data';
import type { ShareContent } from '../components/SocialShareModal';
import type { LocaleConfig } from '../types';

interface ContactViewProps {
  currentLocale: LocaleConfig;
  onOpenShareModal?: (content: ShareContent) => void;
}

const ACCEPTED_FILE_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png']);

export const ContactView: React.FC<ContactViewProps> = ({ currentLocale, onOpenShareModal }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    location: '',
    projectType: '',
    message: '',
  });
  const [drawingFiles, setDrawingFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [submissionError, setSubmissionError] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addDrawingFiles = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    if (drawingFiles.length + incoming.length > 1) {
      setFileError(DRAWING_UPLOAD_HELPER);
      return;
    }
    if (incoming.some((file) => (!ACCEPTED_FILE_TYPES.has(file.type) && !/\.(pdf|jpe?g|png)$/i.test(file.name)) || file.size > MAX_DRAWING_SIZE)) {
      setFileError(DRAWING_UPLOAD_HELPER);
      return;
    }
    setDrawingFiles((current) => [...current, ...incoming]);
    setFileError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !siteConfig.web3FormsAccessKey) return;
    setSubmissionError('');
    setIsSubmitting(true);

    const subject = `WHITEROCK website inquiry from ${formData.company || formData.name}`;
    const payload = {
      access_key: siteConfig.web3FormsAccessKey,
      subject,
      from_name: formData.name,
      email: formData.email,
      company: formData.company,
      location: formData.location,
      project_type: formData.projectType,
      message: formData.message,
      botcheck: '',
    };

    try {
      await submitInquiry({ accessKey: siteConfig.web3FormsAccessKey, fields: payload, files: drawingFiles });
      setSubmissionNote('Thank you. We will reply by email shortly.');
      setIsSubmitted(true);
    } catch {
      setSubmissionError(`Something went wrong or the request timed out. Please email ${siteConfig.email} directly.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wr-contact-page">
      <header className="wr-contact-hero wr-section-band">
        <span className="wr-eyebrow">Contact WHITEROCK</span>
        <h1>Start with the drawing, material direction, and destination.</h1>
        <p>Send the project basics to our Vietnam manufacturing team for a product, material, sample, or quotation review.</p>
      </header>

      <section className="wr-contact-main wr-section-band wr-section-band--mist" aria-labelledby="contact-form-title">
        <aside className="wr-contact-details">
          <div>
            <Building2 aria-hidden="true" />
            <span className="wr-eyebrow">Vietnam manufacturing</span>
            <h2>Direct factory contact.</h2>
            <p>WHITEROCK manufactures vanity tops, kitchen countertops, furniture surfaces, and project components in Binh Phuoc Province.</p>
          </div>
          <address>
            <span><MapPin aria-hidden="true" />{siteConfig.address}</span>
            <a href={`mailto:${siteConfig.email}`}><Mail aria-hidden="true" />{siteConfig.email}<ArrowUpRight aria-hidden="true" /></a>
            <a href={`tel:${siteConfig.telHref}`}><Phone aria-hidden="true" />{siteConfig.tel}<ArrowUpRight aria-hidden="true" /></a>
            <a href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><WhatsAppIcon />WhatsApp<ArrowUpRight aria-hidden="true" /></a>
          </address>
          {onOpenShareModal && (
            <button className="wr-button wr-button--secondary" onClick={() => onOpenShareModal({ title: 'WHITEROCK contact', text: 'Contact WHITEROCK for stone samples, project review, and quotations.', type: 'site' })}>
              <MessageSquare aria-hidden="true" />Share contact page
            </button>
          )}
        </aside>

        <div className="wr-contact-form-panel">
          {!siteConfig.web3FormsAccessKey ? (
            <DirectInquiryContact headingId="contact-form-title" />
          ) : isSubmitted ? (
            <div className="wr-contact-success" role="status">
              <CheckCircle2 aria-hidden="true" />
              <span className="wr-eyebrow">Inquiry received</span>
              <h2>Thank you, {formData.name}.</h2>
              <p className="wr-submission-notice wr-submission-notice--success">{submissionNote}</p>
              <button className="wr-button wr-button--secondary" onClick={() => setIsSubmitted(false)}>Send another inquiry</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} aria-labelledby="contact-form-title" aria-busy={isSubmitting}>
              <div className="wr-contact-form-heading"><span className="wr-eyebrow">Project inquiry</span><h2 id="contact-form-title">Tell us what you are sourcing.</h2><p>Required fields are marked with an asterisk.</p></div>
              <div className="wr-form-grid">
                <Input id="contact-name" label="Full name *" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} />
                <Input id="contact-email" label="Work email *" type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} />
                <Input id="contact-company" label="Company *" required value={formData.company} onChange={(event) => setFormData({ ...formData, company: event.target.value })} />
                <Input id="contact-location" label="Country / region *" required value={formData.location} onChange={(event) => setFormData({ ...formData, location: event.target.value })} />
                <label className="wr-contact-field" htmlFor="contact-project-type"><span>Project type *</span><select id="contact-project-type" required value={formData.projectType} onChange={(event) => setFormData({ ...formData, projectType: event.target.value })}><option value="">Select a project type</option><option>Vanity program</option><option>Kitchen countertops</option><option>Furniture surfaces</option><option>Hospitality or commercial</option><option>Material sample review</option><option>Other project</option></select></label>
                <label className="wr-contact-field wr-form-grid__wide" htmlFor="contact-message"><span>Project details *</span><textarea id="contact-message" required rows={6} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="Include material, dimensions, quantity, destination, and target schedule where available." /></label>
                {siteConfig.web3FormsAttachmentsEnabled ? <div className="wr-file-upload wr-form-grid__wide">
                  <label htmlFor="contact-files"><UploadCloud aria-hidden="true" /><span><strong>Upload drawing</strong><small>{DRAWING_UPLOAD_HELPER}</small></span><input id="contact-files" type="file" accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf" onChange={(event) => { addDrawingFiles(event.target.files); event.currentTarget.value = ''; }} /></label>
                  {drawingFiles.length > 0 && <ul>{drawingFiles.map((file, index) => <li key={`${file.name}-${file.lastModified}`}><File aria-hidden="true" /><span>{file.name}<small>{(file.size / 1024 / 1024).toFixed(1)} MB</small></span><button type="button" className="wr-icon-button" onClick={() => setDrawingFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} aria-label={`Remove ${file.name}`}><X /></button></li>)}</ul>}
                  {fileError && <p className="wr-form-error" role="alert">{fileError}</p>}
                </div> : <p className="wr-form-grid__wide wr-drawing-note">For drawings, include a shared file link in your project details, or send files to <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</p>}
              </div>
              {submissionError && <><p className="wr-submission-notice wr-submission-notice--error" role="alert">{submissionError}</p><DirectInquiryContact title="Contact us directly." /></>}
              <button className="wr-button wr-button--primary wr-contact-submit" type="submit" disabled={isSubmitting}><Send aria-hidden="true" />{isSubmitting ? 'Sending…' : 'Send project inquiry'}</button>
            </form>
          )}
        </div>
      </section>

      <section className="wr-contact-faq wr-section-band">
        <FaqSectionWithSchema
          currentLocale={currentLocale}
          title="Procurement and manufacturing FAQ"
          subtitle="Direct answers about materials, drawings, samples, packing, and order-specific documents."
          showSchemaInspector={false}
        />
      </section>
    </div>
  );
};
