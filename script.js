'use strict';

// Existing endpoints from Naufalag7/Money-Management. No Sheets migration required.
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwETPvuSOBd5d1KEjGleigvQ1fReUiqmlvYbfQmuPPLLeZ5xT5H7fhXSa35H5B3BKiU/exec';
const FEEDS = Object.freeze({
  lily: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vThK41-mH0cCLqg5AI3A3Ri83cHL2SNov6BNMJrKqme-DPGd9NlrP9OcBnsuUjs8xJ43lGePyClme9t/pub?gid=1764720513&single=true&output=csv',
  nopal: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vThK41-mH0cCLqg5AI3A3Ri83cHL2SNov6BNMJrKqme-DPGd9NlrP9OcBnsuUjs8xJ43lGePyClme9t/pub?gid=1421544875&single=true&output=csv'
});
const BUDGETS = Object.freeze([
  { id: 'kos', name: 'Uang Kos', limit: 550000, keywords: ['kos','kost','sewa'] },
  { id: 'arisan', name: 'Arisan Keluarga', limit: 200000, keywords: ['arisan','keluarga'] },
  { id: 'gigi', name: 'Dokter Gigi', limit: 500000, keywords: ['gigi','kontrol','behel','dokter'] },
  { id: 'makan', name: 'Budget Makan', limit: 500000, keywords: ['makan','jajan','minum','food'] },
  { id: 'grab', name: 'Transport', limit: 444000, keywords: ['grab','gojek','maxim','transport','ojol','motor','mobil'] },
  { id: 'makeup', name: 'Makeup', limit: 200000, keywords: ['makeup','skincare','kosmetik','dandan','lipstik'] },
  { id: 'listrik', name: 'Listrik', limit: 150000, keywords: ['listrik','token','pln'] }
]);

const ART = Object.freeze({
  sync:'bouncy', hello:'hello', mark:'hello', income:'bouncy', expense:'grumpy',
  saving:'cheer', empty:'hello',
  'budget-idle':'hello', 'budget-happy':'cheer',
  'budget-warning':'grumpy', 'budget-over':'grumpy',
  kos:'paper-peek', arisan:'paper-letter', gigi:'paper-happy-face',
  makan:'paper-ramen', grab:'paper-sweater', makeup:'paper-icecream', listrik:'paper-singing'
});
const assetFor = key => `assets/stickers/${ART[key] || 'hello'}.webp`;
const MOODS = Object.freeze({
  happy:{message:'A little happy cloud just for Lily!', detail:'Pilih Cinna sesuai mood hari ini, yuk.'},
  cozy:{message:'Soft days & warm little hugs ♡', detail:'Hari pelan-pelan juga tetap hari yang baik.'},
  bouncy:{message:'Tiny steps, big happy energy!', detail:'Semangat, Lily! Cinna siap nemenin.'},
  grumpy:{message:'Even grumpy clouds deserve love.', detail:'Boleh manyun dulu, nanti makan yang enak ya.'}
});

