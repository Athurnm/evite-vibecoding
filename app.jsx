import React from 'react';
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
    ExternalLink
} from 'lucide-react';

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

// --- DATA CONSTANTS ---

const COLORS = {
    hero: { name: 'Deep Maroon', hex: '#800020', desc: 'Reserved: Bride & Groom Only.' },
    foundation: [
        { name: 'Warm Ivory', hex: '#F8F6F0', desc: 'Main Backgrounds, Drapes' },
        { name: 'Champagne', hex: '#F7E7CE', desc: 'Runners, Fabric, Place Cards' },
        { name: 'Warm Sand', hex: '#E8DCC4', desc: 'Table Linens, Base Elements' },
    ],
    accents: [
        { name: 'Terracotta Blush', hex: '#D4A5A5', desc: 'Floral Accents, Napkins' },
        { name: 'Warm Taupe', hex: '#A89F91', desc: 'Typography, Structural Lines' },
        { name: 'Natural Oak', hex: '#C19A6B', desc: 'Wood Furniture, Crates' },
    ],
    text: [
        { name: 'Burgundy Brown', hex: '#6B4C4C', desc: 'Headers & Emphasis' },
        { name: 'Charcoal Brown', hex: '#4A3F35', desc: 'Body Text' },
    ]
};

const VENDOR_BRIEFS = [
    {
        role: "Decorator (Steikhaus)",
        icon: <Lightbulb className="w-6 h-6 text-gold-natural" />,
        title: "Warm Romantic Sanctuary",
        desc: "A warm canvas specifically to contrast the Maroon attire.",
        points: [
            "Lighting: 2700K-3000K (Warm Amber) ONLY. No cool white.",
            "Tables: Expose venue's wooden tables. Use runners, not full cloths.",
            "Backdrop: Warm Ivory/Champagne. Avoid pure white fabric.",
            "Vibe: Mediterranean Romance meets Organic Modernism.",
            "Key: Create a 'Golden Hour' glow even in the morning."
        ]
    },
    {
        role: "Florist",
        icon: <Flower className="w-6 h-6 text-terracotta" />,
        title: "Romantic Earth Blooms",
        desc: "Organic, asymmetric clusters. Not perfect spheres.",
        points: [
            "Primary: Ivory & Champagne Roses, Terracotta Carnations",
            "Texture: Dried Pampas, Bleached foliage for movement",
            "Accent: Deep Burgundy Dahlias (Strategic touches only)",
            "Foliage: Sage/Muted Eucalyptus. NO bright greens.",
            "Vessels: Amber glass vases or Terracotta pots"
        ]
    },
    {
        role: "Souvenir & Stationery",
        icon: <Gift className="w-6 h-6 text-maroon" />,
        title: "Minimalist Elegance",
        desc: "Clean lines, warm paper tones, refined typography.",
        points: [
            "Paper: Warm Ivory or Champagne stock (Matte/Doff).",
            "Technique: Embossed (Timbul) monogram preferred.",
            "Ink: Burgundy Brown (#6B4C4C) or Warm Taupe.",
            "Finish: No glossy laminates. Natural texture is best.",
            "Tags: Use the official monogram arch."
        ]
    }
];

// --- COMPONENTS ---

const SectionHeader = ({ icon, title }) => (
    <div className="flex items-center gap-3 mb-6 border-b border-[#E8DCC4] pb-2">
        {icon}
        <h2 className="text-2xl font-heading font-bold text-burgundy">{title}</h2>
    </div>
);

