/* paper-mgmt.js — 试卷管理（仅支持固定题目 / 随机抽题） */

// ===== Mock Data =====
const papers = [
  { id:1, name:'图书馆知识竞赛试卷', mode:'固定题目', parentMode:'exam', scope:'考试活动', referenced:true, count:50, total:100, pass:60, creator:'管理员', date:'2026-05-01', status:'启用', desc:'图书馆基础知识竞赛专用试卷',
    sections:[
      { title:'一、单选题', type:'单选题', questions:[
        { id:1, content:'《四库全书》是哪个皇帝下令编纂的？', score:10 },
        { id:2, content:'世界上现存最早的有确切日期的雕版印刷品是？', score:10 }
      ]},
      { title:'二、多选题', type:'多选题', questions:[
        { id:3, content:'以下哪些属于非物质文化遗产？', score:10 }
      ]}
    ], drawRules:[] },
  { id:2, name:'历史文化知识测试', mode:'随机抽题', randomStrategy:'sameForAll', retakeStrategy:'reuseFirst', parentMode:'exam', scope:'考试活动', count:30, total:100, pass:60, creator:'管理员', date:'2026-05-03', status:'启用', desc:'历史文化随机组卷',
    sections:[], drawRules:[
      { source:'我的题库', bank:'历史文化题库', type:'单选题', count:15, score:2 },
      { source:'我的题库', bank:'历史文化题库', type:'多选题', count:10, score:4 },
      { source:'我的题库', bank:'非遗知识题库', type:'判断题', count:5, score:6 }
    ]},
  { id:3, name:'阅读素养测评', mode:'固定题目', parentMode:'exam', scope:'考试活动', count:40, total:100, pass:60, creator:'管理员', date:'2026-05-05', status:'启用', desc:'阅读素养综合测评',
    sections:[{ title:'一、单选题', type:'单选题', questions:[{ id:1, content:'阅读理解能力测试题目', score:2.5 }]}], drawRules:[] },
  { id:4, name:'安全知识测试', mode:'随机抽题', randomStrategy:'differentPerUser', retakeStrategy:'newRandom', parentMode:'exam', scope:'考试活动', count:25, total:100, pass:60, creator:'管理员', date:'2026-05-08', status:'启用', desc:'安全知识随机抽题',
    sections:[], drawRules:[
      { source:'我的题库', bank:'安全知识题库', type:'单选题', count:15, score:4 },
      { source:'我的题库', bank:'安全知识题库', type:'判断题', count:10, score:4 }
    ]}
];

// Paper form state
let pfMode = '固定题目';
let pfSections = [];
let pfDrawRules = [];
let pfEditingId = null;
let pfRandomStrategy = 'differentPerUser';
let pfRetakeStrategy = 'reuseFirst';
let pfTotalScore = 100;
let pfNameDraft = '';
let pfDescDraft = '';
let pfPassDraft = 60;

const PAPER_DRAW_RULE_BANKS = [
  { source: '我的题库', bank: '图书馆知识题库' },
  { source: '我的题库', bank: '历史文化题库' },
  { source: '我的题库', bank: '非遗知识题库' },
  { source: '我的题库', bank: '安全知识题库' }
];

const PAPER_SECTION_ORDINALS = ['第一', '第二', '第三', '第四', '第五', '第六', '第七', '第八', '第九', '第十'];

function getDefaultSectionTitle(index) {
  return `${PAPER_SECTION_ORDINALS[index] || `第${index + 1}`}大题`;
}

function isDefaultSectionTitle(title) {
  return PAPER_SECTION_ORDINALS.some((_, index) => title === getDefaultSectionTitle(index)) || /^第\d+大题$/.test(title || '');
}

function normalizeDefaultSectionTitles(sections = pfSections) {
  sections.forEach((section, index) => {
    if (!section.title || isDefaultSectionTitle(section.title)) section.title = getDefaultSectionTitle(index);
  });
  return sections;
}

function normalizePaperSectionTitles(sections = []) {
  return sections.map((section, index) => {
    const oldPattern = /^[一二三四五六七八九十]、/.test(section.title || '');
    return {
      ...section,
      title: !section.title || oldPattern ? getDefaultSectionTitle(index) : section.title
    };
  });
}

function getEditingPaper() {
  return pfEditingId ? papers.find(p => p.id === pfEditingId) || null : null;
}

function capturePaperBasicDraft() {
  const nameEl = document.getElementById('pfName');
  const descEl = document.getElementById('pfDesc');
  const passEl = document.getElementById('pfPass');
  if (nameEl) pfNameDraft = nameEl.value;
  if (descEl) pfDescDraft = descEl.value;
  if (passEl) pfPassDraft = Number(passEl.value) || 0;
}

function rerenderPaperEditor({ capture = true } = {}) {
  if (capture) capturePaperBasicDraft();
  const main = document.getElementById('mainContent');
  if (main) main.innerHTML = renderPaperEditor(getEditingPaper());
}

function paperDrawRuleBankValue(rule) {
  return rule.bank;
}

function paperDrawRuleFromBankValue(value) {
  return { source: '我的题库', bank: value || PAPER_DRAW_RULE_BANKS[0].bank };
}

function createPaperDrawRule(overrides = {}, existingRules = pfDrawRules) {
  const usedBanks = new Set(existingRules.map(rule => paperDrawRuleBankValue(rule)));
  const bank = PAPER_DRAW_RULE_BANKS.find(item => !usedBanks.has(paperDrawRuleBankValue(item))) || PAPER_DRAW_RULE_BANKS[0];
  return { source: bank.source, bank: bank.bank, type: '全部题型', count: 10, score: 1, ...overrides };
}

function ensureRandomSection(section, index) {
  return {
    title: section?.title || getDefaultSectionTitle(index),
    type: section?.type || '随机抽题',
    questions: section?.questions || [],
    drawRules: section?.drawRules && section.drawRules.length ? normalizePaperDrawRules(section.drawRules) : [createPaperDrawRule()]
  };
}

function getRandomPaperSections() {
  if (pfSections.length) {
    pfSections = pfSections.map((section, index) => ensureRandomSection(section, index));
  } else {
    pfSections = [{ title: getDefaultSectionTitle(0), type: '随机抽题', questions: [], drawRules: normalizePaperDrawRules(pfDrawRules.length ? pfDrawRules : [createPaperDrawRule()]) }];
  }
  return pfSections;
}

function getAllRandomDrawRules() {
  return getRandomPaperSections().flatMap(section => section.drawRules || []);
}

function calcPaperConfiguredScore() {
  if (pfMode.includes('固定')) {
    return pfSections.reduce((sum, sec) => sum + sec.questions.reduce((s, q) => s + (Number(q.score) || 0), 0), 0);
  }
  return getAllRandomDrawRules().reduce((sum, rule) => sum + (Number(rule.count) || 0) * (Number(rule.score) || 0), 0);
}

