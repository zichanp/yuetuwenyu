/* workbench.js — 活动管理工作台 (Activity Management Workbench) */

// iOS App Store-style "A" glyph
const APP_ICON_SVG = `
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
    <path d="M30 72 L47 32 C48.5 28.5 51.5 28.5 53 32 L70 72"
          stroke="white" stroke-width="8" stroke-linecap="round" fill="none"/>
    <line x1="38" y1="58" x2="62" y2="58" stroke="white" stroke-width="8" stroke-linecap="round"/>
    <circle cx="30" cy="72" r="4" fill="white"/>
</svg>`;

// Activity-type card definitions (matches screenshot exactly)
const ACTIVITY_TYPES = [
    {
        key: 'collection', title: '征集类', desc: '征文、摄影、书画、视频等作品征集活动',
        color: '#FF9500', created: 15, running: 3, layout: 'grid-2',
        active: '活动列表',
        links: [
            { label: '活动列表', page: 'activity-list' },
            { label: '评选管理' },
            { label: '作品审核' },
            { label: '作品推选' },
            { label: '作品下载' },
            { label: '数据概况' }
        ]
    },
    {
        key: 'task', title: '任务打卡', desc: '每日任务、周期任务、成长打卡活动',
        color: '#2F7CF6', created: 15, running: 3, layout: 'col',
        links: [
            { label: '活动列表', page: 'activity-list' },
            { label: '评分管理' },
            { label: '数据概况' }
        ]
    },
    {
        key: 'quiz', title: '知识问答', desc: '答题竞赛、知识测评、学习闯关活动',
        color: '#34C759', created: 15, running: 3, layout: 'grid-2',
        links: [
            { label: '活动列表', page: 'quiz-activity-list' },
            { label: '题库管理', page: 'question-bank' },
            { label: '试卷管理', page: 'paper-mgmt' },
            { label: '阅卷管理', page: 'paper-review-all' },
            { label: '数据概况' },
            { label: '我的阅卷任务', page: 'paper-review-quick-my-tasks' }
        ]
    },
    {
        key: 'offline', title: '活动报名', desc: '征文、摄影、书画、视频等作品征集活动',
        color: '#FF3B30', created: 15, running: 3, layout: 'col',
        links: [
            { label: '活动列表', page: 'activity-list', params: { activityType: 'offline', activityLabel: '活动报名' } },
            { label: '签到管理' },
            { label: '数据概况' }
        ]
    },
    {
        key: 'vote', title: '投票', desc: '作品投票、人物评选、主题投票活动',
        color: '#00BCD4', created: 15, running: 3, layout: 'col',
        links: [
            { label: '活动列表', page: 'vote-activity-list' },
            { label: '数据概况', page: 'vote-activity-data' }
        ]
    },
    {
        key: 'lang', title: '外语闯关', desc: '语言学习、词汇闯关、阅读训练活动',
        color: '#AF52DE', created: 15, running: 3, layout: 'col',
        links: [
            { label: '活动列表', page: 'activity-list' },
            { label: '数据概况' }
        ]
    },
    {
        key: 'meeting', title: '会议微网站', desc: '会议介绍、议程展示、报名与资料承载',
        color: '#FF9500', created: 15, running: 3, layout: 'grid-2',
        links: [
            { label: '活动列表', page: 'activity-list' },
            { label: '报名管理' },
            { label: '签到管理' },
            { label: '数据概况' }
        ]
    },
    {
        key: 'link', title: '超链接/图文', desc: '专题图文页、链接跳转页、活动说明页',
        color: '#2F7CF6', created: 15, running: 3, layout: 'col',
        links: [
            { label: '内容列表' },
            { label: '数据概况' }
        ]
    }
];

