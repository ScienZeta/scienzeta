// ScienZeta front-end demo. Real authentication/database must be configured separately.
document.getElementById('year').textContent = new Date().getFullYear();
const nav = document.querySelector('.topbar nav');
document.getElementById('hamb').addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const noteSearch = document.getElementById('searchNotes');
noteSearch.addEventListener('input', () => {
  let count = 0;
  document.querySelectorAll('.note').forEach(card => {
    const show = (card.dataset.name + ' ' + card.innerText).toLocaleLowerCase('hi').includes(noteSearch.value.trim().toLocaleLowerCase('hi'));
    card.hidden = !show;
    if (show) count++;
  });
  document.getElementById('noNotes').hidden = count !== 0;
});

const modal = document.getElementById('authModal');
const openAuth = () => { modal.classList.add('show'); modal.setAttribute('aria-hidden','false'); };
const closeAuth = () => { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); };
document.getElementById('openAuth').addEventListener('click', openAuth);
document.getElementById('closeAuth').addEventListener('click', closeAuth);
modal.addEventListener('click', e => { if (e.target === modal) closeAuth(); });
let signup = false;
const switchAuth = document.getElementById('switchAuth');
function setAuthMode() {
  document.getElementById('authTitle').textContent = signup ? 'नया अकाउंट बनाएँ' : 'लॉगिन करें';
  document.getElementById('authSubmit').textContent = signup ? 'डेमो अकाउंट बनाएँ' : 'डेमो लॉगिन';
  document.getElementById('nameInput').hidden = !signup;
  document.getElementById('nameInput').required = signup;
  document.getElementById('nameLabel').hidden = !signup;
  document.getElementById('passwordInput').autocomplete = signup ? 'new-password' : 'current-password';
  switchAuth.textContent = signup ? 'पहले से अकाउंट है? लॉगिन करें' : 'नया अकाउंट बनाएँ';
  document.getElementById('authMessage').textContent = '';
}
switchAuth.addEventListener('click', () => { signup = !signup; setAuthMode(); });
document.getElementById('authForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const password = document.getElementById('passwordInput').value;
  const name = document.getElementById('nameInput').value.trim() || email.split('@')[0];
  const message = document.getElementById('authMessage');
  let users = JSON.parse(localStorage.getItem('sz_demo_users') || '{}');
  if (signup) {
    if (users[email]) { message.textContent = 'इस ईमेल का डेमो अकाउंट पहले से मौजूद है।'; message.style.color = '#b93842'; return; }
    users[email] = { name, password }; localStorage.setItem('sz_demo_users', JSON.stringify(users));
  } else if (!users[email] || users[email].password !== password) {
    message.textContent = 'डेमो अकाउंट नहीं मिला। पहले नया अकाउंट बनाएँ।'; message.style.color = '#b93842'; return;
  }
  localStorage.setItem('sz_demo_session', JSON.stringify({email, name}));
  updateDashboard();
  message.textContent = 'डेमो मोड में सफल! यह वास्तविक सुरक्षित लॉगिन नहीं है।';
  message.style.color = '#13865b';
  setTimeout(closeAuth, 1400);
});
function updateDashboard() {
  const session = JSON.parse(localStorage.getItem('sz_demo_session') || 'null');
  if (!session) return;
  document.getElementById('dashName').textContent = session.name;
  document.getElementById('dashEmail').textContent = session.email;
  document.getElementById('dashStatus').textContent = 'डेमो प्रोफाइल सक्रिय';
}
updateDashboard();
document.getElementById('adminInfo').addEventListener('click', () => document.getElementById('setup').scrollIntoView({behavior:'smooth'}));

