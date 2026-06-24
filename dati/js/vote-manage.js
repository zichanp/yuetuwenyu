/* vote-manage.js - 投票活动管理原型页 */

let voteRecordTab = 'candidate';
let voteUnitMode = 'participation';
let voteCandidateSortMode = 'votes';
let selectedVoteCandidate = null;

const VOTE_LIST_ACTIVITIES = [
    {
        title: '年度最受欢迎阅读推广活动评选',
        status: '进行中',
        statusCls: 'badge-status-ongoing',
        tool: '投票',
        mode: '作品投票',
        toolCls: 'badge-blue',
        grad: 'linear-gradient(135deg,#DDEBFF 0%,#F3F8FF 52%,#BFD9FF 100%)',
        time: '2026-06-01 09:00 至 2026-06-30 18:00',
        host: '阅途文化集团',
        creator: '林月  2026-05-20 09:20',
        canManage: true,
        manageType: 'vote',
        voteConfig: {
            contentTypes: ['图文', '图片', '文字'],
            ruleText: '每日 3 票、同一候选项每天 1 票',
            tags: ['登录后投票', '自动生成参与记录', '异常票管理员复核'],
            resultPublish: '活动结束后自动发布'
        },
        voteStats: {
            voters: 15904,
            todayNewVoters: 2690,
            submissions: 18420,
            submissionTrend: '+12.3%',
            validVotes: 42618,
            abnormalVotes: 214,
            participantUnits: 86,
            candidateUnits: 54,
            topCandidateShare: 61,
            lowParticipationUnits: 8,
            visits: 28436,
            candidateCount: 286
        }
    },
    {
        title: '校园朗读者人气榜',
        status: '未开始',
        statusCls: 'badge-status-upcoming',
        tool: '投票',
        mode: '人物评选',
        toolCls: 'badge-blue',
        grad: 'linear-gradient(135deg,#F7E7C8 0%,#FBF5E8 55%,#B8D6C5 100%)',
        time: '2026-07-05 09:00 至 2026-07-20 18:00',
        host: '阅途文化集团',
        creator: '周贺贺  2026-06-12 14:00',
        canManage: true,
        manageType: 'vote',
        voteConfig: {
            contentTypes: ['图文', '文字'],
            ruleText: '活动期间每人最多 5 票、同一候选项最多 1 票',
            tags: ['登录后投票', '未开始收票', '活动期间公开排名'],
            resultPublish: '投票期间实时展示'
        },
        voteStats: {
            voters: 0,
            todayNewVoters: 0,
            submissions: 0,
            submissionTrend: '未开始',
            validVotes: 0,
            abnormalVotes: 0,
            participantUnits: 0,
            candidateUnits: 18,
            topCandidateShare: 0,
            lowParticipationUnits: 0,
            visits: 0,
            candidateCount: 18
        }
    },
    {
        title: '城市书房主题海报票选',
        status: '已结束',
        statusCls: 'badge-status-ended',
        tool: '投票',
        mode: '主题投票',
        toolCls: 'badge-blue',
        grad: 'linear-gradient(135deg,#FFE3D1 0%,#FF9CA8 54%,#FFE39A 100%)',
        time: '2026-05-08 09:00 至 2026-05-22 18:00',
        host: '阅途文化集团',
        creator: '王默  2026-05-01 10:00',
        canManage: true,
        manageType: 'vote',
        voteConfig: {
            contentTypes: ['图片'],
            ruleText: '每人活动期间最多 1 票',
            tags: ['登录后投票', '单选投票', '结束后保留排行榜'],
            resultPublish: '已发布最终结果'
        },
        voteStats: {
            voters: 7218,
            todayNewVoters: 0,
            submissions: 7218,
            submissionTrend: '已结束',
            validVotes: 8412,
            abnormalVotes: 36,
            participantUnits: 42,
            candidateUnits: 31,
            topCandidateShare: 47,
            lowParticipationUnits: 3,
            visits: 12960,
            candidateCount: 31
        }
    }
];

registerPage('vote-activity-list', () => renderVoteActivityListPanel());
registerPage('vote-activity-data', () => renderVotePlatformDataPage());
registerPage('vote-manage-overview', () => renderVoteManageOverview());
registerPage('vote-records', () => renderVoteRecordsPage());
registerPage('vote-stats', () => renderVoteStatsPage());
registerPage('vote-unit-data', () => renderVoteUnitDataPage());
registerPage('vote-risk-records', () => renderVoteRiskRecordsPage());
registerPage('vote-settings', () => renderVoteSettingsPage());

function enterVoteActivityManage(activityName, activityTime, activityStatus = '进行中', activityData = null) {
    const matchedActivity = activityData || VOTE_LIST_ACTIVITIES.find(item => item.title === activityName);
    currentManageActivity.name = activityName;
    currentManageActivity.type = '投票';
    currentManageActivity.status = activityStatus;
    currentManageActivity.time = activityTime;
    currentManageActivity.voteConfig = matchedActivity?.voteConfig || getDefaultVoteManageConfig();
    currentManageActivity.voteStats = matchedActivity?.voteStats || getDefaultVoteManageStats();
    isInManageMode = true;
    topNavSection = 'activity';
    navigateTo('vote-manage-overview');
}