function renderTypeCard(t) {
    const maxPerColumn = 4;
    const columns = Math.max(1, Math.ceil(t.links.length / maxPerColumn));
    const isQuizCard = t.key === 'quiz';
    const actionGridStyle = [
        'display:grid',
        isQuizCard
            ? `grid-template-columns:repeat(${columns},minmax(140px,1fr))`
            : `grid-template-columns:repeat(${columns},minmax(0,1fr))`,
        `grid-template-rows:repeat(${maxPerColumn},auto)`,
        'grid-auto-flow:column',
        'align-content:start',
        isQuizCard ? 'gap:8px 10px' : 'gap:8px 16px',
        'margin-bottom:var(--spacing-sm)',
        'min-height:112px'
    ].filter(Boolean).join(';');
    const linksHtml = t.links.map(l => {
        const isActive = l.label === t.active;
        const onclick = l.page ? `onclick="navigateTo('${l.page}'${l.params ? `, { params: ${JSON.stringify(l.params)} }` : ''})"` : '';
        const style = isActive
            ? `color:var(--primary);font-weight:var(--font-weight-semibold);cursor:pointer;font-size:var(--font-size-sm);display:inline-flex;align-items:center;gap:4px`
            : `color:var(--text-secondary);cursor:pointer;font-size:var(--font-size-sm)`;
        const cursor = isActive ? '<span style="font-size:11px">🖱️</span>' : '';
        return `<span class="wb-link ${isQuizCard ? 'wb-link-quiz' : ''} ${isActive ? 'wb-link-active' : ''}" ${onclick} style="${style}">${l.label}${cursor}</span>`;
    }).join('');

    return `
    <div class="wb-type-card" ${t.key === 'quiz' ? 'data-guide-target="quiz-demo"' : ''}>
        <div style="display:flex;align-items:center;gap:var(--spacing-sm);margin-bottom:var(--spacing-sm)">
            <div style="width:48px;height:48px;border-radius:var(--radius-lg);background:${t.color};display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 4px 10px ${t.color}40">
                ${APP_ICON_SVG}
            </div>
            <div style="min-width:0;flex:1">
                <div style="font-size:var(--font-size-md);font-weight:var(--font-weight-bold);color:var(--text-primary);margin-bottom:var(--spacing-xxs)">${t.title}</div>
                <div style="font-size:var(--font-size-xs);color:var(--text-tertiary);line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${t.desc}</div>
            </div>
        </div>
        <div style="display:flex;gap:var(--spacing-md);margin-bottom:var(--spacing-sm);font-size:var(--font-size-xs)">
            <span style="color:var(--text-tertiary)">已创建 <span style="color:var(--text-primary);font-weight:var(--font-weight-semibold)">${t.created}</span></span>
            <span style="color:var(--text-tertiary)">进行中 <span style="color:var(--success);font-weight:var(--font-weight-semibold)">${t.running}</span></span>
        </div>
        <div style="${actionGridStyle}">
            ${linksHtml}
        </div>
        <div style="border-top:1px dashed var(--border-color-light);padding-top:var(--spacing-sm)">
            <div style="font-size:11px;color:var(--text-tertiary);margin-bottom:var(--spacing-xxs)">最近管理</div>
            <div style="font-size:var(--font-size-xs);color:var(--text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:var(--spacing-xs);overflow:hidden"
                 onclick="navigateTo('activity-manage')">
                <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">第十六届"华政杯"全国法律翻译大赛打卡赛...</span>
                <span style="color:var(--text-tertiary);flex-shrink:0">›</span>
            </div>
        </div>
    </div>`;
}

const RECOMMENDED_ACTIVITIES = [
    { title: '获奖名单+文末福利｜「锦绣华服·智传千年」华服...', type: '作品征集', status: '预告中', statusColor: '#FF9500', action: '组织单位登记', thumb: 'linear-gradient(135deg,#F7E7C8,#FBF5E8 55%,#B8D6C5)' },
    { title: '舍不得的丽江——丽江礼物” 文创大赛', type: '知识问答', status: '预告中', statusColor: '#FF9500', action: '已参与组织', thumb: 'linear-gradient(135deg,#B8E7F5,#EAF9FF 55%,#8CC7E8)' },
    { title: '【第十六届“华政杯”全国法律翻译大赛】打卡赛...', type: '活动报名', status: '进行中', statusColor: '#22C55E', action: '申请被驳回', thumb: 'linear-gradient(135deg,#F97316,#FCA5A5 55%,#FDE68A)' }
];

