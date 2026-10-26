import { useEffect, useRef, useState } from 'react';
import { previewModules, questions } from './landingPreviewData.js';

// Reveal once when a group enters the viewport; native scrolling stays in control.
function useScrollReveal(root, revision = 0) {
  useEffect(() => {
    const container = root.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!container || !('IntersectionObserver' in window)) return;
    const targets = container.matches('[data-reveal]')
      ? [container] : [...container.querySelectorAll('[data-reveal]:not([data-reveal="stack"])')];
    const reveal = element => { element.classList.add('is-visible'); observer.unobserve(element); };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    targets.forEach(element => {
      if (preference.matches) element.classList.add('is-visible');
      else { element.classList.add('motion-ready'); observer.observe(element); }
    });
    const onFocus = event => targets.forEach(element => {
      if (element.contains(event.target)) reveal(element);
    });
    const onPreference = () => { if (preference.matches) targets.forEach(reveal); };
    container.addEventListener('focusin', onFocus);
    preference.addEventListener('change', onPreference);
    return () => {
      observer.disconnect();
      container.removeEventListener('focusin', onFocus);
      preference.removeEventListener('change', onPreference);
      targets.forEach(element => element.classList.remove('motion-ready'));
    };
  }, [root, revision]);
}

function Icon({ name = 'arrow', size = 20, className = '' }) {
  const shapes = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    northeast: <><path d="M6 18 18 6M6 6h12v12" /></>,
    rise: <><path d="m3 16 6-6 4 4 8-10M15 4h6v6" /><path d="M4 21h17" /></>,
    spark: <><path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5" /></>,
    journal: <><path d="M6 3h12a2 2 0 0 1 2 2v16H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z" /><path d="M6 3v18M10 8h6M10 12h5" /></>,
    layers: <><path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 17l10 5 10-5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    plus: <path d="M12 5v14M5 12h14" />,
  };
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name] || shapes.arrow}</svg>;
}

function Brand({ inverse = false, onClick }) {
  return <a className={`brand${inverse ? ' brand--inverse' : ''}`} href="#home" aria-label="PortfolioX home" onClick={onClick}>
    <span className="brand__mark" aria-hidden="true"><i /><i /><i /></span>
    <span>Portfolio<span className="brand__x">X</span></span>
  </a>;
}

function Star({ className = '' }) {
  return <svg className={`star ${className}`} viewBox="0 0 100 100" aria-hidden="true"><path d="M50 0c4 35 15 46 50 50-35 4-46 15-50 50C46 65 35 54 0 50 35 46 46 35 50 0Z" fill="currentColor" /></svg>;
}

