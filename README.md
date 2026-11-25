# 짜삐 다운로드 사이트

빌드 없는 정적 사이트(`index.html`, `styles.css`, `main.js`). Vercel에 그대로 올리면 된다.

- ZIP과 DMG 버튼은 `hyj090915/Jjappi`의 최신 GitHub 릴리스에서 각각 `Jjappi-mac.zip`과 `Jjappi-mac.dmg`을 받는다. 앱 안에서 업데이트하려면 같은 릴리스에 서명된 `appcast.xml`과 그 목록이 가리키는 ZIP을 함께 게시한다.
- 캐릭터 그림(`assets/cast`)은 짜삐 앱 저장소의 `scripts/export-site-art.py`로 만든다.
- 타이틀 영상은 東宝MOVIEチャンネル의 공식 유튜브 영상을 임베드한다. 영상 파일을 올리지 않는다.
- 로컬 미리보기: `npx serve .` 또는 아무 정적 서버.
