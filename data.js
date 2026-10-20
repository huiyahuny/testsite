// ================================================================
// [배포용 빈 양식] 캐릭터 · 세계관 홈페이지
// 이 파일에서 대괄호 [ ] 안의 안내 문구를 자신의 내용으로 교체하세요.
// 예: name: "[캐릭터 이름 1을 쓰시오]" -> name: "홍길동"
//
// ★ 큰따옴표("), 쉼표(,), 중괄호({})는 삭제하지 마세요.
// ★ 문장 안에는 작은따옴표(')를 쓰면 편합니다.
// ★ 캐릭터 수 등을 늘리는 방법은 편집안내.txt에 있습니다.
// ★ 모든 내용은 공개 사이트에 게시됩니다. 비밀 설정은 적지 마세요.
// ================================================================

window.SITE_DATA = {
  // 1. 사이트 첫 화면 / 공통으로 표시되는 정보
  siteTitle: "[사이트 이름을 쓰시오]",       // 브라우저 탭, 사이드바, 상단 표시
  siteKicker: "[사이트 분류를 쓰시오]",       // 왼쪽 로고 위 작은 글씨
  heroTitleLine1: "[메인 제목]",          // 홈 화면의 아주 큰 첫 줄
  heroTitleLine2: "[메인 부제목]",         // 홈 화면의 아주 큰 둘째 줄
  worldName: "[세계관 이름을 쓰시오]",
  tagline: "[한 줄 소개 문구를 쓰시오]",     // 큰 제목 아래
  summary: "[세계관 전체 소개를 쓰시오]",     // 홈·세계관 소개
  themeLabel: "[상단 작은 문구를 쓰시오]",
  notice: "[공지 또는 방문자 안내 문구를 쓰시오]",
  copyright: "[저작권 표기를 쓰시오]",
  topbarStatus: "[상단 상태 문구를 쓰시오]",
  sidebarMotto: "[왼쪽 하단 문구를 쓰시오]",
  yearLabel: "[연도 입력]",               // 사이드바 장식 문자
  volumeLabel: "[분류 번호 입력]",         // 사이드바 장식 문자
  heroFooterCaption: "[첫 화면 하단 문구를 쓰시오]",
  charactersIntro: "[등장인물 페이지 소개를 쓰시오]",
  timelineIntro: "[연대기 페이지 소개를 쓰시오]",
  archiveIntro: "[자료실 페이지 소개를 쓰시오]",

  // 2. HOME : 숫자 요약 카드 3개
  // number = 큰 숫자, label = 숫자 아래 설명
  metrics: [
    { number: "[수]", label: "[첫 번째 집계 이름]" },
    { number: "[수]", label: "[두 번째 집계 이름]" },
    { number: "[수]", label: "[세 번째 집계 이름]" }
  ],

  // 3. WORLD : 세계관 소개 카드 3개
  // eyebrow = 작은 분류명, title = 제목, subtitle = 부제목, text = 본문
  worldSections: [
    {
      number: "01", eyebrow: "[분류 1]",
      title: "[세계관 항목 1 제목]",
      subtitle: "[세계관 항목 1 소제목]",
      text: "[세계관 항목 1 내용을 쓰시오]",
      tags: ["[태그 1-1]", "[태그 1-2]"]
    },
    {
      number: "02", eyebrow: "[분류 2]",
      title: "[세계관 항목 2 제목]",
      subtitle: "[세계관 항목 2 소제목]",
      text: "[세계관 항목 2 내용을 쓰시오]",
      tags: ["[태그 2-1]", "[태그 2-2]"]
    },
    {
      number: "03", eyebrow: "[분류 3]",
      title: "[세계관 항목 3 제목]",
      subtitle: "[세계관 항목 3 소제목]",
      text: "[세계관 항목 3 내용을 쓰시오]",
      tags: ["[태그 3-1]", "[태그 3-2]"]
    }
  ],

  // 4. CHARACTERS : 캐릭터 3명용 빈 양식
  // id = 각 캐릭터를 구분하는 내부 식별자. 중복되면 안 됩니다.
  // image = 그림 파일 경로. 이미지가 없다면 빈 따옴표("") 그대로 두세요.
  // 파일을 올렸다면 image: "images/파일이름.png" 형태로 변경하세요.
  // accent = 이미지가 없을 때 배경색. gold / blue / rose 중에서 선택.
  characters: [
    {
      id: "character-01",
      name: "[캐릭터 1 이름]",
      english: "[캐릭터 1 영문명]",
      number: "I",
      role: "[캐릭터 1 역할 또는 직책]",
      faction: "[캐릭터 1 소속 세력]",
      accent: "gold",
      image: "",
      quote: "[캐릭터 1 대표 대사를 쓰시오]",
      short: "[캐릭터 1 카드용 짧은 소개를 쓰시오]",
      description: "[캐릭터 1 상세 소개를 쓰시오]",
      details: [
        { label: "소속", value: "[캐릭터 1 소속을 쓰시오]" },
        { label: "직책", value: "[캐릭터 1 직책을 쓰시오]" },
        { label: "성격", value: "[캐릭터 1 성격을 쓰시오]" },
        { label: "관계", value: "[캐릭터 1 주요 관계를 쓰시오]" }
      ]
    },
    {
      id: "character-02",
      name: "[캐릭터 2 이름]",
      english: "[캐릭터 2 영문명]",
      number: "II",
      role: "[캐릭터 2 역할 또는 직책]",
      faction: "[캐릭터 2 소속 세력]",
      accent: "blue",
      image: "",
      quote: "[캐릭터 2 대표 대사를 쓰시오]",
      short: "[캐릭터 2 카드용 짧은 소개를 쓰시오]",
      description: "[캐릭터 2 상세 소개를 쓰시오]",
      details: [
        { label: "소속", value: "[캐릭터 2 소속을 쓰시오]" },
        { label: "직책", value: "[캐릭터 2 직책을 쓰시오]" },
        { label: "성격", value: "[캐릭터 2 성격을 쓰시오]" },
        { label: "관계", value: "[캐릭터 2 주요 관계를 쓰시오]" }
      ]
    },
    {
      id: "character-03",
      name: "[캐릭터 3 이름]",
      english: "[캐릭터 3 영문명]",
      number: "III",
      role: "[캐릭터 3 역할 또는 직책]",
      faction: "[캐릭터 3 소속 세력]",
      accent: "rose",
      image: "",
      quote: "[캐릭터 3 대표 대사를 쓰시오]",
      short: "[캐릭터 3 카드용 짧은 소개를 쓰시오]",
      description: "[캐릭터 3 상세 소개를 쓰시오]",
      details: [
        { label: "소속", value: "[캐릭터 3 소속을 쓰시오]" },
        { label: "직책", value: "[캐릭터 3 직책을 쓰시오]" },
        { label: "성격", value: "[캐릭터 3 성격을 쓰시오]" },
        { label: "관계", value: "[캐릭터 3 주요 관계를 쓰시오]" }
      ]
    }
  ],

  // 5. TIMELINE : 사건 연대기 4개
  timeline: [
    { year: "[시점 1]", title: "[사건 1 제목]", category: "[사건 1 분류]", text: "[사건 1 내용을 쓰시오]" },
    { year: "[시점 2]", title: "[사건 2 제목]", category: "[사건 2 분류]", text: "[사건 2 내용을 쓰시오]" },
    { year: "[시점 3]", title: "[사건 3 제목]", category: "[사건 3 분류]", text: "[사건 3 내용을 쓰시오]" },
    { year: "[시점 4]", title: "[사건 4 제목]", category: "[사건 4 분류]", text: "[사건 4 내용을 쓰시오]" }
  ],

  // 6. ARCHIVE : 문서 목록 4개 (클릭하면 본문이 펼쳐집니다)
  archive: [
    { category: "DOCUMENT 001", title: "[자료 1 제목]", body: "[자료 1 내용을 쓰시오]" },
    { category: "DOCUMENT 002", title: "[자료 2 제목]", body: "[자료 2 내용을 쓰시오]" },
    { category: "DOCUMENT 003", title: "[자료 3 제목]", body: "[자료 3 내용을 쓰시오]" },
    { category: "DOCUMENT 004", title: "[자료 4 제목]", body: "[자료 4 내용을 쓰시오]" }
  ]
};