function calcPaperQuestionCount() {
  if (pfMode.includes('固定')) {
    return pfSections.reduce((sum, sec) => sum + sec.questions.length, 0);
  }
  return getAllRandomDrawRules().reduce((sum, rule) => sum + (Number(rule.count) || 0), 0);
}

function getPaperScoreValidationState() {
  const target = Number(pfTotalScore) || 0;
  const current = calcPaperConfiguredScore();
  if (!target) return { state: 'missing-total', current, target, diff: 0 };
  if (current < target) return { state: 'under', current, target, diff: target - current };
  if (current > target) return { state: 'over', current, target, diff: current - target };
  return { state: 'ok', current, target, diff: 0 };
}

function renderPaperTotalScoreField(ep) {
  const locked = !!(ep && ep.referenced);
  return `
    <div class="form-group">
      <label><span class="req">*</span> 试卷总分</label>
      <div class="score-total-options ${locked ? 'is-disabled' : ''}" ${locked ? 'title="当前试卷已被活动引用，为保证考试数据一致性，试卷总分不支持修改。"' : ''}>
        ${[100, 120, 150].map(score => `
          <button type="button" class="score-total-option ${Number(pfTotalScore) === score ? 'active' : ''}" ${locked ? 'disabled' : `onclick="setPaperTotalScore(${score})"`}>${score} 分</button>
        `).join('')}
      </div>
      <div class="hint" style="margin-top:8px">试卷被活动引用后，试卷总分不支持修改，请确认后再保存。</div>
      ${locked ? '<div class="hint" style="margin-top:4px;color:var(--warning)">当前试卷已被活动引用，为保证考试数据一致性，试卷总分不支持修改。</div>' : ''}
    </div>`;
}

function renderPaperScoreNotice() {
  const result = getPaperScoreValidationState();
  const cls = result.state === 'ok' ? 'ok' : result.state === 'over' ? 'error' : 'warn';
  const message = result.state === 'ok'
    ? `分值配置正确，当前试卷总分为 ${result.target} 分。`
    : result.state === 'over'
      ? `当前已配置 ${result.current} 分，已超出试卷总分 ${result.diff} 分，请调整题目数量或每题分值。`
      : `当前已配置 ${result.current} 分，还差 ${result.diff} 分，请继续补充题目或调整每题分值。`;
  return `<div class="score-rule-notice ${cls}">
    <div class="score-rule-notice-head"><strong>已配置总分：${result.current} / ${result.target || '-'} 分</strong><span>${result.state === 'ok' ? '校验通过' : '待调整'}</span></div>
    <p>本次试卷总分为 ${result.target || '-'} 分，请确保题目或抽题规则的分值之和等于该总分。</p>
    <p>${message}</p>
  </div>`;
}

function setPaperTotalScore(score) {
  const current = getEditingPaper();
  if (current && current.referenced) return;
  pfTotalScore = Number(score) || 100;
  rerenderPaperEditor();
}

function normalizePaperDrawRules(rules) {
  return rules.map(rule => ({ ...createPaperDrawRule({}), ...rule }));
}

function pmPaperModeBadges(paper) {
  const modeCls = paper.mode.includes('固定') ? 'badge-green' : 'badge-blue';
  return `<span class="badge ${modeCls}">${paper.mode}</span>`;
}

// ===== 试卷列表 =====
registerPage('paper-mgmt', () => renderPaperList());

function renderPaperList() {
  return `
  ${shouldHideSecondaryMenuReturnBar('paper-mgmt') ? '' : `
  <div class="review-crumb-card platform-review-back">
    ${renderSourceBack('paper-mgmt')}
    <span class="review-divider"></span>
    <strong>试卷管理</strong>
  </div>`}
  <div class="card">
    <div style="display:flex;justify-content:space-between;margin-bottom:16px">
      <div>${filterBar([
        { type:'input', placeholder:'试卷名称' },
        { type:'select', options:['全部模式','固定题目','随机抽题'] }
      ])}</div>
      <button class="btn btn-primary" onclick="openPaperEditor()">+ 创建试卷</button>
    </div>
    ${tableWrap(
      ['序号','名称','组卷模式','题目数量','总分','及格分','创建人','创建时间','操作'],
      papers.map((p,i) => `<tr>
        <td>${i+1}</td>
        <td><strong>${p.name}</strong><div style="font-size:11px;color:var(--text-muted);margin-top:2px">${p.desc}</div></td>
        <td>${pmPaperModeBadges(p)}</td>
        <td>${p.count}</td><td><strong>${p.total}</strong></td><td>${p.pass}</td>
        <td>${p.creator}</td><td>${p.date}</td>
        <td>
          <span class="action-link" onclick="openPaperEditor(${p.id})">编辑</span>
          <span class="action-link danger" onclick="deletePaper(${p.id})">删除</span>
        </td></tr>`).join('')
    )}
  </div>
  <div style="text-align:right;color:var(--text-muted);font-size:var(--font-size-xs)">共 ${papers.length} 条记录</div>`;
}

// ===== 创建/编辑 全页面 =====
function openPaperEditor(editId) {
  const ep = editId ? papers.find(p => p.id === editId) : null;
  pfEditingId = editId || null;
  pfMode = ep ? ep.mode : '固定题目';
  pfTotalScore = ep ? (Number(ep.total) || 100) : 100;
  pfNameDraft = ep ? ep.name : '';
  pfDescDraft = ep ? ep.desc : '';
  pfPassDraft = ep ? ep.pass : 60;
  pfRandomStrategy = ep && ep.randomStrategy ? (ep.randomStrategy === 'perAttempt' ? 'differentPerUser' : ep.randomStrategy) : 'differentPerUser';
  pfRetakeStrategy = ep && ep.retakeStrategy ? ep.retakeStrategy : 'reuseFirst';
  const sourceSections = ep && ep.sections && ep.sections.length
    ? JSON.parse(JSON.stringify(ep.sections))
    : [{ title: getDefaultSectionTitle(0), type:'单选题', questions:[] }];
  pfSections = normalizePaperSectionTitles(sourceSections);
  pfDrawRules = ep && ep.drawRules && ep.drawRules.length > 0
    ? normalizePaperDrawRules(JSON.parse(JSON.stringify(ep.drawRules)))
    : [createPaperDrawRule()];
  if (pfMode.includes('随机')) {
    if (ep && ep.sections && ep.sections.length) {
      pfSections = normalizePaperSectionTitles(JSON.parse(JSON.stringify(ep.sections))).map((section, index) => ensureRandomSection(section, index));
    } else {
      pfSections = [{ title: getDefaultSectionTitle(0), type: '随机抽题', questions: [], drawRules: normalizePaperDrawRules(pfDrawRules) }];
    }
  }
  const main = document.getElementById('mainContent');
  main.innerHTML = renderPaperEditor(ep);
  window.scrollTo({ top:0, behavior:'smooth' });
}

