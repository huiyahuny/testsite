/* World Archive Admin — GitHub Pages static-site editor.
   보안 주의: 고정값은 공개 코드에 있으므로 GitHub 쓰기 권한을 보호하지 않습니다.
   토큰은 메모리에만 두고 GitHub API 요청 시에만 전송합니다. */
(() => {
  'use strict';
  const cfg = window.ARCHIVE_ADMIN_CONFIG || {};
  const original = window.SITE_DATA;
  const $ = id => document.getElementById(id);
  if (!original) return;
  const esc = v => String(v ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
  const clone = v => JSON.parse(JSON.stringify(v));
  const freshId = prefix => `${prefix}-${(globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^a-zA-Z0-9-]/g,'').slice(0,45)}`;
  let state = clone(original);
  let initial = clone(original);
  let currentTab = 'site';
  let dirty = false;
  let githubToken = ''; // localStorage / sessionStorage / 파일에 저장하지 않음
  let remoteSha = '';
  let busy = false;
  const pendingImages = new Map(); // 캐릭터 고유 ID → { blob, preview }
  const repoBase = `https://api.github.com/repos/${encodeURIComponent(cfg.owner || '')}/${encodeURIComponent(cfg.repo || '')}/contents`;
  const ref = cfg.branch || 'main';
  const format = { 'site': '홈 / 공통', 'world':'세계관', 'characters':'캐릭터', 'timeline':'연대기', 'archive':'자료실' };
  const fields = [
    ['siteTitle','사이트 이름'], ['siteKicker','사이트 분류'],['heroTitleLine1','메인 제목 — 첫 줄'],['heroTitleLine2','메인 제목 — 둘째 줄'],
    ['worldName','세계관 이름'],['tagline','한 줄 소개'],['summary','전체 세계관 소개','long'],
    ['themeLabel','메인 상단 문구'],['notice','방문자 공지','long'],['copyright','저작권 표기'],
    ['topbarStatus','상단 상태 문구'], ['sidebarMotto','왼쪽 하단 문구'], ['yearLabel','장식용 연도'],
    ['volumeLabel','장식용 분류 번호'],['heroFooterCaption','첫 화면 아래 문구'],
    ['charactersIntro','캐릭터 목록 소개','long'],['timelineIntro','연대기 페이지 소개','long'],['archiveIntro','자료실 페이지 소개','long']
  ];
  const schemas = {
    metrics: [['number','표시 숫자'], ['label','집계 설명']],
    worldSections: [['eyebrow','소분류'], ['title','항목 제목'], ['subtitle','소제목'], ['text','본문','long'], ['tags','태그 — 쉼표로 구분','tags']],
    characters: [['name','캐릭터 이름'],['english','영문명'],['role','역할·직책'],['faction','소속'], ['number','일련번호'], ['accent','배경 색상','accent'], ['quote','대표 대사','long'], ['short','카드 짧은 소개','long'],['description','상세 설정','long']],
    timeline: [['year','연대 / 시점'],['title','사건 제목'],['category','분류'],['text','사건 설명','long']],
    archive: [['category','자료 번호 / 분류'],['title','자료 제목'],['body','자료 본문','long']]
  };
  const mkField = (name, value, attributes='', mode='input', hint='') => {
    const control = mode==='long'
      ? `<textarea ${attributes} rows="4">${esc(value)}</textarea>`
      : mode==='accent'
        ? `<select ${attributes}><option value="gold" ${value==='gold'?'selected':''}>골드</option><option value="blue" ${value==='blue'?'selected':''}>블루</option><option value="rose" ${value==='rose'?'selected':''}>로즈</option></select>`
        : `<input type="text" ${attributes} value="${esc(value)}">`;
    return `<div class="admin-field ${mode==='long'?'wide':''}"><label>${esc(name)}</label>${control}${hint?`<small>${esc(hint)}</small>`:''}</div>`;
  };
  const modelField = (collection,index,key,title,mode='input') => mkField(title,mode==='tags' ? (state[collection][index][key] || []).join(', ') : state[collection][index][key],
    `data-list="${esc(collection)}" data-index="${index}" data-key="${esc(key)}"`,mode==='tags'?'input':mode);
  const schemaCard = (collection,i) => {
    const item = state[collection][i];
    const title = item.name || item.title || item.label || `${format[currentTab]} ${i+1}`;
    const props = schemas[collection].map(([key,name,mode])=>modelField(collection,i,key,name,mode)).join('');
    const details = collection==='characters' ? `<div class="admin-detail-editor"><div class="admin-detail-head"><strong>세부 프로필 항목</strong><button class="admin-mini" type="button" data-add-detail="${esc(item.id)}">+ 항목 추가</button></div><div class="admin-detail-list">${(item.details||[]).map((detail,j)=>`<div class="admin-detail-row"><input aria-label="항목 이름" placeholder="항목명" data-detail="${esc(item.id)}" data-detail-index="${j}" data-detail-key="label" value="${esc(detail.label)}"><input aria-label="항목 내용" placeholder="내용" data-detail="${esc(item.id)}" data-detail-index="${j}" data-detail-key="value" value="${esc(detail.value)}"><button class="admin-mini danger" type="button" data-delete-detail="${esc(item.id)}" data-detail-index="${j}">삭제</button></div>`).join('')}</div></div>` : '';
    let imageHtml = '';
    if (collection==='characters') {
      const tmp = pendingImages.get(item.id);
      const src = tmp?.preview || item.image || '';
      const image = src ? `<img src="${esc(src)}" alt="${esc(item.name)} 이미지 미리보기">` : '<span>NO IMAGE</span>';
      imageHtml = `<div class="admin-image-editor"><div class="admin-image-preview">${image}</div><div class="admin-image-right"><label class="admin-field"><span>대표 이미지 업로드</span><input data-character-image="${esc(item.id)}" type="file" accept="image/png,image/jpeg,image/webp"></label><p class="admin-image-help">PNG · JPG · WEBP, 최대 12MB. 저장할 때 WEBP로 최적화되어 GitHub의 images 폴더에 올라갑니다.</p><p class="admin-faint">${tmp?'새 이미지 선택됨 — GitHub 저장 전':item.image ? esc(item.image):'등록된 이미지 없음'}</p><button class="admin-mini danger" type="button" data-remove-image="${esc(item.id)}">이미지 제거</button></div></div>`;
    }
    return `<article class="admin-item" data-item="${esc(collection)}-${i}"><div class="admin-item-title"><strong>${String(i+1).padStart(2,'0')} · ${esc(title)}</strong><div class="admin-item-actions"><button class="admin-mini" data-move="up" data-kind="${collection}" data-index="${i}" type="button" ${i===0?'disabled':''}>↑ 위로</button><button class="admin-mini" data-move="down" data-kind="${collection}" data-index="${i}" type="button" ${i===state[collection].length-1?'disabled':''}>↓ 아래로</button><button class="admin-mini danger" type="button" data-delete="${collection}" data-index="${i}">삭제</button></div></div><div class="admin-form-grid">${props}${imageHtml}${details}</div></article>`;
  };
  const tabHeader = (title,desc,addBtn='') => `<div class="admin-editor-head"><div><h2>${esc(title)}</h2><p>${esc(desc)}</p></div>${addBtn?`<button class="admin-outline" type="button" data-add="${esc(addBtn)}">+ 새 항목 추가</button>`:''}</div>`;
  function renderEditor() {
    let html = '';
    if (currentTab==='site') {
      html += tabHeader('Home & Identity','사이트 전체에서 공통으로 쓰는 제목과 문구를 편집합니다.');
      html += `<div class="admin-item"><div class="admin-form-grid">${fields.map(([key,title,mode])=>mkField(title,state[key],`data-site="${esc(key)}"`,mode)).join('')}</div></div>`;
      html += tabHeader('Summary Counters','메인 화면의 숫자 카드입니다.','metrics');
      html += `<div class="admin-items">${state.metrics.map((_,i)=>schemaCard('metrics',i)).join('')}</div>`;
    } else {
      const targets = {world:['worldSections','Worldbook','세계관 항목을 추가·수정·삭제하고 순서를 바꿀 수 있습니다.'],characters:['characters','Character Profiles','캐릭터를 등록하고 이미지를 첨부하거나 세부 프로필을 수정합니다.'],timeline:['timeline','Timeline','사건이 표시되는 순서는 위아래 버튼으로 바꿀 수 있습니다.'],archive:['archive','Documents','열고 닫을 수 있는 자료실 문서를 작성합니다.']};
      const [key,title,desc] = targets[currentTab];
      html += tabHeader(title,desc,key);
      html += state[key].length ? `<div class="admin-items">${state[key].map((_,i)=>schemaCard(key,i)).join('')}</div>` : '<div class="admin-empty">아직 항목이 없습니다. 상단의 새 항목 추가 버튼을 눌러주세요.</div>';
    }
    $('admin-editor').innerHTML=html;
    updateDirty();
  }
  function updateDirty() {
    const changed = dirty || pendingImages.size>0;
    $('dirty-status').textContent = changed ? '저장되지 않은 수정 있음' : '수정 사항 없음';
  }
  function markDirty() { dirty=true;updateDirty(); }
  function findChar(id) {return (state.characters||[]).find(c=>c.id===id);}
  function newItem(kind) {
    switch(kind) {
      case 'metrics':return {number:'[수]',label:'[집계 설명을 쓰시오]'};
      case 'worldSections':return {number:String(state.worldSections.length+1).padStart(2,'0'),eyebrow:'[분류를 쓰시오]',title:'[세계관 항목 제목]',subtitle:'[소제목을 쓰시오]',text:'[내용을 쓰시오]',tags:[]};
      case 'characters':return {id:freshId('char'),name:'[캐릭터 이름을 쓰시오]',english:'[영문명을 쓰시오]',number:String(state.characters.length+1).padStart(2,'0'),role:'[직책을 쓰시오]',faction:'[소속을 쓰시오]',accent:'gold',image:'',quote:'[대표 대사를 쓰시오]',short:'[짧은 소개를 쓰시오]',description:'[상세 설정을 쓰시오]',details:[{label:'소속',value:'[내용을 쓰시오]'}]};
      case 'timeline':return {year:'[시점을 쓰시오]',title:'[사건 제목]',category:'[사건 분류]',text:'[사건 내용을 쓰시오]'};
      case 'archive':return {category:'[자료 분류]',title:'[자료 제목]',body:'[자료 내용을 쓰시오]'};
      default:return null;
    }
  }
  function releaseImage(id) {
    const item = pendingImages.get(id);
    if(item?.preview) URL.revokeObjectURL(item.preview);
    pendingImages.delete(id);
  }
  function releaseAllImages() {for(const id of pendingImages.keys())releaseImage(id);}
  $('gate-form').addEventListener('submit',e=>{
    e.preventDefault();
    const code = $('gate-code').value;
    if (!cfg.editorCode || cfg.editorCode === '[이곳에 관리자 인증 값을 입력하시오]') {
      $('gate-error').textContent='admin-config.js에서 관리자 인증 값을 먼저 지정해야 합니다.';
      return;
    }
    if (code !== cfg.editorCode) {
      $('gate-error').textContent='인증값이 일치하지 않습니다.';
      return;
    }
    $('gate-code').value='';
    $('admin-gate').hidden=true;
    $('admin-workspace').hidden=false;
    renderEditor();
  });
  $('admin-tabs').addEventListener('click',e=>{
    const btn=e.target.closest('[data-editor]');if(!btn)return;
    currentTab=btn.dataset.editor;
    $('admin-tabs').querySelectorAll('button').forEach(el=>{const active=el===btn;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
    renderEditor();
  });
  $('admin-editor').addEventListener('input',e=>{
    const el=e.target;
    if (el.matches('[data-site]')) {state[el.dataset.site]=el.value; markDirty();}
    if (el.matches('[data-list]')) {
      const {list,index,key}=el.dataset;
      if(!state[list]?.[Number(index)])return;
      const orig=state[list][Number(index)];
      orig[key]=key==='tags' ? el.value.split(',').map(s=>s.trim()).filter(Boolean) : el.value;
      markDirty();
    }
    if(el.matches('[data-detail]')) {
      const c=findChar(el.dataset.detail),j=Number(el.dataset.detailIndex),key=el.dataset.detailKey;
      if(c?.details?.[j]){c.details[j][key]=el.value;markDirty();}
    }
  });
  $('admin-editor').addEventListener('change',async e=>{
    const el=e.target;
    if(!el.matches('[data-character-image]'))return;
    const c=findChar(el.dataset.characterImage);if(!c||!el.files?.[0])return;
    const file=el.files[0];
    if(!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size>12*1024*1024){alert('PNG, JPG, WEBP 이미지(12MB 이하)만 지원합니다.');el.value='';return;}
    try {
      const blob=await optimizeImage(file);
      releaseImage(c.id);
      pendingImages.set(c.id,{blob,preview:URL.createObjectURL(blob)});
      markDirty();renderEditor();
    } catch(err){alert(`이미지 처리 실패: ${err.message}`);}
  });
  $('admin-editor').addEventListener('click',e=>{
    const add=e.target.closest('[data-add]');
    if(add){const kind=add.dataset.add;state[kind].push(newItem(kind));markDirty();renderEditor();return;}
    const del=e.target.closest('[data-delete]');
    if(del){const kind=del.dataset.delete,i=Number(del.dataset.index);
      if(!confirm(`${i+1}번째 항목을 삭제할까요? GitHub 저장을 누르기 전에는 방문자 페이지가 변경되지 않습니다.`))return;
      if(kind==='characters')releaseImage(state.characters[i].id);
      state[kind].splice(i,1);markDirty();renderEditor();return;}
    const move=e.target.closest('[data-move]');
    if(move){const arr=state[move.dataset.kind],i=Number(move.dataset.index),j=i+(move.dataset.move==='up'?-1:1);
      if(j<0||j>=arr.length)return;
      [arr[i],arr[j]]=[arr[j],arr[i]];markDirty();renderEditor();return;}
    const addDetail=e.target.closest('[data-add-detail]');
    if(addDetail){const c=findChar(addDetail.dataset.addDetail);if(!c)return;
      c.details ||= [];c.details.push({label:'[항목 이름]',value:'[내용을 쓰시오]'});markDirty();renderEditor();return;}
    const delDetail=e.target.closest('[data-delete-detail]');
    if(delDetail){const c=findChar(delDetail.dataset.deleteDetail);if(!c)return;
      c.details.splice(Number(delDetail.dataset.detailIndex),1);markDirty();renderEditor();return;}
    const delImage=e.target.closest('[data-remove-image]');
    if(delImage){const c=findChar(delImage.dataset.removeImage);if(!c)return;
      releaseImage(c.id);c.image='';markDirty();renderEditor();return;}
  });
  $('discard-changes').addEventListener('click',()=>{
    if(!confirm('저장하지 않은 수정 내용을 모두 취소할까요?'))return;
    releaseAllImages();state=clone(initial);dirty=false;renderEditor();
    setStatus('수정 내용이 취소되었습니다.','');
  });
  function serializedData() {return `// 이 파일은 관리자 편집기에서 자동으로 생성합니다.\nwindow.SITE_DATA = ${JSON.stringify(state,null,2)};\n`;}
  $('download-backup').addEventListener('click',()=>{
    const blob=new Blob([serializedData()],{type:'application/javascript;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');
    a.href=url;a.download='data.js';document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
    setStatus('현재 텍스트 내용을 data.js 파일로 내려받았습니다. 아직 업로드하지 않은 이미지는 포함되지 않습니다.','');
  });
  async function optimizeImage(file) {
    // 정적 사이트 호환: 캔버스에서 WEBP로 축소 후 이미지를 저장소에 추가
    const bitmap=await createImageBitmap(file);
    try {
      const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
      const canvas=document.createElement('canvas');
      canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
      const ctx=canvas.getContext('2d');if(!ctx)throw Error('캔버스 생성에 실패했습니다.');
      ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
      const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('이미지 변환 실패')),'image/webp',.83));
      return blob;
    } finally { bitmap.close?.(); }
  }
  function setStatus(str,kind='') {const el=$('publish-status');el.textContent=str;el.className='admin-message'+(kind?' '+kind:'');}
  function headers() {
    return {'Accept':'application/vnd.github+json','Authorization':`Bearer ${githubToken}`,'X-GitHub-Api-Version':'2022-11-28'};
  }
  const apiUrl = path => `${repoBase}/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(ref)}`;
  async function gitRequest(url,options={}) {
    const response=await fetch(url,{...options,headers:{...headers(),...(options.headers||{})},cache:'no-store'});
    if(response.ok)return response.json();
    let msg='';try{const body=await response.json();msg=body.message||'';}catch{}
    if(response.status===401||response.status===403)throw Error(`GitHub 인증 또는 권한 오류 (${response.status}). 토큰의 저장소 접근과 Contents: Read and write를 확인하세요. ${msg}`);
    if(response.status===409||response.status===422)throw Error(`파일 충돌 또는 업로드 오류 (${response.status}). 저장소의 최신 변경 내용을 확인하고 페이지를 새로 열어 다시 시도하세요. ${msg}`);
    throw Error(`GitHub API 오류 (${response.status}): ${msg}`);
  }
  async function repoFile(path) {return gitRequest(apiUrl(path));}
  // Uint8Array를 안전하게 Base64로 변환 (한글 및 큰 이미지 지원)
  function bytesBase64(bytes) {
    const piece=0x8000;let binary='';
    for(let i=0;i<bytes.length;i+=piece)binary+=String.fromCharCode(...bytes.subarray(i,i+piece));
    return btoa(binary);
  }
  async function upload(path,bytes,sha,message) {
    const body={message,content:bytesBase64(bytes),branch:ref};if(sha)body.sha=sha;
    return gitRequest(apiUrl(path).split('?')[0],{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  }
  $('verify-token').addEventListener('click',async()=>{
    const val=$('github-token').value.trim();
    if(!val){setStatus('GitHub 토큰을 입력해주세요.','error');return;}
    githubToken=val;$('github-token').value='';
    try {
      const remote=await repoFile('data.js');remoteSha=remote.sha;
      setStatus(`GitHub 저장소 ${cfg.owner}/${cfg.repo} 연결 확인 완료. 수정 후 저장 버튼을 눌러주세요.`,'success');
    }catch(err){githubToken='';remoteSha='';setStatus(err.message,'error');}
  });
  $('publish-btn').addEventListener('click',async()=>{
    if(busy)return;
    if(!dirty&&pendingImages.size===0){setStatus('저장할 변경 내용이 없습니다.','');return;}
    if(!githubToken){setStatus('먼저 GitHub 액세스 토큰을 입력하고 [저장소 연결 확인]을 눌러주세요.','error');return;}
    if(!confirm('현재 수정 사항을 GitHub에 저장하고 공개 홈페이지에 반영할까요?'))return;
    busy=true;$('publish-btn').disabled=true;$('verify-token').disabled=true;
    try {
      setStatus('최신 GitHub 파일 버전 확인 중...','');
      const latest=await repoFile('data.js');
      if(!remoteSha || remoteSha!==latest.sha) throw Error('저장소의 data.js가 연결 확인 이후 변경되었습니다. 새로고침 후 다시 작업해 주세요. 덮어쓰지 않았습니다.');
      let idx=0;
      for(const [id,item] of [...pendingImages.entries()]) {
        const c=findChar(id);
        if(!c){releaseImage(id);continue;}
        const pathname=`images/${new Date().toISOString().slice(0,10)}-${id.replace(/[^a-zA-Z0-9-]/g,'').slice(0,44)}-${Math.random().toString(36).slice(2,10)}.webp`;
        setStatus(`이미지 업로드 ${++idx}/${pendingImages.size}: ${c.name} ...`,'');
        await upload(pathname,new Uint8Array(await item.blob.arrayBuffer()),undefined,`Add portrait for ${c.name}`);
        c.image=pathname;releaseImage(id);
      }
      setStatus('캐릭터 및 세계관 데이터를 GitHub에 저장하는 중...','');
      const result=await upload('data.js',new TextEncoder().encode(serializedData()),latest.sha,'Update character and world archive via editor');
      remoteSha=result.content?.sha || '';
      dirty=false;initial=clone(state);renderEditor();
      setStatus('GitHub 저장이 완료되었습니다. GitHub Pages에 변경사항이 배포되기까지 잠시 걸릴 수 있습니다. 완료 후 방문자 사이트를 새로고침하세요.','success');
    }catch(err){setStatus(`저장 실패: ${err.message}\n이미지 일부가 먼저 올라갔을 수 있습니다. 중복을 피하려면 상태를 확인한 뒤 재시도하세요.`,'error');}
    finally {busy=false;$('publish-btn').disabled=false;$('verify-token').disabled=false;}
  });
  window.addEventListener('beforeunload',e=>{
    if(dirty||pendingImages.size){e.preventDefault();e.returnValue='';}
  });
})();