function enterVoteActivityManageByIndex(index) {
    const activity = VOTE_LIST_ACTIVITIES[index] || VOTE_LIST_ACTIVITIES[0];
    enterVoteActivityManage(activity.title, formatDateTimeRangeSecond(activity.time), activity.status, activity);
}

function renderVoteActivityListPanel() {
    return `
    ${pageHeader('🗳️ 投票活动列表', '活动管理 / 工作台 / 投票 / 活动列表')}
    <div class="card" style="padding:var(--spacing-lg) var(--spacing-xl);margin-bottom:var(--spacing-lg)">
        <div class="form-row-4" style="margin-bottom:var(--spacing-md)">
            <div class="form-group"><label>活动名称</label><input class="form-control" placeholder="请输入投票活动名称"></div>
            <div class="form-group"><label>投票类型</label><select class="form-control"><option>全部类型</option><option>作品投票</option><option>人物评选</option><option>主题投票</option><option>其他</option></select></div>
            <div class="form-group"><label>活动状态</label><select class="form-control"><option>全部状态</option><option>草稿</option><option>未开始</option><option>进行中</option><option>已结束</option></select></div>
            <div style="display:flex;align-items:flex-end;gap:var(--spacing-sm);justify-content:flex-end">
                <button class="btn btn-primary">搜索</button>
                <button class="btn btn-ghost">重置</button>
            </div>
        </div>
    </div>
    <div style="display:flex;align-items:center;margin-bottom:var(--spacing-lg)">
        <button class="btn quiz-create-btn" onclick="navigateTo('vote-activity-create')">+ 创建投票活动</button>
    </div>
    <div class="card quiz-list-panel">
        <div class="quiz-list-head">
            <div>投票活动列表</div>
        </div>
        ${VOTE_LIST_ACTIVITIES.map((item, index) => voteListCard(item, index)).join('')}
        <div class="quiz-list-pagination">${renderStandardPagination(15)}</div>
    </div>`;
}

function voteListCard(item, index) {
    const activityTime = formatDateTimeRangeSecond(item.time);
    const creatorText = formatCreatorWithTimeSecond(item.creator);
    const validVotes = item.voteStats?.validVotes ?? 0;
    return `
    <div class="quiz-list-item">
        <div class="quiz-list-thumb" style="background:${item.grad}"></div>
        <div class="quiz-list-main">
            <div class="quiz-list-title-row">
                <div class="quiz-list-title">${item.title}</div>
                <span class="badge ${item.statusCls}">${item.status}</span>
                <button type="button" class="top-nav-icon activity-entry-icon" data-tooltip="访问活动" aria-label="访问活动">↗</button>
                <button type="button" class="top-nav-icon activity-entry-icon" data-tooltip="复制链接" aria-label="复制链接">⧉</button>
                <button type="button" class="top-nav-icon activity-entry-icon" data-tooltip="二维码" aria-label="二维码">▦</button>
            </div>
            <div class="quiz-list-badge-row">
                <span class="badge badge-blue">投票 - ${item.mode}</span>
                <span class="badge badge-gray">有效票数 ${formatVoteManageNumber(validVotes)}</span>
            </div>
            <div class="quiz-list-meta">
                <span>🕐 ${activityTime}</span>
                <span>🏢 创建单位：广州大学</span>
                <span>👤 ${creatorText}</span>
            </div>
        </div>
        <div class="quiz-list-actions">
            <button class="btn btn-primary btn-sm" onclick="enterVoteActivityManageByIndex(${index})">进入管理</button>
            <button class="btn btn-outline btn-sm" onclick="navigateTo('vote-activity-create', { params: { mode: 'edit' } })">编辑活动</button>
            <div class="activity-more-wrap">
                <button type="button" class="top-nav-icon activity-more-trigger" aria-label="更多操作" onclick="toggleActivityCardMoreMenu(event)">⋮</button>
                <div class="activity-more-menu">
                    ${isSystemAdmin() ? '<button type="button" onclick="handleActivityMoreAction(event, \'recommend\')">推荐到首页（admin）</button>' : ''}
                    <button type="button" onclick="handleActivityMoreAction(event, 'copy')">创建副本</button>
                    <button type="button" onclick="handleActivityMoreAction(event, 'offline')">下架</button>
                    <button type="button" onclick="handleActivityMoreAction(event, 'delete')">删除</button>
                </div>
            </div>
        </div>
    </div>`;
}

function renderVotePlatformDataPage() {
    return pageHeader('📊 投票数据概况', '活动管理 / 投票 / 数据概况') + `
    <section class="quiz-data-page">
        <div class="quiz-data-metric-grid">
            ${renderQuizDataMetric('投票活动数', '18', '进行中 6 / 已结束 9', '规模', 'blue')}
            ${renderQuizDataMetric('有效票数', '42,618', '较上期 +9.6%', '参与', 'cyan')}
            ${renderQuizDataMetric('投票人数', '15,904', '人均投票 2.7 次', '用户', 'green')}
            ${renderQuizDataMetric('候选项数', '286', '平均每活动 15.9 项', '内容', 'purple')}
        </div>
        <section class="card">
            <div class="activity-card-head">
                <div>
                    <h3>投票趋势</h3>
                    <p>展示投票类活动的每日票数和投票人数变化。</p>
                </div>
            </div>
            ${renderVoteTrendChart()}
            <div class="quiz-data-chart-legend">
                <span><i style="background:#00BCD4"></i>有效票数</span>
                <span><i style="background:#52C41A"></i>投票人数</span>
            </div>
        </section>
    </section>`;
}