const $ = selector => document.querySelector(selector);
const money = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');
const today = new Date();
const localDate = d => [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const months = ['januari','februari','maret','april','mei','juni','juli','agustus','september','oktober','november','desember'];
const monthAliases = ['jan','feb','mar','apr','mei|may','jun','jul','agu|aug','sep','okt|oct','nov','des|dec'];
const profiles = { lily: [], nopal: [] };
let profile = 'lily';
let month = localDate(today).slice(0,7);
let query = '';
let typeFilter = 'all';
let loading = true;
let requestInFlight = false;
let hasLoaded = { lily: false, nopal: false };
let toastTimer;
const memoryGet = key => {try{return localStorage.getItem(key);}catch{return null;}};
const memorySet = (key,value) => {try{localStorage.setItem(key,String(value));}catch{/* The tracker still works without local storage. */}};
let selectedMood = MOODS[memoryGet('lily.cinna.mood')] ? memoryGet('lily.cinna.mood') : 'happy';
let skyChoice = ['day','night'].includes(memoryGet('lily.cinna.sky')) ? memoryGet('lily.cinna.sky') : 'auto';
let savingsGoal = Number(memoryGet('lily.cinna.monthlyGoal'));
if (!Number.isSafeInteger(savingsGoal) || savingsGoal < 1) savingsGoal = 0;
let pendingConfirmation = null;
let companionIdleTimer;
let companionTapCount = 0;
let companionTalkTimer;

function validDate(y,m,d) {
  const dt = new Date(y,m-1,d);
  return y >= 1900 && y <= 2099 && dt.getFullYear() === y && dt.getMonth() === m-1 && dt.getDate() === d;
}
function makeDate(y,m,d) {
  y=Number(y); m=Number(m); d=Number(d);
  return validDate(y,m,d) ? `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}` : null;
}
function parseDate(input) {
  const s = String(input??'').trim();
  let match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T\s].*)?$/);
  if(match) return makeDate(match[1], match[2], match[3]);
  match = s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:\s.*)?$/);
  if(match) return makeDate(match[3], match[2], match[1]); // Indonesian day-first format.
  const lower = s.toLowerCase();
  for(let i=0;i<12;i++) {
    const rx = monthAliases[i].split('|').concat(months[i]).join('|');
    match = lower.match(new RegExp(`^(\\d{1,2})[\\s./-]+(?:${rx})[\\s./,-]+(\\d{4})`));
    if(match) return makeDate(match[2],i+1,match[1]);
    match = lower.match(new RegExp(`^(?:${rx})[\\s./-]+(\\d{1,2})[\\s,./-]+(\\d{4})`));
    if(match) return makeDate(match[2],i+1,match[1]);
  }
  return null;
}
function parseCSV(input) {
  const records = [];
  let row=[], cell='', quote=false;
  input = String(input).replace(/^\uFEFF/,'');
  for(let i=0;i<input.length;i++) {
    const c = input[i];
    if(c==='"') { if(quote && input[i+1]==='"') {cell+='"';i++;} else quote=!quote; }
    else if(c===',' && !quote) {row.push(cell);cell='';}
    else if((c==='\n'||c==='\r') && !quote) {
      if(c==='\r'&&input[i+1]==='\n')i++;
      row.push(cell); if(row.some(v=>v.trim()))records.push(row);
      row=[];cell='';
    } else cell+=c;
  }
  row.push(cell);
  if(row.some(v=>v.trim()))records.push(row);
  return records;
}
function parseAmount(raw) {
  const s=String(raw??'').trim();
  if(!s) return null;
  const digits=s.replace(/[^\d]/g,'');
  if(!digits) return null;
  const n=Number(digits);
  return Number.isSafeInteger(n) && n>0 ? n : null;
}
function parseFeed(csv, key) {
  const records=parseCSV(csv);
  const out=[];
  // Current published profile tabs have transaction columns at indices 5–8.
  // The source "input" tab uses A:E (date, type, amount, note, profile).
  for(const cells of records) {
    const isSourceTab=cells.length===5;
    const offset=isSourceTab?0:5;
    if(isSourceTab && String(cells[4]).trim().toLowerCase()!==key)continue;
    const date=parseDate(cells[offset]);
    const rawType=String(cells[offset+1]??'').trim().toLowerCase();
    const type=rawType.includes('masuk')?'Pemasukan':
      (rawType.includes('pengeluaran')||rawType.includes('keluar'))?'Pengeluaran':
      (rawType.includes('tabung'))?'Tabungan':null;
    const amount=parseAmount(cells[offset+2]);
    if(!date||!type||!amount)continue;
    out.push({date,type,amount,note:String(cells[offset+3]??'').trim().slice(0,500)||'Tanpa keterangan'});
  }
  return out.sort((a,b)=>b.date.localeCompare(a.date));
}
function updateSync(label,mode='') {
  $('#sync-label').textContent=label;
  $('#sync-status').className='sync-status '+mode;
  $('.sync-puppy').src=assetFor(mode==='problem'?'budget-warning':mode==='ok'?'budget-happy':'sync');
}
function notify(message) {
  const toast=$('#toast');
  toast.textContent=message;
  toast.hidden=false;
  requestAnimationFrame(()=>toast.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{toast.classList.remove('show');setTimeout(()=>{toast.hidden=true;},250)},5200);
}
async function fetchFeed(key) {
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),14000);
  try {
    const res=await fetch(FEEDS[key]+'&_='+Date.now(),{signal:controller.signal,cache:'no-store'});
    if(!res.ok)throw Error('HTTP '+res.status);
    const csv=await res.text();
    if(!csv.trim())throw Error('CSV kosong');
    const rows=parseCSV(csv);
    if(rows.length<1)throw Error('CSV tidak berisi baris');
    return parseFeed(csv,key);
  } finally {clearTimeout(timeout);}
}
async function refreshData(showFeedback=false) {
  if(loading && hasLoaded.lily && hasLoaded.nopal)return;
  loading=true;
  updateSync('Menyegarkan…');
  $('#refresh-btn').disabled=true;
  if(!hasLoaded[profile])render();
  const results=await Promise.allSettled([fetchFeed('lily'),fetchFeed('nopal')]);
  let errors=0;
  results.forEach((result,index)=>{
    const key=index===0?'lily':'nopal';
    if(result.status==='fulfilled') {profiles[key]=result.value;hasLoaded[key]=true;}else{errors++;console.warn('Feed gagal:',key,result.reason);}
  });
  loading=false;
  $('#refresh-btn').disabled=false;
  if(!errors)updateSync('Sheets tersambung','ok');
  else if(errors===1)updateSync('Sebagian data gagal dimuat','problem');
  else updateSync('Gagal memuat Sheets','problem');
  if(showFeedback)notify(!errors?'Data terbaru dimuat':'Gagal memuat sebagian data. Coba lagi.');
  render();
  verifyPendingEntry(results);
}
function shiftMonth(n) {
  const [y,m]=month.split('-').map(Number);
  const d=new Date(y,m-1+n,1);
  if(d.getFullYear()<1900||d.getFullYear()>2099)return;
  month=localDate(d).slice(0,7);
  render();
}
function monthRows() { return profiles[profile].filter(r=>r.date.slice(0,7)===month); }
function sum(list,type) {return list.reduce((acc,r)=>acc+(r.type===type?r.amount:0),0);}
function monthTitle(ym) {const [y,m]=ym.split('-').map(Number);return `${months[m-1][0].toUpperCase()+months[m-1].slice(1)} ${y}`;}
function displayDate(s) {const [y,m,d]=s.split('-').map(Number);return `${d} ${months[m-1][0].toUpperCase()+months[m-1].slice(1)} ${y}`;}
function progressWidth(value,max) {return max>0?Math.min(100,Math.max(0,(value/max)*100)):0;}
function makeEl(tag,cls='',text='') {const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;}
function renderChart(rows) {
  const [y,m]=month.split('-').map(Number);
  const count=new Date(y,m,0).getDate();
  const values=Array(count).fill(0);
  rows.forEach(r=>{if(r.type==='Pengeluaran')values[Number(r.date.slice(8))-1]+=r.amount;});
  const max=Math.max(...values,1);
  const chart=$('#chart');chart.replaceChildren();
  const todayKey=localDate(new Date());
  for(let i=0;i<count;i++) {
    const column=makeEl('div','chart-col');
    const bar=makeEl('span',values[i]===max&&values[i]>0?'peak':(month===todayKey.slice(0,7)&&i+1===Number(todayKey.slice(8))?'active':''));
    bar.style.height=`${Math.max(3,Math.round(values[i]/max*100))}%`;
    bar.style.animationDelay=`${Math.round(i*7)}ms`;
    bar.title=`${i+1} ${months[m-1]}: ${money(values[i])}`;
    column.appendChild(bar);chart.appendChild(column);
  }
  chart.setAttribute('aria-label',`Pengeluaran per hari untuk ${monthTitle(month)}; tertinggi ${money(Math.max(...values))}`);
  $('#chart-first').textContent='01';$('#chart-last').textContent=String(count);
}
function renderHistory(rows) {
  const target=$('#history');target.replaceChildren();target.setAttribute('aria-busy',String(loading&&!hasLoaded[profile]));
  if(loading&&!hasLoaded[profile]){const e=makeEl('div','blank');e.appendChild(makeEl('img','state-puppy'));e.querySelector('img').src=assetFor('sync');e.querySelector('img').alt='';e.appendChild(makeEl('strong','','Sedang mengambil catatan…'));e.append('Menghubungkan ke Google Sheets.');target.appendChild(e);return;}
  if(!hasLoaded[profile]){const e=makeEl('div','blank');const img=makeEl('img','state-puppy');img.src=assetFor('budget-warning');img.alt='';e.appendChild(img);e.appendChild(makeEl('strong','','Tidak dapat memuat riwayat'));e.append('Periksa koneksi, kemudian tekan tombol muat ulang.');target.appendChild(e);return;}
  const displayed=rows.filter(r=>(typeFilter==='all'||r.type===typeFilter)&&r.note.toLowerCase().includes(query));
  $('#transaction-total').textContent=`${displayed.length} transaksi`;
  if(!displayed.length) {const e=makeEl('div','blank');const img=makeEl('img','state-puppy');img.src=assetFor('empty');img.alt='';e.appendChild(img);e.appendChild(makeEl('strong','','Tidak ada transaksi'));e.append(rows.length?'Tidak ada hasil sesuai pencarian.':'Belum ada transaksi untuk bulan ini.');target.appendChild(e);return;}
  let prevDate='';
  for(const r of displayed) {
    if(r.date!==prevDate) {target.appendChild(makeEl('div','date-head',displayDate(r.date)));prevDate=r.date;}
    const record=makeEl('article','record '+(r.type==='Pemasukan'?'record-in':r.type==='Tabungan'?'record-save':''));
    const recordIcon=makeEl('div','record-icon');
    const code=r.type==='Pemasukan'?'IN':r.type==='Tabungan'?'SAVE':'OUT';
    recordIcon.appendChild(makeEl('span','record-code',code));
    const sticker=makeEl('img','lily-only transaction-puppy');
    sticker.src=assetFor(r.type==='Pemasukan'?'income':r.type==='Tabungan'?'saving':'expense');sticker.alt='';sticker.width=44;sticker.height=36;
    recordIcon.appendChild(sticker);record.appendChild(recordIcon);
    const main=makeEl('div','record-main');
    main.appendChild(makeEl('strong','',r.note));
    main.appendChild(makeEl('span','',r.type));
    record.appendChild(main);
    record.appendChild(makeEl('div','record-amount',(r.type==='Pemasukan'?'+ ':'− ')+money(r.amount)));
    target.appendChild(record);
  }
}
function budgetFor(r) {
  const note=r.note.toLowerCase();
  return BUDGETS.find(b=>b.keywords.some(k=>note.includes(k)))?.id || null;
}
function renderBudgets(rows) {
  const totalLimit=BUDGETS.reduce((a,b)=>a+b.limit,0);
  const allocations=Object.fromEntries(BUDGETS.map(b=>[b.id,0]));
  rows.filter(r=>r.type==='Pengeluaran').forEach(r=>{const id=budgetFor(r);if(id)allocations[id]+=r.amount;});
  const used=Object.values(allocations).reduce((a,b)=>a+b,0);
  $('#budget-used').textContent=money(used);
  $('#budget-pct').textContent=`${Math.round(used/totalLimit*100)}%`;
  $('#budget-progress').style.width=`${progressWidth(used,totalLimit)}%`;
  $('.progress').classList.toggle('over',used>totalLimit);
  $('#budget-mood').src=assetFor('budget-'+(used>totalLimit?'over':used>=totalLimit*.8?'warning':used>0?'happy':'idle'));
  const target=$('#budgets');target.replaceChildren();
  BUDGETS.forEach(b=>{
    const ratio=allocations[b.id]/b.limit;
    const mood=ratio>1?'over':ratio>=.8?'warning':ratio>0?'happy':'idle';
    const item=makeEl('div','budget-line'+(allocations[b.id]>b.limit?' over':''));
    const head=makeEl('div','budget-line-head');
    const title=makeEl('span','budget-name');
    const categorySticker=makeEl('img','lily-only category-puppy');categorySticker.src=assetFor(b.id);categorySticker.alt='';categorySticker.width=40;categorySticker.height=34;
    title.appendChild(categorySticker);title.appendChild(makeEl('span','',b.name));
    head.appendChild(title);
    const right=makeEl('span','budget-right');
    const status=makeEl('img','lily-only status-puppy');status.src=assetFor('budget-'+mood);status.alt='';status.title=({idle:'Belum digunakan',happy:'Masih dalam budget',warning:'Mendekati batas',over:'Melebihi batas'})[mood];status.width=34;status.height=29;
    right.appendChild(makeEl('span','',`${money(allocations[b.id])} / ${money(b.limit)}`));right.appendChild(status);const sr=makeEl('span','sr',status.title);right.appendChild(sr);head.appendChild(right);
    const track=makeEl('div','budget-line-track');const fill=makeEl('span');fill.style.width=`${progressWidth(allocations[b.id],b.limit)}%`;track.appendChild(fill);
    item.append(head,track);target.appendChild(item);
  });
}
function renderSavingSky(rows) {
  const saved = sum(rows,'Tabungan');
  const pct = savingsGoal ? Math.min(100,Math.round(saved/savingsGoal*100)) : 0;
  $('#dream-current').textContent = money(saved);
  $('#dream-goal').value = savingsGoal || '';
  $('#dream-progress-fill').style.width = pct + '%';
  $('#dream-progress').setAttribute('aria-valuenow',String(pct));
  $('#dream-progress').setAttribute('aria-valuetext',savingsGoal ? `${money(saved)} dari ${money(savingsGoal)}` : 'Belum ada target');
  $('#dream-percent').textContent = savingsGoal ? pct + '%' : '♡';
  const note = $('#dream-status');
  note.textContent = !savingsGoal ? 'Set a goal to start growing your sky ♡' :
    saved >= savingsGoal ? 'Your sky is full of stars. Wonderful, Lily! ✦' :
    saved ? `${money(Math.max(0,savingsGoal-saved))} until your next big cloud ♡` :
    `A fresh start! Your little goal is ${money(savingsGoal)}.`;
  document.querySelectorAll('.garden-star').forEach((star,index)=>star.classList.toggle('lit', Boolean(savingsGoal) && pct >= (index+1)*20));
  $('#dream-art').classList.toggle('garden-complete',Boolean(savingsGoal)&&saved>=savingsGoal);
}
function setMood(key,save=false) {
  if(!MOODS[key])return;
  selectedMood=key;
  if(save)memorySet('lily.cinna.mood',key);
  document.body.dataset.mood=key;
  document.querySelectorAll('.mood-choice').forEach(btn=>{
    const active=btn.dataset.mood===key;
    btn.classList.toggle('is-selected',active);
    btn.setAttribute('aria-pressed',String(active));
  });
  $('#mood-message').textContent=MOODS[key].message;
  $('#mood-subline').textContent=MOODS[key].detail;
  if(!$('#lily-companion').classList.contains('is-sleepy'))$('#companion-image').src=assetFor(({happy:'cheer',cozy:'hello',bouncy:'bouncy',grumpy:'grumpy'})[key]);
}
function resolvedSky() {
  const hour=new Date().getHours();
  return skyChoice==='auto' ? (hour>=18||hour<6?'night':'day') : skyChoice;
}
function applySky() {
  const night=resolvedSky()==='night';
  document.body.dataset.sky=night?'night':'day';
  $('#sky-icon').textContent=night?'☀':'☾';
  $('#sky-label').textContent=night?'Day sky':'Night sky';
  $('#sky-toggle').setAttribute('aria-label',night?'Ganti ke langit siang':'Ganti ke langit malam');
  $('#sky-toggle').setAttribute('aria-pressed',String(night));
  if(profile==='lily')document.querySelector('meta[name="theme-color"]').content=night?'#263e70':'#d7efff';
}
function burstAt(element,count=11) {
  if(profile!=='lily'||window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden)return;
  const rect=element.getBoundingClientRect();
  const x=rect.left+rect.width/2,y=rect.top+rect.height/2;
  const glyphs=['♡','✦','✧','♥'];
  for(let i=0;i<count;i++) {
    const p=document.createElement('span');p.className='cinna-particle';
    p.textContent=glyphs[i%glyphs.length];
    p.style.left=x+'px';p.style.top=y+'px';
    const angle=(i/count)*Math.PI*2;
    const radius=35+(i%4)*19;
    p.style.setProperty('--dx',(Math.cos(angle)*radius)+'px');
    p.style.setProperty('--dy',(Math.sin(angle)*radius-25)+'px');
    p.style.setProperty('--spin',((i%2?1:-1)*70)+'deg');
    p.style.animationDelay=(i%3)*32+'ms';
    $('#cinna-particles').appendChild(p);
    p.addEventListener('animationend',()=>p.remove(),{once:true});
  }
}
function matchingCount(list,p) {
  return list.filter(r=>r.date===p.date && r.type===p.type && r.amount===p.amount && r.note===p.note).length;
}
function verifyPendingEntry(results) {
  if(!pendingConfirmation)return;
  const p=pendingConfirmation;
  const index=p.key==='lily'?0:1;
  if(results[index].status!=='fulfilled'||p.baseline===null)return;
  if(matchingCount(profiles[p.key],p)>p.baseline) {
    pendingConfirmation=null;
    updateSync('Tercatat di riwayat','ok');
    notify(p.key==='lily'?'Transaksi sudah muncul di Sheets. Cinna ikut senang! ♡':'Transaksi sudah muncul di Sheets.');
    if(profile==='lily'&&p.key==='lily')burstAt($('#lily-banner-art')||$('.lily-banner-art'),17);
  }
}
function render() {
  document.body.dataset.profile=profile;
  document.querySelectorAll('.profile').forEach(btn=>{const active=btn.dataset.profile===profile;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});
  $('#person-heading').textContent=profile.toUpperCase();
  // Each profile has its own visual identity; only Lily gets the sky journal.
  const isLily = profile === 'lily';
  $('#intro-eyebrow').firstChild.textContent = isLily ? 'CINNAMOROLL SKY JOURNAL / ' : 'BUKU KEUANGAN / ';
  const hour=new Date().getHours();
  const greet=hour<11?'Morning':hour<17?'Hello':'Evening';
  $('#intro-title').innerHTML = isLily ? `${greet}, <em>Lily!</em>` : 'Uang, <em>lebih jelas.</em>';
  $('#intro-description').textContent = isLily ? ({happy:'A little cloud for every money moment. ♡',cozy:'Soft days deserve a cozy little sky. ♡',bouncy:'Tiny steps, big happy energy! ✦',grumpy:'Even grumpy clouds deserve love. ♡'})[selectedMood] : 'Semua pemasukan dan pengeluaran, tanpa ribet.';
  $('#brand-description').innerHTML = isLily ? 'Lily’s little<br>sky journal' : 'Lily &amp; Nopal<br>money journal';
  $('#theme-footer').textContent = isLily ? 'Saku / Lily’s little sky' : 'Saku / Catppuccin Mocha';
  $('#entry-title').textContent = isLily ? 'Cerita uang Lily' : 'Catat uangmu';
  $('#submit-entry').dataset.defaultText = isLily ? 'Simpan di Sheets ♡' : 'Kirim ke Sheets';
  document.querySelector('meta[name="theme-color"]').content = isLily ? (resolvedSky()==='night'?'#263e70':'#d7efff') : '#11111b';
  $('#app-favicon').href = isLily ? 'assets/stickers/hello.webp' : 'assets/saku-nopal-icon.svg';
  $('#app-favicon').type = isLily ? 'image/webp' : 'image/svg+xml';
  $('#month-label').textContent=monthTitle(month);
  $('#period-code').textContent=month.replace('-',' / ');
  const rows=monthRows();const income=sum(rows,'Pemasukan');const expenses=sum(rows,'Pengeluaran');const savings=sum(rows,'Tabungan');const net=income-expenses-savings;
  const all=profiles[profile];const overall=sum(all,'Pemasukan')-sum(all,'Pengeluaran')-sum(all,'Tabungan');
  $('#total-expenses').textContent=money(expenses);
  $('#expense-count').textContent=`${rows.filter(r=>r.type==='Pengeluaran').length} transaksi pengeluaran`;
  $('#monthly-income').textContent=money(income);
  $('#monthly-savings').textContent=money(savings);
  $('#monthly-net').textContent=(net<0?'− ':'')+money(Math.abs(net));
  $('#monthly-net').classList.toggle('negative',net<0);
  $('#overall-net').textContent=(overall<0?'− ':'')+money(Math.abs(overall));
  $('#overall-net').classList.toggle('negative',overall<0);
  renderChart(rows);renderHistory(rows);renderBudgets(rows);renderSavingSky(rows);
}
function csvCell(v) {let s=String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
function exportCSV() {
  if(!hasLoaded[profile]) {notify('Data belum dimuat');return;}
  const rows=monthRows();if(!rows.length){notify('Tidak ada transaksi untuk diunduh');return;}
  const csv='\uFEFF'+[['Tanggal','Jenis','Nominal','Keterangan'],...rows.map(r=>[r.date,r.type,r.amount,r.note])].map(row=>row.map(csvCell).join(',')).join('\r\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const href=URL.createObjectURL(blob);const a=document.createElement('a');a.href=href;a.download=`saku-${profile}-${month}.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),3000);notify('CSV diunduh');
}
function openDialog() {
  if(requestInFlight)return;
  $('#entry-form').reset();
  updateFormCinna();
  $('#entry-date').value=localDate(new Date());
  $('#submit-entry').textContent=$('#submit-entry').dataset.defaultText||'Kirim ke Sheets';
  $('#entry-dialog').showModal();
}
async function submitEntry(event) {
  event.preventDefault();
  if(requestInFlight)return;
  const amount=Number($('#entry-amount').value);
  const type=$('#entry-type').value;
  const date=$('#entry-date').value;
  const note=$('#entry-note').value.trim()||'-';
  if(!Number.isSafeInteger(amount)||amount<=0||!['Pengeluaran','Pemasukan','Tabungan'].includes(type)||!parseDate(date)) {notify('Periksa jenis, nominal, dan tanggal');return;}
  requestInFlight=true;$('#submit-entry').disabled=true;$('#submit-entry').textContent='Mengirim…';
  const key=profile;
  const baseline=hasLoaded[key]?matchingCount(profiles[key],{date,type,amount,note}):null;
  const body={user:key==='lily'?'Lily':'Nopal',kat:type,nom:amount,ket:note,customDate:date};
  // Existing backend uses a cross-origin no-cors POST. An opaque response does not prove a write succeeded.
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),15000);
  try {
    await fetch(SCRIPT_URL,{method:'POST',mode:'no-cors',body:JSON.stringify(body),signal:controller.signal});
    $('#entry-dialog').close();
    pendingConfirmation={key,type,date,amount,note,baseline};
    updateSync('Terkirim, belum terverifikasi');
    notify('Permintaan dikirim. Periksa Sheets sebelum mengirim ulang.');
    setTimeout(()=>refreshData(false),3000);
    setTimeout(()=>refreshData(false),15000);
  } catch(e) {
    console.warn('POST failed, status unknown:',e);
    notify('Status pengiriman tidak pasti. Periksa Sheet sebelum mencoba lagi.');
    updateSync('Status kirim tidak pasti','problem');
  } finally {
    clearTimeout(timeout);
    requestInFlight=false;$('#submit-entry').disabled=false;$('#submit-entry').textContent=$('#submit-entry').dataset.defaultText||'Kirim ke Sheets';
  }
}

