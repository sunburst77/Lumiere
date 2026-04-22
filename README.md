# Lumière · 루미에르 성형외과 (데모 웹)

성형외과 브랜드 **루미에르**를 위한 정적 데모 사이트입니다. 메인 랜딩, 성공사례 목록(Supabase 연동), UI 실험 페이지로 구성되어 있습니다.

**저장소:** [https://github.com/sunburst77/Lumiere](https://github.com/sunburst77/Lumiere)

## 구성 파일

| 파일 | 설명 |
|------|------|
| `index.html` | 메인 페이지 — 히어로, 후기(Swiper), 이벤트 플립 카드, 사례·의료진·안전, 하단 상담 폼 등 |
| `success-cases.html` | 성공사례 모아보기 — Supabase `success_stories` 테이블에서 데이터 로드, 필터·페이지네이션 |
| `master.html` | 디자인 톤앤매너 레퍼런스 |
| `test.html` | 카드·배너 UI 컴포넌트 실험용 |
| `supabase-success-stories.sql` | 성공사례 테이블 스키마·샘플용 SQL |
| `supabase-consult-requests.sql` | 상담 신청 테이블용 SQL (참고) |

이미지·아이콘(`model.png`, `event*.png`, `Slice *.png`, `icon*.png`, `doctor*.png` 등)은 HTML과 같은 폴더에 두고 경로로 참조합니다.

## 기술 스택

- HTML5 / 인라인 CSS
- [Tailwind CSS](https://tailwindcss.com/) (CDN)
- [Pretendard](https://github.com/orioncactus/pretendard), [Gmarket Sans](https://github.com/leetaewook/gmarket-sans-dynamic-subset) 웹폰트
- [Swiper](https://swiperjs.com/) (후기 슬라이드, CDN)
- [Supabase](https://supabase.com/) REST API (`success-cases.html` 내 fetch)

## 로컬에서 실행하기

1. 이 폴더를 그대로 클론하거나 내려받습니다.
2. 정적 서버로 열면 fetch·CORS 이슈를 줄일 수 있습니다. 예:
   - VS Code **Live Server** 확장
   - `npx serve .` (Node.js)
3. 브라우저에서 `index.html`을 엽니다.  
   - `success-cases.html`은 Supabase URL·anon key가 코드에 포함되어 있어, 동일 프로젝트의 테이블이 있어야 목록이 표시됩니다.

## Supabase 설정 (성공사례 페이지)

1. Supabase 프로젝트에서 `supabase-success-stories.sql`을 실행해 테이블을 만듭니다.
2. `success-cases.html` 상단 스크립트의 `SUPABASE_URL`, `SUPABASE_ANON_KEY`를 본인 프로젝트 값으로 바꿉니다.  
   - **주의:** 공개 저장소에 푸시할 경우 anon key도 노출됩니다. 필요 시 RLS 정책으로 읽기만 허용하고, 운영 전 키 교체를 권장합니다.

## 인터랙션 요약

- **index.html**  
  - 최초 세션 1회만 풀스크린 로딩 UI → 이후 같은 탭 세션에서는 `sessionStorage`로 로딩 생략  
  - 로딩 종료 후 `intro-cha` 블러 인트로, 스크롤 시 카드·텍스트 리빌  
- **success-cases.html / test.html**  
  - 풀스크린 로딩 없음, `intro-play`로 블러 인트로만 적용  

## 라이선스 / 의료 콘텐츠

교육·포트폴리오용 데모입니다. 실제 의료기관 도메인·연락처·심의필 번호 등은 반드시 실제 정보로 교체해야 합니다.

---

*Fast Campus 바이브 코딩 실습 — Hospital Web 시리즈*
