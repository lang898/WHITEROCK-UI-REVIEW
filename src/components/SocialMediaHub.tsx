import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  Share2,
  ExternalLink,
  MessageCircle,
  Play,
  Layers,
  CheckCircle2,
  Clock,
  Eye,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Building,
  ShieldCheck,
  Send,
  Plus
} from 'lucide-react';
import {
  WhatsAppIcon,
  LinkedInIcon,
  InstagramIcon,
  YouTubeIcon,
  PinterestIcon
} from './SocialIcons';
import { siteConfig } from '../data';
import type { ShareContent } from './SocialShareModal';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'linkedin' | 'youtube' | 'pinterest';
  title: string;
  caption: string;
  author: string;
  handle: string;
  date: string;
  image: string;
  likes: number;
  commentsCount: number;
  stoneTag: string;
  stoneMaterial: string;
  videoUrl?: string;
  externalUrl: string;
  badge: string;
}

interface SocialMediaHubProps {
  onOpenShareModal: (content: ShareContent) => void;
  onSelectColorSlug?: (slug: string) => void;
}

export const SocialMediaHub: React.FC<SocialMediaHubProps> = ({
  onOpenShareModal,
  onSelectColorSlug,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'instagram' | 'linkedin' | 'youtube' | 'pinterest'>('all');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [postLikes, setPostLikes] = useState<Record<string, number>>({});
  const [activeMediaModal, setActiveMediaModal] = useState<SocialPost | null>(null);

  const posts: SocialPost[] = [
    {
      id: 'post-1',
      platform: 'instagram',
      title: 'Finished Stone Tops Staged for Review',
      caption: 'Owner-supplied Vietnam factory photo. Product dimensions, stone selection, sink model, and acceptance criteria are confirmed for each order.',
      author: 'WHITEROCK Website Draft',
      handle: 'Owner-supplied factory media',
      date: 'Draft',
      image: '/assets/owner/enhanced/vanity-inspection-sequence-b-enhanced.jpg',
      likes: 0,
      commentsCount: 0,
      stoneTag: 'Finished Top Reference',
      stoneMaterial: 'Material varies by order',
      externalUrl: 'https://instagram.com',
      badge: 'Factory Reference'
    },
    {
      id: 'post-2',
      platform: 'linkedin',
      title: 'Bridge Cutting Equipment Reference',
      caption: 'Owner-supplied Vietnam factory photo showing stone cutting equipment. Machine model, working range, and order allocation require owner confirmation.',
      author: 'WHITEROCK Website Draft',
      handle: 'Owner-supplied factory media',
      date: 'Draft',
      image: '/assets/owner/enhanced/cnc-cutting-line-enhanced.jpg',
      likes: 0,
      commentsCount: 0,
      stoneTag: 'Bridge Cutting',
      stoneMaterial: 'Equipment reference',
      externalUrl: siteConfig.social.linkedin || 'https://linkedin.com',
      badge: 'Factory Reference'
    },
    {
      id: 'post-3',
      platform: 'youtube',
      title: 'Vietnam Stone Cutting Area',
      caption: 'Owner-supplied Vietnam factory photo showing a stone cutting area. Equipment origin, model, and process capability are confirmed only in current factory records.',
      author: 'WHITEROCK Website Draft',
      handle: 'Owner-supplied factory media',
      date: 'Draft',
      image: '/assets/owner/enhanced/edge-processing-line-enhanced.jpg',
      likes: 0,
      commentsCount: 0,
      stoneTag: 'Stone Cutting Area',
      stoneMaterial: 'Equipment reference',
      externalUrl: 'https://youtube.com',
      badge: 'Factory Reference'
    },
    {
      id: 'post-4',
      platform: 'pinterest',
      title: 'Continuous Edge Processing Line',
      caption: 'Owner-supplied Vietnam factory photo showing stone processing activity. Available edge programs are confirmed against the approved sample and drawing.',
      author: 'WHITEROCK Website Draft',
      handle: 'Owner-supplied factory media',
      date: 'Draft',
      image: '/assets/owner/enhanced/edge-polisher-close-enhanced.jpg',
      likes: 0,
      commentsCount: 0,
      stoneTag: 'Edge Processing',
      stoneMaterial: 'Equipment reference',
      externalUrl: 'https://pinterest.com',
      badge: 'Factory Reference'
    },
    {
      id: 'post-5',
      platform: 'instagram',
      title: 'Vanity Tops on Factory Worktables',
      caption: 'Owner-supplied Vietnam factory photo showing stone tops arranged on worktables. It is a production reference, not a named customer installation.',
      author: 'WHITEROCK Website Draft',
      handle: 'Owner-supplied factory media',
      date: 'Draft',
      image: '/assets/owner/enhanced/vanity-production-detail-enhanced.jpg',
      likes: 0,
      commentsCount: 0,
      stoneTag: 'Vanity Top Reference',
      stoneMaterial: 'Material varies by order',
      externalUrl: 'https://instagram.com',
      badge: 'Factory Reference'
    },
    {
      id: 'post-6',
      platform: 'linkedin',
      title: 'Production Hall and Stone Racks',
      caption: 'Owner-supplied Vietnam factory photo showing stone racks and staged components. Material properties and test reports must be confirmed for the exact ordered product.',
      author: 'WHITEROCK Website Draft',
      handle: 'Owner-supplied factory media',
      date: 'Draft',
      image: '/assets/owner/enhanced/production-hall-aisle-enhanced.jpg',
      likes: 0,
      commentsCount: 0,
      stoneTag: 'Production Hall',
      stoneMaterial: 'Factory reference',
      externalUrl: siteConfig.social.linkedin || 'https://linkedin.com',
      badge: 'Factory Reference'
    }
  ];

  const filteredPosts = activeTab === 'all'
    ? posts
    : posts.filter((p) => p.platform === activeTab);

  const toggleLike = (postId: string) => {
    const isCurrentlyLiked = likedPosts[postId];
    setLikedPosts((prev) => ({ ...prev, [postId]: !isCurrentlyLiked }));
    setPostLikes((prev) => ({
      ...prev,
      [postId]: isCurrentlyLiked ? (prev[postId] || 1) - 1 : (prev[postId] || 0) + 1,
    }));
  };

  const handleSharePost = (post: SocialPost) => {
    onOpenShareModal({
      title: post.title,
      text: `${post.title} - ${post.caption}`,
      image: post.image,
      material: post.stoneMaterial,
      specs: post.stoneTag,
      url: post.externalUrl,
      type: 'project'
    });
  };

  const handleWhatsAppInquiry = (post: SocialPost) => {
    const text = encodeURIComponent(
      `Hello WHITEROCK Vietnam, I saw your social post: "${post.title}" (${post.stoneTag}). I would like to inquire about pricing, lead time, and sample availability for our project.`
    );
    window.open(`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="wr-panel-eyebrow">
            <Sparkles className="w-3.5 h-3.5 text-stone-600" />
            <span className="tech-badge">OWNER MEDIA • WEBSITE CONTENT DRAFTS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f]">
            Factory Media Ready for Your Content Plan.
          </h2>
          <p className="text-sm sm:text-base text-[#6e6e73] leading-relaxed">
            These unpublished website drafts use owner-supplied factory photos. They do not represent verified customer projects, published social engagement, or product-specific test claims.
          </p>
        </div>

        {/* Contact channels */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <a
            href={siteConfig.social.linkedin || 'https://linkedin.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-black/[0.08] hover:border-black/20 text-[#1d1d1f] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center">
              <LinkedInIcon className="w-3 h-3" />
            </div>
            <span>LinkedIn</span>
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-black/[0.08] hover:border-black/20 text-[#1d1d1f] text-xs font-semibold shadow-2xs transition-all cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-stone-500 via-stone-500 to-stone-600 text-white flex items-center justify-center">
              <InstagramIcon className="w-3 h-3" />
            </div>
            <span>Instagram</span>
          </a>

          <a
            href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hello WHITEROCK, I would like to connect on stone vanity top orders.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1d1d1f] text-white text-xs font-semibold shadow-xs hover:bg-[#000000] transition-all cursor-pointer"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>WhatsApp Fast Track</span>
          </a>
        </div>
      </div>

      {/* Interactive Platform Tabs */}
      <div className="wr-card p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Drafts', count: posts.length },
            { id: 'instagram', label: 'Instagram Drafts', count: 2 },
            { id: 'linkedin', label: 'LinkedIn Drafts', count: 2 },
            { id: 'youtube', label: 'Video Draft', count: 1 },
            { id: 'pinterest', label: 'Pinterest Draft', count: 1 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#111113] text-white shadow-xs font-semibold'
                  : 'bg-black/[0.03] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.06]'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="text-xs text-[#86868b] px-3 font-mono flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-stone-600" />
          <span>Not yet published</span>
        </div>
      </div>

      {/* Social Post Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredPosts.map((post) => {
          const isLiked = !!likedPosts[post.id];
          const likesCount = postLikes[post.id] || post.likes;

          return (
            <div
              key={post.id}
              className="wr-card overflow-hidden flex flex-col justify-between group transition-all duration-500"
            >
              {/* Media Container with badges */}
              <div
                className="relative aspect-4/3 overflow-hidden bg-stone-200 cursor-pointer"
                onClick={() => setActiveMediaModal(post)}
              >
                <img
                  src={post.image}
                  alt={post.title}
                  width={720}
                  height={540}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                />

                {/* Subtle vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Platform Badge (Top Left) */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#1d1d1f] shadow-xs">
                  {post.platform === 'instagram' && <InstagramIcon className="w-3.5 h-3.5 text-stone-600" />}
                  {post.platform === 'linkedin' && <LinkedInIcon className="w-3.5 h-3.5 text-[#1d1d1f]" />}
                  {post.platform === 'youtube' && <YouTubeIcon className="w-3.5 h-3.5 text-red-600" />}
                  {post.platform === 'pinterest' && <PinterestIcon className="w-3.5 h-3.5 text-[#1d1d1f]" />}
                  <span>{post.badge}</span>
                </div>

                {/* Video Indicator (if video) */}
                {post.platform === 'youtube' && (
                  <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                )}

                {/* Stone Material Pill (Bottom Left) */}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-stone-300" />
                  <span>{post.stoneTag}</span>
                </div>

                {/* Expand click hint (Bottom Right) */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-[#1d1d1f] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#86868b]">
                    <span className="font-semibold text-[#1d1d1f]">{post.author}</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="font-bold text-base text-[#1d1d1f] group-hover:text-stone-900 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#6e6e73] leading-relaxed line-clamp-3">
                    {post.caption}
                  </p>
                </div>

                {/* Interactive Engagement Row */}
                <div className="pt-3 border-t border-black/[0.06] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    {/* Like button with state */}
                    <button
                      type="button"
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all cursor-pointer text-xs font-medium ${
                        isLiked
                          ? 'bg-stone-50 text-stone-600 border border-stone-200'
                          : 'bg-black/[0.03] text-[#6e6e73] hover:text-stone-600 hover:bg-stone-50/50'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-stone-600 text-stone-600' : ''}`} />
                      <span>{likesCount}</span>
                    </button>

                    {/* Share Modal Trigger */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSharePost(post)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/[0.03] hover:bg-black/[0.08] text-[#1d1d1f] text-xs font-medium transition-all cursor-pointer"
                        title="Share this update"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#6e6e73]" />
                        <span>Share</span>
                      </button>

                      <a
                        href={post.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-full bg-black/[0.03] hover:bg-black/[0.08] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                        title="View original post"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Direct WhatsApp Quote Button */}
                  <button
                    type="button"
                    onClick={() => handleWhatsAppInquiry(post)}
                    className="w-full py-2.5 rounded-full bg-[#1d1d1f]/10 hover:bg-[#1d1d1f] text-[#1d1d1f] hover:text-white font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-[#1d1d1f]/30 shadow-2xs group/wa"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>Inquire via WhatsApp on this Spec</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Post Detail Preview Modal */}
      {activeMediaModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div
            className="relative bg-white rounded-[2rem] w-full max-w-3xl shadow-2xl text-[#1d1d1f] overflow-hidden border border-black/[0.08] flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-stone-800 bg-stone-50 px-2.5 py-1 rounded-full border border-stone-200">
                    {activeMediaModal.badge}
                  </span>
                  <span className="text-xs text-[#86868b]">{activeMediaModal.author}</span>
                </div>
                <button
                  onClick={() => setActiveMediaModal(null)}
                  className="px-3 py-1 rounded-full bg-black/[0.05] text-xs font-semibold hover:bg-black/[0.1] cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-100 border border-black/[0.06]">
                <img
                  src={activeMediaModal.image}
                  alt={activeMediaModal.title}
                  width={1200}
                  height={900}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-[#1d1d1f]">
                  {activeMediaModal.title}
                </h3>
                <p className="text-sm text-[#6e6e73] leading-relaxed">
                  {activeMediaModal.caption}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/[0.06]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleLike(activeMediaModal.id)}
                    className="px-4 py-2 rounded-full bg-stone-50 text-stone-600 border border-stone-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-stone-600" />
                    <span>{postLikes[activeMediaModal.id] || activeMediaModal.likes} Likes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSharePost(activeMediaModal)}
                    className="px-4 py-2 rounded-full bg-black/[0.05] hover:bg-black/[0.1] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share to Social</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleWhatsAppInquiry(activeMediaModal)}
                  className="px-6 py-2.5 rounded-full bg-[#1d1d1f] text-white text-xs font-bold flex items-center gap-2 hover:bg-[#000000] cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Send WhatsApp Inquiry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