function renderVoteTrendChart() {
    const days = ['6/9', '6/10', '6/11', '6/12', '6/13', '6/14', '6/15'];
    const votes = [4200, 4860, 4520, 5380, 6120, 6840, 7350];
    const users = [1560, 1720, 1680, 1980, 2260, 2480, 2690];
    const max = Math.max(...votes);
    return `
    <div class="quiz-trend-chart">
        ${days.map((day, index) => `
            <div class="quiz-trend-day">
                <div class="quiz-trend-bars">
                    <i style="height:${Math.round(votes[index] / max * 100)}%;background:#00BCD4"></i>
                    <i style="height:${Math.round(users[index] / max * 100)}%;background:#52C41A"></i>
                </div>
                <span>${day}</span>
            </div>
        `).join('')}
    </div>`;
}

function getDefaultVoteManageConfig() {
    return {
        contentTypes: ['图文', '图片', '文字'],
        ruleText: '每日 3 票、同一候选项每天 1 票',
        tags: ['登录后投票', '自动生成参与记录', '异常票管理员复核'],
        resultPublish: '活动结束后自动发布'
    };
}

function getDefaultVoteManageStats() {
    return {
        voters: 0,
        todayNewVoters: 0,
        submissions: 0,
        submissionTrend: '暂无变化',
        validVotes: 0,
        abnormalVotes: 0,
        participantUnits: 0,
        candidateUnits: 0,
        topCandidateShare: 0,
        lowParticipationUnits: 0,
        visits: 0,
        candidateCount: 0
    };
}

function getCurrentVoteManageData() {
    return {
        config: currentManageActivity.voteConfig || getDefaultVoteManageConfig(),
        stats: currentManageActivity.voteStats || getDefaultVoteManageStats()
    };
}

function formatVoteManageNumber(value) {
    return Number(value || 0).toLocaleString('zh-CN');
}

function renderVoteManageRuleIntro(config) {
    const contentTypes = config.contentTypes?.length ? config.contentTypes.join('、') : '候选项';
    return `本活动已配置${contentTypes}候选项投票，当前采用“${config.ruleText}”的投票规则。`;
}

function getVoteManageVoterNote(stats) {
    return stats.voters ? `今日新增 ${formatVoteManageNumber(stats.todayNewVoters)}` : '暂无投票用户';
}

function getVoteManageSubmissionNote(stats) {
    return stats.submissions ? `较昨日 ${stats.submissionTrend}` : stats.submissionTrend;
}

function getVoteManageValidVoteNote(stats) {
    return stats.validVotes ? `异常票 ${formatVoteManageNumber(stats.abnormalVotes)}` : '暂无有效票';
}

function getVoteManageAverageVotes(stats) {
    return stats.voters ? (Number(stats.validVotes || 0) / Number(stats.voters)).toFixed(1) : '0';
}

function getVoteManageVoteRate(stats) {
    return stats.visits ? `${(Number(stats.voters || 0) / Number(stats.visits) * 100).toFixed(1)}%` : '0%';
}

function getVoteManageTotalVotes(stats) {
    return Number(stats.validVotes || 0) + Number(stats.abnormalVotes || 0);
}

function renderVoteManageOverview() {
    const { config, stats } = getCurrentVoteManageData();
    return `
    <section class="vote-overview-data-page">
        <section class="card vote-overview-hero vote-overview-data-hero">
            <div class="vote-overview-copy">
                <span class="badge badge-blue">图本系统 · 投票活动</span>
                <h2>${currentManageActivity.name}</h2>
                <p>${renderVoteManageRuleIntro(config)}</p>
                <div class="vote-overview-tags">
                    ${(config.tags || []).map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
            <div class="vote-overview-side">
                <div><strong>投票时间</strong><span>${currentManageActivity.time}</span></div>
                <div><strong>活动状态</strong><span>${currentManageActivity.status}</span></div>
                <div><strong>结果发布</strong><span>${config.resultPublish}</span></div>
            </div>
        </section>
        <div class="quiz-data-metric-grid vote-overview-metric-grid">
            ${renderQuizDataMetric('累计总票数', formatVoteManageNumber(getVoteManageTotalVotes(stats)), getVoteManageSubmissionNote(stats), '总票', 'blue')}
            ${renderQuizDataMetric('有效票数', formatVoteManageNumber(stats.validVotes), getVoteManageValidVoteNote(stats), '有效', 'green')}
            ${renderQuizDataMetric('异常票数', formatVoteManageNumber(stats.abnormalVotes), stats.abnormalVotes ? '待管理员复核' : '暂无异常票', '风险', 'red')}
            ${renderQuizDataMetric('参与人数', formatVoteManageNumber(stats.voters), getVoteManageVoterNote(stats), '用户', 'cyan')}
            ${renderQuizDataMetric('人均投票次数', getVoteManageAverageVotes(stats), `投票转化率 ${getVoteManageVoteRate(stats)}`, '深度', 'orange')}
            ${renderQuizDataMetric('候选项数', formatVoteManageNumber(stats.candidateCount || stats.candidateUnits), `覆盖单位 ${formatVoteManageNumber(stats.participantUnits)} 个`, '候选', 'purple')}
        </div>
        ${renderVoteStatsOverviewSections(stats)}
    </section>`;
}