const questions = [
 {q:'बिहार की राजधानी कौन-सी है?', options:['गया','पटना','भागलपुर','मुजफ्फरपुर'], answer:1, explain:'पटना बिहार की राजधानी है।'},
 {q:'भारत का संविधान कब लागू हुआ?', options:['15 अगस्त 1947','26 जनवरी 1950','26 नवंबर 1949','2 अक्टूबर 1950'], answer:1, explain:'संविधान 26 जनवरी 1950 को लागू हुआ।'},
 {q:'पौधे अपना भोजन किस प्रक्रिया से बनाते हैं?', options:['श्वसन','वाष्पोत्सर्जन','प्रकाश संश्लेषण','पाचन'], answer:2, explain:'हरे पौधे सूर्य के प्रकाश की मदद से प्रकाश संश्लेषण करते हैं।'}
];
let current=0, answers={}, started=false;
const $ = id => document.getElementById(id);
function drawQuestion() {
  const q=questions[current];
  $('qNumber').textContent=`प्रश्न ${current+1} / ${questions.length}`;
  $('qProgress').textContent=`${Math.round((Object.keys(answers).length/questions.length)*100)}% पूरा`;
  $('quizBar').style.width=`${Object.keys(answers).length/questions.length*100}%`;
  $('qText').textContent=q.q; $('qOptions').innerHTML=''; $('qFeedback').textContent='';
  q.options.forEach((opt,i)=>{
    const b=document.createElement('button'); b.className='qOption'; b.textContent=`${String.fromCharCode(65+i)}. ${opt}`;
    if (answers[current] !== undefined) {
      b.disabled=true;
      if(i===q.answer)b.classList.add('correct');
      if(i===answers[current]&&i!==q.answer)b.classList.add('wrong');
    }
    b.addEventListener('click',()=>{answers[current]=i;drawQuestion();$('qFeedback').textContent=(i===q.answer?'सही जवाब! ':'सही उत्तर: '+q.options[q.answer]+'. ')+q.explain;});
    $('qOptions').appendChild(b);
  });
  if(answers[current]!==undefined)$('qFeedback').textContent=(answers[current]===q.answer?'सही जवाब! ':'सही उत्तर: '+q.options[q.answer]+'. ')+q.explain;
  $('prevQ').disabled=current===0;
  $('nextQ').hidden=current===questions.length-1;
  $('nextQ').disabled=answers[current]===undefined;
  $('submitTest').hidden=current!==questions.length-1;
  $('submitTest').disabled=Object.keys(answers).length!==questions.length;
  $('result').hidden=true;
}
$('startTest').addEventListener('click',()=>{started=true;current=0;answers={};$('result').hidden=true;drawQuestion();$('qText').scrollIntoView({behavior:'smooth',block:'center'});});
$('prevQ').addEventListener('click',()=>{if(current>0){current--;drawQuestion();}});
$('nextQ').addEventListener('click',()=>{if(current<questions.length-1){current++;drawQuestion();}});
$('submitTest').addEventListener('click',()=>{
  let score=questions.reduce((sum,q,i)=>sum+(answers[i]===q.answer?1:0),0);
  let history=JSON.parse(localStorage.getItem('sz_demo_results')||'[]');
  history.push({date:new Date().toISOString(),score,total:questions.length});
  localStorage.setItem('sz_demo_results',JSON.stringify(history));
  $('attempts').textContent=history.length;
  $('bestScore').textContent=Math.max(...history.map(x=>x.score))+'/'+questions.length;
  $('result').hidden=false;
  $('result').innerHTML=`<h4>आपका रिज़ल्ट: ${score} / ${questions.length}</h4><p>${Math.round(score/questions.length*100)}% अंक। ${score===questions.length?'बहुत बढ़िया!':score>=2?'अच्छा प्रयास—गलत प्रश्न दोहराएँ।':'चिंता न करें—नोट्स पढ़कर फिर प्रयास करें।'} यह रिज़ल्ट इसी ब्राउज़र में सेव हुआ है।</p>`;
  $('result').scrollIntoView({behavior:'smooth',block:'nearest'});
});
$('attempts').textContent=(JSON.parse(localStorage.getItem('sz_demo_results')||'[]')).length;
const oldResults=JSON.parse(localStorage.getItem('sz_demo_results')||'[]');
if(oldResults.length)$('bestScore').textContent=Math.max(...oldResults.map(x=>x.score))+'/'+questions.length;
drawQuestion();