function renderPaperEditor(ep) {
  const label = '试卷';
  return `
  <div class="review-crumb-card platform-review-back">
    <span class="action-link muted" onclick="navigateTo('paper-mgmt')">‹ 返回上一级</span>
    <span class="review-divider"></span>
    <strong>试卷管理</strong>
  </div>
  <div class="paper-editor-shell">
    ${renderPaperStructureBoard()}
    <div class="paper-editor-main">
  <!-- Basic Info -->
  <div class="card">
    <div class="section"><div class="section-head"><div class="sec-icon blue">📋</div><div><div class="sec-title">基本信息</div></div></div><div class="section-body">
      <div class="form-group"><label><span class="req">*</span> ${label}名称</label><input class="form-control" id="pfName" placeholder="请输入${label}名称" value="${pfNameDraft}"></div>
      <div class="form-group"><label>${label}说明</label><input class="form-control" id="pfDesc" placeholder="选填" value="${pfDescDraft}"></div>
      ${renderPaperTotalScoreField(ep)}
      <div class="form-group"><label><span class="req">*</span> 及格分数</label><div class="inline-field"><input type="number" id="pfPass" value="${pfPassDraft}" min="0"><span>分</span></div></div>
    </div></div>
  </div>
  <!-- Question Config -->
  ${renderPaperQuestionConfig()}
  <!-- Actions -->
  <div class="card" style="position:sticky;bottom:16px;z-index:50;display:flex;justify-content:flex-end;align-items:center">
    <div class="btn-group">
      <button class="btn btn-primary" onclick="savePaper()">保存</button>
    </div>
  </div>
    </div>
  </div>`;
}

function renderPaperStructureBoard() {
  const fixedMode = pfMode.includes('固定');
  const sections = fixedMode ? pfSections : getRandomPaperSections();
  const qCount = calcPaperQuestionCount();
  const configuredScore = calcPaperConfiguredScore();
  const validation = getPaperScoreValidationState();
  const statusClass = validation.state === 'ok' ? 'ok' : validation.state === 'over' ? 'error' : 'warn';
  const statusText = validation.state === 'ok'
    ? '配置完整'
    : validation.state === 'over'
      ? `超出 ${validation.diff} 分`
      : `还差 ${validation.diff} 分`;
  return `
    <aside class="paper-preview-board" aria-label="试卷结构预览">
      <div class="ppb-head">
        <div>
          <strong>${fixedMode ? '试卷结构预览' : '随机组卷预览'}</strong>
          <span>${sections.length} 个大题 · ${qCount} 题 · ${configuredScore}/${pfTotalScore || '-'} 分</span>
        </div>
        <span class="ppb-mode">${pfMode}</span>
      </div>
      <button type="button" class="ppb-add-section" onclick="${fixedMode ? 'addSection()' : 'addRandomSection()'}">+ 新增大题</button>
      <div class="ppb-section-list">
        ${sections.map((section, si) => fixedMode ? renderFixedPreviewSection(section, si) : renderRandomPreviewSection(section, si)).join('')}
      </div>
      <button type="button" class="ppb-score-btn" onclick="openPaperBatchScoreModal()">
        <span aria-hidden="true">⚙</span>
        批量设置分数
      </button>
      <div class="ppb-check ${statusClass}">
        <div class="ppb-check-head">
          <strong>配置检查</strong>
          <span>${statusText}</span>
        </div>
        <div class="ppb-check-row"><span>试卷总分</span><strong>${pfTotalScore || '-'} 分</strong></div>
        <div class="ppb-check-row"><span>已配置</span><strong>${configuredScore} 分</strong></div>
        <div class="ppb-check-row"><span>${fixedMode ? '题目数量' : '预计题量'}</span><strong>${qCount} 题</strong></div>
      </div>
    </aside>`;
}

function renderFixedPreviewSection(section, si) {
  const questions = section.questions || [];
  const totalScore = questions.reduce((sum, q) => sum + (Number(q.score) || 0), 0);
  return `
    <div class="ppb-section">
      <button type="button" class="ppb-section-title" onclick="scrollToPaperEditorItem('paper-section-${si}')">
        <span>${section.title}</span>
        <em>${questions.length} 题 · 合计 ${totalScore} 分</em>
      </button>
      ${questions.length ? `
        <div class="ppb-question-grid">
          ${questions.map((q, qi) => `
            <button type="button" class="ppb-q-dot ${(Number(q.score) || 0) <= 0 ? 'warn' : ''} ${q.type === '简答题' ? 'manual' : ''}" title="${q.type || '题目'} · ${Number(q.score) || 0} 分" onclick="scrollToPaperEditorItem('paper-q-${si}-${qi}')">
              ${qi + 1}
              ${q.type === '简答题' ? '<small>阅</small>' : ''}
            </button>
          `).join('')}
        </div>
      ` : '<div class="ppb-empty">当前大题暂无题目</div>'}
    </div>`;
}

function renderRandomPreviewSection(section, si) {
  const rules = section.drawRules || [];
  const qCount = rules.reduce((sum, rule) => sum + (Number(rule.count) || 0), 0);
  const totalScore = rules.reduce((sum, rule) => sum + (Number(rule.count) || 0) * (Number(rule.score) || 0), 0);
  const slots = buildRandomPreviewSlots(rules);
  return `
    <div class="ppb-section">
      <button type="button" class="ppb-section-title" onclick="scrollToPaperEditorItem('paper-section-${si}')">
        <span>${section.title}</span>
        <em>${qCount} 题 · 合计 ${totalScore} 分</em>
      </button>
      ${slots.length ? `
        <div class="ppb-question-grid random" aria-label="${section.title}预计题位">
          ${slots.map(slot => `
            <button type="button" class="ppb-q-dot random ${(slot.score <= 0 || slot.ruleCount <= 0) ? 'warn' : ''}" title="随机题位：${slot.type} · ${slot.score} 分，作答时按规则抽取" onclick="scrollToPaperEditorItem('paper-rule-${si}-${slot.ruleIndex}')">
              ${slot.index}
            </button>
          `).join('')}
        </div>
      ` : ''}
      ${rules.length ? '' : '<div class="ppb-empty">当前大题暂无抽题规则</div>'}
    </div>`;
}

function buildRandomPreviewSlots(rules) {
  const slots = [];
  (rules || []).forEach((rule, ruleIndex) => {
    const count = Math.max(0, Number(rule.count) || 0);
    const score = Number(rule.score) || 0;
    for (let i = 0; i < count; i += 1) {
      slots.push({
        index: slots.length + 1,
        ruleIndex,
        ruleCount: count,
        score,
        type: rule.type || '全部题型'
      });
    }
  });
  return slots;
}

