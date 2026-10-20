/* 메뉴 및 카드 작동 코드입니다. 일반적인 콘텐츠 수정은 data.js에서 하세요. */
(() => {
  'use strict';
  const d = window.SITE_DATA;
  const root = document.getElementById('view');
  const nav = document.getElementById('main-nav');
  const dialog = document.getElementById('character-dialog');
  const modalBody = document.getElementById('modal-body');
  if (!d || !root || !nav) return;

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const label = (text) => `<span class="eyebrow">${esc(text)}</span>`;
  const banner = (title, kicker, desc) => `<section class="page-banner">${label(kicker)}<h1 class="section-title">${esc(title)}</h1><p class="section-desc">${esc(desc)}</p></section>`;
  const portrait = (c, cls = '') => `<div class="char-portrait ${esc(c.accent || 'gold')} ${c.image?'has-image':''} ${cls}"><span class="card-num">NO. ${esc(c.number)}</span><span class="roman" aria-hidden="true">${esc(c.number)}</span>${c.image ? `<img src="${esc(c.image)}" alt="${esc(c.name)} 캐릭터 이미지" onerror="this.remove();this.parentElement.classList.remove('has-image')">` : ''}</div>`;
  const characterCard = c => `<button type="button" class="char-card" data-character="${esc(c.id)}" aria-label="${esc(c.name)} 상세 프로필 열기">${portrait(c)}<div class="char-card-content">${label(c.faction)}<h3>${esc(c.english)} <small>${esc(c.name)}</small></h3><p>${esc(c.short)}</p><div class="card-more"><span>VIEW CHARACTER</span><span>↗</span></div></div></button>`;
  const worldCard = w => `<article class="world-card"><span class="no">${esc(w.number)}</span>${label(w.eyebrow)}<h3>${esc(w.title)}</h3><span class="subtitle">${esc(w.subtitle)}</span><p>${esc(w.text)}</p><div class="tags">${(w.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div></article>`;

  function home() {
    const featured = (d.characters || []).slice(0,3);
    const titleParts = String(d.siteTitle || "THE UNWRITTEN").trim().split(/\s+/);
    const firstTitle = titleParts.shift() || "THE";
    const secondTitle = titleParts.join(" ") || "ARCHIVE";
    return `<div class="view-wrap">
      <section class="hero"><span class="hero-astral" aria-hidden="true"></span><span class="hero-index">A STORY IN FRAGMENTS / 001</span><div class="hero-content"><div class="hero-pre">${label(d.themeLabel)}</div><h1>${esc(firstTitle)}<br><em>${esc(secondTitle)}</em></h1><p class="hero-korean">${esc(d.tagline)}<br><span style="color:#9899a5">${esc(d.worldName)}</span></p><div class="hero-actions"><button class="btn" data-goto="world">세계관 탐색하기 &nbsp; ↗</button><button class="btn outline" data-goto="characters">등장인물 보기 &nbsp; ↗</button></div></div><span class="hero-label">Every world has its own secret.</span></section>
      <section class="section"><div class="section-top"><div>${label('ABOUT THE UNIVERSE')}<h2 class="section-title">A world to remember.</h2></div></div><div class="intro-card"><div>${label('WORLD OVERVIEW')}<h3>${esc(d.worldName)}</h3><p>${esc(d.summary)}</p></div><div class="seal" aria-hidden="true">✧</div></div><p class="disclaimer">${esc(d.notice)}</p><div class="info-grid">${(d.metrics||[]).map(m=>`<div class="info-box"><strong>${esc(m.number)}</strong><span>${esc(m.label)}</span></div>`).join('')}</div></section>
      <section class="section bordered"><div class="section-top"><div>${label('THE CAST')}<h2 class="section-title">Characters</h2></div><button class="minor-link" data-goto="characters">ALL CHARACTERS ↗</button></div><div class="character-grid">${featured.map(characterCard).join('')}</div></section>
      <section class="section bordered"><div class="section-top"><div>${label('A WORLD IN FRAGMENTS')}<h2 class="section-title">Worldbook</h2></div><button class="minor-link" data-goto="world">EXPLORE THE WORLD ↗</button></div><div class="world-grid">${(d.worldSections||[]).slice(0,3).map(worldCard).join('')}</div></section>
      </div>`;
  }
  function world() {
    return `<div class="view-wrap">${banner('Worldbook', 'CHAPTER 01 · THE SETTING', `${d.worldName} — ${d.summary}`)}<section class="section"><div class="section-top"><div>${label('WORLD STRUCTURE')}<h2 class="section-title">The setting</h2></div></div><div class="world-grid">${(d.worldSections||[]).map(worldCard).join('')}</div><p class="disclaimer">더 많은 항목을 추가하려면 data.js의 worldSections에 항목을 복사해 넣으세요.</p></section></div>`;
  }
  function characters() {
    const factions = [...new Set((d.characters||[]).map(c=>c.faction).filter(Boolean))];
    return `<div class="view-wrap">${banner('Characters', 'CHAPTER 02 · THE PEOPLE', '이 세계를 움직이는 사람들. 각 인물의 카드를 선택하면 상세 프로필을 확인할 수 있습니다.')}<section class="section"><div class="filter-bar"><input class="search-input" id="character-search" type="search" placeholder="이름 · 소속 · 소개 검색" aria-label="캐릭터 검색" /><div class="filter-list" id="faction-filters"><button class="filter-btn active" data-faction="ALL">전체</button>${factions.map(f=>`<button class="filter-btn" data-faction="${esc(f)}">${esc(f)}</button>`).join('')}</div></div><div class="character-grid" id="characters-list">${(d.characters||[]).map(characterCard).join('')}</div><p class="disclaimer">캐릭터 추가 및 이미지 변경: data.js 파일의 characters 항목을 편집하세요.</p></section></div>`;
  }
  function timeline() {
    return `<div class="view-wrap">${banner('Timeline', 'CHAPTER 03 · THE CHRONICLES', '현재의 이야기를 만든 사건과 선택의 순서를 기록합니다.')}<section class="section"><div class="section-top"><div>${label('EVENTS & HISTORY')}<h2 class="section-title">Chronicles</h2></div></div><div class="timeline">${(d.timeline||[]).map(t=>`<article class="time-item"><div class="time-year">${esc(t.year)}</div><div><span class="time-category">${esc(t.category)}</span><h3 class="time-title">${esc(t.title)}</h3><p class="time-body">${esc(t.text)}</p></div></article>`).join('')}</div></section></div>`;
  }
  function archive() {
    return `<div class="view-wrap">${banner('Archive', 'CHAPTER 04 · THE RECORDS', '세계관의 용어와 문서, 짧은 설정을 주제별로 정리한 자료실입니다.')}<section class="section"><div class="section-top"><div>${label('OPEN THE RECORDS')}<h2 class="section-title">Documents</h2></div></div><div class="archive-list">${(d.archive||[]).map(a=>`<details class="archive-item"><summary><span class="archive-num">${esc(a.category)}</span><strong>${esc(a.title)}</strong><span class="plus" aria-hidden="true">+</span></summary><p>${esc(a.body)}</p></details>`).join('')}</div></section></div>`;
  }

  const pages = {home,world,characters,timeline,archive};
  let selectedFaction = 'ALL';
  function render() {
    const page = location.hash.replace('#','').toLowerCase();
    const safePage = Object.hasOwn(pages,page) ? page : 'home';
    document.title = `${safePage.toUpperCase()} — ${d.siteTitle}`;
    document.getElementById('side-brand').textContent = d.siteTitle;
    document.getElementById('topbar-title').textContent = `${d.siteTitle} / 001`;
    document.getElementById('footer-copyright').textContent = d.copyright;
    document.getElementById('side-copyright').textContent = d.copyright;
    nav.querySelectorAll('[data-page]').forEach(b=>{
      const active = b.dataset.page===safePage;
      b.classList.toggle('active',active);
      if (active) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
    });
    root.innerHTML = pages[safePage]();
    selectedFaction='ALL';
    if (safePage==='characters') {
      document.getElementById('character-search').addEventListener('input',filterCharacters);
      document.getElementById('faction-filters').addEventListener('click',e=>{
        const b=e.target.closest('[data-faction]');if(!b)return;
        selectedFaction=b.dataset.faction;
        document.querySelectorAll('.filter-btn').forEach(btn=>btn.classList.toggle('active',btn===b));
        filterCharacters();
      });
    }
    window.scrollTo({top:0,behavior:'auto'});
  }
  function filterCharacters() {
    const q=(document.getElementById('character-search')?.value||'').trim().toLocaleLowerCase();
    const visible=(d.characters||[]).filter(c=>
      (selectedFaction==='ALL'||c.faction===selectedFaction) &&
      [c.name,c.english,c.role,c.faction,c.short,c.description].join(' ').toLocaleLowerCase().includes(q)
    );
    document.getElementById('characters-list').innerHTML = visible.length ? visible.map(characterCard).join('') : '<p class="empty-state">해당 조건에 맞는 캐릭터가 없습니다.</p>';
  }
  function openCharacter(id) {
    const c=(d.characters||[]).find(item=>String(item.id)===String(id));if(!c)return;
    modalBody.innerHTML = `<div class="modal-layout">${portrait(c)}<div class="modal-content">${label(c.faction)}<h2>${esc(c.english)} <small>${esc(c.name)}</small></h2><p class="modal-role">${esc(c.role)}</p><div class="modal-quote">“${esc(c.quote)}”</div>${label('CHARACTER PROFILE')}<p class="modal-text">${esc(c.description)}</p><div class="detail-table">${(c.details||[]).map(a=>`<div class="detail-row"><span>${esc(a.label)}</span><span>${esc(a.value)}</span></div>`).join('')}</div></div></div>`;
    dialog.showModal();
  }
  document.addEventListener('click',e=>{
    const to=e.target.closest('[data-goto],[data-page]');
    if(to){const p=to.dataset.goto||to.dataset.page;if(Object.hasOwn(pages,p)){if(location.hash==='#'+p) render();else location.hash=p;}return;}
    const char=e.target.closest('[data-character]');if(char){openCharacter(char.dataset.character);}
  });
  document.getElementById('modal-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  window.addEventListener('hashchange',render);
  render();
})();