function renderRecommendItem(item, i) {
    return `
    <div class="wb-rec-item">
        <div class="wb-rec-thumb" style="background:${item.thumb}"></div>
        <div class="wb-rec-main">
            <div class="wb-rec-title-row">
                <div class="wb-rec-title">${item.title}</div>
                <span class="wb-rec-status" style="background:${item.statusColor}">${item.status}</span>
                <button class="wb-icon-btn" title="复制链接">⧉</button>
                <button class="wb-icon-btn" title="二维码">▦</button>
            </div>
            <div class="wb-rec-type">${item.type}</div>
            <div class="wb-rec-meta">
                <span>活动时间：${formatDateTimeRangeSecond('2026-01-03 9:00 至 2026-01-20 12:00')}</span>
                <span>主办单位：阅途文化集团</span>
            </div>
        </div>
        <div class="wb-rec-actions">
            <button class="btn btn-ghost btn-sm">活动页面</button>
            <button class="btn btn-primary btn-sm" style="background:var(--color-gold-500);border-color:var(--color-gold-500)">${item.action}</button>
        </div>
    </div>`;
}

registerPage('workbench', () => {
    return `
    <style>
        .wb-type-card{
            padding: var(--spacing-lg);
            border-radius: 0;
            background: var(--bg-card);
            transition: var(--transition-fast);
            cursor: default;
            border: none;
            box-shadow: none;
        }
        .wb-type-card:hover{
            background: var(--bg-hover);
        }
        .wb-link{
            transition: var(--transition-fast);
        }
        .wb-link:hover{
            color: var(--primary) !important;
        }
        .wb-link-active{
            position: relative;
            font-weight: var(--font-weight-semibold) !important;
        }
        .wb-link-quiz{
            white-space: nowrap;
        }
        .wb-top-grid{
            display:grid;
            grid-template-columns:minmax(280px,360px) minmax(0,1fr);
            gap:var(--spacing-md);
            margin-bottom:var(--spacing-md);
        }
        .wb-profile-card{
            padding:var(--spacing-lg) var(--spacing-xl);
            margin-bottom:0;
        }
        .wb-profile-head{
            display:flex;
            align-items:center;
            gap:var(--spacing-md);
            margin-bottom:var(--spacing-lg);
        }
        .wb-avatar{
            width:72px;
            height:72px;
            border-radius:var(--radius-full);
            background:radial-gradient(circle at 35% 30%,#fff 0 8%,#FACC15 9% 35%,#F97316 36% 70%,#78350F 71%);
            border:3px solid var(--color-neutral-0);
            box-shadow:var(--shadow-sm);
            flex-shrink:0;
        }
        .wb-profile-stat{
            display:flex;
            justify-content:space-between;
            align-items:center;
            font-size:var(--font-size-sm);
            color:var(--text-tertiary);
            margin-bottom:var(--spacing-sm);
        }
        .wb-profile-stat strong{
            font-size:var(--font-size-md);
            color:var(--text-primary);
        }
        .wb-pending-card{
            padding:var(--spacing-lg) var(--spacing-xl);
            margin-bottom:0;
        }
        .wb-pending-grid{
            display:grid;
            grid-template-columns:repeat(3,1fr);
            gap:var(--spacing-xl);
            align-items:center;
            min-height:168px;
        }
        .wb-pending-item{
            text-align:center;
        }
        .wb-pending-label{
            font-size:var(--font-size-sm);
            color:var(--text-secondary);
            margin-bottom:var(--spacing-sm);
        }
        .wb-pending-value{
            font-size:30px;
            font-weight:var(--font-weight-bold);
            color:var(--text-primary);
            margin-bottom:var(--spacing-sm);
        }
        .wb-section-card{
            padding:var(--spacing-lg);
            margin-bottom:var(--spacing-md);
        }
        .wb-type-grid{
            display:grid;
            grid-template-columns:repeat(4,1fr);
            gap:0;
        }
        .wb-rec-head{
            display:flex;
            align-items:center;
            gap:var(--spacing-md);
            margin-bottom:var(--spacing-md);
        }
        .wb-rec-note{
            color:#EF4444;
            font-size:var(--font-size-sm);
            font-weight:var(--font-weight-semibold);
        }
        .wb-rec-item{
            display:grid;
            grid-template-columns:160px minmax(0,1fr) auto;
            gap:var(--spacing-md);
            align-items:center;
            padding:var(--spacing-md);
            border:1px solid var(--border-color-light);
            border-radius:var(--radius-lg);
            margin-bottom:var(--spacing-sm);
        }
        .wb-rec-thumb{
            height:76px;
            border-radius:var(--radius-md);
        }
        .wb-rec-title-row{
            display:flex;
            align-items:center;
            gap:var(--spacing-sm);
            margin-bottom:var(--spacing-xs);
        }
        .wb-rec-title{
            font-size:var(--font-size-md);
            font-weight:var(--font-weight-bold);
            color:var(--text-primary);
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
            max-width:100%;
            min-width:0;
        }
        .wb-rec-status{
            color:#fff;
            border-radius:var(--radius-sm);
            padding:3px 10px;
            font-size:var(--font-size-xs);
            font-weight:var(--font-weight-semibold);
        }
        .wb-icon-btn{
            width:26px;
            height:26px;
            border:none;
            background:transparent;
            color:var(--text-tertiary);
            cursor:pointer;
            border-radius:var(--radius-sm);
        }
        .wb-icon-btn:hover{ background:var(--bg-hover); color:var(--text-primary); }
        .wb-rec-type{
            display:inline-flex;
            border:1px solid var(--color-gold-500);
            color:var(--color-gold-500);
            padding:2px 10px;
            border-radius:var(--radius-sm);
            font-size:var(--font-size-xs);
            margin-bottom:var(--spacing-xs);
        }
        .wb-rec-meta{
            display:flex;
            gap:var(--spacing-lg);
            color:var(--text-tertiary);
            font-size:var(--font-size-xs);
        }
        .wb-rec-actions{
            display:flex;
            gap:var(--spacing-sm);
            white-space:nowrap;
        }
        .wb-rec-thumb,
        .wb-rec-main,
        .wb-rec-title-row,
        .wb-rec-meta,
        .wb-rec-actions{
            min-width:0;
            max-width:100%;
        }
        @media (max-width: 900px){
            .wb-top-grid{
                grid-template-columns:1fr;
            }
            .wb-type-grid{
                grid-template-columns:repeat(2,minmax(0,1fr));
            }
            .wb-rec-item{
                grid-template-columns:128px minmax(0,1fr);
                align-items:start;
            }
            .wb-rec-actions{
                grid-column:1 / -1;
                flex-wrap:wrap;
            }
        }
        @media (max-width: 640px){
            .wb-profile-card,
            .wb-pending-card,
            .wb-section-card{
                padding:var(--spacing-md);
            }
            .wb-pending-grid,
            .wb-type-grid,
            .wb-rec-item{
                grid-template-columns:1fr;
            }
            .wb-rec-thumb{
                width:100%;
                height:120px;
            }
            .wb-rec-main,
            .wb-rec-actions{
                width:100%;
            }
            .wb-rec-title-row,
            .wb-rec-meta{
                flex-wrap:wrap;
            }
        }
    </style>

    <div class="wb-top-grid">
        <div class="card wb-profile-card">
            <div class="wb-profile-head">
                <div class="wb-avatar"></div>
                <div style="font-size:var(--font-size-md);font-weight:var(--font-weight-bold);color:var(--color-gold-600)">平台系统管理员账号</div>
            </div>
            <div class="wb-profile-stat"><span>总活动数量</span><strong>180</strong></div>
            <div class="wb-profile-stat"><span>总参与人数</span><strong>100000</strong></div>
            <div style="display:flex;gap:var(--spacing-xs);margin-top:var(--spacing-md)">
                ${renderGlobalActivityCreateDropdown({ buttonStyle: 'background:var(--color-gold-500);border-color:var(--color-gold-500)' })}
                <button class="btn btn-outline" style="border-color:var(--color-gold-500);color:var(--color-gold-500)">+ 专题活动</button>
            </div>
        </div>
        <div class="card wb-pending-card">
            <div style="font-size:var(--font-size-md);font-weight:var(--font-weight-bold);color:var(--text-primary);margin-bottom:var(--spacing-lg)">待办事项</div>
            <div class="wb-pending-grid">
                <div class="wb-pending-item"><div class="wb-pending-label">待审核</div><div class="wb-pending-value">1800</div><span class="action-link" style="color:var(--color-gold-500)" onclick="navigateTo('activity-list')">立即处理</span></div>
                <div class="wb-pending-item"><div class="wb-pending-label">举报消息</div><div class="wb-pending-value">3</div><span class="action-link" style="color:var(--color-gold-500)" onclick="navigateTo('activity-list')">立即处理</span></div>
                <div class="wb-pending-item"><div class="wb-pending-label">互动消息</div><div class="wb-pending-value">99</div><span class="action-link" style="color:var(--color-gold-500)" onclick="navigateTo('activity-list')">立即处理</span></div>
            </div>
        </div>
    </div>

    <div class="card wb-section-card">
        <div class="wb-rec-head">
            <div style="font-size:var(--font-size-md);font-weight:var(--font-weight-bold);color:var(--text-primary)">官方推荐</div>
        </div>
        ${RECOMMENDED_ACTIVITIES.map(renderRecommendItem).join('')}
        ${renderStandardPagination(99)}
    </div>
    `;
});