function scrollToPaperEditorItem(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.classList.add('paper-editor-flash');
  setTimeout(() => el.classList.remove('paper-editor-flash'), 900);
}

function openPaperBatchScoreModal() {
  const fixedMode = pfMode.includes('固定');
  const sections = fixedMode ? pfSections : getRandomPaperSections();
  const sectionOptions = sections.map((section, si) => `<option value="${si}">${section.title}</option>`).join('');
  openModal('批量设置分数', `
    <div class="form-group">
      <label>应用范围</label>
      <select class="form-control" id="paperBatchScope">
        <option value="all">整张试卷</option>
        ${sectionOptions}
      </select>
    </div>
    <div class="form-group">
      <label>每题分值</label>
      <input class="form-control" id="paperBatchScore" type="number" min="0.5" step="0.5" value="1">
    </div>
    ${fixedMode ? `
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-secondary)">
        <input id="paperBatchOnlyUnset" type="checkbox">
        仅设置未配置分数的题目
      </label>
    ` : '<div class="hint">随机抽题模式会批量修改所选范围内每条抽题规则的“每题分值”。</div>'}
  `, () => {
    const scope = document.getElementById('paperBatchScope')?.value || 'all';
    const score = Math.max(0.5, Number(document.getElementById('paperBatchScore')?.value) || 1);
    const onlyUnset = !!document.getElementById('paperBatchOnlyUnset')?.checked;
    const targetIndexes = scope === 'all' ? sections.map((_, i) => i) : [Number(scope)];
    targetIndexes.forEach(si => {
      const section = sections[si];
      if (!section) return;
      if (fixedMode) {
        (section.questions || []).forEach(q => {
          if (!onlyUnset || !Number(q.score)) q.score = score;
        });
      } else {
        (section.drawRules || []).forEach(rule => { rule.score = score; });
      }
    });
    rerenderPaperEditor();
  }, { confirmText: '应用' });
}

function renderSubModeCard(mode, selected) {
  const isFixed = mode.includes('固定');
  return `<div class="mode-card${selected ? ' selected' : ''}" onclick="switchSubMode('${mode}')">
    <div class="mode-tag">${isFixed ? '手动组卷' : '随机抽题'}</div>
    <div class="mode-icon">${isFixed ? '📝' : '🎲'}</div>
    <div class="mode-title">${mode}</div>
    <div class="mode-desc">${isFixed ? '逐题添加并设置分值，适合题目完全确定的考试' : '按题库和题型配置抽题规则，适合题量大或需要随机化的考试'}</div>
  </div>`;
}

function switchSubMode(mode) {
  pfMode = mode;
  if (mode.includes('固定')) { if (pfSections.length === 0) pfSections = [{ title: getDefaultSectionTitle(0), type:'单选题', questions:[] }]; }
  else {
    const sourceRules = getAllRandomDrawRules();
    pfSections = pfSections.length
      ? pfSections.map((section, index) => ensureRandomSection(section, index))
      : [{ title: getDefaultSectionTitle(0), type: '随机抽题', questions: [], drawRules: normalizePaperDrawRules(sourceRules.length ? sourceRules : [createPaperDrawRule()]) }];
  }
  rerenderPaperEditor();
}

// ===== 题目配置（组卷方式 + 固定/随机配置）=====
function renderPaperQuestionConfig() {
  const label = '试卷';
  const fixedMode = pfMode.includes('固定');
  return `<div class="card">
    <div class="section"><div class="section-head"><div class="sec-icon green">📝</div><div><div class="sec-title">${label}题目管理</div><div class="sec-subtitle">选择组卷方式，并配置题目、抽题规则与分值</div></div></div><div class="section-body">
      <div class="paper-mode-config">
        <div class="paper-mode-config-head">
          <strong>组卷方式</strong>
          <span>固定题目用于逐题编排，随机抽题用于按规则抽题。切换后下方展示对应配置项。</span>
        </div>
        <div class="paper-mode-grid">
          ${['固定题目','随机抽题'].map(m => renderSubModeCard(m, pfMode === m)).join('')}
        </div>
      </div>
      ${fixedMode ? renderPaperFixedQuestionConfig() : renderPaperRandomQuestionConfig()}
    </div></div>
  </div>`;
}

// ===== 固定配置（大题+题目管理）=====
function renderPaperFixedQuestionConfig() {
  return `
    <div class="info-box blue">💡 当前为固定题目：请逐题选择题目并设置分值。可按大题分组管理，每个大题可设置题型和分值。</div>
    ${pfSections.map((sec, si) => renderSectionBlock(sec, si)).join('')}
    <button class="btn btn-outline" style="margin-top:14px" onclick="addSection()">+ 添加大题</button>`;
}

function renderSectionBlock(sec, si) {
  const qCount = sec.questions.length;
  const totalScore = sec.questions.reduce((s, q) => s + (q.score || 0), 0);
  return `<div id="paper-section-${si}" class="paper-section-card" ondragover="dragOverSection(event,${si})" ondragleave="dragLeaveSection(event)" ondrop="dropSection(event,${si})">
    <div class="paper-section-head">
      <div class="paper-section-title-wrap">
        <span class="paper-section-drag-handle" draggable="true" ondragstart="startDragSection(event,${si})" ondragend="endDragSection(event)" title="拖拽调整大题顺序" aria-label="拖拽调整大题顺序">⋮⋮</span>
        <span class="paper-section-title">${sec.title}</span>
        <span style="font-size:var(--font-size-xs);color:var(--text-muted)">(${qCount}题 / ${totalScore}分)</span>
      </div>
      <div style="display:flex;gap:8px">
        <span class="action-link" onclick="addQToSection(${si})">添加题目</span>
        <span class="action-link" onclick="editSection(${si})">修改名称</span>
        ${pfSections.length > 1 ? `<span class="action-link danger" onclick="delSection(${si})">删除</span>` : ''}
      </div>
    </div>
    <div style="padding:var(--spacing-md) var(--spacing-lg)">
      ${qCount > 0 ? sec.questions.map((q, qi) => `
        <div id="paper-q-${si}-${qi}" class="paper-question-row" ondragover="dragOverQ(event,${si},${qi})" ondragleave="dragLeaveQ(event)" ondrop="dropQ(event,${si},${qi})">
          <div style="display:flex;align-items:center;gap:var(--spacing-xs);flex:1;min-width:0">
            <span class="paper-question-drag-handle" draggable="true" ondragstart="startDragQ(event,${si},${qi})" ondragend="endDragQ(event)" title="拖拽调整题目顺序" aria-label="拖拽调整题目顺序">⋮⋮</span>
            <span style="color:var(--text-muted);font-size:var(--font-size-xs);flex-shrink:0">${qi+1}.</span>
            <span class="badge ${questionTypeBadgeClass(q.type || sec.type)}" style="flex-shrink:0">${q.type || sec.type}</span>
            <span style="font-size:var(--font-size-xs);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${q.content}</span>
          </div>
          <div style="display:flex;align-items:center;gap:var(--spacing-xs);flex-shrink:0;margin-left:var(--spacing-md)">
            <input type="number" value="${q.score}" style="width:56px;padding:4px 6px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:var(--font-size-xs);text-align:center" onchange="updateQScore(${si},${qi},parseFloat(this.value))">
            <span style="font-size:var(--font-size-xs);color:var(--text-muted)">分</span>
            <span class="action-link danger" style="font-size:var(--font-size-xs)" onclick="delQ(${si},${qi})">移除</span>
          </div>
        </div>`).join('')
        : '<div style="padding:var(--spacing-lg);text-align:center;color:var(--text-muted);font-size:var(--font-size-xs)">暂未选择题目，点击「添加题目」从题库选题</div>'}
    </div>
  </div>`;
}

