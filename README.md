# 🚢 HMS 10주년 기념 온라인 사진/영상전

**"10년의 항해, 함께한 순간들"**

HD현대마린솔루션 창립 10주년을 기념하는 온라인 사진전 웹사이트입니다.

## 📋 기능

✅ **사진 갤러리**
- 3개 카테고리별 분류 (HMS와 나 / HMS와 우리 / HMS와 10년)
- 각 사진마다 작가 정보, 촬영 시기, 장소, 설명 표시
- 클릭하면 확대 보기 가능
- Google Drive에서 직접 이미지 로드

✅ **응원 메시지**
- 임직원들의 응원 메시지를 남길 수 있는 게시판
- 브라우저 로컬 스토리지에 저장 (최대 100개)
- 실시간 표시

✅ **투표 시스템**
- QR코드를 통한 투표 참여
- Google Forms 연동

## 🚀 배포

이 사이트는 **GitHub Pages**에서 호스팅됩니다.

### 배포 주소
```
https://hdhms.github.io/10th/
```

### 배포 활성화 방법
1. GitHub 저장소 Settings 이동
2. Pages 섹션에서 "Deploy from a branch" 선택
3. Branch를 `main`으로 설정
4. Save 클릭

## 📸 데이터 구성

사진 정보는 **Google Sheets**에서 관리됩니다:
```
https://docs.google.com/spreadsheets/d/1lSXWtgNW6tttziaQ9GYgRVRotO1Xpha-RvFS27hQu_E
```

### 필수 컬럼
- `고유ID`: 사진의 고유 번호
- `카테고리`: HMS와나 / HMS와우리 / HMS와10년
- `이름`: 작가 이름
- `부서`: 작가 부서
- `작품제목`: 사진 제목
- `촬영시기`: 촬영 시기 (예: 2024년 3월)
- `촬영장소`: 촬영 장소
- `한줄소개`: 사진에 대한 한줄 설명
- `구글드라이브링크`: Google Drive 이미지 링크
- `투표수`: 받은 투표 수 (숫자)

## 🗳️ 투표 설정

### Google Forms 생성
1. Google Forms 새 설문지 생성
2. "가장 감동적인 사진 투표" 라는 제목 추가
3. 선택형 문제로 사진들을 옵션으로 추가
4. 공유 링크 복사

### 코드에 적용
`js/app.js`의 `CONFIG` 섹션에서:
```javascript
VOTING_FORM_URL: 'https://forms.gle/YOUR_VOTING_FORM_ID'
```

## 🛠️ 로컬 개발

```bash
# 저장소 클론
git clone https://github.com/hdhms/10th.git
cd 10th

# 로컬 서버 실행
python -m http.server 8000
# 또는
npx http-server

# 브라우저에서 열기
http://localhost:8000
```

## 📁 파일 구조

```
10th/
├── index.html          # 메인 HTML
├── css/
│   └── style.css       # 스타일시트
├── js/
│   └── app.js          # 메인 JavaScript
└── README.md           # 이 파일
```

## ⚙️ 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Data**: Google Sheets + opensheet API
- **Hosting**: GitHub Pages
- **QR Code**: api.qrserver.com
- **Storage**: Browser LocalStorage

## 🎨 커스터마이징

### 색상 변경
`css/style.css`의 `:root` 섹션에서 CSS 변수 수정:
```css
:root {
    --primary-color: #003d7a;      /* 파란색 */
    --secondary-color: #0066cc;    /* 밝은 파란색 */
    --accent-color: #ff6b6b;       /* 빨간색 */
}
```

### 텍스트 수정
`index.html`의 hero 섹션 내용 수정

## 📞 문의

기술적 문제가 있으시면 GitHub Issues에 등록해주세요.

---

**Made with ❤️ for HMS 10th Anniversary**