function renderVoteStatsOverviewSections(stats) {
    return `
    <section class="card">
        <div class="activity-card-head">
            <div>
                <h3>投票趋势</h3>
                <p>按日期查看有效票数和参与人数变化，辅助判断活动传播节奏。</p>
            </div>
        </div>
        ${renderVoteTrendChart()}
        <div class="quiz-data-chart-legend">
            <span><i style="background:#00BCD4"></i>有效票数</span>
            <span><i style="background:#52C41A"></i>投票人数</span>
        </div>
    </section>
    <div class="vote-stats-grid">
        ${renderVoteCandidateDistributionCard(stats)}
        ${renderVoteHourDistributionCard()}
    </div>
    <section class="card">
        <div class="activity-card-head">
            <div>
                <h3>单位参与分布</h3>
                <p>展示各单位参与人数和有效票数 Top10，用于判断组织发动效果。</p>
            </div>
            <button class="btn btn-outline btn-sm" onclick="navigateTo('vote-unit-data')">查看单位数据</button>
        </div>
        <div class="vote-unit-overview-list">
            ${getVoteUnitOverviewRows().map(row => `
                <div class="vote-unit-overview-row">
                    <strong>${row.unit}</strong>
                    <span>参与 ${row.users} 人</span>
                    <i><b style="width:${row.percent}%"></b></i>
                    <em>${row.votes} 票</em>
                </div>
            `).join('')}
        </div>
    </section>`;
}

function renderVoteCandidateDistributionCard(stats) {
    const topShare = Number(stats.topCandidateShare || 0);
    return `
    <section class="card">
        <div class="activity-card-head">
            <div>
                <h3>候选项票数分布</h3>
                <p>Top10 候选项占总票数 ${topShare}%，帮助识别头部集中度。</p>
            </div>
        </div>
        <div class="vote-ranking-list">
            ${getVoteCandidateDistributionRows().map((row, index) => `
                <div class="vote-ranking-item"><span>${index + 1}. ${row.name}</span><strong>${formatVoteManageNumber(row.votes)}</strong><small>${row.percent}%</small></div>
            `).join('')}
        </div>
    </section>`;
}

function renderVoteHourDistributionCard() {
    return `
    <section class="card">
        <div class="activity-card-head">
            <div>
                <h3>投票时段分布</h3>
                <p>按小时查看投票峰值，便于安排活动推送。</p>
            </div>
        </div>
        <div class="vote-hour-grid">
            ${[9, 10, 11, 14, 15, 16, 17, 20].map((hour, index) => `
                <div class="vote-hour-bar"><em style="height:${[48, 62, 58, 72, 80, 85, 91, 65][index]}%"></em><span>${hour}:00</span></div>
            `).join('')}
        </div>
    </section>`;
}

function getVoteCandidateDistributionRows() {
    return [
        { name: '书香校园主题海报', votes: 12856, percent: '30.2' },
        { name: '城市书房摄影作品', votes: 11342, percent: '26.6' },
        { name: '朗读者风采展示', votes: 9284, percent: '21.8' },
        { name: '阅读推广人故事', votes: 6902, percent: '16.2' },
        { name: '馆员风采海报', votes: 5810, percent: '13.6' }
    ];
}

function getVoteUnitOverviewRows() {
    return [
        { unit: '广州大学', users: 328, votes: 1862, percent: 100 },
        { unit: '江南分馆', users: 264, votes: 1508, percent: 81 },
        { unit: '青少年宫阅读中心', users: 218, votes: 1284, percent: 69 },
        { unit: '城东分馆', users: 176, votes: 986, percent: 53 }
    ];
}

function renderVoteRecordsPage() {
    const activeVoteRecordTab = ['detail', 'candidate-users'].includes(voteRecordTab) ? voteRecordTab : 'candidate';
    if (activeVoteRecordTab === 'candidate-users') {
        return renderVoteCandidateUserPage();
    }
    return `
    <section class="vote-record-page">
        <div class="vote-record-tabs" role="tablist" aria-label="投票情况">
            <button class="${activeVoteRecordTab === 'candidate' ? 'active' : ''}" onclick="switchVoteRecordTab('candidate')">投票情况</button>
            <button class="${activeVoteRecordTab === 'detail' ? 'active' : ''}" onclick="switchVoteRecordTab('detail')">投票明细</button>
        </div>
        <section class="card vote-record-card">
            ${activeVoteRecordTab === 'detail' ? renderVoteDetailPanel() : renderVoteCandidatePanel()}
        </section>
    </section>`;
}

