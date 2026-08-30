import React, { useMemo, useState } from 'react';
import { CheckCircle2, Mail, MapPin, Package, Send, Trash2 } from 'lucide-react';
import { siteConfig } from '../data/site';
import type { ColorItem, LocaleConfig } from '../types';

interface SampleRequestViewProps {
  samples: ColorItem[];
  currentLocale: LocaleConfig;
  onRemove: (slug: string) => void;
  onClear: () => void;
  setCurrentTab: (tab: string) => void;
}

export const SampleRequestView: React.FC<SampleRequestViewProps> = ({
  samples,
  onRemove,
  onClear,
  setCurrentTab
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [note, setNote] = useState('');
  const [formData, setFormData] = useState({
    company: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    cityRegion: '',
    country: '',
    projectType: '',
    intendedUse: ''
  });

  const sampleSummary = useMemo(
    () => samples.map((sample, index) => `${index + 1}. ${sample.name} (${sample.material})`).join('\n'),
    [samples]
  );

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!samples.length) return;
    setIsSubmitting(true);
    setStatus('idle');
    setNote('');

    const payload = {
      access_key: siteConfig.web3FormsAccessKey,
      subject: `WHITEROCK sample request from ${formData.company}`,
      from_name: formData.contact,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      delivery_address: `${formData.address}, ${formData.cityRegion}, ${formData.country}`,
      project_type: formData.projectType,
      intended_use: formData.intendedUse,
      requested_samples: sampleSummary,
      botcheck: ''
    };

    try {
      if (siteConfig.web3FormsAccessKey) {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Sample request failed');
        setNote('Your sample request was submitted. Availability, sample format, freight, and dispatch timing will be confirmed by the sales team.');
      } else {
        const body = encodeURIComponent([
          `Company: ${formData.company}`,
          `Contact: ${formData.contact}`,
          `Email: ${formData.email}`,
          `Phone: ${formData.phone}`,
          `Address: ${formData.address}`,
          `City / region: ${formData.cityRegion}`,
          `Country: ${formData.country}`,
          `Project type: ${formData.projectType}`,
          `Intended use: ${formData.intendedUse}`,
          '',
          'Requested samples:',
          sampleSummary
        ].join('\n'));
        window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(`WHITEROCK sample request - ${formData.company}`)}&body=${body}`;
        setNote('An email draft was opened because the website submission key is not configured. Send the draft to complete the request.');
      }
      setStatus('success');
    } catch {
      setStatus('error');
      setNote(`The request could not be sent. Please email ${siteConfig.email} with your selected colors and delivery address.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wr-sample-page">
      <header className="wr-catalog-hero wr-catalog-hero--centered">
        <div><span className="wr-eyebrow">Physical material approval</span><h1>Build a sample box before requesting a quotation.</h1></div>
        <p>Select up to six color directions. Sample format, stock, freight, delivery time, and lot representation are confirmed before dispatch.</p>
      </header>

      <div className="wr-sample-layout">
        <section className="wr-sample-box" aria-labelledby="sample-box-title">
          <header><div><span className="wr-eyebrow">Sample box</span><h2 id="sample-box-title">{samples.length}/6 selected</h2></div>{samples.length > 0 && <button className="wr-button wr-button--ghost" onClick={onClear}><Trash2 />Clear</button>}</header>
          {samples.length > 0 ? (
            <div className="wr-sample-box__grid">
              {samples.map((sample) => (
                <article key={sample.slug}>
                  <img src={sample.swatchImage} alt={`${sample.name} illustrative digital swatch`} width="800" height="800" loading="lazy" />
                  <div><small>{sample.material}</small><h3>{sample.name}</h3><button className="wr-icon-button" onClick={() => onRemove(sample.slug)} aria-label={`Remove ${sample.name}`}><Trash2 /></button></div>
                </article>
              ))}
            </div>
          ) : (
            <div className="wr-empty-state"><Package /><h3>Your sample box is empty.</h3><p>Add color directions from Collections or a Stone Type page.</p><button className="wr-button wr-button--secondary" onClick={() => setCurrentTab('colors')}>Browse colors</button></div>
          )}
          <div className="wr-sample-box__note"><CheckCircle2 /><p>Digital swatches guide the shortlist only. A physical sample does not guarantee the full natural-stone slab or future engineered-stone batch.</p></div>
        </section>

        <form className="wr-sample-form" onSubmit={submit}>
          <div><span className="wr-eyebrow">Delivery request</span><h2>Where should the sample box go?</h2><p>Required details help the team confirm stock, sample format, and dispatch options.</p></div>
          <label><span>Company name *</span><input required value={formData.company} onChange={(event) => setFormData({ ...formData, company: event.target.value })} /></label>
          <div className="wr-form-grid">
            <label><span>Contact person *</span><input required value={formData.contact} onChange={(event) => setFormData({ ...formData, contact: event.target.value })} /></label>
            <label><span>Work email *</span><input type="email" required value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} /></label>
            <label><span>Phone</span><input value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} /></label>
            <label><span>Project type *</span><select required value={formData.projectType} onChange={(event) => setFormData({ ...formData, projectType: event.target.value })}><option value="">Select</option><option>Distributor / showroom</option><option>Residential project</option><option>Hospitality project</option><option>Commercial project</option><option>Furniture program</option><option>Other</option></select></label>
          </div>
          <label><span>Street address *</span><input required value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} /></label>
          <div className="wr-form-grid">
            <label><span>City / state / region *</span><input required value={formData.cityRegion} onChange={(event) => setFormData({ ...formData, cityRegion: event.target.value })} /></label>
            <label><span>Country *</span><input required value={formData.country} onChange={(event) => setFormData({ ...formData, country: event.target.value })} /></label>
          </div>
          <label><span>Intended use *</span><textarea required rows={4} value={formData.intendedUse} onChange={(event) => setFormData({ ...formData, intendedUse: event.target.value })} placeholder="Countertop, vanity, furniture, project mock-up, or other use" /></label>
          {note && <p className={status === 'error' ? 'wr-form-error' : 'wr-form-success'}>{status === 'success' ? <CheckCircle2 /> : <Mail />}{note}</p>}
          <button className="wr-button wr-button--primary" type="submit" disabled={!samples.length || isSubmitting}><Send />{isSubmitting ? 'Sending…' : 'Submit sample request'}</button>
          <p className="wr-form-privacy"><MapPin />Submitting this form is a sample request, not an order. Dispatch is confirmed separately in writing.</p>
        </form>
      </div>
    </div>
  );
};
