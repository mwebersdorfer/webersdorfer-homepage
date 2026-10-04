(() => {
const root=document.querySelector('.org-calendar');
if(!root)return;
const now=new Date(), today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
let shown=new Date(today.getFullYear(),today.getMonth(),1), selected=new Date(today);
const month=root.querySelector('#calendar-month'), days=root.querySelector('#calendar-days');
const label=root.querySelector('#calendar-selected'), events=root.querySelector('#calendar-events');
const key=d=>[d.getFullYear(),d.getMonth(),d.getDate()].join('-');
function agenda(){
 label.textContent=selected.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 events.replaceChildren();
 const p=document.createElement('p');p.textContent='Keine Termine für diesen Tag.';events.append(p);
}
function render(){
 month.textContent=shown.toLocaleDateString('de-DE',{month:'long',year:'numeric'});
 days.replaceChildren();
 const offset=(shown.getDay()+6)%7;
 for(let i=0;i<offset;i++){const gap=document.createElement('span');gap.setAttribute('aria-hidden','true');days.append(gap);}
 const count=new Date(shown.getFullYear(),shown.getMonth()+1,0).getDate();
 for(let n=1;n<=count;n++){
  const date=new Date(shown.getFullYear(),shown.getMonth(),n),b=document.createElement('button');
  b.type='button';b.textContent=n;b.setAttribute('aria-label',date.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
  b.setAttribute('aria-pressed',String(key(date)===key(selected)));
  if(key(date)===key(today))b.setAttribute('aria-current','date');
  b.addEventListener('click',()=>{selected=date;render();days.querySelector('[aria-pressed="true"]').focus();});
  days.append(b);
 }
 agenda();
}
root.querySelectorAll('[data-month]').forEach(b=>b.addEventListener('click',()=>{
 shown=new Date(shown.getFullYear(),shown.getMonth()+Number(b.dataset.month),1);selected=new Date(shown);render();
}));
root.querySelector('#calendar-today').addEventListener('click',()=>{selected=new Date(today);shown=new Date(today.getFullYear(),today.getMonth(),1);render();});
render();
})();