function renderVoteCandidatePanel() {
    const rows = getSortedVoteCandidateRows();
    return `
    <div class="vote-candidate-toolbar">
        <div class="vote-candidate-sortbar">
            <div class="vote-sort-segment" role="tablist" aria-label="排序方式">
                <button type="button" role="tab" aria-selected="${voteCandidateSortMode === 'votes'}" class="vote-sort-radio ${voteCandidateSortMode === 'votes' ? 'active' : ''}" onclick="switchVoteCandidateSort('votes')">按票数排名</button>
                <button type="button" role="tab" aria-selected="${voteCandidateSortMode === 'order'}" class="vote-sort-radio ${voteCandidateSortMode === 'order' ? 'active' : ''}" onclick="switchVoteCandidateSort('order')">按选项顺序</button>
            </div>
        </div>
        <button class="btn btn-primary">导出</button>
    </div>
    <div class="vote-candidate-ranking">
        <div class="vote-candidate-ranking-head">
            <span>排名</span>
            <span>候选项</span>
            <span>票数占比</span>
            <span>票数</span>
            <span>投票人数</span>
            <span class="vote-candidate-percent-head">票数占比<span class="field-help tooltip" data-tooltip="票数占比 = 该候选项有效票数 / 所有候选项有效票总数 × 100%">?</span></span>
            <span>操作</span>
        </div>
        ${renderVoteCandidateRankingRows(rows)}
    </div>
    ${renderStandardPagination(rows.length)}`;
}

function getVoteCandidateRows() {
    return [
        { rank: 1, id: 'YC-20260615-001', name: '书香进校园青少年阅读推广活动', unit: '城东社区网格站', issue: '公共设施异常', imageTone: 'amber', votes: 80, users: 72, percent: 70 },
        { rank: 2, id: 'YC-20260615-002', name: '城市共读夜全民阅读推广活动', unit: '市图书馆安全巡查组', issue: '通道占用', imageTone: 'blue', votes: 20, users: 18, percent: 20 },
        { rank: 3, id: 'YC-20260614-003', name: '亲子绘本故事会阅读推广活动', unit: '公共交通志愿服务队', issue: '照明故障', imageTone: 'green', votes: 8, users: 7, percent: 8 }
    ];
}

function getSortedVoteCandidateRows() {
    const rows = getVoteCandidateRows();
    if (voteCandidateSortMode === 'order') return rows;
    return [...rows].sort((a, b) => b.votes - a.votes).map((row, index) => ({ ...row, rank: index + 1 }));
}

function renderVoteCandidateRankingRows(rows = getVoteCandidateRows()) {
    return rows.map(row => `
        <div class="vote-candidate-row">
            <div class="vote-candidate-rank"><span>${row.rank}</span></div>
            <div class="vote-candidate-name">
                <div class="vote-candidate-media vote-candidate-media-${row.imageTone || 'blue'}" aria-hidden="true">
                    <span></span>
                    <i></i>
                </div>
                <div class="vote-candidate-copy">
                    <strong>${row.name}</strong>
                </div>
            </div>
            <div class="vote-candidate-progress" aria-label="${row.name} 票数占比 ${row.percent}%">
                <span style="width:${row.percent}%"></span>
            </div>
            <div class="vote-candidate-votes">${row.votes}票</div>
            <div class="vote-candidate-users">${row.users}人</div>
            <div class="vote-candidate-percent">${row.percent}%</div>
            <button class="vote-record-link" onclick="openVoteCandidateUserList('${row.id}')">查看</button>
        </div>
    `).join('');
}

function renderVoteCandidateUserPage() {
    const candidate = selectedVoteCandidate || getVoteCandidateRows()[0];
    const stats = getVoteCandidateUserStats(candidate.id);
    return `
    <section class="vote-record-page">
        <div class="vote-candidate-user-head">
            <button class="vote-back-link" onclick="backToVoteCandidateRanking()">‹ 返回投票情况</button>
            <div>
                <h3>参与投票该候选项的用户列表</h3>
                <p>${candidate.name}</p>
            </div>
            <button class="btn btn-primary">导出</button>
        </div>
        <section class="card vote-record-card">
            <div class="vote-candidate-user-stats">
                <strong>共 ${stats.users} 位用户参与，累计获得 ${stats.votes} 票</strong>
                <span>${stats.users} 位用户为去重后的投票人数；${stats.votes} 票为该候选项实际获得的总票数。</span>
            </div>
            <div class="review-list-title">投票用户汇总</div>
            <div class="unit-data-table-wrap vote-detail-table-wrap vote-candidate-user-table-wrap">${renderVoteCandidateUserTable(candidate.id)}</div>
        </section>
    </section>`;
}

function getVoteCandidateUserRows(candidateId) {
    const rowsByCandidate = {
        V001: [
            ['张三', '第一图书馆', '3 票', '3 次', '06-16 09:20', '06-18 14:35'],
            ['林月', '广州大学', '2 票', '2 次', '06-15 17:40', '06-16 10:18'],
            ['周贺贺', '江南分馆', '1 票', '1 次', '06-15 16:05', '06-15 16:05']
        ],
        V002: [
            ['李青', '江南分馆', '2 票', '2 次', '06-14 11:12', '06-15 09:28'],
            ['陈晓', '城东分馆', '1 票', '1 次', '06-15 13:20', '06-15 13:20'],
            ['王晨', '青少年宫阅读中心', '1 票', '1 次', '06-15 18:02', '06-15 18:02']
        ],
        V003: [
            ['赵敏', '城东分馆', '4 票', '4 次', '06-14 09:10', '06-18 15:20'],
            ['王晨', '青少年宫阅读中心', '3 票', '3 次', '06-14 18:02', '06-17 12:36'],
            ['林月', '广州大学', '1 票', '1 次', '06-16 08:40', '06-16 08:40']
        ]
    };
    return rowsByCandidate[candidateId] || rowsByCandidate.V001;
}

