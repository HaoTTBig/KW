// ===== 状态 =====
let currentIndex = 0;
let totalScore = 0;
let selectedIdx = -1;
let currentLevel = null;

// ===== 页面切换 =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ===== 首页 =====
(function initHome() {
  const base = 12847;
  const days = Math.max(0, Math.floor((Date.now() - new Date('2026-05-15').getTime()) / 86400000));
  document.getElementById('testCount').textContent = (base + days * 137 + Math.floor(Math.random() * 80)).toLocaleString();
})();

function startQuiz() {
  currentIndex = 0;
  totalScore = 0;
  selectedIdx = -1;
  renderQuestion();
  showPage('page-quiz');
}

// ===== 答题 =====
function renderQuestion() {
  const q = QUESTIONS[currentIndex];
  document.getElementById('qText').textContent = q.text;
  document.getElementById('progressText').textContent = `${currentIndex + 1} / ${QUESTIONS.length}`;
  document.getElementById('progressFill').style.width = `${((currentIndex + 1) / QUESTIONS.length) * 100}%`;

  const wrap = document.getElementById('optionsWrap');
  wrap.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const div = document.createElement('div');
    div.className = 'option-item';
    div.dataset.idx = idx;
    div.innerHTML = `<span class="option-label">${opt.label}</span><span class="option-text">${opt.text}</span>`;
    div.onclick = () => selectOption(idx);
    wrap.appendChild(div);
  });

  selectedIdx = -1;
  const btn = document.getElementById('btnNext');
  btn.classList.add('disabled');
  btn.textContent = currentIndex === QUESTIONS.length - 1 ? '查看结果' : '下一题';
}

function selectOption(idx) {
  selectedIdx = idx;
  document.querySelectorAll('.option-item').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
  });
  document.getElementById('btnNext').classList.remove('disabled');
}

function nextQuestion() {
  if (selectedIdx === -1) return;
  totalScore += QUESTIONS[currentIndex].options[selectedIdx].score;
  currentIndex++;
  if (currentIndex >= QUESTIONS.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

// ===== 结果 =====
function getLevel(score) {
  for (const lvl of LEVELS) {
    if (score >= lvl.range[0] && score <= lvl.range[1]) return lvl;
  }
  return LEVELS[LEVELS.length - 1];
}

function showResult() {
  currentLevel = getLevel(totalScore);
  const lvl = currentLevel;
  document.getElementById('resBadge').textContent = lvl.badge;
  document.getElementById('resTitle').textContent = lvl.title;
  document.getElementById('resSubtitle').textContent = lvl.subtitle;
  document.getElementById('resPercent').textContent = lvl.percentage;
  document.getElementById('resMainText').textContent = lvl.mainText;
  document.getElementById('resRoast').textContent = '「' + lvl.roast + '」';
  document.getElementById('resTip').textContent = lvl.tip;
  showPage('page-result');
}

function retake() {
  startQuiz();
}

function followCTA() {
  alert('长按识别下方二维码关注公众号\n解锁「老中人等级考试」「春节生存测试」等更多测试');
}

// ===== 海报 =====
function generatePoster() {
  const canvas = document.getElementById('posterCanvas');
  const ctx = canvas.getContext('2d');
  const W = 750, H = 1200;
  canvas.width = W;
  canvas.height = H;
  const lvl = currentLevel;

  // 背景
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#CC0000');
  grad.addColorStop(1, '#6B0000');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // 金色装饰线
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(40, 60, W - 80, 3);
  ctx.fillRect(40, H - 60, W - 80, 3);

  // 顶部标题
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CHINESE LEVEL 检 测 报 告', W / 2, 120);

  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '16px sans-serif';
  ctx.fillText('CULTURAL DNA DETECTION REPORT', W / 2, 155);

  // 百分比
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 130px sans-serif';
  ctx.fillText(lvl.percentage, W / 2, 330);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '18px sans-serif';
  ctx.fillText('Chinese Level', W / 2, 370);

  // 等级
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 42px sans-serif';
  ctx.fillText(lvl.badge + ' ' + lvl.title, W / 2, 440);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '18px sans-serif';
  ctx.fillText(lvl.subtitle, W / 2, 475);

  // 主文案
  ctx.fillStyle = '#FFF';
  ctx.font = '22px sans-serif';
  ctx.textAlign = 'left';
  const lines = lvl.mainText.split('\n');
  let y = 540;
  lines.forEach(line => { ctx.fillText(line, 80, y); y += 38; });

  // Roast
  y += 24;
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('「' + lvl.roast + '」', W / 2, y);

  // Tip
  y += 50;
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = 'italic 16px sans-serif';
  ctx.fillText(lvl.tip, W / 2, y);

  // 底部
  ctx.fillStyle = '#FFD700';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🇨🇳 Chinese Level 检测', 80, H - 130);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '14px sans-serif';
  ctx.fillText('长按识别 · 测测你有多 Chinese', 80, H - 100);

  // 二维码占位
  ctx.strokeStyle = 'rgba(255,215,0,0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(W - 180, H - 180, 110, 110);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('你的二维码', W - 125, H - 120);

  // 免责
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('本测试纯属娱乐 · 与国籍民族身份认同无关', W / 2, H - 25);

  showPage('page-poster');
}

function savePoster() {
  const canvas = document.getElementById('posterCanvas');
  const link = document.createElement('a');
  link.download = 'chinese-level-' + (currentLevel ? currentLevel.id : 'result') + '.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
