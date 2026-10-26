import { useEffect, useId, useRef, useState } from 'react';
import { CAST, bodyPath, entranceAt, peekAt, poseFor, topAnchor } from './loginCharacterMotion.js';

function CastFace({ character, prefix }) {
  const c = character;
  return <g className={'cast-face cast-face--' + c.kind} data-face={c.kind}>
    {c.eyes.map(([x, y, radius], index) => <g key={index} data-eye={index} transform={'translate(' + x + ' ' + y + ')'}>
      <g data-eye-open="true">
        {c.white && <><defs><clipPath id={prefix + '-' + c.kind + '-' + index}><circle r={radius} /></clipPath></defs><circle className="cast-eye-white" r={radius} /></>}
        <g clipPath={c.white ? 'url(#' + prefix + '-' + c.kind + '-' + index + ')' : undefined}><circle data-pupil="true" className="cast-eye-ink" r={c.white ? radius * 0.52 : radius} /></g>
      </g>
      <path data-eye-closed="true" opacity="0" className={'cast-eye-closed' + (c.kind === 'ink' ? ' cast-eye-closed--white' : '')} d={'M' + (-radius) + ' 0Q0 ' + (-radius * 0.7) + ' ' + radius + ' 0'} />
    </g>)}
    {c.kind === 'violet' && <>
      <path className="cast-mouth cast-mouth--smile" d="M111 48Q121 53 131 48L136 54Q121 62 106 54Z" />
      <path className="cast-mouth cast-mouth--curious" d="M126 22H135V58H126Z" />
      <path className="cast-mouth cast-mouth--sad cast-line" d="M108 67Q122 51 139 67" />
    </>}
    {c.kind === 'coral' && <>
      <path className="cast-mouth cast-mouth--smile" d="M179 104H210A15.5 15.5 0 0 1 179 104Z" />
      <circle className="cast-mouth cast-mouth--curious" cx="195" cy="104" r="8" />
      <path className="cast-mouth cast-mouth--sad cast-line" d="M185 105Q195 94 205 105" />
    </>}
    {c.kind === 'lime' && <>
      <path className="cast-mouth cast-mouth--smile cast-beak" d="M76 72H158" />
      <path className="cast-mouth cast-mouth--curious cast-beak" d="M52 72H99" />
      <path className="cast-mouth cast-mouth--away cast-beak" d="M0 72H62" />
      <path className="cast-mouth cast-mouth--sad cast-line" d="M52 58Q65 64 78 58T104 58" />
    </>}
  </g>;
}

const rounded = value => Number(value.toFixed(3));
function attribute(element, name, value) {
  const text = String(value);
  if (element.getAttribute(name) !== text) element.setAttribute(name, text);
}