function getVoteCandidateUserStats(candidateId) {
    const statsByCandidate = {
        V001: { users: 18, votes: 20 },
        V002: { users: 7, votes: 8 },
        V003: { users: 72, votes: 80 }
    };
    return statsByCandidate[candidateId] || statsByCandidate.V001;
}

function renderVoteCandidateUserTable(candidateId) {
    return tableWrap(
        ['用户姓名', '所属单位', '累计投票数', '投票次数', '首次投票时间', '最近投票时间', '操作'],
        getVoteCandidateUserRows(candidateId).map(row => `
            <tr>
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
                <td>${row[4]}</td>
                <td>${row[5]}</td>
                <td><button class="vote-record-link vote-record-link-sm" onclick="openVoteCandidateUserDetailModal('${row[0]}', '${candidateId}')">查看明细</button></td>
            </tr>
        `).join(''),
        { total: getVoteCandidateUserRows(candidateId).length }
    );
}

function renderVoteDetailPanel() {
    return `
    <div class="exam-filter-form unit-exam-filter-form vote-detail-filter">
        <label><span>投票用户</span><input class="form-control" placeholder="请输入姓名或手机号"></label>
        <label><span>候选项</span><input class="form-control" placeholder="请输入候选项名称或编号"></label>
        <div class="exam-filter-actions"><button class="btn btn-primary btn-sm">查询</button><button class="btn btn-outline btn-sm">重置</button><button class="btn btn-outline btn-sm">导出</button></div>
    </div>
    <div class="review-list-title">投票明细</div>
    <div class="unit-data-table-wrap vote-detail-table-wrap">${renderVoteDetailTable()}</div>`;
}

function renderVoteDetailTable() {
    return tableWrap(
        ['投票用户', '手机号', '候选项名称', '投票时间'],
        [
            ['VR-20260615-001', '林月', '138****0012', '书香校园主题海报', '2026-06-15 17:40:08'],
            ['VR-20260615-002', '周贺贺', '139****7734', '城市书房摄影作品', '2026-06-15 16:05:30'],
            ['VR-20260615-003', '王晨', '137****4460', '朗读者风采展示', '2026-06-14 18:02:40']
        ].map(row => `
            <tr>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
                <td>${row[4]}</td>
            </tr>
        `).join(''),
        { total: 3 }
    );
}

function switchVoteRecordTab(tab) {
    voteRecordTab = tab === 'detail' ? 'detail' : 'candidate';
    navigateTo('vote-records', { refresh: true, fromTabSwitch: true, reuseTabKey: activeTabKey });
}

function switchVoteCandidateSort(mode) {
    voteCandidateSortMode = mode === 'order' ? 'order' : 'votes';
    navigateTo('vote-records', { refresh: true, fromTabSwitch: true, reuseTabKey: activeTabKey });
}

function openVoteCandidateUserList(candidateId) {
    selectedVoteCandidate = getVoteCandidateRows().find(row => row.id === candidateId) || getVoteCandidateRows()[0];
    voteRecordTab = 'candidate-users';
    navigateTo('vote-records', { refresh: true, fromTabSwitch: true, reuseTabKey: activeTabKey });
}

function backToVoteCandidateRanking() {
    voteRecordTab = 'candidate';
    selectedVoteCandidate = null;
    navigateTo('vote-records', { refresh: true, fromTabSwitch: true, reuseTabKey: activeTabKey });
}

function openVoteCandidateUserDetailModal(userName, candidateId) {
    const candidate = getVoteCandidateRows().find(row => row.id === candidateId) || getVoteCandidateRows()[0];
    const detailRows = [
        ['06-18 14:35', '1 票', '微信小程序', '仅管理员可见'],
        ['06-17 10:20', '1 票', '微信小程序', '仅管理员可见'],
        ['06-16 09:20', '1 票', '活动页', '仅管理员可见']
    ];
    openModal(`${userName}的投票明细`, `
        <div class="vote-publish-modal">
            <div class="vote-summary-content">候选项：${candidate.name}</div>
            ${tableWrap(
                ['投票时间', '本次投票数', '投票渠道', 'IP 地址'],
                detailRows.map(row => `
                    <tr>
                        <td>${row[0]}</td>
                        <td>${row[1]}</td>
                        <td>${row[2]}</td>
                        <td>${row[3]}</td>
                    </tr>
                `).join(''),
                { pagination: false }
            )}
        </div>
    `, closeModal);
}

