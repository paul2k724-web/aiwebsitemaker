/**
 * JSON-to-React Template Compiler
 * Dynamically generates a complete, clean React + Tailwind codebase from a JSON layout state.
 */

function getSectionComponentName(section) {
    const id = section.id || section.type || "section";
    // Standardize casing to PascalCase and strip special characters
    const clean = id.replace(/[-_]([a-z0-9])/gi, (g) => g[1].toUpperCase())
                    .replace(/[^a-zA-Z0-9]/g, '');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function compileProject(project) {
    const theme = project?.theme || {
        fontFamily: "Outfit",
        primaryColor: "#3b82f6",
        backgroundColor: "#0b0f19",
        accentColor: "#ec4899",
        borderRadius: "12px"
    };

    const sections = project?.sections || [];
    const files = {};

    // 1. Generate individual section components
    sections.forEach(section => {
        let code = '';
        const name = getSectionComponentName(section);
        switch (section.type) {
            case 'navbar':
                code = compileNavbar(section, theme);
                files[`/components/${name}.js`] = code;
                break;
            case 'hero':
                code = compileHero(section, theme);
                files[`/components/${name}.js`] = code;
                break;
            case 'features':
                code = compileFeatures(section, theme);
                files[`/components/${name}.js`] = code;
                break;
            case 'pricing':
                code = compilePricing(section, theme);
                files[`/components/${name}.js`] = code;
                break;
            case 'testimonials':
                code = compileTestimonials(section, theme);
                files[`/components/${name}.js`] = code;
                break;
            case 'faq':
                code = compileFAQ(section, theme);
                files[`/components/${name}.js`] = code;
                break;
            case 'cta':
                code = compileCTA(section, theme);
                files[`/components/${name}.js`] = code;
                break;
            case 'footer':
                code = compileFooter(section, theme);
                files[`/components/${name}.js`] = code;
                break;
            case 'custom':
                files[`/components/${name}.js`] = section.code || `import React from 'react'; export default function ${name}() { return <div className="p-8 text-center text-gray-400">Empty Custom Section</div>; }`;
                break;
        }
    });

    // 2. Generate App.js coordinating all sections
    files['/App.js'] = compileApp(sections, theme);

    return files;
}

function compileApp(sections, theme) {
    const imports = sections.map(s => {
        const name = getSectionComponentName(s);
        return `import ${name} from './components/${name}';`;
    }).join('\n');

    const renders = sections.map(s => {
        const name = getSectionComponentName(s);
        return `      <${name} />`;
    }).join('\n');

    return `import React from 'react';
${imports}

function App() {
  return (
    <div className="text-white min-h-screen font-sans selection:bg-blue-500 selection:text-white" style={{ backgroundColor: '${theme.backgroundColor || "#0b0f19"}' }}>
${renders}
    </div>
  );
}

export default App;`;
}

function compileNavbar(section, theme) {
    const brand = section.brandName || "AI Builder";
    const links = Array.isArray(section.links) ? section.links : ["Home", "Features", "Pricing", "FAQ"];
    const button = section.buttonText || "Get Started";

    return `import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0b0f19]/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          ${brand}
        </span>
        <div className="hidden md:flex items-center space-x-8 text-sm text-gray-400">
          ${links.map(l => `<a href="#${l.toLowerCase()}" className="hover:text-white transition-colors duration-200">${l}</a>`).join('\n          ')}
        </div>
        <button className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 transition-all duration-200" style={{ borderRadius: '${theme.borderRadius || "8px"}' }}>
          ${button}
        </button>
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 hover:text-white">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#0b0f19] border-b border-gray-800 px-6 py-4 space-y-4 flex flex-col">
          ${links.map(l => `<a href="#${l.toLowerCase()}" onClick={() => setOpen(false)} className="text-gray-400 hover:text-white py-2">${l}</a>`).join('\n          ')}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-3 w-full" style={{ borderRadius: '${theme.borderRadius || "8px"}' }}>
            ${button}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;`;
}

function compileHero(section, theme) {
    const title = section.title || "Create Stunning Digital Platforms";
    const subtitle = section.subtitle || "The next-generation AI powered platform to design, build, and deploy websites seamlessly.";
    const pBtn = section.primaryBtn || "Get Started Free";
    const sBtn = section.secondaryBtn || "Watch Demo";
    const img = section.imageUrl || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80";

    return `import React from 'react';

function Hero() {
  return (
    <section className="relative pt-24 pb-20 px-6 overflow-hidden flex flex-col items-center">
      {/* Decorative Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_150px,#3b82f615,transparent)] pointer-events-none" />
      
      <div className="max-w-4xl text-center space-y-8 relative z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-[linear-gradient(45deg,#60a5fa_30%,#ec4899)]">
          ${title}
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          ${subtitle}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 transition-all duration-200 shadow-[0_0_20px_5px_rgba(59,130,246,0.15)]" style={{ borderRadius: '${theme.borderRadius || "8px"}' }}>
            ${pBtn}
          </button>
          <button className="bg-gray-800/80 hover:bg-gray-800 text-gray-300 font-medium px-8 py-4 transition-all duration-200 border border-gray-700 hover:border-gray-600" style={{ borderRadius: '${theme.borderRadius || "8px"}' }}>
            ${sBtn}
          </button>
        </div>
      </div>
      
      {/* Dashboard Preview mockup */}
      <div className="mt-16 w-full max-w-5xl relative group z-10 px-4 md:px-0">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
        <div className="relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden aspect-[16/10] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]">
          <img src="${img}" className="w-full h-full object-cover opacity-80" alt="Mockup" />
        </div>
      </div>
    </section>
  );
}

export default Hero;`;
}

function compileFeatures(section, theme) {
    const title = section.title || "Engineered for Excellence";
    const subtitle = section.subtitle || "Highly detailed sections built for conversion and modern performance.";
    const items = section.items || [
        { icon: "Zap", title: "Instant Generation", desc: "AI builds completely custom component nodes in seconds." },
        { icon: "Layers", title: "Bento Layouts", desc: "Beautiful responsive structural cards for maximum clarity." },
        { icon: "Shield", title: "Security Enforced", desc: "Rigorous standards protecting your data assets." }
    ];

    return `import React from 'react';
import * as Icons from 'lucide-react';

const SafeIcon = ({ name, className }) => {
  const IconComponent = Icons[name] || Icons.Sparkles;
  return <IconComponent className={className} />;
};

function Features() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col items-center">
      <div className="text-center max-w-3xl space-y-4 mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
          ${title}
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed">
          ${subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        ${items.map((item, i) => {
            const IconName = item.icon || "Sparkles";
            return `<div className="relative group p-8 bg-gray-900/50 hover:bg-gray-800/40 border border-gray-800 hover:border-gray-700/80 transition-all duration-300 shadow-md" style={{ borderRadius: '${theme.borderRadius || "12px"}' }}>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_60%,rgba(59,130,246,0.03))]" />
          <div className="relative space-y-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 inline-block rounded-xl border border-blue-500/20">
              <SafeIcon name="${IconName}" className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">${item.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">${item.desc}</p>
          </div>
        </div>`;
        }).join('\n        ')}
      </div>
    </section>
  );
}

export default Features;`;
}