registerPage('workbench_init', () => {
    maybeShowKnowledgeDemoGuide();
});

function maybeShowKnowledgeDemoGuide() {
    const target = document.querySelector('[data-guide-target="quiz-demo"]');
    if (!target || sessionStorage.getItem('knowledgeDemoGuideSeen') === '1') return;

    window.setTimeout(() => showKnowledgeDemoGuide(target), 220);
}

function showKnowledgeDemoGuide(target) {
    closeKnowledgeDemoGuide(false);

    const overlay = document.createElement('div');
    overlay.className = 'guide-overlay';
    overlay.id = 'knowledgeDemoGuideOverlay';
    overlay.onclick = () => closeKnowledgeDemoGuide(true);

    const panel = document.createElement('div');
    panel.className = 'guide-popover';
    panel.id = 'knowledgeDemoGuidePopover';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'knowledgeDemoGuideTitle');
    panel.onclick = (event) => event.stopPropagation();
    panel.innerHTML = `
        <button class="guide-close" type="button" aria-label="关闭引导" onclick="closeKnowledgeDemoGuide(true)">×</button>
        <div class="guide-kicker">演示开放提醒</div>
        <h2 id="knowledgeDemoGuideTitle">当前仅开放“知识问答”演示</h2>
        <p>欢迎进入阅途·文遇活动管理后台。现阶段可以先体验知识问答活动的创建、题库、试卷与数据管理流程，其他活动类型暂未开放演示。</p>
        <div class="guide-actions">
            <button class="btn btn-primary" onclick="closeKnowledgeDemoGuide(true)">我知道了</button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);
    target.classList.add('demo-guide-target');

    positionKnowledgeDemoGuide(target, panel);

    const onResize = () => positionKnowledgeDemoGuide(target, panel);
    const onKeydown = (event) => {
        if (event.key === 'Escape') closeKnowledgeDemoGuide(true);
    };
    window.__knowledgeDemoGuideHandlers = { onResize, onKeydown };
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKeydown);
}

function positionKnowledgeDemoGuide(target, panel) {
    const rect = target.getBoundingClientRect();
    const panelWidth = Math.min(380, window.innerWidth - 32);
    const panelHeight = panel.offsetHeight || 220;
    let left = rect.right + 20;
    let top = rect.top + rect.height / 2 - panelHeight / 2;
    panel.classList.remove('guide-popover-left', 'guide-popover-right', 'guide-popover-bottom');

    if (left + panelWidth + 16 > window.innerWidth) {
        left = Math.max(16, rect.left - panelWidth - 20);
        panel.classList.add('guide-popover-left');
    }
    if (left < 16) {
        left = Math.max(16, Math.min(rect.left, window.innerWidth - panelWidth - 16));
        top = rect.bottom + 16;
        panel.classList.remove('guide-popover-left');
        panel.classList.add('guide-popover-bottom');
    }

    top = Math.max(16, Math.min(top, window.innerHeight - panelHeight - 16));
    if (!panel.classList.contains('guide-popover-left') && !panel.classList.contains('guide-popover-bottom')) {
        panel.classList.add('guide-popover-right');
    }
    panel.style.width = `${panelWidth}px`;
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
}

function closeKnowledgeDemoGuide(remember) {
    if (remember) sessionStorage.setItem('knowledgeDemoGuideSeen', '1');
    const handlers = window.__knowledgeDemoGuideHandlers;
    if (handlers) {
        window.removeEventListener('resize', handlers.onResize);
        document.removeEventListener('keydown', handlers.onKeydown);
        window.__knowledgeDemoGuideHandlers = null;
    }
    document.getElementById('knowledgeDemoGuideOverlay')?.remove();
    document.getElementById('knowledgeDemoGuidePopover')?.remove();
    document.querySelector('[data-guide-target="quiz-demo"]')?.classList.remove('demo-guide-target');
}