function renderVoteStatsPage() {
    return `
    <div class="quiz-data-metric-grid">
        ${renderQuizDataMetric('活动访问人数', '28,436', '投票转化率 55.9%', '访问', 'blue')}
        ${renderQuizDataMetric('投票人数', '15,904', '去重用户', '用户', 'green')}
        ${renderQuizDataMetric('投票人次', '18,420', '用户提交次数', '行为', 'cyan')}
        ${renderQuizDataMetric('有效票数', '42,618', '无效票 214', '票数', 'purple')}
    </div>
    <section class="card" style="margin-top:var(--spacing-lg)">
        <div class="activity-card-head">
            <div>
                <h3>投票趋势</h3>
                <p>用于分析投票人数、投票人次和有效票数的变化。</p>
            </div>
        </div>
        ${renderVoteTrendChart()}
        <div class="quiz-data-chart-legend">
            <span><i style="background:#00BCD4"></i>有效票数</span>
            <span><i style="background:#52C41A"></i>投票人数</span>
        </div>
    </section>
    <div class="vote-stats-grid">
        ${renderVoteCandidateDistributionCard({ topCandidateShare: 61 })}
        ${renderVoteHourDistributionCard()}
    </div>`;
}

function renderVoteUnitDataPage() {
    return `
    <section class="card answer-mode-panel unit-mode-panel">
        <div class="answer-mode-tabs" role="tablist" aria-label="单位数据模式">
            <button class="${voteUnitMode === 'participation' ? 'active' : ''}" onclick="switchVoteUnitMode('participation')"><strong>单位投票参与情况</strong></button>
            <button class="${voteUnitMode === 'candidate' ? 'active' : ''}" onclick="switchVoteUnitMode('candidate')"><strong>单位候选项获票情况</strong></button>
        </div>
        <p>${voteUnitMode === 'participation' ? '看哪些单位参与人数多、投票行为活跃。' : '看哪些单位所属候选项获票更多，适合做组织表现分析。'}</p>
    </section>
    <section class="card unit-data-table-card">
        <div class="exam-filter-form unit-exam-filter-form">
            <label><span>单位名称</span><input class="form-control" placeholder="请输入单位名称"></label>
            <label><span>时间范围</span><input class="form-control" placeholder="请选择时间范围"></label>
            <label><span>排序方式</span><select class="form-control"><option>${voteUnitMode === 'participation' ? '按有效票数' : '按总获票数'}</option><option>按参与人数</option></select></label>
            <div class="exam-filter-actions"><button class="btn btn-primary btn-sm">查询</button><button class="btn btn-outline btn-sm">重置</button><button class="btn btn-outline btn-sm">导出</button></div>
        </div>
        <div class="review-list-title">${voteUnitMode === 'participation' ? '单位投票参与情况' : '单位候选项获票情况'}</div>
        <div class="unit-data-table-wrap">${renderVoteUnitTable()}</div>
        ${renderStandardPagination(18)}
    </section>`;
}

function renderVoteUnitTable() {
    if (voteUnitMode === 'participation') {
        return tableWrap(
            ['排名', '单位名称', '参与人数', '投票人次', '有效票数', '人均投票数', '今日新增票数', '最近投票时间', '操作'],
            [
                ['1', '广州大学', '328', '620', '1,862', '5.7', '126', '2026-06-15 17:40:08'],
                ['2', '江南分馆', '264', '512', '1,508', '5.7', '102', '2026-06-15 16:05:30'],
                ['3', '青少年宫阅读中心', '218', '438', '1,284', '5.9', '94', '2026-06-15 15:48:11']
            ].map(row => `
                <tr>
                    <td>${row[0]}</td>
                    <td>${row[1]}</td>
                    <td>${row[2]}</td>
                    <td>${row[3]}</td>
                    <td>${row[4]}</td>
                    <td>${row[5]}</td>
                    <td>${row[6]}</td>
                    <td>${row[7]}</td>
                    <td><button class="btn btn-ghost btn-sm" onclick="openVoteUnitDetailModal('${row[1]}','${row[2]}','${row[4]}','${row[5]}')">查看单位详情</button></td>
                </tr>
            `).join('')
        );
    }
    return tableWrap(
        ['排名', '单位名称', '候选项数量', '单位候选项总获票数', '票数占比', 'Top1 候选项', 'Top1 票数', '操作'],
        [
            ['1', '复兴小学', '4', '13,920', '32.7%', '书香校园主题海报', '12,856'],
            ['2', '江南分馆', '3', '11,842', '27.8%', '城市书房摄影作品', '11,342'],
            ['3', '青少年宫阅读中心', '5', '9,926', '23.3%', '朗读者风采展示', '9,284']
        ].map(row => `
            <tr>
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${row[3]}</td>
                <td>${row[4]}</td>
                <td>${row[5]}</td>
                <td>${row[6]}</td>
                <td><button class="btn btn-ghost btn-sm" onclick="openVoteUnitCandidateModal('${row[1]}','${row[3]}','${row[5]}','${row[6]}')">查看单位详情</button></td>
            </tr>
        `).join('')
    );
}

function switchVoteUnitMode(mode) {
    voteUnitMode = mode;
    navigateTo('vote-unit-data', { refresh: true, fromTabSwitch: true, reuseTabKey: activeTabKey });
}

