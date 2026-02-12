import React, { useState } from 'react';
import {
    Download,
    Palette,
    Type,
    Flower,
    Lightbulb,
    Gift,
    AlertCircle,
    Check,
    X,
    MapPin,
    Calendar,
    Clock,
    ExternalLink,
    Globe
} from 'lucide-react';
import { getTranslation } from './guideline/translations';

// --- STYLES & FONTS ---
const FontStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
    
    .font-heading { font-family: 'Playfair Display', serif; }
    .font-body { font-family: 'Montserrat', sans-serif; }
    .font-script { font-family: 'Pinyon Script', cursive; }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(232, 220, 196, 0.6);
      box-shadow: 0 4px 20px rgba(74, 63, 53, 0.05);
    }

    .monogram-frame {
      border: 1px solid #E8DCC4;
      padding: 2rem;
      background: white;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `}</style>
);

// --- COMPONENTS ---

const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-6 border-b border-[#E8DCC4] pb-2">
        {icon}
        <h2 className="text-2xl font-heading font-bold text-burgundy">{title}</h2>
    </div>
);

const ColorCard = ({ color, large = false, t }) => (
    <div className={`group flex flex-col ${large ? 'md:col-span-2' : ''}`}>
        <div
            className={`w-full rounded-lg shadow-sm border border-black/5 transition-transform group-hover:scale-[1.02] ${large ? 'h-32' : 'h-24'}`}
            style={{ backgroundColor: color.hex }}
        />
        <div className="mt-2">
            <h3 className="font-heading font-bold text-charcoal flex justify-between items-center">
                {color.name}
                {large && <span className="text-[10px] bg-maroon text-white px-2 py-0.5 rounded-full font-body uppercase tracking-wider">Reserved</span>}
            </h3>
            <code className="text-xs text-taupe font-mono block mb-1">{color.hex}</code>
            <p className="text-xs text-burgundy opacity-80 leading-tight">{color.desc}</p>
        </div>
    </div>
);

const DoDontRow = ({ type, text }) => (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${type === 'do' ? 'bg-[#8A9A5B]/10' : 'bg-maroon/5'}`}>
        {type === 'do' ? <Check className="w-5 h-5 text-[#8A9A5B] mt-0.5 shrink-0" /> : <X className="w-5 h-5 text-maroon mt-0.5 shrink-0" />}
        <span className={`text-sm font-body ${type === 'do' ? 'text-charcoal' : 'text-maroon'}`}>{text}</span>
    </div>
);

// --- MAIN APPLICATION ---

