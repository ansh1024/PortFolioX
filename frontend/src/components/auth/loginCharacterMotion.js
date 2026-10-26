// Reference measurements in one shared coordinate system, baseline y = 460.
export const CAST = [
  { kind: 'violet', x: 125, y: 45, w: 190, h: 415, eyes: [[94, 27, 6], [150, 27, 6]], white: true, faceCenter: [122, 45] },
  { kind: 'ink', x: 262, y: 167, w: 118, h: 293, eyes: [[48, 28, 9.5], [79, 28, 9.5]], white: true, faceCenter: [63, 28] },
  { kind: 'lime', x: 350, y: 245, w: 133, h: 215, eyes: [[52, 48, 4.5]], white: false, faceCenter: [66, 60] },
  { kind: 'coral', x: 0, y: 302, w: 318, h: 158, eyes: [[156, 92, 8], [230, 92, 8]], white: false, faceCenter: [195, 100] },
];

const poses = {
  curious: {
    violet: { top: 70, bend: 32.9, faceX: 8, gazeX: 2.5, gazeY: 1 },
    ink: { top: 50, bend: 23.5, faceX: 18, gazeX: 4, gazeY: 0 },
    lime: { top: 35, bend: 8, faceX: 50, faceY: -14 },
    coral: { top: 8, dy: -12, faceX: 55, faceY: -27, faceAngle: -10 },
  },
  exchange: {
    violet: { top: 114, bend: 55, angle: 48, topScale: 0.92, dy: 10, faceX: -5, faceY: 20, gazeX: 2, gazeY: 3 },
    ink: { top: 45, bend: 10, dy: 20, angle: -20, gazeX: -4, gazeY: -5 },
    lime: { top: 28, bend: 6, dy: 24, faceX: 50, faceY: -14 },
    coral: { top: 8, dy: -20, faceX: 55, faceY: -27, faceAngle: -10 },
  },
  sad: {
    violet: { top: -10, bend: -45, angle: 11, faceX: -10, faceY: 30, gazeY: 3 },
    ink: { dy: 70, faceX: 8, faceY: 15, gazeX: 2, gazeY: -3 },
    lime: { faceX: 30, faceY: 25 },
    coral: { dy: -10, faceX: 39, faceY: -18, faceAngle: -8 },
  },
  away: {
    violet: { faceX: -73, faceY: 20, gazeX: -2.5 },
    ink: { faceX: -32, faceY: 80, gazeX: -3 },
    lime: { faceX: 10 },
    coral: { top: -8, dy: -12, faceX: -100, faceY: -20 },
  },
};

export function poseFor(kind, reaction, pointer = { x: 0, y: 0 }, peek = 0) {
  const pose = { top: 0, bend: 0, angle: 0, topScale: 1, dy: 0, faceX: 0, faceY: 0, faceAngle: 0, gazeX: 0, gazeY: 0, ...poses[reaction]?.[kind] };
  if (reaction === 'idle') {
    pose.top = pointer.x * 6;
    pose.faceX = pointer.x * 12;
    pose.faceY = pointer.y * 6;
    pose.gazeX = pointer.x * (kind === 'ink' ? 4 : 2.5);
    pose.gazeY = pointer.y * 2;
  }
  if (reaction === 'away') {
    if (kind === 'violet') { pose.faceX += peek * 50; pose.gazeX += peek * 5; }
    if (kind === 'ink') { pose.faceX += peek * 25; pose.faceY -= peek * 20; pose.gazeX += peek * 7; }
  }
  return pose;
}

const n = value => Number(value.toFixed(2));
export function topAnchor(character, pose) {
  if (character.kind === 'coral' || character.kind === 'lime') return [character.x + (character.kind === 'lime' ? pose.top : 0), character.y + pose.dy];
  const angle = pose.angle * Math.PI / 180;
  return [character.x + character.w / 2 + pose.top - Math.cos(angle) * character.w * pose.topScale / 2, character.y + pose.dy - Math.sin(angle) * character.w * pose.topScale / 2];
}

