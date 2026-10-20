// =====================================================
// 여기를 수정하면 사이트의 세계관·캐릭터·연대기 내용이 변경됩니다.
// GitHub에서 data.js 파일의 연필(편집) 아이콘으로 수정할 수 있습니다.
// 큰따옴표(")는 삭제하지 마세요. 문장 안의 따옴표에는 작은따옴표(')를 사용하세요.
// 아래 정보는 모두 예시입니다. 원하는 세계관으로 교체하세요.
// =====================================================

window.SITE_DATA = {
  // 사이트 기본 정보
  siteTitle: "THE UNWRITTEN",
  siteKicker: "ORIGINAL WORLD & CHARACTER ARCHIVE",
  worldName: "이름 없는 세계",
  tagline: "모든 이야기는, 하나의 비밀에서 시작된다.",
  summary: "여기는 창작 세계관과 그 안에 살아가는 인물들을 기록하는 공간입니다. 지역과 세력, 사건, 그리고 인물들이 가진 저마다의 이야기를 천천히 펼쳐 보세요.",
  themeLabel: "세계관 자료실 · SAMPLE EDITION",
  notice: "현재 표시된 인물과 설정은 디자인 확인을 위한 예시입니다. data.js를 수정하여 자신의 세계로 바꾸세요.",
  copyright: "© 2026 ORIGINAL WORLD ARCHIVE",

  // HOME 숫자 카드. 원하는 정보로 변경 가능
  metrics: [
    { number: "03", label: "등록 캐릭터" },
    { number: "03", label: "주요 세력" },
    { number: "04", label: "기록된 사건" }
  ],

  // 세계관 소개 카드
  worldSections: [
    { number: "01", eyebrow: "STRUCTURE", title: "세계의 구조", subtitle: "세계를 구성하는 규칙", text: "세계를 둘러싼 지형, 환경, 질서, 기술과 마법 등 근본적인 규칙을 여기에 기록합니다. 공개할 수 있는 정보와 감춰진 진실을 구분하여 작성해도 좋습니다.", tags: ["지리", "질서", "규칙"] },
    { number: "02", eyebrow: "FACTIONS", title: "세력과 조직", subtitle: "서로 다른 목적을 가진 사람들", text: "국가, 기관, 가문, 길드, 종교 조직 등 세계관의 주요 세력을 소개합니다. 영향력과 이해관계, 갈등 구조를 함께 적으면 이야기가 더 선명해집니다.", tags: ["조직", "관계", "갈등"] },
    { number: "03", eyebrow: "HISTORY", title: "기록되지 않은 역사", subtitle: "현재를 만든 과거", text: "모든 사건은 이전의 선택에서 비롯됩니다. 세계의 기원과 역사적 사건, 구전되는 소문과 진실을 정리해 두는 장소입니다.", tags: ["연대기", "전설", "비밀"] }
  ],

  // 세력 필터는 characters의 faction 값을 자동으로 가져옵니다.
  // 이미지가 있다면 예: image: "images/rian.png"
  // 이미지가 없으면 자동으로 추상적인 배경 카드가 표시됩니다.
  characters: [
    {
      id: "rian", name: "리안", english: "RIAN", number: "I",
      role: "기록관", faction: "중앙 기록원", accent: "gold", image: "",
      quote: "이 세상에서 가장 위험한 것은, 지워진 기록이야.",
      short: "진실을 수집하지만 자신의 과거만큼은 기록하지 않는 인물.",
      description: "기록원에 소속된 조사관. 침착하고 합리적인 태도를 유지하며, 사소한 모순도 놓치지 않는다. 오래된 문서에서 어느 날 자신의 이름을 발견한 이후 세계의 비밀을 추적하기 시작했다.",
      details: [{label:"소속",value:"중앙 기록원"},{label:"직책",value:"조사관"},{label:"성향",value:"냉철 · 관찰형"},{label:"주요 관계",value:"세라 / 카엘"}]
    },
    {
      id: "sera", name: "세라", english: "SERA", number: "II",
      role: "경계의 수호자", faction: "경계 수비대", accent: "blue", image: "",
      quote: "우리가 지키는 것은 땅이 아니라, 돌아갈 수 있는 곳이야.",
      short: "세계의 경계에서 묵묵히 자신의 사명을 지켜온 수호자.",
      description: "외부와 내부를 잇는 길목을 지키는 수비대의 일원. 강인하고 무뚝뚝하지만, 자신의 책임 아래 있는 사람을 결코 버리지 않는다. 오래전 실종 사건의 목격자이기도 하다.",
      details: [{label:"소속",value:"경계 수비대"},{label:"직책",value:"수호자"},{label:"성향",value:"신중 · 책임형"},{label:"주요 관계",value:"리안"}]
    },
    {
      id: "kael", name: "카엘", english: "KAEL", number: "III",
      role: "망명자", faction: "독립 세력", accent: "rose", image: "",
      quote: "진실이 누구에게나 구원이 되는 건 아니지.",
      short: "과거를 버리고 돌아온, 목적을 알 수 없는 방문자.",
      description: "한때 세계의 중심에서 이름을 떨쳤으나 현재는 어떤 조직에도 소속되지 않는다. 부드러운 말투와 예측하기 어려운 행동으로 주변을 혼란스럽게 만든다. 그의 귀환과 함께 묻혀 있던 사건들이 다시 수면 위로 떠오른다.",
      details: [{label:"소속",value:"독립 세력"},{label:"직책",value:"망명자"},{label:"성향",value:"유연 · 비밀주의"},{label:"주요 관계",value:"리안 / 세라"}]
    }
  ],

  timeline: [
    { year: "제0년", title: "첫 번째 기록", category: "기원", text: "오늘날 사용되는 연대의 기점이 되는 사건. 세계의 질서가 확립되었다고 전해진다." },
    { year: "제84년", title: "경계의 설립", category: "조직", text: "서로 다른 영역 사이에 경계가 설정되고 이를 관리하는 수비대가 창설되었다." },
    { year: "제126년", title: "기록의 소실", category: "사건", text: "대량의 기록이 일제히 사라진 원인 불명의 사건. 관련자들의 증언은 서로 일치하지 않는다." },
    { year: "현재", title: "봉인된 문서의 발견", category: "현재", text: "사라졌던 문서의 일부가 발견되면서 세 인물의 행보가 하나의 사건으로 이어지기 시작한다." }
  ],

  archive: [
    { category: "DOCUMENT 001", title: "세계관의 핵심 주제", body: "이 이야기가 궁극적으로 다루는 주제, 중심 질문, 독자가 알아두면 좋은 방향성을 작성합니다." },
    { category: "DOCUMENT 002", title: "주요 용어 사전", body: "세계에서만 통용되는 고유명사, 명칭, 제도, 기술 등을 정의하는 공간입니다. 한 항목씩 추가할 수 있습니다." },
    { category: "DOCUMENT 003", title: "캐릭터 관계에 관한 기록", body: "인물들의 관계, 공통의 과거, 충돌하는 가치관 등을 정리합니다. 이 영역은 공개 가능한 정보만을 기입하는 것도 좋습니다." },
    { category: "DOCUMENT 004", title: "비공개 설정을 위한 메모", body: "주의: GitHub Pages에 게시한 내용은 누구나 확인할 수 있습니다. 진짜 비공개 설정이나 스포일러는 공개 사이트 파일에 넣지 마세요." }
  ]
};