let pfDraggingQuestion = null;
let pfDraggingSection = null;

function getPaperSectionCard(el) {
  return el && el.closest ? el.closest('.paper-section-card') : null;
}

function startDragSection(event, si) {
  pfDraggingSection = { si };
  const card = getPaperSectionCard(event.currentTarget);
  if (card) card.classList.add('is-dragging');
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', `section:${si}`);
  }
}

function dragOverSection(event, si) {
  if (!pfDraggingSection || pfDraggingSection.si === si) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  const card = getPaperSectionCard(event.currentTarget);
  if (!card) return;
  card.classList.remove('drop-before', 'drop-after');
  const rect = card.getBoundingClientRect();
  const isAfter = event.clientY > rect.top + rect.height / 2;
  card.classList.add(isAfter ? 'drop-after' : 'drop-before');
}

function dragLeaveSection(event) {
  const card = getPaperSectionCard(event.currentTarget);
  if (card) card.classList.remove('drop-before', 'drop-after');
}

function dropSection(event, si) {
  if (!pfDraggingSection) return;
  event.preventDefault();
  const card = getPaperSectionCard(event.currentTarget);
  const drag = pfDraggingSection;
  if (card) card.classList.remove('drop-before', 'drop-after');
  if (drag.si === si || !pfSections[drag.si] || !pfSections[si]) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const insertAfter = event.clientY > rect.top + rect.height / 2;
  const [moved] = pfSections.splice(drag.si, 1);
  let targetIndex = si;
  if (drag.si < si) targetIndex -= 1;
  if (insertAfter) targetIndex += 1;
  pfSections.splice(Math.max(0, Math.min(targetIndex, pfSections.length)), 0, moved);
  normalizeDefaultSectionTitles();
  pfDraggingSection = null;
  rerenderPaperEditor();
}

function endDragSection(event) {
  const card = getPaperSectionCard(event.currentTarget);
  if (card) card.classList.remove('is-dragging', 'drop-before', 'drop-after');
  document.querySelectorAll('.paper-section-card.drop-before, .paper-section-card.drop-after, .paper-section-card.is-dragging')
    .forEach(item => item.classList.remove('drop-before', 'drop-after', 'is-dragging'));
  pfDraggingSection = null;
}

function getPaperQuestionRow(el) {
  return el && el.closest ? el.closest('.paper-question-row') : null;
}

function startDragQ(event, si, qi) {
  pfDraggingQuestion = { si, qi };
  const row = getPaperQuestionRow(event.currentTarget);
  if (row) row.classList.add('is-dragging');
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', `${si}:${qi}`);
  }
}

function dragOverQ(event, si, qi) {
  if (!pfDraggingQuestion || pfDraggingQuestion.si !== si || pfDraggingQuestion.qi === qi) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  const row = getPaperQuestionRow(event.currentTarget);
  if (!row) return;
  row.classList.remove('drop-before', 'drop-after');
  const rect = row.getBoundingClientRect();
  const isAfter = event.clientY > rect.top + rect.height / 2;
  row.classList.add(isAfter ? 'drop-after' : 'drop-before');
}

function dragLeaveQ(event) {
  const row = getPaperQuestionRow(event.currentTarget);
  if (row) row.classList.remove('drop-before', 'drop-after');
}

function dropQ(event, si, qi) {
  event.preventDefault();
  const row = getPaperQuestionRow(event.currentTarget);
  const drag = pfDraggingQuestion;
  if (row) row.classList.remove('drop-before', 'drop-after');
  if (!drag || drag.si !== si || drag.qi === qi) return;
  const questions = pfSections[si] && pfSections[si].questions;
  if (!questions || !questions[drag.qi] || !questions[qi]) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const insertAfter = event.clientY > rect.top + rect.height / 2;
  const [moved] = questions.splice(drag.qi, 1);
  let targetIndex = qi;
  if (drag.qi < qi) targetIndex -= 1;
  if (insertAfter) targetIndex += 1;
  questions.splice(Math.max(0, Math.min(targetIndex, questions.length)), 0, moved);
  pfDraggingQuestion = null;
  rerenderPaperEditor();
}

function endDragQ(event) {
  const row = getPaperQuestionRow(event.currentTarget);
  if (row) row.classList.remove('is-dragging', 'drop-before', 'drop-after');
  document.querySelectorAll('.paper-question-row.drop-before, .paper-question-row.drop-after, .paper-question-row.is-dragging')
    .forEach(item => item.classList.remove('drop-before', 'drop-after', 'is-dragging'));
  pfDraggingQuestion = null;
}

