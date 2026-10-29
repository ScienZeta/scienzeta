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

const questions = [];

let current = 0;
let answers = {};
let started = false;
let finished = false;
let timeLeft = 20 * 60;
let timerId = null;

const $ = id => document.getElementById(id);

function drawQuestion() {
  if (!questions.length) return;

  const q = questions[current];
  const answeredCount = Object.keys(answers).length;

  $('qNumber').textContent =
    `प्रश्न ${current + 1} / ${questions.length}`;

  $('qProgress').textContent =
    `हल किए: ${answeredCount}/${questions.length} | समय: ${formatTime(timeLeft)}`;

  $('quizBar').style.width =
    `${answeredCount / questions.length * 100}%`;

  $('qText').textContent = q.q;
  $('qOptions').innerHTML = '';
  $('qFeedback').textContent = '';

  q.options.forEach((opt, i) => {
    const b = document.createElement('button');
    b.className = 'qOption';
    b.textContent = `${String.fromCharCode(65 + i)}. ${opt}`;

    b.disabled = !started || finished;

    if (answers[current] === i) {
      b.style.border = '2px solid #2563eb';
    }

    b.addEventListener('click', () => {
      if (!started || finished) return;

      answers[current] = i;
      drawQuestion();
    });

    $('qOptions').appendChild(b);
  });

  $('prevQ').disabled = !started || current === 0 || finished;
  $('nextQ').hidden = current === questions.length - 1;
  $('nextQ').disabled = !started || finished;

  $('submitTest').hidden =
    !started || current !== questions.length - 1;

  $('submitTest').disabled = !started || finished;
  $('result').hidden = true;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = 20 * 60;

  timerId = setInterval(() => {
    if (finished) {
      clearInterval(timerId);
      return;
    }

    timeLeft--;
    $('qProgress').textContent =
      `हल किए: ${Object.keys(answers).length}/${questions.length} | समय: ${formatTime(timeLeft)}`;

    if (timeLeft <= 0) {
      finishTest(true);
    }
  }, 1000);
}

$('startTest').addEventListener('click', () => {
  if (!questions.length) return;

  current = 0;
  answers = {};
  started = true;
  finished = false;

  $('result').hidden = true;
  startTimer();
  drawQuestion();

  $('qText').scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
});

$('prevQ').addEventListener('click', () => {
  if (started && !finished && current > 0) {
    current--;
    drawQuestion();
  }
});

$('nextQ').addEventListener('click', () => {
  if (started && !finished && current < questions.length - 1) {
    current++;
    drawQuestion();
  }
});

$('submitTest').addEventListener('click', () => {
  finishTest(false);
});

function finishTest(autoSubmitted) {
  if (!started || finished || !questions.length) return;

  finished = true;
  started = false;
  clearInterval(timerId);

  const score = questions.reduce(
    (sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0),
    0
  );

  const history = JSON.parse(
    localStorage.getItem('sz_demo_results') || '[]'
  );

  history.push({
    date: new Date().toISOString(),
    score,
    total: questions.length
  });

  localStorage.setItem('sz_demo_results', JSON.stringify(history));

  $('attempts').textContent = history.length;
  $('bestScore').textContent =
    Math.max(...history.map(x => x.score)) + '/' + questions.length;

  $('result').hidden = false;
  $('result').innerHTML = `
    <h4>आपका रिज़ल्ट: ${score} / ${questions.length}</h4>
    <p>${Math.round(score / questions.length * 100)}% अंक।</p>
    <p>${autoSubmitted ? 'समय पूरा होने पर परीक्षा जमा हुई।' : 'आपकी परीक्षा जमा हो गई।'}</p>
    <p>सही उत्तर नीचे देखें।</p>
  `;

  const reviewTitle = document.createElement('h4');
  reviewTitle.textContent = 'उत्तर समीक्षा';
  $('result').appendChild(reviewTitle);

  questions.forEach((q, i) => {
    const item = document.createElement('div');
    item.style.padding = '12px 0';
    item.style.borderBottom = '1px solid #ddd';

    const questionText = document.createElement('p');
    questionText.textContent = `${i + 1}. ${q.q}`;

    const yourAnswer = document.createElement('p');
    yourAnswer.textContent = answers[i] === undefined
      ? 'आपका उत्तर: नहीं दिया'
      : `आपका उत्तर: ${q.options[answers[i]]}`;

    const correctAnswer = document.createElement('p');
    correctAnswer.textContent =
      `सही उत्तर: ${q.options[q.answer]}`;

    const explanation = document.createElement('p');
    explanation.textContent = q.explain || '';

    item.append(questionText, yourAnswer, correctAnswer, explanation);
    $('result').appendChild(item);
  });

  $('result').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  $('qProgress').textContent = 'परीक्षा पूरी हुई';
  $('quizBar').style.width = '100%';

  $('prevQ').disabled = true;
  $('nextQ').disabled = true;
  $('submitTest').disabled = true;
}

$('attempts').textContent = (
  JSON.parse(localStorage.getItem('sz_demo_results') || '[]')
).length;

const oldResults = JSON.parse(
  localStorage.getItem('sz_demo_results') || '[]'
);

if (oldResults.length) {
  $('bestScore').textContent =
    Math.max(...oldResults.map(x => x.score)) + '/' +
    (oldResults[oldResults.length - 1].total || questions.length);
}

fetch('./questions.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('questions.json फाइल नहीं मिली');
    }

    return response.json();
  })
  .then(data => {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Questions की सूची खाली है');
    }

    const validQuestions = data.every(q =>
      typeof q.q === 'string' &&
      Array.isArray(q.options) &&
      q.options.length >= 2 &&
      Number.isInteger(q.answer) &&
      q.answer >= 0 &&
      q.answer < q.options.length
    );

    if (!validQuestions) {
      throw new Error('किसी सवाल का JSON format गलत है');
    }

    questions.push(...data);
    drawQuestion();
  })
  .catch(error => {
    $('qText').textContent =
      'सवाल लोड नहीं हुए। questions.json की जाँच करें।';
    console.error(error);
  });
