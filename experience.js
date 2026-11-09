'use strict';
/* Layout and chart enhancements. Never changes financial calculations or endpoints. */
(() => {
  const $$ = selector => document.querySelector(selector);
  const links = [...document.querySelectorAll('.mobile-dock .dock-link[data-dock]')];
  const targets = {home:'#main', history:'#history-section', savings:'#savings-section'};
  let chosenDay = -1;
  const pick = name => {
    links.forEach(link => {
      const current = link.dataset.dock === name;
      link.classList.toggle('active', current);
      if(current) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    });
  };
  const adaptProfile = () => {
    const savings = links.find(link=>link.dataset.dock==='savings');
    if(!savings) return;
    if(document.body.dataset.profile==='nopal') {
      targets.savings='#budget-section';
      savings.href='#budget-section';
      savings.querySelector('span').textContent='Budget';
    } else {
      targets.savings='#savings-section';
      savings.href='#savings-section';
      savings.querySelector('span').textContent='Tabungan';
    }
  };
  const revealHistory = () => {
    if($$('#history-content').hidden) $$('#history-toggle').click();
  };
  links.forEach(link=>link.addEventListener('click',()=>{
    if(link.dataset.dock==='history') revealHistory();
    pick(link.dataset.dock);
  }));
  // Update only after the original app's profile-switch handlers have run.
  document.querySelectorAll('.profile').forEach(button=>button.addEventListener('click',()=>{
    adaptProfile();pick('home');
  }));
  const updatePosition = () => {
    if(window.innerWidth>735) return;
    const y=window.scrollY+Math.min(175,innerHeight*.24);
    const history=$$('#history-section'); const saving=$$(targets.savings);
    if(saving && saving.offsetParent && y >= saving.getBoundingClientRect().top+window.scrollY) pick('savings');
    else if(history && y>=history.getBoundingClientRect().top+window.scrollY) pick('history');
    else pick('home');
  };
  let frame=false;
  window.addEventListener('scroll',()=>{
    if(frame) return;frame=true;
    requestAnimationFrame(()=>{frame=false;updatePosition();});
  },{passive:true});
  window.addEventListener('resize',updatePosition,{passive:true});
  adaptProfile();
  const chart=$$('#chart'), label=$$('#chart-selected');
  function selectDay(day) {
    const columns=[...chart.querySelectorAll('.chart-col')];
    if(!columns.length) return;
    chosenDay=Math.max(0,Math.min(columns.length-1,day));
    columns.forEach((c,i)=>c.dataset.selected=String(i===chosenDay));
    const col=columns[chosenDay];
    const amount=Number(col.dataset.amount);
    const monthLabel=$$('#month-label').textContent;
    label.textContent=`${String(chosenDay+1).padStart(2,'0')} ${monthLabel}: ${money(amount)} pengeluaran.`;
    chart.setAttribute('aria-label',`${label.textContent} Gunakan panah kiri/kanan untuk hari lain.`);
  }
  chart.addEventListener('click',event=>{
    const column=event.target.closest('.chart-col');
    if(column&&chart.contains(column)) selectDay(Number(column.dataset.day)-1);
  });
  chart.addEventListener('keydown',event=>{
    if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
    event.preventDefault();
    const count=chart.querySelectorAll('.chart-col').length;
    if(!count)return;
    if(event.key==='Home')selectDay(0);
    else if(event.key==='End')selectDay(count-1);
    else selectDay(Math.max(0,Math.min(count-1,(chosenDay<0?0:chosenDay)+(event.key==='ArrowRight'?1:-1))));
  });
  // Actual month/profile changes invalidate any previous daily selection.
  const resetSelected=()=>{chosenDay=-1;};
  ['#prev-month','#next-month',...[]].forEach(selector=> $$(selector)?.addEventListener('click',resetSelected));
  document.querySelectorAll('.profile').forEach(button=>button.addEventListener('click',resetSelected));
  if(location.hash==='#history-section')revealHistory();
  if(location.hash==='#savings-section'||location.hash==='#budget-section') pick('savings');
  else if(location.hash==='#history-section')pick('history');
  // Chart and navigation are still accessible without JavaScript through links and titles.
})();