function addSection() {
  const types = SYSTEM_QUESTION_TYPE_LABELS;
  const num = pfSections.length + 1;
  pfSections.push({ title: getDefaultSectionTitle(num - 1), type:types[pfSections.length%types.length], questions:[] });
  rerenderPaperEditor();
}
function delSection(si) { pfSections.splice(si, 1); normalizeDefaultSectionTitles(); rerenderPaperEditor(); }
function editSection(si) {
  const s = pfSections[si];
  openModal('修改名称', `
    <div class="form-group"><label>大题名称</label><input class="form-control" id="secTitle" value="${s.title}" placeholder="${getDefaultSectionTitle(si)}"></div>
  `, () => {
    const title = document.getElementById('secTitle').value.trim();
    s.title = title || getDefaultSectionTitle(si);
    rerenderPaperEditor();
  }, { confirmText:'保存' });
}
function addQToSection(si) {
  const questionPool = [
    { id: 'pool-001', content:'《四库全书》是哪个皇帝下令编纂的？', type:'单选题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-002', content:'世界上现存最早的有确切日期的雕版印刷品是？', type:'单选题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-003', content:'以下哪些属于非物质文化遗产？', type:'多选题', bank:'历史文化题库', status:'启用' },
    { id: 'pool-004', content:'《四库全书》是清代乾隆年间编纂的。', type:'判断题', bank:'历史文化题库', status:'启用' },
    { id: 'pool-005', content:'中国最早的公共图书馆建于哪个城市？', type:'单选题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-006', content:'ISBN是国际标准书号的简称。', type:'判断题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-007', content:'图书馆的四大基本职能包括？', type:'多选题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-008', content:'中国图书馆分类法简称____。', type:'填空题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-009', content:'请简述公共图书馆在全民阅读推广中的主要作用。', type:'简答题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-010', content:'请按图书借阅流程排序。', type:'排序题', bank:'图书馆知识题库', status:'启用' },
    { id: 'pool-011', content:'已停用的旧版阅读规则题目', type:'单选题', bank:'图书馆知识题库', status:'停用' }
  ];
  const enabledQuestions = questionPool.filter(q => q.status === '启用');
  openModal('从题库选择题目', `
    <div class="filter-bar" style="margin-bottom:12px">
      <select><option>全部题库</option><option>图书馆知识题库</option><option>历史文化题库</option><option>非遗知识题库</option></select>
      <select>${questionTypeOptions('全部题型', true)}</select>
      <input placeholder="搜索题目">
    </div>
    <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px">仅展示启用状态的题目，停用题目不会出现在待选列表中。</div>
    <div id="paperQuestionSelectHint" style="font-size:12px;color:var(--primary);font-weight:600;margin-bottom:8px">已选择 0 道题</div>
    <div style="max-height:300px;overflow-y:auto">
      ${enabledQuestions.map(q => `<label style="display:flex;align-items:center;gap:10px;padding:10px;border-bottom:1px solid var(--border-light);cursor:pointer">
        <input type="checkbox" class="paper-question-pick" value="${q.id}" onchange="updatePaperQuestionPickHint()" style="accent-color:var(--primary)">
        <span class="badge ${questionTypeBadgeClass(q.type)}" style="flex-shrink:0">${q.type}</span>
        <span style="font-size:var(--font-size-xs);flex:1">${q.content}</span>
        <span style="font-size:11px;color:var(--text-muted)">${q.bank}</span>
      </label>`).join('')}
    </div>
  `, () => {
    const selectedIds = Array.from(document.querySelectorAll('.paper-question-pick:checked')).map(input => input.value);
    if (!selectedIds.length) {
      const hint = document.getElementById('paperQuestionSelectHint');
      if (hint) {
        hint.textContent = '请至少选择 1 道题后再确认';
        hint.style.color = 'var(--danger)';
      }
      return false;
    }
    const selectedQuestions = enabledQuestions.filter(q => selectedIds.includes(q.id));
    const base = Date.now();
    selectedQuestions.forEach((q, index) => {
      pfSections[si].questions.push({ id: base + index, sourceId: q.id, content: q.content, type: q.type, bank: q.bank, score: 10 });
    });
    rerenderPaperEditor();
  }, { confirmText:'确认选择' });
}

function updatePaperQuestionPickHint() {
  const count = document.querySelectorAll('.paper-question-pick:checked').length;
  const hint = document.getElementById('paperQuestionSelectHint');
  if (!hint) return;
  hint.textContent = `已选择 ${count} 道题`;
  hint.style.color = count ? 'var(--primary)' : 'var(--text-muted)';
}
function delQ(si, qi) { pfSections[si].questions.splice(qi, 1); rerenderPaperEditor(); }
function updateQScore(si, qi, v) {
  if (pfSections[si] && pfSections[si].questions[qi]) pfSections[si].questions[qi].score = v || 0;
  rerenderPaperEditor();
}

// ===== 随机配置（抽题规则+配比UI）=====
function renderPaperRandomQuestionConfig() {
  const sections = getRandomPaperSections();
  return `
      <div class="paper-question-subhead">
        <div>
          <strong>随机大题配置</strong>
          <span>先添加大题，再为每个大题配置题库、题型、数量、分值等随机抽题规则。</span>
        </div>
      </div>
      <div class="info-box green">🎯 当前为随机抽题：${`系统按「${pfRandomStrategy === 'sameForAll' ? '每人试卷相同' : '每人试卷不同'}」生成题目`}，配比实时计算。</div>
      ${sections.map((section, si) => renderRandomSectionBlock(section, si)).join('')}
      <button class="btn btn-outline" style="margin-top:14px" onclick="addRandomSection()">+ 添加大题</button>
    `;
}

function renderRandomSectionBlock(section, si) {
  const rules = section.drawRules || [];
  const qCount = rules.reduce((sum, rule) => sum + (Number(rule.count) || 0), 0);
  const totalScore = rules.reduce((sum, rule) => sum + (Number(rule.count) || 0) * (Number(rule.score) || 0), 0);
  return `<div id="paper-section-${si}" class="paper-section-card" ondragover="dragOverSection(event,${si})" ondragleave="dragLeaveSection(event)" ondrop="dropSection(event,${si})">
    <div class="paper-section-head">
      <div class="paper-section-title-wrap">
        <span class="paper-section-drag-handle" draggable="true" ondragstart="startDragSection(event,${si})" ondragend="endDragSection(event)" title="拖拽调整大题顺序" aria-label="拖拽调整大题顺序">⋮⋮</span>
        <span class="paper-section-title">${section.title}</span>
        <span style="font-size:var(--font-size-xs);color:var(--text-muted)">(${qCount}题 / ${totalScore}分)</span>
      </div>
      <div style="display:flex;gap:8px">
        <span class="action-link" onclick="addDrawRule(${si})">添加规则</span>
        <span class="action-link" onclick="editSection(${si})">修改名称</span>
        ${pfSections.length > 1 ? `<span class="action-link danger" onclick="delSection(${si})">删除</span>` : ''}
      </div>
    </div>
    <div style="padding:var(--spacing-md) var(--spacing-lg)">
      ${renderRandomRulesTable(section, si)}
    </div>
  </div>`;
}