export default function LoginCharacters({ interaction }) {
  const scene = useRef(null);
  const prefix = useId().replace(/:/g, '');
  const [exchanging, setExchanging] = useState(false);
  const away = interaction.passwordVisible && interaction.hasPassword;
  const passwordCurious = interaction.field === 'password';
  const reaction = away ? 'away' : passwordCurious ? 'curious' : interaction.hasError ? 'sad' : exchanging ? 'exchange' : interaction.field ? 'curious' : 'idle';
  const latest = useRef({ reaction, rejectionId: interaction.rejectionId || 0 });
  useEffect(() => { latest.current = { reaction, rejectionId: interaction.rejectionId || 0 }; }, [reaction, interaction.rejectionId]);
  useEffect(() => {
    if (!interaction.exchangeId) { setExchanging(false); return; }
    setExchanging(true);
    const timer = window.setTimeout(() => setExchanging(false), 1100);
    return () => window.clearTimeout(timer);
  }, [interaction.exchangeId]);

  useEffect(() => {
    const svg = scene.current;
    const art = svg.closest('.login-art');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const actors = CAST.map(c => {
      const actor = svg.querySelector('[data-actor="' + c.kind + '"]');
      return { c, actor, body: actor.querySelector('[data-body]'), face: actor.querySelector('[data-face]'), eyes: [...actor.querySelectorAll('[data-eye]')], pose: poseFor(c.kind, 'idle') };
    });
    let frame, previous = performance.now(), time = 0, ambientTime = 0, shakeStart = -10, rejection = 0, awayStart = 0, previousReaction = 'idle';
    const pointer = { x: 0, y: 0 };
    const onMove = event => {
      if (event.pointerType !== 'mouse' || reduced.matches) return;
      const bounds = svg.getBoundingClientRect();
      pointer.x = Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / 300));
      pointer.y = Math.max(-1, Math.min(1, (event.clientY - bounds.top - bounds.height / 2) / 240));
    };
    const reset = () => { pointer.x = 0; pointer.y = 0; };
    const tick = now => {
      const elapsed = Math.max(0, (now - previous) / 1000);
      const dt = Math.min(elapsed, 0.25);
      previous = now;
      const state = latest.current;
        time += elapsed;
        const ambientPaused = art.matches(':hover') || art.contains(document.activeElement);
        if (!ambientPaused) ambientTime += elapsed;
        if (state.reaction !== previousReaction) {
          if (state.reaction === 'away') awayStart = ambientTime;
          previousReaction = state.reaction;
        }
        if (state.rejectionId !== rejection) { rejection = state.rejectionId; shakeStart = time; }
        actors.forEach((actor, index) => {
          const { c, body, face, eyes } = actor;
          const peek = state.reaction === 'away' && !reduced.matches ? peekAt(ambientTime - awayStart, c.kind === 'ink' ? 0.7 : 0) : 0;
          const target = poseFor(c.kind, state.reaction, pointer, peek);
          const alpha = reduced.matches ? 1 : 1 - Math.exp(-dt * 14);
          Object.keys(target).forEach(key => { actor.pose[key] += (target[key] - actor.pose[key]) * alpha; });
          const p = actor.pose;
          const shakeAge = time - shakeStart - index * 0.035;
          const shake = !reduced.matches && state.reaction === 'sad' && shakeAge >= 0 && shakeAge < 0.65 ? Math.sin(shakeAge * 30) * 5 * Math.exp(-shakeAge * 4) : 0;
          const entrance = entranceAt(reduced.matches ? 10 : time, index);
          const pivot = c.x + c.w / 2;
          attribute(actor.actor, 'opacity', rounded(entrance.opacity));
          attribute(actor.actor, 'transform', 'translate(' + rounded(shake + entrance.x) + ' ' + rounded(entrance.y) + ') translate(' + pivot + ' 460) rotate(' + rounded(entrance.rotation) + ') scale(' + rounded(entrance.scaleX) + ' ' + rounded(entrance.scaleY) + ') translate(' + (-pivot) + ' -460)');
          attribute(body, 'd', bodyPath(c, p));
          const [x, y] = topAnchor(c, p);
          const angle = c.kind === 'coral' || c.kind === 'lime' ? 0 : p.angle;
          attribute(face, 'transform', 'translate(' + rounded(x) + ' ' + rounded(y) + ') rotate(' + rounded(angle) + ') scale(' + rounded(p.topScale) + ') translate(' + rounded(p.faceX) + ' ' + rounded(p.faceY) + ') rotate(' + rounded(p.faceAngle + shake * 0.3) + ' ' + c.faceCenter.join(' ') + ')');
          let mouth = state.reaction === 'idle' ? 'smile' : state.reaction === 'sad' ? 'sad' : state.reaction === 'away' ? (c.kind === 'lime' ? 'away' : 'sad') : 'curious';
          if (peek > 0.6 && c.kind === 'violet') mouth = 'curious';
          attribute(face, 'data-mouth', mouth);
          eyes.forEach((eye, eyeIndex) => {
            const [ex, ey] = c.eyes[eyeIndex];
            const blinkPhase = (ambientTime + index * 1.3) % 6;
            const naturalBlink = !reduced.matches && blinkPhase > 4.5 && blinkPhase < 4.72 ? 1 - 0.95 * Math.sin((blinkPhase - 4.5) / 0.22 * Math.PI) : 1;
            const closed = state.reaction === 'away' && c.kind === 'coral';
            let open = naturalBlink;
            if (state.reaction === 'away' && c.kind === 'violet') open *= 0.55 + peek * 0.45;
            if (state.reaction === 'away' && c.kind === 'ink') open *= 0.7 + peek * 0.3;
            attribute(eye, 'transform', 'translate(' + ex + ' ' + ey + ')');
            const visible = eye.querySelector('[data-eye-open]');
            attribute(visible, 'opacity', closed ? 0 : 1);
            attribute(visible, 'transform', 'scale(1 ' + rounded(open) + ')');
            attribute(eye.querySelector('[data-eye-closed]'), 'opacity', closed ? 1 : 0);
            attribute(eye.querySelector('[data-pupil]'), 'transform', 'translate(' + rounded(p.gazeX) + ' ' + rounded(p.gazeY) + ')');
          });
        });
      frame = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', reset);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', reset);
    };
  }, []);

  return <aside className="login-art" data-scene="vector" data-reaction={reaction} aria-label="Animated characters react to the form">
    <span className="login-art__caption">A LITTLE LESS NOISE. A LITTLE MORE YOU.</span>
    <div className="login-cast login-cast--vector" aria-hidden="true">
      <svg ref={scene} className="cast-scene" viewBox="-25 0 580 500" fill="none">
        {CAST.map(c => <g key={c.kind} data-actor={c.kind} opacity="0" transform="translate(0 -530)">
          <path data-body={c.kind} className={'cast-body cast-body--' + c.kind} d={bodyPath(c, poseFor(c.kind, 'idle'))} />
          <CastFace character={c} prefix={prefix} />
        </g>)}
      </svg>
    </div>
    <div className="login-art__bottom"><span>Your investments.<br />Your point of view.</span></div>
  </aside>;
}

export function LoginIntro() {
  return <div className="login-intro" aria-hidden="true"><span className="login-intro__dot" /><svg className="login-intro__star" viewBox="0 0 100 100"><path d="M50 0c4 35 15 46 50 50-35 4-46 15-50 50C46 65 35 54 0 50 35 46 46 35 50 0Z" fill="currentColor" /></svg></div>;
}