export default function VendorGuidelines() {
    const [lang, setLang] = useState('en');
    const t = (key) => getTranslation(lang, key);

    // --- DATA WITH TRANSLATIONS ---
    const COLORS = {
        hero: { name: 'Deep Maroon', hex: '#800020', desc: t('color_hero_desc') },
        foundation: [
            { name: 'Warm Ivory', hex: '#F8F6F0', desc: t('color_found_1_desc') },
            { name: 'Champagne', hex: '#F7E7CE', desc: t('color_found_2_desc') },
            { name: 'Warm Sand', hex: '#E8DCC4', desc: t('color_found_3_desc') },
        ],
        accents: [
            { name: 'Terracotta Blush', hex: '#D4A5A5', desc: t('color_accent_1_desc') },
            { name: 'Warm Taupe', hex: '#A89F91', desc: t('color_accent_2_desc') },
            { name: 'Natural Oak', hex: '#C19A6B', desc: t('color_accent_3_desc') },
        ],
        text: [
            { name: 'Burgundy Brown', hex: '#6B4C4C', desc: t('color_text_1_desc') },
            { name: 'Charcoal Brown', hex: '#4A3F35', desc: t('color_text_2_desc') },
        ]
    };

    const VENDOR_BRIEFS = [
        {
            role: t('brief_1_role'),
            icon: <Lightbulb className="w-6 h-6 text-gold-natural" />,
            title: t('brief_1_title'),
            desc: t('brief_1_desc'),
            points: [
                t('brief_1_pt_1'),
                t('brief_1_pt_2'),
                t('brief_1_pt_3'),
                t('brief_1_pt_4'),
                t('brief_1_pt_5')
            ]
        },
        {
            role: t('brief_2_role'),
            icon: <Flower className="w-6 h-6 text-terracotta" />,
            title: t('brief_2_title'),
            desc: t('brief_2_desc'),
            points: [
                t('brief_2_pt_1'),
                t('brief_2_pt_2'),
                t('brief_2_pt_3'),
                t('brief_2_pt_4'),
                t('brief_2_pt_5')
            ]
        },
        {
            role: t('brief_3_role'),
            icon: <Gift className="w-6 h-6 text-maroon" />,
            title: t('brief_3_title'),
            desc: t('brief_3_desc'),
            points: [
                t('brief_3_pt_1'),
                t('brief_3_pt_2'),
                t('brief_3_pt_3'),
                t('brief_3_pt_4'),
                t('brief_3_pt_5')
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-ivory text-charcoal font-body pb-20">
            <FontStyles />

            {/* HEADER HERO */}
            <header className="bg-white border-b border-sand py-3 md:pt-12 md:pb-8 px-4 md:px-6 sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm shadow-sm transition-all duration-300">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 md:gap-6">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 md:gap-3 text-taupe text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-1 md:mb-2">
                            <span>{t('production_guidelines')}</span>
                            <span className="w-1 h-1 bg-terracotta rounded-full"></span>
                            <span>{t('decoration')}</span>
                        </div>
                        <h1 className="font-heading text-3xl md:text-5xl text-burgundy font-semibold mb-1 md:mb-2 leading-tight">
                            Athur <span className="font-script text-maroon text-4xl md:text-5xl">&</span> Dara
                        </h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 text-xs md:text-sm text-charcoal mt-2 font-medium">
                            <span className="flex items-center gap-1"><Calendar size={14} className="text-terracotta" /> {t('date')}</span>
                            <span className="hidden md:flex items-center gap-1.5"><MapPin size={16} className="text-terracotta" /> {t('location')}</span>
                            <span className="flex items-center gap-1"><Clock size={14} className="text-terracotta" /> {t('time')}</span>
                        </div>
                    </div>

                    {/* Asset Download & Language Toggle */}
                    <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            {/* Language Toggle */}
                            <div className="flex bg-sand/20 rounded-lg p-1 border border-sand/30">
                                <button
                                    onClick={() => setLang('en')}
                                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all min-h-[36px] ${lang === 'en' ? 'bg-maroon text-white shadow-sm' : 'text-taupe hover:text-charcoal'}`}
                                >
                                    EN
                                </button>
                                <button
                                    onClick={() => setLang('id')}
                                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all min-h-[36px] ${lang === 'id' ? 'bg-maroon text-white shadow-sm' : 'text-taupe hover:text-charcoal'}`}
                                >
                                    ID
                                </button>
                            </div>

                            <a
                                href="https://drive.google.com/file/d/1AaXeekBRExwG11kZvO1nipsI1-_V_ALg/view?usp=drive_link"
                                target="_blank"
                                rel="noreferrer"
                                className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-maroon text-ivory px-4 py-2 md:px-6 md:py-2 rounded-lg font-medium text-xs md:text-sm hover:bg-maroon-hover transition-colors shadow-lg touch-manipulation min-h-[40px]"
                            >
                                <Download size={16} />
                                {t('download_asset')}
                            </a>
                        </div>
                        <p className="text-[10px] text-taupe hidden md:block">
                            {t('download_desc')}
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pt-8 md:pt-10 space-y-12 md:space-y-16">

                {/* 1. VISUAL IDENTITY & CONCEPT */}
                <section className="grid md:grid-cols-12 gap-8">
                    {/* Left: Concept Text */}
                    <div className="md:col-span-8 space-y-6">
                        <SectionHeader icon={<Lightbulb className="text-terracotta" />} title={t('concept_title')} />
                        <div className="glass-card p-6 md:p-8 rounded-xl">
                            <p className="text-lg md:text-xl leading-relaxed font-heading italic text-burgundy mb-4">
                                {t('concept_quote')}
                            </p>
                            <p className="text-sm md:text-base leading-relaxed text-charcoal mb-6">
                                {t('concept_desc_1')}<strong>{t('concept_desc_bold_1')}</strong>{t('concept_desc_2')}<strong>{t('concept_desc_bold_2')}</strong>{t('concept_desc_3')}<strong>{t('concept_desc_bold_3')}</strong>{t('concept_desc_4')}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {t('tags').map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-sand/30 border border-sand text-burgundy text-xs uppercase tracking-wide font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Official Asset Display */}
                    <div className="md:col-span-4">
                        <div className="bg-white rounded-xl border border-sand shadow-sm overflow-hidden h-full flex flex-col">
                            <div className="bg-ivory p-3 border-b border-sand flex justify-between items-center">
                                <span className="text-xs text-burgundy font-bold uppercase tracking-widest">{t('official_asset')}</span>
                                <ExternalLink size={14} className="text-taupe" />
                            </div>
                            <div className="flex-grow flex items-center justify-center p-8 bg-white">
                                {/* Using the Direct Link for Preview */}
                                <img
                                    src="/assets/monogram.png"
                                    alt="Official Monogram A&D"
                                    width="200"
                                    height="200"
                                    loading="lazy"
                                    className="max-w-full max-h-[200px] object-contain opacity-90 hover:opacity-100 transition-opacity"
                                />
                            </div>
                            <div className="p-4 bg-ivory border-t border-sand text-center">
                                <p className="text-[10px] text-taupe">
                                    {t('file_info')}<br />
                                    {t('usage_info')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. COLOR PALETTE (CRITICAL) */}
                <section>
                    <SectionHeader icon={<Palette className="text-terracotta" />} title={t('color_system_title')} />

                    <div className="mb-6 p-4 bg-maroon/5 rounded-lg border-l-4 border-maroon flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-maroon shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-bold text-maroon uppercase tracking-wide mb-1">{t('strict_rules_title')}</p>
                            <ul className="list-disc ml-4 space-y-1 text-charcoal">
                                <li><strong>Maroon (#800020)</strong>{t('rule_maroon')}</li>
                                <li><strong>{t('rule_white')}</strong>{t('rule_white_desc')}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        <ColorCard color={COLORS.hero} large={true} t={t} />
                        {COLORS.foundation.map((c, i) => <ColorCard key={i} color={c} t={t} />)}
                        {COLORS.accents.map((c, i) => <ColorCard key={i} color={c} t={t} />)}
                        {COLORS.text.map((c, i) => <ColorCard key={i} color={c} t={t} />)}
                    </div>
                </section>

                {/* 3. PRODUCTION BRIEFS */}
                <section>
                    <SectionHeader icon={<Check className="text-terracotta" />} title={t('production_briefs_title')} />
                    <div className="grid md:grid-cols-3 gap-6">
                        {VENDOR_BRIEFS.map((brief, idx) => (
                            <div key={idx} className="glass-card p-8 rounded-xl flex flex-col h-full hover:border-terracotta transition-colors">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-ivory rounded-full border border-sand shadow-sm">{brief.icon}</div>
                                    <h3 className="font-heading font-bold text-xl text-burgundy">{brief.role}</h3>
                                </div>
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-maroon uppercase tracking-widest mb-2">{t('theme_label')}</h4>
                                    <p className="text-sm font-medium text-charcoal">{brief.title}</p>
                                    <p className="text-xs text-taupe mt-1 italic">{brief.desc}</p>
                                </div>
                                <div className="mt-auto">
                                    <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-3">{t('req_label')}</h4>
                                    <ul className="space-y-3">
                                        {brief.points.map((pt, i) => (
                                            <li key={i} className="text-xs flex items-start gap-2 leading-relaxed">
                                                <span className="block w-1.5 h-1.5 bg-terracotta rounded-full mt-1.5 shrink-0"></span>
                                                <span className="text-charcoal">{pt}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. TYPOGRAPHY & APPLICATION */}
                <section>
                    <SectionHeader icon={<Type className="text-terracotta" />} title={t('typography_title')} />
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Fonts */}
                        <div className="space-y-8 bg-white p-8 rounded-xl border border-sand">
                            <div className="border-l-4 border-burgundy pl-6">
                                <span className="text-[10px] text-taupe uppercase tracking-widest font-bold">{t('main_headings')}</span>
                                <p className="font-heading text-4xl text-charcoal mt-1">Playfair Display</p>
                                <p className="text-xs text-taupe mt-1">{t('use_headings')}</p>
                            </div>
                            <div className="border-l-4 border-charcoal pl-6">
                                <span className="text-[10px] text-taupe uppercase tracking-widest font-bold">{t('body_menus')}</span>
                                <p className="font-body text-4xl text-charcoal mt-1">Montserrat</p>
                                <p className="text-xs text-taupe mt-1">{t('use_body')}</p>
                            </div>
                            <div className="border-l-4 border-maroon pl-6">
                                <span className="text-[10px] text-taupe uppercase tracking-widest font-bold">{t('couple_signatures')}</span>
                                <p className="font-script text-5xl text-maroon mt-1">Pinyon Script</p>
                                <p className="text-xs text-taupe mt-1">{t('use_script')}</p>
                            </div>
                        </div>

                        {/* Application Guidelines */}
                        <div className="glass-card p-8 rounded-xl">
                            <h3 className="font-heading font-bold text-burgundy text-xl mb-6">{t('souvenir_rules_title')}</h3>
                            <div className="space-y-3">
                                <DoDontRow type="do" text={t('rule_do_1')} />
                                <DoDontRow type="do" text={t('rule_do_2')} />
                                <DoDontRow type="do" text={t('rule_do_3')} />
                                <DoDontRow type="dont" text={t('rule_dont_1')} />
                                <DoDontRow type="dont" text={t('rule_dont_2')} />
                                <DoDontRow type="dont" text={t('rule_dont_3')} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="border-t border-[#E8DCC4] py-12 text-center">
                    <p className="font-heading text-burgundy text-lg font-bold">Athur & Dara</p>
                    <p className="text-xs text-taupe mt-2 uppercase tracking-widest">{t('footer_rights')}</p>
                    <p className="text-xs text-taupe mt-4 max-w-md mx-auto leading-relaxed opacity-60">
                        {t('footer_disclaimer')}
                    </p>
                </footer>

            </main>
        </div>
    );
}