function renderVoteRiskRecordsPage() {
    return `
    <section class="card">
        <div class="exam-filter-form unit-exam-filter-form">
            <label><span>投票用户</span><input class="form-control" placeholder="请输入姓名或手机号"></label>
            <label><span>候选项名称</span><input class="form-control" placeholder="请输入候选项名称"></label>
            <label><span>当前状态</span><select class="form-control"><option>全部</option><option>待复核</option><option>已无效</option><option>已恢复有效</option></select></label>
            <div class="exam-filter-actions"><button class="btn btn-primary btn-sm">查询</button><button class="btn btn-outline btn-sm">重置</button><button class="btn btn-outline btn-sm">导出</button></div>
        </div>
        <div class="review-list-title">异常投票记录</div>
        ${tableWrap(
            ['异常记录编号', '投票用户', '手机号', '所属单位', '候选项名称', '投票时间', '风险原因', '当前状态', '操作'],
            [
                ['RISK-001', '周贺贺', '139****7734', '江南分馆', '城市书房摄影作品', '2026-06-15 16:05:30', '高频设备集中投票', '待复核'],
                ['RISK-002', '陈林', '136****2248', '广州大学', '书香校园主题海报', '2026-06-15 15:18:21', '短时高频提交', '已无效'],
                ['RISK-003', '赵敏', '135****8801', '城东分馆', '朗读者风采展示', '2026-06-14 18:46:11', '账号行为异常', '已恢复有效']
            ].map(row => `
                <tr>
                    <td>${row[0]}</td>
                    <td>${row[1]}</td>
                    <td>${row[2]}</td>
                    <td>${row[3]}</td>
                    <td>${row[4]}</td>
                    <td>${row[5]}</td>
                    <td>${row[6]}</td>
                    <td><span class="badge ${row[7] === '待复核' ? 'badge-yellow' : row[7] === '已无效' ? 'badge-gray' : 'badge-green'}">${row[7]}</span></td>
                    <td><button class="btn btn-ghost btn-sm" onclick="openVoteRiskActionModal('${row[0]}','invalid')">标记无效</button><button class="btn btn-ghost btn-sm" onclick="openVoteRiskActionModal('${row[0]}','valid')">恢复有效</button></td>
                </tr>
            `).join(''),
            { total: 3 }
        )}
    </section>`;
}

function renderVoteSettingsPage() {
    return `
    <section class="card vote-settings-card">
        <div class="activity-card-head">
            <div>
                <h3>活动设置</h3>
                <p>投票开始后，候选项来源、投票周期和每周期可投票数进入锁定状态。</p>
            </div>
        </div>
        <div class="vote-settings-grid">
            <div><strong>候选项来源</strong><span>关联征集活动作品</span></div>
            <div><strong>投票规则</strong><span>每人每天 3 票，同一候选项每天 1 票</span></div>
            <div><strong>提交方式</strong><span>统一选择后提交</span></div>
            <div><strong>结果展示</strong><span>投票期间隐藏票数，结束后自动公布</span></div>
            <div><strong>异常票处理</strong><span>先计入，管理员复核</span></div>
            <div><strong>分享链接</strong><span>默认进入投票活动首页</span></div>
        </div>
    </section>`;
}

function openVoteCandidateRecordModal(id, name) {
    openModal(`投票明细 - ${name}`, `
        <div class="vote-publish-modal">
            <div class="vote-summary-content">候选项编号：${id}</div>
            <div class="vote-summary-content">可查看该候选项的有效票数、票数占比、今日新增和逐条投票记录。</div>
            <div class="vote-summary-content">后续如需深挖趋势，可在数据统计页查看投票趋势与时段分布。</div>
        </div>
    `, closeModal);
}

function openVoteUnitDetailModal(unit, users, votes, avg) {
    openModal(`单位详情 - ${unit}`, `
        <div class="vote-publish-modal">
            <div class="vote-summary-content">参与人数：${users}</div>
            <div class="vote-summary-content">有效票数：${votes}</div>
            <div class="vote-summary-content">人均投票数：${avg}</div>
            <div class="vote-summary-content">该视角关注“本单位用户投出了多少票”，适合判断单位组织效果。</div>
        </div>
    `, closeModal);
}

function openVoteUnitCandidateModal(unit, totalVotes, topCandidate, topVotes) {
    openModal(`单位候选项获票 - ${unit}`, `
        <div class="vote-publish-modal">
            <div class="vote-summary-content">单位候选项总获票数：${totalVotes}</div>
            <div class="vote-summary-content">Top1 候选项：${topCandidate}</div>
            <div class="vote-summary-content">Top1 票数：${topVotes}</div>
            <div class="vote-summary-content">该视角关注“本单位候选项被投了多少票”，适合看单位作品表现。</div>
        </div>
    `, closeModal);
}

function openVoteRiskActionModal(recordId, type) {
    const title = type === 'invalid' ? '标记异常票为无效' : '恢复异常票为有效';
    openModal(title, `
        <div class="vote-publish-modal">
            <div class="vote-summary-content">异常记录编号：${recordId}</div>
            <div class="vote-summary-content">第一期推荐处理方式为“先计入，管理员复核”，以减少误伤正常投票。</div>
            <div class="vote-summary-content">所有处理动作都需要留痕，不能物理删除原始投票记录。</div>
        </div>
    `, closeModal);
}