function renderRandomRulesTable(section, si) {
  const rules = section.drawRules || [];
  return `<div style="overflow-x:auto;margin-bottom:8px">
    <table style="width:100%;font-size:13px;border-collapse:collapse">
      <thead><tr>
        <th style="padding:8px 10px;text-align:left;font-size:11px;color:var(--text-muted);border-bottom:2px solid var(--border)">题库</th>
        <th style="padding:8px 10px;text-align:left;font-size:11px;color:var(--text-muted);border-bottom:2px solid var(--border)">题型</th>
        <th style="padding:8px 10px;text-align:center;font-size:11px;color:var(--text-muted);border-bottom:2px solid var(--border)">数量</th>
        <th style="padding:8px 10px;text-align:center;font-size:11px;color:var(--text-muted);border-bottom:2px solid var(--border)">分值</th>
        <th style="padding:8px 10px;text-align:center;font-size:11px;color:var(--text-muted);border-bottom:2px solid var(--border)">小计</th>
        <th style="padding:8px 10px;text-align:center;font-size:11px;color:var(--text-muted);border-bottom:2px solid var(--border)">操作</th>
      </tr></thead>
      <tbody>${rules.map((r, ri) => `<tr id="paper-rule-${si}-${ri}">
        <td style="padding:8px 6px"><select onchange="updateRuleBank(${si},${ri},this.value)" style="width:100%;padding:5px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px">${PAPER_DRAW_RULE_BANKS.map(b => `<option value="${b.bank}" ${paperDrawRuleBankValue(r)===paperDrawRuleBankValue(b)?'selected':''}>${b.bank}</option>`).join('')}</select></td>
        <td style="padding:8px 6px"><select onchange="updateRule(${si},${ri},'type',this.value)" style="width:100%;padding:5px 8px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px">${examQuestionTypeOptions(r.type || '全部题型')}</select></td>
        <td style="padding:8px 6px"><input type="number" value="${r.count}" min="1" style="width:60px;margin:0 auto;display:block;padding:5px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="updateRule(${si},${ri},'count',parseInt(this.value))"></td>
        <td style="padding:8px 6px"><input type="number" value="${r.score}" min="1" style="width:60px;margin:0 auto;display:block;padding:5px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:12px;text-align:center" onchange="updateRule(${si},${ri},'score',parseInt(this.value))"></td>
        <td style="padding:8px 6px;text-align:center;font-weight:700;color:var(--primary);font-size:13px">${r.count * r.score}分</td>
        <td style="padding:8px 6px;text-align:center">${rules.length > 1 ? `<span class="action-link danger" onclick="removeDrawRule(${si},${ri})">删除</span>` : '<span style="color:var(--text-muted);font-size:11px">—</span>'}</td>
      </tr>`).join('')}</tbody>
    </table>
  </div>`;
}

function renderRatioBar() {
  const total = pfDrawRules.reduce((s, r) => s + r.count, 0);
  if (total === 0) return '';
  const colors = ['#4A6CF7','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#F97316'];
  let html = '<div style="display:flex;height:8px;border-radius:4px;overflow:hidden;margin-bottom:8px">';
  pfDrawRules.forEach((r, i) => {
    const pct = (r.count / total * 100).toFixed(1);
    html += `<div style="width:${pct}%;background:${colors[i % colors.length]}" title="${r.type}: ${pct}%"></div>`;
  });
  html += '</div><div style="display:flex;flex-wrap:wrap;gap:10px;font-size:11px">';
  pfDrawRules.forEach((r, i) => {
    const pct = (r.count / total * 100).toFixed(1);
    html += `<span style="display:flex;align-items:center;gap:4px"><span style="width:10px;height:10px;border-radius:2px;background:${colors[i % colors.length]};display:inline-block"></span>${r.type}: ${pct}%</span>`;
  });
  html += '</div>';
  return html;
}

function updateRule(si, ri, field, value) {
  const rule = getRandomPaperSections()[si]?.drawRules?.[ri];
  if (rule) {
    rule[field] = (field === 'count' || field === 'score')
      ? Math.max(field === 'count' ? 1 : 0.5, Number(value) || (field === 'count' ? 1 : 0.5))
      : value;
  }
  rerenderPaperEditor();
}

function updateRuleBank(si, ri, value) {
  const rule = getRandomPaperSections()[si]?.drawRules?.[ri];
  if (rule) Object.assign(rule, paperDrawRuleFromBankValue(value));
  rerenderPaperEditor();
}

function setPaperRandomStrategy(strategy) {
  pfRandomStrategy = strategy;
  rerenderPaperEditor();
}

function setPaperRetakeStrategy(strategy) {
  pfRetakeStrategy = strategy;
  rerenderPaperEditor();
}

function addDrawRule(si) {
  const section = getRandomPaperSections()[si];
  if (!section) return;
  section.drawRules.push(createPaperDrawRule({}, section.drawRules));
  rerenderPaperEditor();
}

function removeDrawRule(si, ri) {
  const rules = getRandomPaperSections()[si]?.drawRules;
  if (!rules || rules.length <= 1) return;
  rules.splice(ri, 1);
  rerenderPaperEditor();
}

function addRandomSection() {
  pfSections.push({ title: getDefaultSectionTitle(pfSections.length), type: '随机抽题', questions: [], drawRules: [createPaperDrawRule()] });
  normalizeDefaultSectionTitles();
  rerenderPaperEditor();
}

// ===== Save Paper =====
function savePaper() {
  const name = document.getElementById('pfName')?.value.trim();
  if (!name) { alert('请填写试卷名称'); return; }
  const pass = parseInt(document.getElementById('pfPass')?.value) || 60;
  const desc = document.getElementById('pfDesc')?.value.trim() || '';
  const isFixed = pfMode.includes('固定');
  const count = calcPaperQuestionCount();
  const total = Number(pfTotalScore) || 0;
  const scoreState = getPaperScoreValidationState();
  if (!total) { alert('请先选择试卷总分。'); return; }
  if (scoreState.current === 0) { alert(isFixed ? '请先添加题目并设置分值。' : '请先配置抽题规则。'); return; }
  if (scoreState.state === 'under') { alert(`当前题目总分不足，已配置 ${scoreState.current} 分，还差 ${scoreState.diff} 分，请调整后再继续。`); return; }
  if (scoreState.state === 'over') { alert(`当前题目总分超出，已配置 ${scoreState.current} 分，超出 ${scoreState.diff} 分，请调整后再继续。`); return; }
  if (pass > total) { alert('及格分数不能大于试卷总分。'); return; }

  if (pfEditingId) {
    const p = papers.find(x => x.id === pfEditingId);
    if (p) {
      p.name = name; p.desc = desc; p.pass = pass; p.mode = pfMode; p.parentMode = 'exam';
      p.randomStrategy = isFixed ? undefined : pfRandomStrategy;
      p.retakeStrategy = isFixed ? undefined : pfRetakeStrategy;
      p.count = count; p.total = total;
      if (isFixed) { p.sections = JSON.parse(JSON.stringify(pfSections)); p.drawRules = []; }
      else { p.sections = JSON.parse(JSON.stringify(getRandomPaperSections())); p.drawRules = []; }
    }
  } else {
    papers.push({
      id: papers.length + 1, name, mode: pfMode, randomStrategy: isFixed ? undefined : pfRandomStrategy, retakeStrategy: isFixed ? undefined : pfRetakeStrategy, parentMode: 'exam', count, total, pass,
      creator: '管理员', date: new Date().toISOString().slice(0, 10), status: '启用', scope: '考试活动', desc,
      sections: isFixed ? JSON.parse(JSON.stringify(pfSections)) : JSON.parse(JSON.stringify(getRandomPaperSections())),
      drawRules: []
    });
  }
  navigateTo('paper-mgmt');
}

