// The download button always targets the newest GitHub release. The static
// link works with no script; the API call only adds the version and date.
const REPO = 'hyj090915/jjappi';
const ASSET = 'Jjappi-mac.zip';
const downloads = document.querySelectorAll('[data-download]');
for (const link of downloads) link.href = `https://github.com/${REPO}/releases/latest/download/${ASSET}`;

const version = document.querySelector('[data-version]');
fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {headers: {Accept: 'application/vnd.github+json'}})
  .then(response => {
    if (response.status === 404) throw new Error('no-release');
    if (!response.ok) throw new Error('unavailable');
    return response.json();
  })
  .then(release => {
    const asset = release.assets.find(item => item.name === ASSET) ?? release.assets.find(item => item.name.endsWith('.zip'));
    if (!asset) throw new Error('no-release');
    for (const link of downloads) link.href = asset.browser_download_url;
    const date = new Date(release.published_at).toLocaleDateString('ko-KR', {month: 'long', day: 'numeric'});
    version.textContent = `${release.tag_name} · ${date} · Apple Silicon 맥 · macOS 14 이상`;
  })
  .catch(error => {
    if (error.message !== 'no-release') return;
    version.textContent = '첫 버전을 준비하고 있어요';
    for (const link of downloads) {
      link.setAttribute('aria-disabled', 'true');
      link.textContent = '곧 만나요';
    }
  });

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Seeded so the hand-made wobble looks the same on every visit.
let seed = 7;
const wobble = (min, max) => { seed = (seed * 9301 + 49297) % 233280; return min + (seed / 233280) * (max - min); };

// Each letter of a heading sits a little crooked, like hand lettering.
for (const heading of document.querySelectorAll('[data-jitter]')) {
  const nodes = [...heading.childNodes];
  heading.replaceChildren();
  for (const node of nodes) {
    if (node.nodeType !== Node.TEXT_NODE) { heading.append(node); continue; }
    for (const char of node.textContent) {
      if (char === ' ') { heading.append(' '); continue; }
      const span = document.createElement('span');
      span.className = 'jit';
      span.textContent = char;
      span.style.setProperty('--r', `${wobble(-7, 7).toFixed(1)}deg`);
      span.style.setProperty('--y', `${wobble(-5, 5).toFixed(1)}px`);
      span.style.setProperty('--s', wobble(.92, 1.12).toFixed(2));
      heading.append(span);
    }
  }
  heading.setAttribute('aria-label', heading.textContent);
}

// Friends in the parade differ a little in size, tilt and footing.
document.querySelectorAll('.pal').forEach((pal, index) => {
  pal.style.setProperty('--n', index);
  pal.style.marginBottom = `${wobble(-6, 14).toFixed(0)}px`;
  const img = pal.querySelector('img');
  img.style.rotate = `${wobble(-6, 6).toFixed(1)}deg`;
  img.style.scale = wobble(.88, 1.1).toFixed(2);
});

// A little confetti burst when someone grabs a ticket.
const confettiColors = ['#f6b8c6', '#fbe39b', '#bfe3d0', '#bcd9f2', '#fff8e8'];
for (const button of document.querySelectorAll('[data-confetti]')) {
  button.addEventListener('click', event => {
    if (calm) return;
    for (let index = 0; index < 26; index++) {
      const piece = document.createElement('span');
      piece.className = 'confetti';
      piece.style.left = `${event.clientX}px`;
      piece.style.top = `${event.clientY}px`;
      piece.style.background = confettiColors[index % confettiColors.length];
      document.body.append(piece);
      const angle = Math.random() * Math.PI * 2, distance = 80 + Math.random() * 160;
      piece.animate([
        {transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1},
        {transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance + 140}px) rotate(${Math.random() * 720}deg)`, opacity: 0},
      ], {duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.22,1,.36,1)'}).onfinish = () => piece.remove();
    }
  });
}

// Hovering a friend swaps it to its happy face, like petting it in the app.
for (const pal of document.querySelectorAll('.pal[data-hop]')) {
  const image = pal.querySelector('img');
  const calm = image.src, happy = calm.replace('-neutral.webp', `-${pal.dataset.hop}.webp`);
  new Image().src = happy;
  const cheer = () => { image.src = happy; };
  const settle = () => { image.src = calm; };
  pal.addEventListener('pointerenter', cheer);
  pal.addEventListener('focus', cheer);
  pal.addEventListener('pointerleave', settle);
  pal.addEventListener('blur', settle);
}

// Browsers only autoplay muted video; this unmutes through the player's
// postMessage interface.
const video = document.querySelector('#hero-video');
const sound = document.querySelector('#sound-toggle');
sound.addEventListener('click', () => {
  const on = sound.getAttribute('aria-pressed') !== 'true';
  video.contentWindow?.postMessage(JSON.stringify({event: 'command', func: on ? 'unMute' : 'mute', args: []}), '*');
  sound.setAttribute('aria-pressed', String(on));
  sound.textContent = on ? '소리 끄기' : '소리 켜기';
});
if (matchMedia('(prefers-reduced-motion: reduce)').matches) video.src = video.src.replace('autoplay=1', 'autoplay=0');