export function bodyPath(c, p) {
  const base = c.y + c.h;
  if (c.kind === 'coral') {
    const y = c.y + p.dy;
    return 'M0 460C0 373 ' + n(71 + p.top) + ' ' + n(y) + ' ' + n(159 + p.top) + ' ' + n(y) + 'C' + n(247 + p.top) + ' ' + n(y) + ' 318 373 318 460Z';
  }
  if (c.kind === 'lime') {
    const x = c.x + p.top, y = c.y + p.dy, radius = c.w / 2;
    return 'M350 460C' + n(350 + p.bend) + ' 400 ' + n(x) + ' 365 ' + n(x) + ' ' + n(y + radius) + 'C' + n(x) + ' ' + n(y + 30) + ' ' + n(x + 30) + ' ' + n(y) + ' ' + n(x + radius) + ' ' + n(y) + 'C' + n(x + c.w - 30) + ' ' + n(y) + ' ' + n(x + c.w) + ' ' + n(y + 30) + ' ' + n(x + c.w) + ' ' + n(y + radius) + 'C' + n(x + c.w) + ' 365 ' + n(483 + p.bend) + ' 400 483 460Z';
  }
  const [lx, ly] = topAnchor(c, p);
  const radians = p.angle * Math.PI / 180;
  const rx = lx + Math.cos(radians) * c.w * p.topScale, ry = ly + Math.sin(radians) * c.w * p.topScale;
  const bend = (p.bend - p.top * 0.47) * 1.3;
  const control = (x, y, destination, t) => n(x + (destination - x) * t + bend) + ' ' + n(y + (base - y) * t);
  return 'M' + n(lx) + ' ' + n(ly) + 'L' + n(rx) + ' ' + n(ry) + 'C' + control(rx, ry, c.x + c.w, 0.33) + ' ' + control(rx, ry, c.x + c.w, 0.72) + ' ' + n(c.x + c.w) + ' ' + base + 'L' + c.x + ' ' + base + 'C' + control(lx, ly, c.x, 0.72) + ' ' + control(lx, ly, c.x, 0.33) + ' ' + n(lx) + ' ' + n(ly) + 'Z';
}

export function peekAt(seconds, offset = 0) {
  const phase = (seconds + offset) % 5.4;
  if (phase < 2.7 || phase > 3.7) return 0;
  return Math.sin((phase - 2.7) * Math.PI) ** 2;
}

// Each actor has its own tumble, landing and stretch, as in the reference intro.
// Frames: progress, x, y, rotation, width scale, height scale, opacity.
const entrances = [
  { delay: 2.18, duration: 1.15, frames: [[0,-180,-230,-45,1,0.45,0],[0.15,-110,-150,-45,1,0.45,1],[0.5,0,0,8,1,0.45,1],[0.65,0,-12,0,1,0.45,1],[0.78,0,0,0,1,0.45,1],[1,0,0,0,1,1,1]] },
  { delay: 2.04, duration: 1.33, frames: [[0,35,-760,145,1,1,0],[0.15,35,-700,155,1,1,1],[0.35,10,-530,185,1,1,1],[0.6,35,-280,270,1,1,1],[0.88,0,0,365,1,0.92,1],[1,0,0,360,1,1,1]] },
  { delay: 2.14, duration: 1.25, frames: [[0,15,-260,-18,1,0.35,0],[0.2,10,-140,0,1,0.35,1],[0.38,0,0,18,1,0.35,1],[0.53,0,-16,0,1,0.35,1],[0.68,0,0,0,1,0.35,1],[0.8,0,0,0,1,0.55,1],[1,0,0,0,1,1,1]] },
  { delay: 2.3, duration: 1.1, frames: [[0,-220,-210,-65,0.12,0.35,0],[0.2,-180,-210,-35,0.15,0.35,1],[0.4,-100,-230,35,0.2,0.4,1],[0.65,-20,-80,-30,0.25,0.5,1],[0.8,0,0,0,0.65,0.65,1],[1,0,0,0,1,1,1]] },
];

export function entranceAt(seconds, index) {
  const track = entrances[index];
  const progress = (seconds - track.delay) / track.duration;
  const names = ['x', 'y', 'rotation', 'scaleX', 'scaleY', 'opacity'];
  if (progress >= 1) return { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, opacity: 1 };
  let frame = track.frames[0];
  if (progress > 0) {
    const nextIndex = track.frames.findIndex(item => item[0] >= progress);
    const a = track.frames[nextIndex - 1], b = track.frames[nextIndex];
    const t = (progress - a[0]) / (b[0] - a[0]);
    const eased = t * t * (3 - 2 * t);
    frame = a.map((value, i) => i ? value + (b[i] - value) * eased : progress);
  }
  return Object.fromEntries(names.map((name, i) => [name, frame[i + 1]]));
}