const ColorCard = ({ color, large = false }) => (
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
    return (
        <div className="min-h-screen bg-ivory text-charcoal font-body pb-20">
            <FontStyles />

            {/* HEADER HERO */}
            <header className="bg-white border-b border-sand pt-12 pb-8 px-6 sticky top-0 z-50 bg-opacity-95 backdrop-blur-sm shadow-sm">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3 text-taupe text-xs font-bold tracking-[0.2em] uppercase mb-2">
                            <span>Production Guidelines</span>
                            <span className="w-1 h-1 bg-terracotta rounded-full"></span>
                            <span>Decoration & Souvenir</span>
                        </div>
                        <h1 className="font-heading text-4xl md:text-5xl text-burgundy font-semibold mb-2">
                            Athur <span className="font-script text-maroon text-5xl">&</span> Dara
                        </h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-charcoal mt-4 font-medium">
                            <span className="flex items-center gap-1.5"><Calendar size={16} className="text-terracotta" /> March 28, 2026</span>
                            <span className="flex items-center gap-1.5"><MapPin size={16} className="text-terracotta" /> Steikhaus, Bandung</span>
                            <span className="flex items-center gap-1.5"><Clock size={16} className="text-terracotta" /> 08:00 - 13:00</span>
                        </div>
                    </div>

                    {/* Asset Download */}
                    <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                        <a
                            href="https://drive.google.com/file/d/1AaXeekBRExwG11kZvO1nipsI1-_V_ALg/view?usp=drive_link"
                            target="_blank"
                            rel="noreferrer"
                            className="flex w-full md:w-auto justify-center items-center gap-2 bg-maroon text-ivory px-8 py-3 rounded-lg font-medium text-sm hover:bg-maroon-hover transition-colors shadow-lg"
                        >
                            <Download size={18} />
                            Download Monogram Asset
                        </a>
                        <p className="text-[10px] text-taupe">
                            Required for Souvenirs & Signage
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 pt-10 space-y-16">

                {/* 1. VISUAL IDENTITY & CONCEPT */}
                <section className="grid md:grid-cols-12 gap-8">
                    {/* Left: Concept Text */}
                    <div className="md:col-span-8 space-y-6">
                        <SectionHeader icon={<Lightbulb className="text-terracotta" />} title="Design Concept" />
                        <div className="glass-card p-8 rounded-xl">
                            <p className="text-xl leading-relaxed font-heading italic text-burgundy mb-4">
                                "Maroon Romance Meets Ethereal Earth"
                            </p>
                            <p className="text-base leading-relaxed text-charcoal mb-6">
                                We are creating a <strong>warm, romantic sanctuary</strong>. The design anchors on the couple's <strong>Deep Maroon</strong> attire, contrasted against a canvas of <strong>Warm Ivory, Champagne, and Earth Tones</strong>.
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {['Romantic', 'Warm', 'Organic', 'Timeless', 'Post-Lebaran Spring'].map(tag => (
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
                                <span className="text-xs text-burgundy font-bold uppercase tracking-widest">Official Asset</span>
                                <ExternalLink size={14} className="text-taupe" />
                            </div>
                            <div className="flex-grow flex items-center justify-center p-8 bg-white">
                                {/* Using the Direct Link for Preview */}
                                <img
                                    src="/assets/monogram.png"
                                    alt="Official Monogram A&D"
                                    className="max-w-full max-h-[200px] object-contain opacity-90 hover:opacity-100 transition-opacity"
                                />
                            </div>
                            <div className="p-4 bg-ivory border-t border-sand text-center">
                                <p className="text-[10px] text-taupe">
                                    File: Monogram_AD_Final.png<br />
                                    Usage: Embossed tags, Signage
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. COLOR PALETTE (CRITICAL) */}
                <section>
                    <SectionHeader icon={<Palette className="text-terracotta" />} title="Official Color System" />

                    <div className="mb-6 p-4 bg-maroon/5 rounded-lg border-l-4 border-maroon flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-maroon shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-bold text-maroon uppercase tracking-wide mb-1">Strict Color Rules</p>
                            <ul className="list-disc ml-4 space-y-1 text-charcoal">
                                <li><strong>Maroon (#800020)</strong> is strictly reserved for the Bride & Groom. Do not use for tablecloths, drapes, or guest attire.</li>
                                <li><strong>Avoid Pure White.</strong> Always use Warm Ivory (#F8F6F0) or Champagne to maintain the "warm sanctuary" vibe.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        <ColorCard color={COLORS.hero} large={true} />
                        {COLORS.foundation.map((c, i) => <ColorCard key={i} color={c} />)}
                        {COLORS.accents.map((c, i) => <ColorCard key={i} color={c} />)}
                        {COLORS.text.map((c, i) => <ColorCard key={i} color={c} />)}
                    </div>
                </section>

                {/* 3. PRODUCTION BRIEFS */}
                <section>
                    <SectionHeader icon={<Check className="text-terracotta" />} title="Production Briefs" />
                    <div className="grid md:grid-cols-3 gap-6">
                        {VENDOR_BRIEFS.map((brief, idx) => (
                            <div key={idx} className="glass-card p-8 rounded-xl flex flex-col h-full hover:border-terracotta transition-colors">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-ivory rounded-full border border-sand shadow-sm">{brief.icon}</div>
                                    <h3 className="font-heading font-bold text-xl text-burgundy">{brief.role}</h3>
                                </div>
                                <div className="mb-6">
                                    <h4 className="text-xs font-bold text-maroon uppercase tracking-widest mb-2">Theme</h4>
                                    <p className="text-sm font-medium text-charcoal">{brief.title}</p>
                                    <p className="text-xs text-taupe mt-1 italic">{brief.desc}</p>
                                </div>
                                <div className="mt-auto">
                                    <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-3">Requirements</h4>
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
                    <SectionHeader icon={<Type className="text-terracotta" />} title="Typography & Souvenir Details" />
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Fonts */}
                        <div className="space-y-8 bg-white p-8 rounded-xl border border-sand">
                            <div className="border-l-4 border-burgundy pl-6">
                                <span className="text-[10px] text-taupe uppercase tracking-widest font-bold">Main Headings</span>
                                <p className="font-heading text-4xl text-charcoal mt-1">Playfair Display</p>
                                <p className="text-xs text-taupe mt-1">Use for "The Wedding of", Welcome Signs</p>
                            </div>
                            <div className="border-l-4 border-charcoal pl-6">
                                <span className="text-[10px] text-taupe uppercase tracking-widest font-bold">Body & Menus</span>
                                <p className="font-body text-4xl text-charcoal mt-1">Montserrat</p>
                                <p className="text-xs text-taupe mt-1">Use for Menu lists, Souvenir cards</p>
                            </div>
                            <div className="border-l-4 border-maroon pl-6">
                                <span className="text-[10px] text-taupe uppercase tracking-widest font-bold">Couple Signatures</span>
                                <p className="font-script text-5xl text-maroon mt-1">Pinyon Script</p>
                                <p className="text-xs text-taupe mt-1">Use for "Athur & Dara" only</p>
                            </div>
                        </div>

                        {/* Application Guidelines */}
                        <div className="glass-card p-8 rounded-xl">
                            <h3 className="font-heading font-bold text-burgundy text-xl mb-6">Souvenir & Tag Rules</h3>
                            <div className="space-y-3">
                                <DoDontRow type="do" text="Use Warm Taupe ink on Ivory paper" />
                                <DoDontRow type="do" text="Embossed (Timbul) is preferred for luxury feel" />
                                <DoDontRow type="do" text="Maintain clear space around the arch logo" />
                                <DoDontRow type="dont" text="Do NOT use glossy or shiny gold finishes" />
                                <DoDontRow type="dont" text="Do NOT distort the Monogram aspect ratio" />
                                <DoDontRow type="dont" text="Do NOT use black ink (too harsh)" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="border-t border-[#E8DCC4] py-12 text-center">
                    <p className="font-heading text-burgundy text-lg font-bold">Athur & Dara</p>
                    <p className="text-xs text-taupe mt-2 uppercase tracking-widest">Official Design Guidelines • Steikhaus 2026</p>
                    <p className="text-[10px] text-taupe mt-4 max-w-md mx-auto leading-relaxed opacity-60">
                        This document is intended for vendor reference only. Colors may vary on screens.
                        Please refer to Pantone/Hex codes for exact matching.
                    </p>
                </footer>

            </main>
        </div>
    );
}