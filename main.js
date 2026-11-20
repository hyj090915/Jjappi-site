// The download button always targets the newest GitHub release. The static
// link works with no script; the API call only adds the version and date.
const REPO = 'hyj090915/Jjappi';
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
    version.textContent = '아직 첫 버전이 올라오지 않았어요';
    for (const link of downloads) {
      link.setAttribute('aria-disabled', 'true');
      link.textContent = '준비 중';
    }
  });

// Browsers only autoplay muted video; this unmutes through the player's
// postMessage interface.
const video = document.querySelector('#hero-video');
// The player wants to know which site embeds it; without it some visitors
// get YouTube's bot check instead of the video.
video.src += `&origin=${encodeURIComponent(location.origin)}`;
const sound = document.querySelector('#sound-toggle');
sound.addEventListener('click', () => {
  const on = sound.getAttribute('aria-pressed') !== 'true';
  video.contentWindow?.postMessage(JSON.stringify({event: 'command', func: on ? 'unMute' : 'mute', args: []}), '*');
  sound.setAttribute('aria-pressed', String(on));
  sound.textContent = on ? '소리 끄기' : '소리 켜기';
});
if (matchMedia('(prefers-reduced-motion: reduce)').matches) video.src = video.src.replace('autoplay=1', 'autoplay=0');