function compilePricing(section, theme) {
    const title = section.title || "Transparent, Flexible Plans";
    const plans = section.plans || [
        { name: "Starter", price: "$9", features: ["1 Project", "Email Support", "Vite export"], popular: false },
        { name: "Professional Pro", price: "$29", features: ["Unlimited projects", "Priority support", "Full visual IDE access", "Advanced components"], popular: true },
        { name: "Enterprise Custom", price: "$99", features: ["Custom integrations", "Dedicated engineer", "Custom themes"], popular: false }
    ];

    return `import React from 'react';
import { Check } from 'lucide-react';

function Pricing() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col items-center">
      <div className="text-center max-w-3xl space-y-4 mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
          ${title}
        </h2>
        <p className="text-lg text-gray-400 leading-relaxed">
          Upgrade to unlock ultimate speed and platform parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-stretch">
        ${plans.map(plan => `
        <div className={\`relative p-8 flex flex-col border transition-all duration-300 \${
          ${plan.popular} 
            ? 'bg-gray-900 border-blue-500 shadow-[0_0_30px_10px_rgba(59,130,246,0.1)] scale-105 z-10' 
            : 'bg-gray-900/40 border-gray-800 hover:border-gray-700/80'
        }\`} style={{ borderRadius: '${theme.borderRadius || "16px"}' }}>
          ${plan.popular ? `<div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow">Most Popular</div>` : ''}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-300">${plan.name}</h3>
            <div className="flex items-baseline gap-1 mt-4">
              <span className="text-4xl font-extrabold text-white">${plan.price}</span>
              <span className="text-sm text-gray-400">/ month</span>
            </div>
          </div>
          
          <ul className="space-y-4 flex-1 mb-8">
            ${plan.features.map(f => `
            <li className="flex items-start gap-3 text-sm text-gray-300">
              <Check className="h-5 w-5 text-blue-400 shrink-0" />
              <span>${f}</span>
            </li>`).join('')}
          </ul>

          <button className={\`w-full py-4 text-center font-medium transition-all duration-200 \${
            ${plan.popular}
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
          }\`} style={{ borderRadius: '${theme.borderRadius || "8px"}' }}>
            Select Plan
          </button>
        </div>`).join('')}
      </div>
    </section>
  );
}