function HeroArtwork({ paused, onToggle }) {
  const cards = useRef(null);
  const frame = useRef(null);
  function resetTilt() {
    cancelAnimationFrame(frame.current);
    cards.current?.style.removeProperty('--tilt-x');
    cards.current?.style.removeProperty('--tilt-y');
  }
  function onPointerMove(event) {
    if (paused || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      cards.current?.style.setProperty('--tilt-x', `${-y * 3}deg`);
      cards.current?.style.setProperty('--tilt-y', `${x * 4}deg`);
    });
  }
  useEffect(() => {
    if (paused) resetTilt();
    return () => cancelAnimationFrame(frame.current);
  }, [paused]);
  return <div data-reveal="artwork" data-paused={paused} className="hero-art" onPointerMove={onPointerMove} onPointerLeave={resetTilt} aria-label="Illustrative product cards, not live portfolio data">
    <div className="hero-art__aside">
      <div className="aside-label"><span className="status-dot" /> YOUR NEXT CHAPTER</div>
      <div className="round-seal"><Icon name="spark" size={19} /><span>LESS NOISE.<br />MORE CLARITY.</span></div>
      <div className="aside-message">A little context.<br /><span>A better perspective.</span></div>
      <div className="aside-bottom"><span>Your money.<br />Your point of view.</span><Icon name="northeast" size={30} /></div>
    </div>
    <div className="hero-art__main grid-surface">
      <div className="art-topline"><span><span className="tiny-cross">✳</span> A clearer kind of investing.</span><span className="preview-label">ILLUSTRATIVE PREVIEW <span className="status-dot" /></span></div>
      <div ref={cards} className="hero-cards" aria-hidden="true">
        <div className="investment-card investment-card--pink">
          <div className="investment-card__top"><span>IPO WATCHLIST</span><Icon name="northeast" size={18} /></div>
          <span className="investment-card__heading">Find your<br />next move.</span>
          <div className="card-score"><strong>78<span>/100</span></strong><span>Sample IPO score</span></div>
          <div className="investment-card__footer"><span>CONTEXT, NOT GUESSWORK.</span><Icon name="spark" size={22} /></div>
        </div>
        <div className="investment-card investment-card--ink">
          <div className="investment-card__top"><span>YOUR PERSPECTIVE</span><Icon name="journal" size={18} /></div>
          <span className="investment-card__heading">Keep the<br />reasoning.</span>
          <span className="ink-card-note">A place for the why<br />behind your decisions.</span>
        </div>
        <div className="investment-card investment-card--blue">
          <div className="investment-card__top"><span>THE LONG GAME</span><Icon name="layers" size={20} /></div>
          <span className="sip-amount">₹5,000<span>Illustrative monthly SIP</span></span>
          <svg className="card-sparkline" viewBox="0 0 240 70" fill="none"><path d="M0 61 24 53 46 57 70 34 94 41 118 24 143 30 169 13 194 18 220 3 240 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div className="investment-card__footer"><span>ONE STEP AT A TIME.</span><Icon name="northeast" size={22} /></div>
        </div>
      </div>
      <div className="sticky-note" aria-hidden="true"><Icon name="spark" size={25} /><span>BIG PICTURE.<br />SMALL DETAILS.<br />ALL YOURS.</span><span className="sticky-note__fold" /></div>
      <Star className="art-star art-star--large" /><Star className="art-star art-star--small" />
      <div className="art-bottomline"><span>IPOs. SIPs. A point of view.</span><button className="motion-toggle" onClick={onToggle} aria-label={paused ? 'Play card animation' : 'Pause card animation'} aria-pressed={paused}><span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span><span>{paused ? 'Play' : 'Pause'}</span></button></div>
    </div>
  </div>;
}

function ProductPreview() {
  const [selected, setSelected] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const [hasSwitched, setHasSwitched] = useState(false);
  const module = previewModules[displayed];
  const tabRefs = useRef([]);
  const panelRef = useRef(null);
  useScrollReveal(panelRef, displayed);
  useEffect(() => {
    if (selected === displayed) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const showSelected = () => { setHasSwitched(true); setDisplayed(selected); };
    const timer = window.setTimeout(showSelected, preference.matches ? 0 : 120);
    return () => window.clearTimeout(timer);
  }, [selected, displayed]);
  function onTabKey(event, index) {
    const keys = { ArrowRight: (index + 1) % previewModules.length, ArrowLeft: (index + previewModules.length - 1) % previewModules.length, Home: 0, End: previewModules.length - 1 };
    if (event.key in keys) { event.preventDefault(); setSelected(keys[event.key]); tabRefs.current[keys[event.key]]?.focus({ preventScroll: true }); }
  }
  return <section className="product-section grid-surface" id="preview" aria-labelledby="product-title">
    <div className="product-section__top"><p className="small-caption">BUILT AROUND YOUR NEXT MOVE</p><span className="section-cross" aria-hidden="true">✳</span></div>
    <div data-reveal="rise" className="product-intro"><h2 id="product-title">Every investment.<br />One clear picture<span className="accent-period">.</span></h2><p>A few thoughtful tools. A little less back-and-forth.<br className="desktop-break" /> Get to know your investment command center.</p></div>
    <div data-reveal="rise" className="product-tabs" role="tablist" aria-label="Explore PortfolioX modules">{previewModules.map((item, index) => <button key={item.id} ref={el => { tabRefs.current[index] = el; }} role="tab" id={`tab-${item.id}`} aria-selected={selected === index} aria-controls="product-preview-panel" tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={event => onTabKey(event, index)}><Icon name={item.symbol} size={18} />{item.label}<Icon name="northeast" size={15} /></button>)}</div>
    <div ref={panelRef} data-reveal="stack" className={`module-panel module-panel--${module.color}`} data-tab-phase={selected === displayed ? "in" : "out"} data-switched={hasSwitched} aria-busy={selected !== displayed} role="tabpanel" id="product-preview-panel" aria-labelledby={`tab-${module.id}`} key={module.id} tabIndex={0}>
      <div className="module-visual" aria-label={`${module.sheetLabel}, illustrative layout`}>
        <div className="module-back-sheet" aria-hidden="true"><Icon name={module.symbol} size={44} /><span>{module.tag}</span><Star /></div>
        <div className="module-sheet"><div className="module-sheet__top"><span className="mini-brand">p<span>✳</span></span><span>{module.sheetLabel}</span></div><h3>{module.sheetTitle}</h3><div className="module-sheet__rows">{module.rows.map((row, index) => <div key={row}><span className="row-symbol"><Icon name={index === 2 ? 'check' : module.symbol} size={15} /></span><span>{row}</span><span className="row-dot" /></div>)}</div><div className="module-sheet__note"><span className="status-dot" />{module.note}</div></div>
        <div className="module-badge" aria-hidden="true"><Icon name="northeast" size={30} /></div>
      </div>
      <div className="module-copy"><span className="module-copy__tag">{module.tag}</span><h3>{module.title.split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h3><p>{module.description}</p><span className="module-copy__note"><span className="status-dot" /> A look at what’s coming. No live account data.</span></div>
    </div>
    <div data-reveal="rise" className="product-bottom"><div><span className="outline-pill">A little more considered</span><h3>Know the why.<br />Not just the number.</h3></div><p>Bring the details and your own reasoning together. Because the most useful perspective is one you understand.</p><div className="product-bottom__note" aria-hidden="true"><span>FOR YOUR<br />NEXT CHAPTER.</span><Icon name="spark" size={28} /></div></div>
  </section>;
}

function FaqItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return <article data-reveal="rise" className="faq-item" data-open={open}>
    <h3><button id={`question-${index}`} className="faq-question" aria-expanded={open} aria-controls={`answer-${index}`} onClick={() => setOpen(value => !value)}>
      {item.question}<span className="faq-toggle" aria-hidden="true"><Icon name="plus" size={18} /></span>
    </button></h3>
    <div id={`answer-${index}`} className="faq-answer" role="region" aria-labelledby={`question-${index}`} aria-hidden={!open} inert={!open}>
      <div className="faq-answer__clip"><p>{item.answer}</p></div>
    </div>
  </article>;
}