// ===== Preview Paper =====
function previewPaper(paperId) {
  const paper = papers.find(p => p.id === paperId);
  if (!paper) return;
  const isFixed = paper.mode.includes('固定');

  let bodyHtml = `
    <div style="display:grid;gap:var(--spacing-lg)">
      <div style="display:flex;justify-content:space-between;align-items:center;padding-bottom:var(--spacing-md);border-bottom:1px solid var(--border-light)">
        <div>
          <div style="font-size:var(--font-size-md);font-weight:700;color:var(--text-primary)">${paper.name}</div>
          <div style="font-size:var(--font-size-xs);color:var(--text-muted);margin-top:var(--spacing-xxs)">${paper.desc}</div>
        </div>
        <span>${pmPaperModeBadges(paper)}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:var(--spacing-md)">
        <div style="text-align:center;padding:10px;background:var(--color-neutral-50);border-radius:var(--radius-sm)"><div style="font-size:var(--font-size-xs);color:var(--text-muted)">题目数</div><div style="font-size:var(--font-size-lg);font-weight:700;color:var(--primary)">${paper.count}</div></div>
        <div style="text-align:center;padding:10px;background:var(--color-neutral-50);border-radius:var(--radius-sm)"><div style="font-size:var(--font-size-xs);color:var(--text-muted)">总分</div><div style="font-size:var(--font-size-lg);font-weight:700;color:var(--success)">${paper.total}</div></div>
        <div style="text-align:center;padding:10px;background:var(--color-neutral-50);border-radius:var(--radius-sm)"><div style="font-size:var(--font-size-xs);color:var(--text-muted)">及格分</div><div style="font-size:var(--font-size-lg);font-weight:700;color:var(--warning)">${paper.pass}</div></div>
        <div style="text-align:center;padding:10px;background:var(--color-neutral-50);border-radius:var(--radius-sm)"><div style="font-size:var(--font-size-xs);color:var(--text-muted)">状态</div><div style="font-size:var(--font-size-base);font-weight:600"><span class="badge ${paper.status==='启用'?'badge-green':'badge-gray'}">${paper.status}</span></div></div>
      </div>`;

  if (isFixed && paper.sections && paper.sections.length > 0) {
    paper.sections.forEach(sec => {
      bodyHtml += `<div style="margin-top:var(--spacing-xs)"><div style="font-size:var(--font-size-base);font-weight:700;margin-bottom:var(--spacing-xs)">${sec.title}</div>`;
      sec.questions.forEach((q, qi) => {
        bodyHtml += `<div style="padding:var(--spacing-xs) var(--spacing-md);background:var(--color-neutral-50);border:1px solid var(--border-light);border-radius:var(--radius-sm);margin-bottom:4px;display:flex;justify-content:space-between;align-items:center">
          <div><span style="color:var(--text-muted);margin-right:6px">${qi+1}.</span><span style="font-size:var(--font-size-xs)">${q.content}</span></div>
          <span style="font-weight:600;color:var(--primary)">${q.score}分</span></div>`;
      });
      bodyHtml += '</div>';
    });
  } else {
    const randomSections = paper.sections && paper.sections.length
      ? paper.sections
      : [{ title: getDefaultSectionTitle(0), drawRules: paper.drawRules || [] }];
    randomSections.forEach(section => {
      bodyHtml += `<div style="margin-top:var(--spacing-xs)"><div style="font-size:var(--font-size-base);font-weight:700;margin-bottom:var(--spacing-xs)">${section.title}</div>`;
      (section.drawRules || []).forEach(r => {
        bodyHtml += `<div style="padding:var(--spacing-xs) var(--spacing-md);background:var(--color-neutral-50);border:1px solid var(--border-light);border-radius:var(--radius-sm);margin-bottom:4px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--spacing-xs);font-size:var(--font-size-xs)">
          <div><span style="color:var(--text-muted)">来源：</span>${r.source || '我的题库'}</div>
          <div><span style="color:var(--text-muted)">题库：</span>${r.bank}</div>
          <div><span style="color:var(--text-muted)">题型：</span>${r.type}</div>
          <div><span style="color:var(--text-muted)">数量：</span><strong>${r.count}题</strong></div>
          <div><span style="color:var(--text-muted)">每题：</span><strong>${r.score}分</strong></div>
          <div><span style="color:var(--text-muted)">小计：</span><strong style="color:var(--primary)">${r.count * r.score}分</strong></div>
        </div>`;
      });
      bodyHtml += '</div>';
    });
  }

  bodyHtml += '</div>';
  openModal('试卷预览', bodyHtml, null, { confirmText:'关闭', hideCancel:true });
}

// ===== Copy Paper =====
function copyPaper(paperId) {
  const paper = papers.find(p => p.id === paperId);
  if (!paper) return;
  openModal('复制试卷', `
    <div class="info-box blue">💡 将创建一份副本，名称自动添加「(副本)」后缀。</div>
    <div class="form-group"><label>新名称</label><input class="form-control" id="copyPaperName" value="${paper.name}（副本）"></div>
    <div class="form-group"><label>组卷模式</label><input class="form-control" value="${paper.mode}" disabled></div>
  `, () => {
    const newName = document.getElementById('copyPaperName')?.value.trim() || paper.name + '（副本）';
    papers.push({
      ...paper, id: papers.length + 1, name: newName,
      date: new Date().toISOString().slice(0, 10), status: '停用',
      sections: paper.sections ? JSON.parse(JSON.stringify(paper.sections)) : [],
      drawRules: paper.drawRules ? JSON.parse(JSON.stringify(paper.drawRules)) : []
    });
    navigateTo('paper-mgmt');
  }, { confirmText:'确认复制' });
}

// ===== Delete Paper =====
function deletePaper(paperId) {
  const paper = papers.find(p => p.id === paperId);
  if (!paper) return;
  openModal('删除确认', `<div style="text-align:center;padding:10px 0"><div style="font-size:40px;margin-bottom:12px">⚠️</div><p>确定删除 <strong>${paper.name}</strong> 吗？</p><p style="color:var(--danger);font-size:12px;margin-top:8px">删除后不可恢复！如有活动正在使用，请先修改活动配置。</p></div>`, () => {
    const idx = papers.findIndex(p => p.id === paperId);
    if (idx > -1) papers.splice(idx, 1);
    navigateTo('paper-mgmt');
  }, { confirmText:'确认删除', danger:true });
}

// 分期考卷能力已移除（当前仅支持固定题目 / 随机抽题）