export default Pricing;`;
}

function compileTestimonials(section, theme) {
    const title = section.title || "What Our Customers Say";
    const items = section.items || [
        { name: "John Doe", role: "Co-Founder, LiftCorp", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80", content: "The dynamic components look incredible out of the box. Absolutely cut our design sprint in half." }
    ];

    return `import React from 'react';

function Testimonials() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-16 text-center">
        ${title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        ${items.map(t => `
        <div className="p-8 bg-gray-900/50 border border-gray-800 shadow" style={{ borderRadius: '${theme.borderRadius || "12px"}' }}>
          <p className="text-gray-300 text-lg leading-relaxed mb-6 italic">"${t.content}"</p>
          <div className="flex items-center gap-4">
            <img src="${t.avatar}" className="w-12 h-12 rounded-full object-cover border border-gray-700" alt="${t.name}" />
            <div>
              <h4 className="font-bold text-white">${t.name}</h4>
              <p className="text-xs text-gray-500 font-mono">${t.role}</p>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </section>
  );
}

export default Testimonials;`;
}

function compileFAQ(section, theme) {
    const title = section.title || "Got Questions?";
    const items = Array.isArray(section.items) ? section.items : [
        { question: "Is this free?", answer: "Yes, we offer an extensive free trial." }
    ];

    return `import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

function FAQItem({ q, a, borderRadius }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 bg-gray-900/30 overflow-hidden" style={{ borderRadius: borderRadius }}>
      <button onClick={() => setOpen(!open)} className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-800/20 transition-all">
        <span className="font-bold text-white text-lg">{q}</span>
        {open ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
      </button>
      {open && (
        <div className="p-6 pt-0 text-gray-400 text-sm leading-relaxed border-t border-gray-800/50">
          {a}
        </div>
      )}
    </div>
  );
}

function FAQ() {
  const items = ${JSON.stringify(items)};
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-16 text-center">
        ${title}
      </h2>
      <div className="w-full space-y-4">
        {items.map((item, i) => (
          <FAQItem key={i} q={item.question} a={item.answer} borderRadius="${theme.borderRadius || "8px"}" />
        ))}
      </div>
    </section>
  );
}

export default FAQ;`;
}

function compileCTA(section, theme) {
    const title = section.title || "Build Your Vision Today";
    const subtitle = section.subtitle || "Instantly compile structured sections, deploy with ease, and streamline developer velocity.";
    const btn = section.buttonText || "Get Started Free";

    return `import React from 'react';

function CTA() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="relative p-12 md:p-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50 border border-blue-500/20 text-center overflow-hidden flex flex-col items-center" style={{ borderRadius: '${theme.borderRadius || "24px"}' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_50%,#3b82f615,transparent)] pointer-events-none" />
        <div className="max-w-3xl space-y-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            ${title}
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed max-w-xl mx-auto">
            ${subtitle}
          </p>
          <div className="pt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 transition-all duration-200 shadow-lg" style={{ borderRadius: '${theme.borderRadius || "8px"}' }}>
              ${btn}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;`;
}

function compileFooter(section, theme) {
    const text = section.text || "© 2026 SaaS Builder Inc. All rights reserved.";

    return `import React from 'react';

function Footer() {
  return (
    <footer className="border-t border-gray-900 bg-black/40 py-8 px-6 text-center text-sm text-gray-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span>${text}</span>
        <div className="flex space-x-6 text-gray-600 text-xs">
          <a href="#privacy" className="hover:text-gray-400">Privacy Policy</a>
          <a href="#terms" className="hover:text-gray-400">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;`;
}