function GettingStartedDialog({ open, onClose }) {
  const dialog = useRef(null);
  useEffect(() => { if (open && !dialog.current.open) dialog.current.showModal(); if (!open && dialog.current.open) dialog.current.close(); }, [open]);
  return <dialog ref={dialog} className="start-dialog" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }} aria-labelledby="start-title" aria-describedby="start-description">
    <button className="icon-button dialog-close" onClick={onClose} aria-label="Close getting started dialog"><Icon name="close" /></button>
    <span className="dialog-symbol"><Icon name="spark" size={32} /></span><p className="small-caption">THE FIRST CHAPTER</p><h2 id="start-title">A new perspective<br />is taking shape.</h2><p id="start-description">You’re exploring the PortfolioX landing-page preview. Sign in, registration and live portfolio screens are the next development steps.</p>
    <div className="dialog-note"><Icon name="check" size={18} /><span>No account details are collected on this page.</span></div><button className="button button--dark" onClick={onClose}>Keep exploring <Icon name="arrow" size={18} /></button>
  </dialog>;
}

export default function LandingPage() {
  const pageRef = useRef(null);
  useScrollReveal(pageRef);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    let frame;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setCompact(previous => window.scrollY > (previous ? 24 : 80));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); };
  }, []);
  const navigation = [['The product', '#preview'], ['How it works', '#how-it-works'], ['Why PortfolioX', '#why'], ['FAQs', '#questions']];
  function openStart() { setMenuOpen(false); setDialogOpen(true); }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header" data-compact={compact} id="home"><div className="site-header__inner"><Brand onClick={() => setMenuOpen(false)} /><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav><div className="nav-actions"><button className="text-button sign-in" onClick={openStart}>Sign in <Icon name="northeast" size={14} /></button><button className="button button--lime nav-start" onClick={openStart}>Get started <Icon name="arrow" size={17} /></button><button className="icon-button menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-menu" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button></div></div>
      {menuOpen && <nav className="mobile-nav" id="mobile-menu" aria-label="Mobile navigation">{navigation.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}<Icon name="arrow" size={17} /></a>)}<button className="text-button" onClick={openStart}>Sign in <Icon name="northeast" size={16} /></button></nav>}
    </header>
    <main id="main" ref={pageRef}>
      <section className="hero page-width" aria-labelledby="hero-title"><div data-reveal="rise" className="hero__heading"><h1 id="hero-title"><span className="headline-line"><span>Good investments</span></span><span className="headline-line"><span>start with clarity<span className="hero__asterisk" aria-hidden="true">✳</span></span></span></h1><p>Your IPOs, SIPs and decisions.<br className="mobile-break" /> Finally, in one place.</p></div><HeroArtwork paused={paused} onToggle={() => setPaused(!paused)} />
        <div data-reveal="rise" className="module-rail" aria-label="PortfolioX modules"><span><Icon name="northeast" />IPOs</span><span><Icon name="layers" />Mutual funds</span><span><Icon name="rise" />SIP holdings</span><span><Icon name="spark" />Risk profile</span><span><Icon name="journal" />Decision journal</span></div>
      </section>
      <div className="page-width"><ProductPreview /></div>
      <section className="why-section page-width" id="why" aria-labelledby="why-title"><div data-reveal="rise" className="why-heading"><span className="lime-label">A different perspective</span><h2 id="why-title">Less scattered.<br />More considered<span className="heading-quote" aria-hidden="true">”</span></h2><p>Your investments have a story.<br />Give yourself a place to see it.</p></div><div className="principle-list">
        <div data-reveal="rise" className="principle"><span className="principle__icon"><Icon name="layers" size={26} /></span><h3>The whole picture.</h3><p>IPOs, funds and SIP holdings, brought into one workspace. Less searching. More seeing how it all fits.</p></div>
        <div data-reveal="rise" className="principle principle--featured"><span className="principle__icon"><Icon name="spark" size={26} /></span><h3>Context comes first.</h3><p>Look beyond a score. See its contributing factors and make room for your own judgement.</p></div>
        <div data-reveal="rise" className="principle"><span className="principle__icon"><Icon name="journal" size={26} /></span><h3>Your point of view.</h3><p>Keep a record of what you considered and why. Your decision journal is a place for your perspective.</p></div>
      </div></section>
      <section className="workflow-section page-width" id="how-it-works" aria-labelledby="workflow-title"><div data-reveal="rise" className="workflow-copy"><span className="outline-pill">From the first step</span><h2 id="workflow-title">A place for<br />your next chapter.</h2><p>Start with what you own.<br />Make space for what comes next.</p><a className="text-link" href="#preview">Take a closer look <Icon name="northeast" size={18} /></a></div><ol className="workflow-list"><li data-reveal="rise"><span>01</span><div><h3>Bring it together.</h3><p>Keep your IPO applications and SIP holdings connected to the details that matter.</p></div></li><li data-reveal="rise"><span>02</span><div><h3>Find your perspective.</h3><p>Explore IPO scoring factors and the risk assessment returned by the backend.</p></div></li><li data-reveal="rise"><span>03</span><div><h3>Remember your reasoning.</h3><p>Give your future self some context with a note in your decision journal.</p></div></li></ol></section>
      <section className="faq-section page-width" id="questions" aria-labelledby="faq-title"><div><span className="small-caption">A FEW THINGS TO KNOW</span><h2 id="faq-title">Glad you asked<span className="accent-period">.</span></h2><p>A little clarity before you explore.</p></div><div className="faq-list">{questions.map((item, index) => <FaqItem key={item.question} item={item} index={index} />)}</div></section>
      <section data-reveal="rise" className="closing-section page-width" aria-labelledby="closing-title"><div className="closing-back" aria-hidden="true"><span>YOUR NEXT MOVE STARTS WITH A LITTLE PERSPECTIVE.</span><Icon name="northeast" size={28} /></div><div className="closing-ticket grid-surface"><Star className="closing-star" /><span className="outline-pill">This is just the beginning.</span><h2 id="closing-title">Make your next move<br />a considered one.</h2><div className="closing-actions"><button className="button button--lime" onClick={openStart}>Get to know PortfolioX <Icon name="arrow" size={18} /></button><p>Your investments.<br />A clearer point of view.</p></div><div className="closing-sticker" aria-hidden="true"><Icon name="spark" size={24} /><span>HERE’S TO<br />WHAT’S NEXT.</span></div></div></section>
    </main>
    <footer className="site-footer page-width"><Brand /><p>An investment command center. In the making.</p><a href="#home">Back to top <Icon name="northeast" size={15} /></a><span className="footer-copyright">© {new Date().getFullYear()} PortfolioX</span></footer>
    <GettingStartedDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
  </>;
}
