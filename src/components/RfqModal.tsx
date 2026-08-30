import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, ChevronLeft, ChevronRight, File, FileText, Minus, Package, Plus, Send, Trash2, UploadCloud, X } from 'lucide-react';
import { siteConfig } from '../data';
import { t } from '../i18n';
import type { LocaleConfig, RfqCartItem } from '../types';

interface RfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: RfqCartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  currentLocale: LocaleConfig;
}

type Step = 'items' | 'details' | 'review' | 'success';

export const RfqModal: React.FC<RfqModalProps> = ({
  isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart, currentLocale
}) => {
  const [step, setStep] = useState<Step>('items');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionNote, setSubmissionNote] = useState('');
  const [drawingFiles, setDrawingFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', company: '', country: '', destinationPort: '', projectType: '', targetTimeline: '', customNotes: '' });

  useEffect(() => {
    if (!isOpen) setStep('items');
  }, [isOpen]);

  if (!isOpen) return null;

  const itemSummary = cartItems.map((item) => `${item.quantity} x ${item.title}${item.sku ? ` (${item.sku})` : ''}${item.specSummary ? ` - ${item.specSummary}` : ''}`).join('\n');

  const submitInquiry = async () => {
    setIsSubmitting(true);
    const payload = {
      access_key: siteConfig.web3FormsAccessKey,
      subject: `WHITEROCK RFQ from ${formData.company || formData.name}`,
      from_name: formData.name,
      email: formData.email,
      company: formData.company,
      country: formData.country,
      destination_port: formData.destinationPort,
      project_type: formData.projectType,
      target_timeline: formData.targetTimeline,
      items: itemSummary,
      message: formData.customNotes,
      botcheck: ''
    };

    try {
      if (siteConfig.web3FormsAccessKey) {
        const formPayload = new FormData();
        Object.entries(payload).forEach(([key, value]) => formPayload.append(key, String(value)));
        drawingFiles.forEach((file, index) => formPayload.append(`drawing_${index + 1}`, file, file.name));
        const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formPayload });
        if (!response.ok) throw new Error('Submission failed');
        setSubmissionNote('Your inquiry was submitted. The sales team will confirm receipt and next steps.');
      } else {
        const body = encodeURIComponent(`Contact\n${formData.name}\n${formData.company}\n${formData.email}\n${formData.country}\n${formData.destinationPort}\n\nSelected items\n${itemSummary}\n\nSelected drawing files\n${drawingFiles.map((file) => `${file.name} (${Math.ceil(file.size / 1024 / 1024)} MB)`).join('\n') || 'None'}\n\nNotes\n${formData.customNotes}\n\nAttach the selected files to this email before sending.`);
        window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(`WHITEROCK RFQ - ${formData.company || formData.name}`)}&body=${body}`;
        setSubmissionNote('An email draft was opened because the website form access key has not yet been configured.');
      }
      setStep('success');
    } catch {
      setSubmissionNote(`The form could not be sent. Please email ${siteConfig.email} with your selected list.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addDrawingFiles = (files: FileList | null) => {
    if (!files) return;
    const acceptedTypes = new Set(['application/pdf', 'image/jpeg']);
    const incoming = Array.from(files);
    if (drawingFiles.length + incoming.length > 3) {
      setFileError('Upload up to 3 files in total.');
      return;
    }
    const invalidType = incoming.find((file) => !acceptedTypes.has(file.type) && !/\.(pdf|jpe?g)$/i.test(file.name));
    if (invalidType) {
      setFileError('Only JPG, JPEG, and PDF files are accepted.');
      return;
    }
    const oversized = incoming.find((file) => file.size > 30 * 1024 * 1024);
    if (oversized) {
      setFileError(`${oversized.name} exceeds the 30 MB per-file limit.`);
      return;
    }
    setDrawingFiles((current) => [...current, ...incoming]);
    setFileError('');
  };

  const close = () => {
    if (step === 'success' && siteConfig.web3FormsAccessKey) onClearCart();
    onClose();
  };

  const steps = [
    ['items', t(currentLocale, 'review')],
    ['details', t(currentLocale, 'details')],
    ['review', t(currentLocale, 'submit')]
  ];

  return (
    <div className="wr-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="rfq-title">
      <div className="wr-rfq-dialog">
        <header className="wr-modal-header">
          <div><span className="wr-eyebrow">B2B inquiry builder</span><h2 id="rfq-title">{t(currentLocale, 'rfq')} & sample list</h2></div>
          <button className="wr-icon-button" onClick={close} aria-label="Close RFQ"><X /></button>
        </header>

        {step !== 'success' && <ol className="wr-rfq-steps">{steps.map(([id, label], index) => <li key={id} className={step === id ? 'is-active' : steps.findIndex(([stepId]) => stepId === step) > index ? 'is-complete' : ''}><span>{index + 1}</span>{label}</li>)}</ol>}

        <div className="wr-rfq-body">
          {step === 'items' && (
            <section className="wr-rfq-items">
              <div className="wr-rfq-section-title"><div><h3>{t(currentLocale, 'review')}</h3><p>Adjust quantities before entering project details.</p></div>{cartItems.length > 0 && <button className="wr-button wr-button--ghost" onClick={onClearCart}><Trash2 />{t(currentLocale, 'clear')}</button>}</div>
              {!cartItems.length ? <div className="wr-empty-state"><Package /><h3>Your inquiry list is empty.</h3><p>Add products or samples from the catalog first.</p></div> : cartItems.map((item) => (
                <article key={item.id} className="wr-rfq-item">
                  <div><small>{item.type}{item.sku ? ` · ${item.sku}` : ''}</small><h4>{item.title}</h4><p>{item.specSummary || item.material || 'Specifications to be confirmed'}</p></div>
                  <div className="wr-quantity-control" aria-label={`${t(currentLocale, 'quantity')} ${item.title}`}><button onClick={() => onUpdateQuantity(item.id, -1)} aria-label="Decrease quantity"><Minus /></button><output>{item.quantity}</output><button onClick={() => onUpdateQuantity(item.id, 1)} aria-label="Increase quantity"><Plus /></button></div>
                  <button className="wr-icon-button" onClick={() => onRemoveItem(item.id)} aria-label={`${t(currentLocale, 'remove')} ${item.title}`}><Trash2 /></button>
                </article>
              ))}
              <footer><span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} total units / samples</span><button className="wr-button wr-button--primary" disabled={!cartItems.length} onClick={() => setStep('details')}>{t(currentLocale, 'continue')}<ChevronRight /></button></footer>
            </section>
          )}

          {step === 'details' && (
            <form className="wr-rfq-form" onSubmit={(event) => { event.preventDefault(); setStep('review'); }}>
              <div className="wr-rfq-section-title"><div><h3>Buyer and project details</h3><p>Fields marked with * are required for a useful response.</p></div></div>
              <div className="wr-form-grid">
                <label><span>Full name *</span><input required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} /></label>
                <label><span>Work email *</span><input type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} /></label>
                <label><span>Company *</span><input required value={formData.company} onChange={(event) => setFormData({ ...formData, company: event.target.value })} /></label>
                <label><span>Country / region *</span><input required value={formData.country} onChange={(event) => setFormData({ ...formData, country: event.target.value })} /></label>
                <label><span>Destination port</span><input value={formData.destinationPort} onChange={(event) => setFormData({ ...formData, destinationPort: event.target.value })} /></label>
                <label><span>Project type</span><input value={formData.projectType} onChange={(event) => setFormData({ ...formData, projectType: event.target.value })} /></label>
                <label><span>Target timeline</span><input value={formData.targetTimeline} onChange={(event) => setFormData({ ...formData, targetTimeline: event.target.value })} /></label>
                <div className="wr-file-upload wr-form-grid__wide">
                  <label><UploadCloud /><span><strong>Upload drawings</strong><small>JPG or PDF · up to 3 files · 30 MB each</small></span><input type="file" accept=".jpg,.jpeg,.pdf,image/jpeg,application/pdf" multiple onChange={(event) => { addDrawingFiles(event.target.files); event.currentTarget.value = ''; }} /></label>
                  {drawingFiles.length > 0 && <ul>{drawingFiles.map((file, index) => <li key={`${file.name}-${file.lastModified}`}><File /><span>{file.name}<small>{(file.size / 1024 / 1024).toFixed(1)} MB</small></span><button type="button" className="wr-icon-button" onClick={() => setDrawingFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} aria-label={`Remove ${file.name}`}><X /></button></li>)}</ul>}
                  {fileError && <p className="wr-form-error">{fileError}</p>}
                </div>
                <label className="wr-form-grid__wide"><span>Notes, drawings, edge details, or required documents</span><textarea rows={4} value={formData.customNotes} onChange={(event) => setFormData({ ...formData, customNotes: event.target.value })} /></label>
              </div>
              <footer><button type="button" className="wr-button wr-button--ghost" onClick={() => setStep('items')}><ChevronLeft />{t(currentLocale, 'back')}</button><button className="wr-button wr-button--primary">{t(currentLocale, 'review')}<ChevronRight /></button></footer>
            </form>
          )}

          {step === 'review' && (
            <section className="wr-rfq-review">
              <div className="wr-rfq-section-title"><div><h3>Confirm before sending</h3><p>Review the selected items and contact details. Submission is an inquiry, not a purchase order.</p></div></div>
              <div className="wr-rfq-review__grid"><div><h4>Selected list</h4><pre>{itemSummary}</pre>{drawingFiles.length > 0 && <div className="wr-rfq-review__files"><h4>Drawings</h4>{drawingFiles.map((file) => <span key={`${file.name}-${file.lastModified}`}><File />{file.name}</span>)}</div>}</div><div><h4>Buyer details</h4><dl><div><dt>Name</dt><dd>{formData.name}</dd></div><div><dt>Company</dt><dd>{formData.company}</dd></div><div><dt>Email</dt><dd>{formData.email}</dd></div><div><dt>Destination</dt><dd>{[formData.country, formData.destinationPort].filter(Boolean).join(' · ') || 'Not provided'}</dd></div></dl></div></div>
              <p className="wr-rfq-confirmation"><Check />Final dimensions, material availability, capacity, lead time, packing, trade documents, and price remain subject to the written quotation.</p>
              {submissionNote && <p className="wr-form-error">{submissionNote}</p>}
              <footer><button className="wr-button wr-button--ghost" onClick={() => setStep('details')}><ChevronLeft />{t(currentLocale, 'back')}</button><button className="wr-button wr-button--primary" disabled={isSubmitting} onClick={submitInquiry}><Send />{isSubmitting ? 'Sending…' : t(currentLocale, 'submit')}</button></footer>
            </section>
          )}

          {step === 'success' && <section className="wr-rfq-success"><CheckCircle2 /><span className="wr-eyebrow">Inquiry prepared</span><h3>Thank you, {formData.name}.</h3><p>{submissionNote}</p><button className="wr-button wr-button--primary" onClick={close}>Close</button></section>}
        </div>
      </div>
    </div>
  );
};
