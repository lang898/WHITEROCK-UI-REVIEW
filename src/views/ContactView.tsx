import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Building,
  CheckCircle2,
  Clock,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Globe2,
  FileSpreadsheet,
  Box,
  ArrowRight,
  MessageSquare,
  Sparkles,
  Share2
} from 'lucide-react';
import {
  WhatsAppIcon,
  LinkedInIcon,
  InstagramIcon
} from '../components/SocialIcons';
import { siteConfig } from '../data';
import { FaqSectionWithSchema } from '../components/FaqSectionWithSchema';
import type { LocaleConfig } from '../types';
import type { ShareContent } from '../components/SocialShareModal';

interface ContactViewProps {
  currentLocale: LocaleConfig;
  onOpenShareModal?: (content: ShareContent) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({
  currentLocale,
  onOpenShareModal
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionNote, setSubmissionNote] = useState('');
  const [submissionError, setSubmissionError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmissionError('');
    setIsSubmitting(true);

    const payload = {
      access_key: siteConfig.web3FormsAccessKey,
      subject: `WHITEROCK website inquiry from ${formData.company || formData.name}`,
      from_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      destination: formData.country,
      message: formData.message,
      botcheck: ''
    };

    try {
      if (siteConfig.web3FormsAccessKey) {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Submission failed');
        setSubmissionNote('Your inquiry was submitted. The team will confirm receipt and the appropriate next step.');
      } else {
        const body = encodeURIComponent(`Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nDestination: ${formData.country}\n\nProject details:\n${formData.message}`);
        window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(`WHITEROCK inquiry - ${formData.company || formData.name}`)}&body=${body}`;
        setSubmissionNote('An email draft was opened because the website form access key has not yet been configured.');
      }
      setIsSubmitted(true);
    } catch {
      setSubmissionError(`The form could not be sent. Please email ${siteConfig.email}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 space-y-24 sm:space-y-28">
      {/* Header Banner (Unified Apple Display + Keynote Style) */}
      <div className="space-y-4 max-w-4xl">
        <div className="wr-panel-eyebrow">
          <Mail className="w-3.5 h-3.5 text-stone-600" />
          <span className="tech-badge">DIRECT FACTORY ENGINEERING & EXPORT DESK</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-[-0.035em] text-[#1d1d1f]">
          Request Quotation & Engineering Takeoff.
        </h1>
        <p className="text-base sm:text-xl text-[#6e6e73] leading-relaxed max-w-3xl font-normal">
          Connect directly with our Vietnam manufacturing team in Binh Phuoc for architectural takeoffs, CAD reviews, container planning, and sample requests.
        </p>

        {/* Industrial Specification Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
          <span className="wr-info-pill">
            <Clock className="w-3.5 h-3.5 text-stone-600 shrink-0" />
            <span className="tech-badge">24-Hour CAD Takeoff Response</span>
          </span>
          <span className="wr-info-pill">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-600 shrink-0" />
            <span className="tech-badge">Direct FOB Vietnam Port Pricing</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Contact Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Side: Contact Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vietnam Fabrication Facility Card */}
          <div className="wr-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-500 animate-pulse"></span>
                <h3 className="font-bold text-base text-[#1d1d1f]">
                  Vietnam Primary Manufacturing Plant
                </h3>
              </div>
              <span className="tech-badge text-stone-800 bg-stone-50 px-2.5 py-0.5 rounded-full border border-stone-200">
                Broker Review Required
              </span>
            </div>

            <div className="space-y-4 text-xs text-[#6e6e73]">
              <div className="flex items-start gap-3">
                <Building className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1d1d1f] text-sm block font-semibold">WHITEROCK SURFACES VIETNAM CO., LTD.</strong>
                  <span className="text-[#86868b]">Cong Ty TNHH WHITEROCK Surfaces</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                <span className="text-[#1d1d1f] leading-relaxed">
                  {siteConfig.address}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-stone-700 shrink-0" />
                <a href={`mailto:${siteConfig.email}`} className="text-[#1d1d1f] font-medium hover:text-stone-800 transition-colors">
                  {siteConfig.email}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-stone-700 shrink-0" />
                <a href={`tel:${siteConfig.telHref}`} className="text-[#1d1d1f] font-medium hover:text-stone-800 transition-colors">
                  {siteConfig.tel} (Phone & WhatsApp)
                </a>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-black/[0.06]">
                <Clock className="w-4 h-4 text-[#86868b] shrink-0" />
                <span className="text-[#86868b]">Mon - Sat: 8:00 AM - 6:00 PM (GMT+7)</span>
              </div>
            </div>
          </div>

          {/* North American Project Desk Card */}
          <div className="wr-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-stone-600" />
              <h4 className="font-bold text-sm text-[#1d1d1f]">North American Account Support</h4>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              Assisting US and Canadian general contractors, multi-family developers, and distributor buyers with CAD takeoffs, container load planning, and order-specific shipping documents.
            </p>
            <div className="pt-2 text-xs font-mono text-[#86868b] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-500"></span>
              EST & PST Timezone Account Coordinators
            </div>
          </div>

          {/* Instant Social Channels & Live Chat Desk */}
          <div className="wr-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-stone-600" />
                <h4 className="font-bold text-sm text-[#1d1d1f]">Instant Social & Chat Desks</h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 font-bold">
                Online
              </span>
            </div>
            <p className="text-xs text-[#86868b] leading-relaxed">
              For urgent drawing verification, live factory video audits, or quick sample requests, connect directly via our prioritized channels:
            </p>

            <div className="space-y-2 pt-1">
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hello WHITEROCK Vietnam, I have an urgent inquiry regarding commercial countertops.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#1d1d1f]/10 hover:bg-[#1d1d1f]/20 text-[#1d1d1f] text-xs font-semibold transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <WhatsAppIcon className="w-4 h-4 text-[#1d1d1f]" />
                  <span>WhatsApp Direct ({siteConfig.whatsapp})</span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-[#1d1d1f] shadow-2xs">
                  &lt;15m reply
                </span>
              </a>

              <a
                href={siteConfig.social.linkedin || 'https://linkedin.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-[#1d1d1f]/10 hover:bg-[#1d1d1f]/20 text-[#1d1d1f] text-xs font-semibold transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <LinkedInIcon className="w-4 h-4 text-[#1d1d1f]" />
                  <span>LinkedIn B2B Company Desk</span>
                </div>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full text-[#1d1d1f] shadow-2xs">
                  Corporate
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive RFQ / Message Form */}
        <div className="lg:col-span-3">
          <div className="wr-card p-6 sm:p-10 space-y-6">
            {isSubmitted ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 bg-stone-50 text-stone-600 rounded-full flex items-center justify-center mx-auto border border-stone-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-[#1d1d1f]">Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-[#86868b] max-w-md mx-auto leading-relaxed">
                  {submissionNote}
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSubmissionNote('');
                    setSubmissionError('');
                    setFormData({ name: '', email: '', phone: '', company: '', country: '', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-full bg-[#111113] text-white text-xs font-medium hover:bg-black cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" aria-busy={isSubmitting}>
                <input type="checkbox" name="botcheck" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <div className="space-y-1 pb-2 border-b border-black/[0.06]">
                  <div className="tech-badge text-[#86868b]">DIRECT QUOTATION FORM</div>
                  <h3 className="font-bold text-xl text-[#1d1d1f]">
                    Send Project Specifications or Drawings
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-semibold text-[#1d1d1f]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      placeholder="e.g., Marcus Vance"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="wr-form-control w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl px-4 py-3 text-xs text-[#1d1d1f]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-semibold text-[#1d1d1f]">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      placeholder="m.vance@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="wr-form-control w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl px-4 py-3 text-xs text-[#1d1d1f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="contact-company" className="text-xs font-semibold text-[#1d1d1f]">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      id="contact-company"
                      name="company"
                      placeholder="e.g., Apex Development Group"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="wr-form-control w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl px-4 py-3 text-xs text-[#1d1d1f]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-phone" className="text-xs font-semibold text-[#1d1d1f]">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="wr-form-control w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl px-4 py-3 text-xs text-[#1d1d1f]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-destination" className="text-xs font-semibold text-[#1d1d1f]">
                    Destination Country / Port
                  </label>
                  <input
                    type="text"
                    id="contact-destination"
                    name="destination"
                    placeholder="e.g., Long Beach, CA (USA) / Vancouver (Canada)"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="wr-form-control w-full bg-[#f5f5f7] border border-black/[0.06] rounded-xl px-4 py-3 text-xs text-[#1d1d1f]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-semibold text-[#1d1d1f]">
                    Project Details, Quantities & Scope *
                  </label>
                  <textarea
                    required
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="Describe your requested vanity sizes (e.g., 22x37 single bowl, 22x61 double bowl), quartz color, edge profile, and estimated number of units or containers..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="wr-form-control w-full bg-[#f5f5f7] border border-black/[0.06] rounded-2xl p-4 text-xs text-[#1d1d1f] leading-relaxed"
                  />
                </div>

                {submissionError && <p className="wr-form-error" role="alert">{submissionError}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="wr-button wr-button--primary w-full"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Transmitting Request...' : 'Submit RFQ to Vietnam Factory'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Technical FAQ Section with Schema */}
      <div className="pt-8 border-t border-black/[0.06]">
        <FaqSectionWithSchema
          currentLocale={currentLocale}
          title="Direct Export & Manufacturing FAQ"
          subtitle="Direct answers regarding indicative lead times, payment terms, container planning, and order-specific shipping documents."
          showSchemaInspector={true}
        />
      </div>
    </div>
  );
};
