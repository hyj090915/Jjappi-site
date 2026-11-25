const REPO = 'hyj090915/Jjappi';
const downloads = document.querySelectorAll('[data-download]');
const version = document.querySelector('[data-version]');
fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {headers: {Accept: 'application/vnd.github+json'}})
  .then(response => response.ok ? response.json() : null)
  .then(release => {
    if (!release) return;
    for (const link of downloads) {
      const filename = new URL(link.href).pathname.split('/').pop();
      const asset = release.assets.find(item => item.name === filename);
      if (asset) {
        link.href = asset.browser_download_url;
      } else {
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
        link.title = '이번 버전에서 제공하지 않는 파일이에요.';
      }
    }
    const date = new Date(release.published_at).toLocaleDateString('ko-KR', {month: 'long', day: 'numeric', timeZone: 'Asia/Seoul'});
    version.textContent = `${release.tag_name} · ${date} · Apple Silicon 맥 · macOS 14 이상`;
  })
  .catch(() => { /* The static links also work when GitHub's API is unavailable. */ });

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