function updateFormCinna() {
  const type=$('#entry-type').value;
  const image=type==='Pengeluaran'?'paper-ramen':type==='Pemasukan'?'bouncy':'cheer';
  $('.dialog-puppy').src=`assets/stickers/${image}.webp`;
  $('#save-helper').textContent=type==='Tabungan'?'Little savings make big fluffy dreams! ☁':type==='Pemasukan'?'Yay, money coming in! Cinna says hi ♡':'Every little expense has a story. ♡';
}
function wakeCompanion() {
  clearTimeout(companionIdleTimer);
  $('#lily-companion').classList.remove('is-sleepy');
  $('#companion-image').src=assetFor(({happy:'cheer',cozy:'hello',bouncy:'bouncy',grumpy:'grumpy'})[selectedMood]);
  companionIdleTimer=setTimeout(()=>{
    if(profile!=='lily'||document.hidden)return;
    $('#lily-companion').classList.add('is-sleepy');
    $('#companion-image').src='assets/stickers/paper-nap.webp';
    $('#companion-bubble').textContent='shhh… Cinna is dreaming ☾';
  },55000);
}
function setupCinnaCorner() {
  setMood(selectedMood);
  applySky();
  document.querySelectorAll('.mood-choice').forEach(btn=>btn.addEventListener('click',()=>{
    setMood(btn.dataset.mood,true);
    render();
    wakeCompanion();
    burstAt(btn,8);
  }));
  $('#sky-toggle').addEventListener('click',()=>{
    skyChoice=resolvedSky()==='night'?'day':'night';
    memorySet('lily.cinna.sky',skyChoice);
    applySky();
    burstAt($('#sky-toggle'),9);
  });
  $('#dream-form').addEventListener('submit',event=>{
    event.preventDefault();
    const val=Number($('#dream-goal').value);
    if(!Number.isSafeInteger(val)||val<1){notify('Masukkan target tabungan yang valid.');return;}
    savingsGoal=val;
    memorySet('lily.cinna.monthlyGoal',val);
    renderSavingSky(monthRows());
    notify('Your little savings cloud is ready! ♡');
    burstAt($('#dream-goal'),13);
  });
  const letter=$('#letter-dialog');
  $('#open-letter').addEventListener('click',()=>{
    if(profile!=='lily')return;
    letter.showModal();
    burstAt($('#open-letter'),12);
  });
  $('#letter-close').addEventListener('click',()=>letter.close());
  letter.addEventListener('click',event=>{if(event.target===letter)letter.close();});
  $('#entry-type').addEventListener('change',updateFormCinna);
  document.querySelectorAll('.idea-chips button').forEach(chip=>chip.addEventListener('click',()=>{
    const note=$('#entry-note');
    if(!note.value.trim())note.value=chip.dataset.note;
    else if(!note.value.toLowerCase().startsWith(chip.dataset.note.toLowerCase()))note.value=chip.dataset.note+' · '+note.value;
    note.focus();
    burstAt(chip,6);
  }));
  const companion=$('#companion-button');
  companion.addEventListener('click',()=>{
    companionTapCount++;
    wakeCompanion();
    const lines=['Hii Lily! You’re my favorite cloud ♡','A little hug just for you! ☁','Cinna believes in your tiny steps ✦','Remember to drink some water! ♡','Sending you a sky full of hugs!'];
    $('#companion-bubble').textContent=lines[(companionTapCount-1)%lines.length];
    $('#lily-companion').classList.add('is-talking');
    clearTimeout(companionTalkTimer);
    companionTalkTimer=setTimeout(()=>$('#lily-companion').classList.remove('is-talking'),4800);
    $('#lily-companion').classList.remove('is-wiggling');
    void $('#lily-companion').offsetWidth;
    $('#lily-companion').classList.add('is-wiggling');
    burstAt(companion,12);
  });
  ['pointerdown','keydown'].forEach(name=>document.addEventListener(name,event=>{
    if(event.target.closest?.('#companion-button'))return;
    if($('#lily-companion').classList.contains('is-sleepy'))wakeCompanion();
    else {clearTimeout(companionIdleTimer);companionIdleTimer=setTimeout(()=>{
      if(profile!=='lily'||document.hidden)return;
      $('#lily-companion').classList.add('is-sleepy');
      $('#companion-image').src='assets/stickers/paper-nap.webp';
      $('#companion-bubble').textContent='shhh… Cinna is dreaming ☾';
    },55000);}
  },{passive:true}));
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)wakeCompanion();});
  wakeCompanion();
  const dialog=$('#sticker-dialog');
  document.querySelectorAll('.sticker-card').forEach(card=>card.addEventListener('click',()=>{
    const picture=card.querySelector('img');
    $('#sticker-dialog-image').src=picture.src;
    $('#sticker-dialog-image').alt=picture.alt;
    $('#sticker-dialog-title').textContent=card.dataset.caption;
    if(!dialog.open)dialog.showModal();
  }));
  $('#sticker-dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
}
function boot() {
  setupCinnaCorner();

  document.querySelectorAll('.profile').forEach(btn=>btn.addEventListener('click',()=>{profile=btn.dataset.profile;render();if(profile==='lily')wakeCompanion();}));
  $('#prev-month').addEventListener('click',()=>shiftMonth(-1));
  $('#next-month').addEventListener('click',()=>shiftMonth(1));
  $('#refresh-btn').addEventListener('click',()=>refreshData(true));
  $('#search').addEventListener('input',e=>{query=e.target.value.toLowerCase().trim();renderHistory(monthRows());});
  $('#type-filter').addEventListener('change',e=>{typeFilter=e.target.value;renderHistory(monthRows());});
  $('#export-btn').addEventListener('click',exportCSV);
  $('#new-entry-top').addEventListener('click',openDialog);
  $('#new-entry-mobile').addEventListener('click',openDialog);
  $('#close-dialog').addEventListener('click',()=>$('#entry-dialog').close());
  $('#cancel-dialog').addEventListener('click',()=>$('#entry-dialog').close());
  $('#entry-dialog').addEventListener('click',e=>{if(e.target===$('#entry-dialog'))$('#entry-dialog').close();});
  $('#entry-form').addEventListener('submit',submitEntry);
  render();refreshData();
}
boot();
