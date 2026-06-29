/* activity-manage.js — 管理中心子页面 (活动概况 / 机构管理 / 奖证管理)
   报名情况 / 答题情况 / 单位情况 reuse existing pages in data-mgmt.js
   Activity header is prepended globally by navigateTo() when sidebarMode === 'manage'.
*/

// Legacy alias — keeps old navigateTo('activity-manage') calls working
registerPage('activity-manage', () => renderActivityOverview());

// ===== 活动概况 =====
registerPage('activity-overview', () => renderActivityOverview());

let activityOverviewMode = 'exam';

const ACTIVITY_OVERVIEW_MODES = [
    { key: 'exam', label: '在线考试', desc: '考试提交与成绩' },
    { key: 'daily', label: '每日答题', desc: '每日参与与累计' },
    { key: 'level', label: '趣味闯关', desc: '关卡挑战与过关' }
];

function switchActivityOverviewMode(mode) {
    if (!ACTIVITY_OVERVIEW_MODES.some(item => item.key === mode)) return;
    activityOverviewMode = mode;
    const main = document.getElementById('mainContent');
    if (main) main.innerHTML = renderActivityOverview();
}

function getActivityOverviewConfig() {
    const configs = {
        exam: {
            modeLabel: '在线考试',
            meta: [
                '活动时间：2026-03-06 10:10:00 至 2026-03-26 23:59:00',
                '参与范围：集团总部及 8 家分馆',
                '试卷设置：50 题 / 100 分 / 60 分及格',
                '答题规则：每人 1 次正式提交，限时 60 分钟'
            ],
            metrics: [
                ['总参与人数', '528', '↑ 12% 较昨日', '口径：活动范围内已报名或被分配用户', 'var(--success)', 'var(--primary)'],
                ['完成人数', '386', '完成率 73.1%', '口径：已提交正式答卷用户', 'var(--success)', 'var(--success)'],
                ['未完成人数', '142', '其中 51 人未开始', '需运营提醒', 'var(--warning)', 'var(--warning)'],
                ['平均分', '78.5', '满分 100 分', '仅统计已提交用户', 'var(--text-muted)', 'var(--warning)'],
                ['通过率', '82.3%', '及格线 60 分', '通过 318 / 已完成 386', 'var(--text-muted)', 'var(--color-gold-500)'],
                ['高分人数', '135', '90 分以上占 35%', '可用于榜单激励', 'var(--success)', 'var(--info)']
            ],
            trend: {
                title: '参与趋势',
                desc: '查看报名、答题和完成提交的增长情况',
                segments: ['新增参与', '完成提交', '通过人数'],
                days: ['3/06','3/09','3/12','3/15','3/18','3/21','3/24','3/26'],
                values: [45, 82, 110, 158, 210, 268, 340, 528]
            },
            distribution: {
                title: '分数分布',
                desc: '77% 用户集中在 80 分以上',
                bars: [
                    ['90-100 分', '优秀', 35, 'var(--success)'],
                    ['80-89 分', '良好', 42, 'var(--color-gold-500)'],
                    ['60-79 分', '待提升', 18, 'var(--warning)'],
                    ['60 分以下', '未通过', 5, 'var(--danger)']
                ],
                insight: '整体掌握情况较好，60 分以下用户占 5%，建议定向复训。'
            },
            funnel: {
                title: '答题状态漏斗',
                desc: '定位用户卡在报名、开始答题还是提交环节',
                steps: [
                    ['参与人数', 528, 100, 'var(--primary)'],
                    ['已开始答题', 477, 90, 'var(--info)'],
                    ['已完成提交', 386, 73, 'var(--success)'],
                    ['已通过', 318, 60, 'var(--color-gold-500)']
                ]
            },
            todos: [
                ['high', '142 人尚未完成', '建议今天向未开始和答题中用户发送提醒。'],
                ['medium', '3 个组织完成率低于 50%', '优先联系分馆管理员确认组织推进情况。'],
                ['medium', '5 道题正确率低于 60%', '建议检查题目表述或补充对应知识点材料。'],
                ['low', '26 人未通过', '可在活动结束前安排一次复训或补考。']
            ],
            orgRows: [
                ['集团总部', 96, 88, '91.7%', '84.2', '93.2%', 'good'],
                ['城东分馆', 64, 53, '82.8%', '81.6', '88.7%', 'good'],
                ['少儿阅读中心', 72, 51, '70.8%', '77.9', '80.4%', ''],
                ['城西分馆', 58, 31, '53.4%', '73.1', '74.2%', 'warn'],
                ['流动服务站', 45, 19, '42.2%', '69.8', '63.2%', 'risk']
            ],
            questionTitle: '低正确率题目',
            questionDesc: '用于判断知识点薄弱项和题目质量',
            questionRows: [
                ['古籍修复中“揭裱”的主要目的是什么？', '单选题', '古籍保护', 48, 201],
                ['公共图书馆数字资源授权边界判断', '多选题', '版权常识', 52, 185],
                ['读者证跨馆通借规则适用场景', '判断题', '服务规范', 57, 166],
                ['地方文献入藏优先级排序', '排序题', '馆藏建设', 59, 158]
            ]
        },
        daily: {
            modeLabel: '每日答题',
            meta: [
                '活动时间：2026-03-06 至 2026-03-26',
                '开放规则：每日 09:00 至 18:00 可答题',
                '题目设置：每日 10 题 / 达标 6 题',
                '成绩规则：按每日最高分累计'
            ],
            metrics: [
                ['参与用户', '486', '连续参与 212 人', '至少完成 1 天答题用户', 'var(--success)', 'var(--primary)'],
                ['累计答题天数', '2,184', '人均 4.5 天', '所有用户已完成答题天数合计', 'var(--success)', 'var(--success)'],
                ['今日未答', '176', '需提醒', '今日尚未提交答题用户', 'var(--warning)', 'var(--warning)'],
                ['累计平均分', '82.8', '每日最高分累计均值', '仅统计已参与用户', 'var(--text-muted)', 'var(--warning)'],
                ['达标率', '83.9%', '达标 324 / 完成 386', '当日最高分达到达标线', 'var(--text-muted)', 'var(--color-gold-500)'],
                ['连续 7 天', '68', '可发放激励', '连续答题达到 7 天用户', 'var(--success)', 'var(--info)']
            ],
            trend: {
                title: '每日参与趋势',
                desc: '查看每日答题提交与达标增长情况',
                segments: ['答题人数', '达标人数', '连续人数'],
                days: ['3/06','3/09','3/12','3/15','3/18','3/21','3/24','3/26'],
                values: [38, 76, 118, 164, 208, 258, 318, 386]
            },
            distribution: {
                title: '累计得分分布',
                desc: '高活跃用户集中在 80 分以上',
                bars: [
                    ['90 分以上', '优秀', 28, 'var(--success)'],
                    ['80-89 分', '良好', 39, 'var(--color-gold-500)'],
                    ['60-79 分', '待提升', 25, 'var(--warning)'],
                    ['60 分以下', '需提醒', 8, 'var(--danger)']
                ],
                insight: '每日答题参与稳定，建议重点提醒今日未答和连续中断用户。'
            },
            funnel: {
                title: '每日答题漏斗',
                desc: '定位用户从参与到达标的转化情况',
                steps: [
                    ['报名用户', 528, 100, 'var(--primary)'],
                    ['参与答题', 486, 92, 'var(--info)'],
                    ['完成当日答题', 386, 73, 'var(--success)'],
                    ['达到达标线', 324, 61, 'var(--color-gold-500)']
                ]
            },
            todos: [
                ['high', '176 人今日未答', '建议在每日答题关闭前发送一次提醒。'],
                ['medium', '4 个组织达标率低于 70%', '建议联系单位管理员推进每日参与。'],
                ['medium', '连续答题中断用户 39 人', '可通过积分或证书提醒恢复参与。'],
                ['low', '8% 用户累计得分低于 60 分', '建议补充每日解析和复习材料。']
            ],
            orgRows: [
                ['集团总部', 96, 91, '94.8%', '86.1', '90.2%', 'good'],
                ['城东分馆', 64, 57, '89.1%', '83.4', '86.0%', 'good'],
                ['少儿阅读中心', 72, 58, '80.6%', '79.2', '78.8%', ''],
                ['城西分馆', 58, 39, '67.2%', '72.8', '69.4%', 'warn'],
                ['流动服务站', 45, 24, '53.3%', '68.5', '61.1%', 'risk']
            ],
            questionTitle: '低达标题目',
            questionDesc: '用于判断每日答题薄弱知识点',
            questionRows: [
                ['读者证挂失后是否仍可借阅？', '判断题', '服务规范', 54, 126],
                ['数字资源远程访问的授权条件', '多选题', '数字资源', 58, 119],
                ['馆内自助借还设备异常处理', '单选题', '读者服务', 61, 104],
                ['文献检索关键词组合规则', '填空题', '检索技能', 63, 98]
            ]
        },
        level: {
            modeLabel: '趣味闯关',
            meta: [
                '活动时间：2026-03-06 至 2026-03-26',
                '闯关规则：按顺序解锁关卡',
                '关卡设置：3 关 / 每关 50 题 / 答对 30 题过关',
                '挑战规则：每关最多 3 次挑战'
            ],
            metrics: [
                ['参与闯关人数', '438', '完成至少 1 关', '进入过任意关卡的用户', 'var(--success)', 'var(--primary)'],
                ['通关人数', '168', '全关卡通过', '已完成全部关卡用户', 'var(--success)', 'var(--success)'],
                ['停留人数', '270', '需继续挑战', '仍停留在未通过关卡', 'var(--warning)', 'var(--warning)'],
                ['平均过关数', '1.8', '共 3 关', '按参与闯关用户计算', 'var(--text-muted)', 'var(--warning)'],
                ['通关率', '38.4%', '168 / 438', '通过全部关卡比例', 'var(--text-muted)', 'var(--color-gold-500)'],
                ['满关高效通关', '42', '用时前 25%', '适合榜单激励', 'var(--success)', 'var(--info)']
            ],
            trend: {
                title: '闯关进度趋势',
                desc: '查看参与闯关、过关和完成全关的增长情况',
                segments: ['参与闯关', '通过关卡', '全关通关'],
                days: ['3/06','3/09','3/12','3/15','3/18','3/21','3/24','3/26'],
                values: [24, 58, 94, 140, 196, 255, 326, 438]
            },
            distribution: {
                title: '关卡停留分布',
                desc: '识别用户集中卡住的关卡',
                bars: [
                    ['第 1 关', '基础', 18, 'var(--success)'],
                    ['第 2 关', '进阶', 42, 'var(--color-gold-500)'],
                    ['第 3 关', '综合', 31, 'var(--warning)'],
                    ['未开始', '待提醒', 9, 'var(--danger)']
                ],
                insight: '第 2 关停留人数较多，建议检查题目难度和关卡说明。'
            },
            funnel: {
                title: '闯关漏斗',
                desc: '定位用户从开始闯关到全关通关的转化情况',
                steps: [
                    ['报名用户', 528, 100, 'var(--primary)'],
                    ['参与闯关', 438, 83, 'var(--info)'],
                    ['通过至少 1 关', 286, 54, 'var(--success)'],
                    ['完成全部关卡', 168, 32, 'var(--color-gold-500)']
                ]
            },
            todos: [
                ['high', '270 人仍未完成全关', '建议提醒停留用户继续挑战。'],
                ['medium', '第 2 关停留占比 42%', '建议复核该关题目难度和提示文案。'],
                ['medium', '3 个组织闯关成功率低于 40%', '可联系单位管理员组织集中答题。'],
                ['low', '42 人高效通关', '可作为排行榜或证书激励对象。']
            ],
            orgRows: [
                ['集团总部', 96, 42, '43.8%', '2.1 关', '48.6%', 'good'],
                ['城东分馆', 64, 28, '43.8%', '1.9 关', '44.4%', 'good'],
                ['少儿阅读中心', 72, 24, '33.3%', '1.7 关', '38.2%', ''],
                ['城西分馆', 58, 15, '25.9%', '1.4 关', '29.6%', 'warn'],
                ['流动服务站', 45, 8, '17.8%', '1.1 关', '21.1%', 'risk']
            ],
            questionTitle: '低通过关卡题',
            questionDesc: '用于判断关卡卡点和题目质量',
            questionRows: [
                ['阅读常识中，哪些环节属于有效答题过程？', '多选题', '第 1 关', 49, 133],
                ['历史文化中的基础规则是否需要按顺序完成？', '判断题', '第 2 关', 51, 121],
                ['非遗知识的核心关键词是____。', '填空题', '第 3 关', 55, 108],
                ['馆藏分类与地方文献匹配规则', '单选题', '第 2 关', 58, 96]
            ]
        }
    };
    return configs[activityOverviewMode] || configs.exam;
}

function renderActivityOverviewModeTabs() {
    return `
    <section class="card answer-mode-panel activity-overview-mode-panel">
        <div class="answer-mode-tabs" role="tablist" aria-label="活动概览模式">
            ${ACTIVITY_OVERVIEW_MODES.map(mode => `
                <button class="${activityOverviewMode === mode.key ? 'active' : ''}" onclick="switchActivityOverviewMode('${mode.key}')">
                    <strong>${mode.label}</strong>
                    <span>${mode.desc}</span>
                </button>
            `).join('')}
        </div>
        <p>研发查看：切换不同答题模式下的概览口径与运营数据。</p>
    </section>`;
}

function getUnifiedActivityOverviewConfig(activityType) {
    const type = activityType || currentManageActivity.type;
    if (type === '征集类') return getCollectionActivityOverviewConfig();
    if (type === '任务打卡') return getTaskActivityOverviewConfig();
    if (type === '活动报名') return getOfflineActivityOverviewConfig();
    if (type === '投票') return getVoteActivityOverviewConfigFromManage();
    return getQuizActivityOverviewUnifiedConfig();
}

function getActivityOverviewBaseMeta(ruleText, extra = []) {
    return [
        `活动时间：${currentManageActivity.time}`,
        '参与范围：集团总部及 8 家分馆',
        ruleText,
        ...extra
    ];
}

function getActivityOverviewActions() {
    return [
        { label: '导出数据', onclick: "openActivityOverviewAction('导出数据')" },
        { label: '发送提醒', onclick: "openActivityOverviewAction('发送提醒')" },
        { label: '查看活动', primary: true, onclick: "openActivityOverviewAction('查看活动')" }
    ];
}

function getCollectionActivityOverviewConfig() {
    return {
        moduleLabel: '作品征集类活动',
        tags: ['征集类', '作品征集', '剩余 18 天'],
        statusClass: 'badge-green',
        actions: getActivityOverviewActions(),
        meta: getActivityOverviewBaseMeta('征集规则：报名、投稿、审核、推选、评选、获奖', ['投票配置：已开启作品投票，票数展示由活动设置控制']),
        metrics: [
            metricConfig('报名人数', '1,260', '今日新增 42', 'wy_activity_entry_user 未删除报名记录数', 'var(--success)', 'var(--primary)', 'registration'),
            metricConfig('投稿人数', '936', '投稿转化率 74.3%', 'wy_activity_creation 按 app_user_id 去重', 'var(--success)', 'var(--success)', 'submission-list'),
            metricConfig('作品总数', '1,128', '含审核中/成功/驳回', '当前活动未删除作品总数', 'var(--text-muted)', 'var(--info)', 'submission-list'),
            metricConfig('待审核作品', '86', '需优先处理', 'review_status = 1', 'var(--warning)', 'var(--warning)', 'submission-list'),
            metricConfig('投稿成功作品', '892', '审核通过率 79.1%', 'review_status = 2', 'var(--success)', 'var(--success)', 'submission-list'),
            metricConfig('已推选作品', '128', '覆盖 18 个单位', 'is_elect = Y', 'var(--text-muted)', 'var(--color-gold-500)', 'more-functions'),
            metricConfig('待评选作品', '214', '评委任务待完成', 'selection_status = 1/2', 'var(--warning)', 'var(--danger)', 'more-functions'),
            metricConfig('获奖作品', '36', '证书待发 12', 'wy_activity_award_record 作品获奖记录', 'var(--success)', 'var(--primary)', 'certificate-mgmt')
        ],
        trend: {
            title: '投稿趋势',
            desc: '按日查看报名人数、投稿人数和投稿成功作品变化',
            segments: ['报名人数', '投稿人数', '通过作品'],
            days: ['6/20','6/21','6/22','6/23','6/24','6/25','6/26'],
            values: [120, 188, 246, 388, 512, 746, 936]
        },
        todos: [
            { level: 'high', title: '86 件作品待审核', desc: '建议先处理临近评选批次的投稿作品。', targetPage: 'submission-list' },
            { level: 'medium', title: '214 件作品待评选', desc: '请提醒评委完成打分并检查评选进度。', targetPage: 'more-functions' },
            { level: 'medium', title: '12 份证书待发放', desc: '获奖名单已确认，待发放活动证明。', targetPage: 'certificate-mgmt' },
            { level: 'low', title: '投票配置需复核', desc: '投票展示规则和结束时间建议在活动结束前确认。', targetPage: 'more-functions' }
        ],
        funnel: {
            title: '征集进度',
            desc: '从报名到投稿、审核通过、推选评选的业务进度',
            steps: [
                ['报名人数', '1,260', 100, 'var(--primary)'],
                ['投稿人数', '936', 74, 'var(--info)'],
                ['投稿成功作品', '892', 71, 'var(--success)'],
                ['已推选作品', '128', 32, 'var(--color-gold-500)'],
                ['获奖作品', '36', 18, 'var(--warning)']
            ]
        },
        quickActions: [
            { label: '报名情况', desc: '查看报名用户', page: 'registration' },
            { label: '投稿情况', desc: '审核和管理作品', page: 'submission-list' },
            { label: '评选配置/管理', desc: '评委和评选进度', page: 'more-functions' },
            { label: '奖证管理', desc: '获奖名单和证书', page: 'certificate-mgmt' },
            { label: '活动动态', desc: '发布活动资讯', page: 'activity-dynamic' },
            { label: '推荐资源', desc: '配置推荐内容', page: 'recommend-resources' }
        ],
        detail: {
            title: '最近投稿 / 待审核作品',
            desc: '优先展示需要管理员处理的作品记录',
            page: 'submission-list',
            headers: ['作品名称', '投稿人', '选送单位', '审核状态', '提交时间'],
            rows: [
                ['《城市书房的一天》', '林悦', '集团总部', badgeHtml('待审核', 'badge-yellow'), '2026-06-26 15:42'],
                ['《旧书新读》', '黄嘉', '城东分馆', badgeHtml('投稿成功', 'badge-green'), '2026-06-26 14:18'],
                ['《阅途微光》', '苏晴', '少儿阅读中心', badgeHtml('待评选', 'badge-blue'), '2026-06-25 18:06'],
                ['《馆藏记忆》', '程默', '城西分馆', badgeHtml('驳回', 'badge-red'), '2026-06-25 11:23']
            ]
        },
        secondary: {
            title: '单位投稿表现',
            desc: '识别投稿推进效果较好的单位',
            page: 'unit-data',
            headers: ['单位名称', '报名人数', '投稿人数', '作品总数', '通过率'],
            rows: [
                ['集团总部', '286', '248', '318', rateHtml('86.8%', 'good')],
                ['城东分馆', '192', '156', '186', rateHtml('81.2%', 'good')],
                ['少儿阅读中心', '168', '124', '151', rateHtml('76.5%', '')],
                ['流动服务站', '96', '48', '62', rateHtml('51.6%', 'warn')]
            ]
        }
    };
}

function getTaskActivityOverviewConfig() {
    return {
        moduleLabel: '任务打卡活动',
        tags: ['任务打卡', '周期任务', '剩余 12 天'],
        statusClass: 'badge-green',
        actions: getActivityOverviewActions(),
        meta: getActivityOverviewBaseMeta('打卡规则：按任务生成应打卡记录，支持补卡、评分和积分', ['任务配置：5 个任务 / 每日 1 次 / 达标后可发证']),
        metrics: [
            metricConfig('报名人数', '1,086', '今日新增 38', 'wy_activity_entry_user 当前活动报名记录数', 'var(--success)', 'var(--primary)', 'registration'),
            metricConfig('任务数', '5', '进行中 4 个', 'wy_activity_clock_task 当前活动任务数量', 'var(--text-muted)', 'var(--info)', 'more-functions'),
            metricConfig('打卡人数', '812', '参与率 74.8%', 'finished_count > 0 的去重用户数', 'var(--success)', 'var(--success)', 'exam-records'),
            metricConfig('已打卡次数', '6,428', '应打卡 8,640', 'finished_count 合计', 'var(--success)', 'var(--primary)', 'exam-records'),
            metricConfig('今日打卡人数', '486', '较昨日 +32', '今日 checkin_status = 1 的去重用户数', 'var(--success)', 'var(--success)', 'exam-records'),
            metricConfig('缺卡次数', '318', '需提醒补卡', 'checkin_status = 2 的记录数', 'var(--warning)', 'var(--warning)', 'exam-records'),
            metricConfig('完成率', '74.4%', '已打卡/应打卡', 'finished_count / required_count', 'var(--text-muted)', 'var(--color-gold-500)'),
            metricConfig('违规下架记录', '12', '待复核 3 条', 'content_status = 2 的打卡记录数', 'var(--danger)', 'var(--danger)', 'exam-records')
        ],
        trend: {
            title: '打卡趋势',
            desc: '按日查看打卡人数、已打卡次数和缺卡次数变化',
            segments: ['打卡人数', '打卡次数', '缺卡次数'],
            days: ['6/20','6/21','6/22','6/23','6/24','6/25','6/26'],
            values: [286, 342, 398, 424, 466, 454, 486]
        },
        todos: [
            { level: 'high', title: '318 次缺卡待跟进', desc: '建议向缺卡用户发送补卡或提醒通知。', targetPage: 'exam-records' },
            { level: 'medium', title: '12 条违规下架记录', desc: '复核下架原因并处理用户申诉。', targetPage: 'exam-records' },
            { level: 'medium', title: '3 个单位完成率低于 60%', desc: '联系单位管理员确认组织推进情况。', targetPage: 'unit-data' },
            { level: 'low', title: '评分记录待同步', desc: '部分打卡任务评分尚未更新到积分流水。', targetPage: 'more-functions' }
        ],
        funnel: {
            title: '打卡进度',
            desc: '从报名到参与打卡、完成任务和达标的转化',
            steps: [
                ['报名人数', '1,086', 100, 'var(--primary)'],
                ['打卡人数', '812', 75, 'var(--info)'],
                ['连续打卡人数', '438', 40, 'var(--success)'],
                ['达标人数', '326', 30, 'var(--color-gold-500)']
            ]
        },
        quickActions: [
            { label: '报名情况', desc: '查看报名用户', page: 'registration' },
            { label: '任务打卡情况', desc: '查看用户打卡', page: 'exam-records' },
            { label: '单位数据情况', desc: '按单位统计', page: 'unit-data' },
            { label: '排行榜', desc: '积分和连续打卡', page: 'leaderboard' },
            { label: '奖证管理', desc: '达标证明发放', page: 'certificate-mgmt' },
            { label: '更多功能', desc: '积分/评分/规则', page: 'more-functions' }
        ],
        detail: {
            title: '任务数据列表',
            desc: '查看任务维度下的应打卡与完成情况',
            page: 'exam-records',
            headers: ['任务名称', '应打卡次数', '已打卡次数', '缺卡次数', '完成率'],
            rows: [
                ['每日阅读 30 分钟', '2,172', '1,768', '84', rateHtml('81.4%', 'good')],
                ['上传读书笔记', '2,172', '1,526', '132', rateHtml('70.3%', '')],
                ['完成主题练习', '1,086', '746', '58', rateHtml('68.7%', 'warn')],
                ['分享阅读心得', '1,086', '612', '44', rateHtml('56.4%', 'risk')]
            ]
        },
        secondary: {
            title: '用户打卡情况',
            desc: '展示最近需要关注的用户记录',
            page: 'exam-records',
            headers: ['用户姓名', '选送单位', '应打卡', '已打卡', '缺卡', '积分'],
            rows: [
                ['林悦', '集团总部', '12', '12', '0', '240'],
                ['黄嘉', '城东分馆', '12', '10', '2', '198'],
                ['苏晴', '少儿阅读中心', '12', '8', '4', '156'],
                ['程默', '城西分馆', '12', '7', '5', '142']
            ]
        }
    };
}

function getOfflineActivityOverviewConfig() {
    return {
        moduleLabel: '活动报名活动',
        tags: ['活动报名', '线下预约', '剩余 5 天'],
        statusClass: 'badge-green',
        actions: getActivityOverviewActions(),
        meta: getActivityOverviewBaseMeta('报名规则：按活动报名，一次选择多个场次，支持审核、签到和签退', ['场次设置：8 场 / 总名额 1,200 / 需工作人员签到']),
        metrics: [
            metricConfig('场次数', '8', '即将开始 2 场', 'wy_activity_reserve_session 未删除场次数量', 'var(--text-muted)', 'var(--primary)', 'registration'),
            metricConfig('总名额', '1,200', '全部场次名额合计', 'max_seats_no 合计', 'var(--text-muted)', 'var(--info)'),
            metricConfig('剩余名额', '268', '余量 22.3%', 'remain_seats_no 合计', 'var(--success)', 'var(--success)'),
            metricConfig('活动报名人数', '486', '今日新增 42', '报名成功主记录数', 'var(--success)', 'var(--primary)', 'registration'),
            metricConfig('待审核报名', '74', '需今日处理', '待审核主记录数', 'var(--warning)', 'var(--warning)', 'registration'),
            metricConfig('签到人数', '618', '签到率 66.3%', 'sign_in_status = Y 的记录数', 'var(--success)', 'var(--success)', 'offline-signin-stats'),
            metricConfig('未签到人数', '314', '活动开始前提醒', 'status = 3 且未签到记录数', 'var(--warning)', 'var(--warning)', 'offline-signin-stats'),
            metricConfig('签退人数', '486', '签退率 78.6%', 'sign_out_status = Y 的记录数', 'var(--text-muted)', 'var(--color-gold-500)', 'offline-signin-stats')
        ],
        trend: {
            title: '报名 / 签到趋势',
            desc: '按日查看活动报名人数、签到人数和待审核报名变化',
            segments: ['报名成功', '签到人数', '待审核'],
            days: ['6/20','6/21','6/22','6/23','6/24','6/25','6/26'],
            values: [126, 188, 266, 342, 486, 618, 932]
        },
        todos: [
            { level: 'high', title: '74 条报名待审核', desc: '建议在场次开始前完成审核。', targetPage: 'registration' },
            { level: 'medium', title: '314 人未签到', desc: '可向报名成功但未签到人员发送提醒。', targetPage: 'offline-signin-stats' },
            { level: 'medium', title: '2 个场次名额不足', desc: '剩余名额低于 10%，建议评估扩容或加场。', targetPage: 'registration' },
            { level: 'low', title: '3 名工作人员未排班', desc: '请补充场次签到工作人员。', targetPage: 'offline-checkin-staff' }
        ],
        funnel: {
            title: '场次进度',
            desc: '从名额到报名成功、签到和签退的业务进度',
            steps: [
                ['总名额', '1,200', 100, 'var(--primary)'],
                ['场次报名人数', '932', 78, 'var(--info)'],
                ['签到人数', '618', 52, 'var(--success)'],
                ['签退人数', '486', 41, 'var(--color-gold-500)']
            ]
        },
        quickActions: [
            { label: '报名情况', desc: '审核和查看报名', page: 'registration' },
            { label: '工作人员', desc: '签到人员配置', page: 'offline-checkin-staff' },
            { label: '签到/签退情况', desc: '按场次查看签到签退', page: 'offline-signin-stats' },
            { label: '单位数据情况', desc: '按单位查看报名', page: 'unit-data' },
            { label: '活动反馈', desc: '满意度反馈', page: 'activity-feedback' },
            { label: '更多功能', desc: '资源和扩展', page: 'more-functions' }
        ],
        detail: {
            title: '场次数据列表',
            desc: '按场次查看名额、报名、签到和签退情况',
            page: 'registration',
            headers: ['场次名称', '举办时间', '名额', '报名成功', '签到', '剩余名额'],
            rows: [
                ['亲子阅读专场', '06-27 10:00', '200', '186', '142', '14'],
                ['古籍修复体验', '06-28 14:00', '120', '118', '84', '2'],
                ['馆员导览活动', '06-29 09:30', '180', '132', '96', '48'],
                ['城市书房沙龙', '06-30 19:00', '160', '148', '112', '12']
            ]
        },
        secondary: {
            title: '最近报名记录',
            desc: '展示最新提交和待审核报名',
            page: 'registration',
            headers: ['报名人', '手机号', '场次', '状态', '提交时间'],
            rows: [
                ['林悦', '138****1234', '亲子阅读专场', badgeHtml('报名成功', 'badge-green'), '2026-06-26 16:18'],
                ['黄嘉', '136****9012', '古籍修复体验', badgeHtml('待审核', 'badge-yellow'), '2026-06-26 16:25'],
                ['苏晴', '133****1122', '城市书房沙龙', badgeHtml('报名成功', 'badge-green'), '2026-06-26 16:42'],
                ['程默', '132****4509', '馆员导览活动', badgeHtml('已取消', 'badge-gray'), '2026-06-26 17:05']
            ]
        }
    };
}

function getQuizActivityOverviewUnifiedConfig() {
    const mode = normalizeActivityOverviewMode(currentManageActivity.quizMode || activityOverviewMode);
    activityOverviewMode = mode;
    const old = getActivityOverviewConfig();
    const modeLabel = old.modeLabel;
    const metricMap = {
        exam: [
            metricConfig('报名人数', '528', '较昨日 +32', 'wy_activity_entry_user 当前活动报名记录数', 'var(--success)', 'var(--primary)', 'registration'),
            metricConfig('考试场次数', '4', '已发布成绩 1 场', 'wy_activity_quiz_exam 当前活动场次数', 'var(--text-muted)', 'var(--info)', 'paper-review'),
            metricConfig('答题人数', '477', '参与率 90.3%', 'involved_count > 0 去重用户数', 'var(--success)', 'var(--success)', 'exam-records'),
            metricConfig('已交卷人次', '386', '交卷率 73.1%', 'submit_time 不为空的答卷场次记录数', 'var(--success)', 'var(--primary)', 'exam-records'),
            metricConfig('待阅卷试卷', '42', '含主观题试卷', '有主观题且 status != Y', 'var(--warning)', 'var(--warning)', 'paper-review'),
            metricConfig('待发布成绩场次', '3', '需完成阅卷后发布', 'is_result = N 的考试场次', 'var(--warning)', 'var(--danger)', 'paper-review'),
            metricConfig('平均分', '78.5', '满分 100', '参与人员总分 / 参与人数', 'var(--text-muted)', 'var(--color-gold-500)'),
            metricConfig('及格率', '82.3%', '及格线 60 分', '及格人数 / 已交卷人数', 'var(--success)', 'var(--success)')
        ],
        daily: [
            metricConfig('报名人数', '528', '较昨日 +28', 'wy_activity_entry_user 当前活动报名记录数', 'var(--success)', 'var(--primary)', 'registration'),
            metricConfig('答题人数', '486', '至少答题 1 天', 'answer_days > 0 的用户数', 'var(--success)', 'var(--success)', 'exam-records'),
            metricConfig('今日答题人数', '386', '今日未答 176', '今日存在答题记录的去重用户数', 'var(--success)', 'var(--primary)', 'exam-records'),
            metricConfig('答题总次数', '2,184', '人均 4.5 次', '每日答题记录总数', 'var(--text-muted)', 'var(--info)', 'exam-records'),
            metricConfig('达标人数', '324', '达标率 83.9%', 'psss_days > 0 的用户数', 'var(--success)', 'var(--success)', 'user-qualified'),
            metricConfig('达标天数合计', '1,680', '今日达标 324', '所有用户达标天数合计', 'var(--success)', 'var(--color-gold-500)', 'user-qualified'),
            metricConfig('总得分', '402,816', '含分享奖励得分', '用户总得分合计', 'var(--text-muted)', 'var(--primary)', 'daily-score-detail'),
            metricConfig('平均分', '82.8', '未答题用户不计入', '参与人员总分 / 参与人数', 'var(--text-muted)', 'var(--warning)')
        ],
        level: [
            metricConfig('报名人数', '528', '较昨日 +18', 'wy_activity_entry_user 当前活动报名记录数', 'var(--success)', 'var(--primary)', 'registration'),
            metricConfig('总关卡数', '3', '顺序解锁', '当前活动配置关卡数量', 'var(--text-muted)', 'var(--info)', 'exam-records'),
            metricConfig('闯关人数', '438', '参与率 83.0%', 'record_count > 0 的用户数', 'var(--success)', 'var(--success)', 'exam-records'),
            metricConfig('闯关次数', '1,286', '人均 2.9 次', 'record_count 合计', 'var(--text-muted)', 'var(--primary)', 'exam-records'),
            metricConfig('已过关数', '784', '含重复挑战过关', 'passed_count 合计', 'var(--success)', 'var(--color-gold-500)', 'level-answer-detail'),
            metricConfig('闯关成功人数', '168', '全关卡通过', 'is_clear = Y 的用户数', 'var(--success)', 'var(--success)', 'exam-records'),
            metricConfig('闯关成功率', '38.4%', '168 / 438', '闯关成功人数 / 闯关人数', 'var(--text-muted)', 'var(--warning)'),
            metricConfig('平均过关数', '1.8', '共 3 关', '已过关数合计 / 闯关人数', 'var(--text-muted)', 'var(--info)')
        ]
    };
    return {
        moduleLabel: `${modeLabel}活动`,
        tags: ['知识问答', modeLabel, '剩余 18 天'],
        showModeTabs: true,
        statusClass: 'badge-green',
        actions: getActivityOverviewActions(),
        meta: getActivityOverviewBaseMeta(old.meta[2].replace(/^.*?：/, `${modeLabel}规则：`), [old.meta[3]]),
        metrics: metricMap[mode],
        trend: old.trend,
        todos: old.todos.map(args => ({ level: args[0], title: args[1], desc: args[2], targetPage: args[1].includes('阅卷') ? 'paper-review' : 'exam-records' })),
        funnel: old.funnel,
        quickActions: getQuizOverviewQuickActions(mode),
        detail: {
            title: '组织完成情况',
            desc: '快速识别推进最好和最需要跟进的单位',
            page: 'unit-data',
            headers: ['组织名称', '应参与', mode === 'level' ? '已通关' : '已完成', '完成率', mode === 'level' ? '平均过关数' : '平均分', mode === 'level' ? '成功率' : '通过率'],
            rows: old.orgRows.map(row => [row[0], row[1], row[2], rateHtml(row[3], row[6]), row[4], rateHtml(row[5], row[6])])
        },
        secondary: {
            title: old.questionTitle,
            desc: old.questionDesc,
            page: 'exam-records',
            headers: ['题目', '题型', '知识点', mode === 'level' ? '通过率' : '正确率', '错误人数'],
            rows: old.questionRows.map(row => [row[0], badgeHtml(row[1], questionTypeBadgeClass(row[1])), row[2], rateHtml(`${row[3]}%`, row[3] < 55 ? 'risk' : 'warn'), row[4]])
        }
    };
}

function getQuizOverviewQuickActions(mode) {
    const common = [
        { label: '报名情况', desc: '查看报名用户', page: 'registration' },
        { label: '用户答题情况', desc: '答卷和记录', page: 'exam-records' },
        { label: '单位数据情况', desc: '按单位统计', page: 'unit-data' },
        { label: '排行榜', desc: '成绩排行', page: 'leaderboard' },
        { label: '奖证管理', desc: '证书发放', page: 'certificate-mgmt' }
    ];
    if (mode === 'exam') return [{ label: '阅卷管理', desc: '分配和发布成绩', page: 'paper-review' }, ...common];
    if (mode === 'daily') return [{ label: '得分明细', desc: '得分流水', page: 'daily-score-detail' }, { label: '用户达标情况', desc: '达标天数', page: 'user-qualified' }, ...common.slice(0, 4)];
    return [{ label: '关卡记录', desc: '查看过关详情', page: 'level-user-detail' }, { label: '过关详情', desc: '关卡明细', page: 'level-answer-detail' }, ...common.slice(0, 4)];
}

function normalizeActivityOverviewMode(value) {
    const text = String(value || '').trim();
    if (text.includes('每日')) return 'daily';
    if (text.includes('闯关') || text.includes('关卡')) return 'level';
    if (ACTIVITY_OVERVIEW_MODES.some(item => item.key === text)) return text;
    return 'exam';
}

function getVoteActivityOverviewConfigFromManage() {
    const stats = currentManageActivity.voteStats || {};
    const validVotes = Number(stats.validVotes || 42860);
    const voters = Number(stats.voters || 12860);
    const visits = Number(stats.visits || 43680);
    const candidateCount = Number(stats.candidateCount || stats.candidateUnits || 128);
    const abnormalVotes = Number(stats.abnormalVotes || 126);
    const voteRate = visits ? `${(voters / visits * 100).toFixed(1)}%` : '0%';
    return {
        moduleLabel: '投票活动',
        tags: ['投票', '独立投票', '剩余 7 天'],
        statusClass: 'badge-blue',
        actions: getActivityOverviewActions(),
        meta: getActivityOverviewBaseMeta('投票规则：候选项投票、异常票复核、排行统计', ['数据来源：候选项表、投票记录表、异常投票表预留接口']),
        metrics: [
            metricConfig('候选项数量', formatOverviewNumber(candidateCount), '当前活动候选项总数', '候选项表 mock 字段', 'var(--text-muted)', 'var(--primary)', 'vote-settings'),
            metricConfig('投票人数', formatOverviewNumber(voters), '有效投票用户去重数', '投票记录表按用户去重', 'var(--success)', 'var(--success)', 'vote-records'),
            metricConfig('投票总数', formatOverviewNumber(validVotes), '有效票数合计', '投票记录表有效票数合计', 'var(--success)', 'var(--primary)', 'vote-records'),
            metricConfig('当前领先候选项', '书香校园主题海报', '12,856 票', '候选项统计表最高票候选项', 'var(--text-muted)', 'var(--info)', 'vote-stats'),
            metricConfig('异常投票数', formatOverviewNumber(abnormalVotes), '待复核异常记录', '异常投票表标记记录数', 'var(--danger)', 'var(--danger)', 'vote-risk-records'),
            metricConfig('投票转化率', voteRate, '投票人数 / 访客数', '访问统计 + 投票记录', 'var(--text-muted)', 'var(--color-gold-500)')
        ],
        trend: {
            title: '投票趋势',
            desc: '按日查看有效票数、投票人数和异常票变化',
            segments: ['有效票数', '投票人数', '异常票'],
            days: ['6/20','6/21','6/22','6/23','6/24','6/25','6/26'],
            values: [3280, 5840, 9280, 14860, 22640, 31820, validVotes]
        },
        todos: [
            { level: 'high', title: `${formatOverviewNumber(abnormalVotes)} 条异常投票待复核`, desc: '请确认刷票、重复投票和异常设备记录。', targetPage: 'vote-risk-records' },
            { level: 'medium', title: '3 个候选项票数波动异常', desc: '建议查看候选项投票明细和来源分布。', targetPage: 'vote-stats' },
            { level: 'medium', title: '2 个单位参与率偏低', desc: '可联系单位管理员组织投票提醒。', targetPage: 'vote-unit-data' },
            { level: 'low', title: '结果发布规则待确认', desc: '活动结束前确认是否自动展示排行。', targetPage: 'vote-settings' }
        ],
        funnel: {
            title: '投票进度',
            desc: '从访问到参与投票、产生有效票和异常复核的转化',
            steps: [
                ['访客数', formatOverviewNumber(visits), 100, 'var(--primary)'],
                ['投票人数', formatOverviewNumber(voters), Math.round(voters / visits * 100), 'var(--info)'],
                ['有效票数', formatOverviewNumber(validVotes), 82, 'var(--success)'],
                ['异常票数', formatOverviewNumber(abnormalVotes), 8, 'var(--danger)']
            ]
        },
        quickActions: [
            { label: '投票情况', desc: '查看投票记录', page: 'vote-records' },
            { label: '数据统计', desc: '候选项和时段', page: 'vote-stats' },
            { label: '单位数据情况', desc: '单位参与分布', page: 'vote-unit-data' },
            { label: '异常投票记录', desc: '复核风险记录', page: 'vote-risk-records' },
            { label: '活动设置', desc: '规则和结果发布', page: 'vote-settings' }
        ],
        detail: {
            title: '候选项票数排行',
            desc: '展示当前票数较高的候选项',
            page: 'vote-stats',
            headers: ['候选项', '所属单位', '有效票数', '占比', '状态'],
            rows: [
                ['书香校园主题海报', '集团总部', '12,856', '30.2%', badgeHtml('领先', 'badge-green')],
                ['城市书房摄影作品', '城东分馆', '11,342', '26.6%', badgeHtml('正常', 'badge-blue')],
                ['朗读者风采展示', '少儿阅读中心', '9,284', '21.8%', badgeHtml('正常', 'badge-blue')],
                ['阅读推广人故事', '城西分馆', '6,902', '16.2%', badgeHtml('正常', 'badge-blue')]
            ]
        },
        secondary: {
            title: '异常投票记录',
            desc: '需要管理员复核的风险记录',
            page: 'vote-risk-records',
            headers: ['风险类型', '涉及候选项', '票数', '发现时间', '处理状态'],
            rows: [
                ['同设备高频投票', '书香校园主题海报', '38', '2026-06-26 16:40', badgeHtml('待复核', 'badge-yellow')],
                ['IP 集中异常', '城市书房摄影作品', '26', '2026-06-26 15:12', badgeHtml('待复核', 'badge-yellow')],
                ['短时重复提交', '朗读者风采展示', '19', '2026-06-26 14:36', badgeHtml('已忽略', 'badge-gray')]
            ]
        }
    };
}

function metricConfig(label, value, sub, note, subColor, valueColor, targetPage) {
    return { label, value, sub, note, subColor, valueColor, targetPage };
}

function badgeHtml(label, cls) {
    return `<span class="badge ${cls}">${escapeHtml(label)}</span>`;
}

function rateHtml(label, state) {
    const stateClass = state ? ` ${state}` : '';
    return `<span class="activity-rate${stateClass}">${escapeHtml(label)}</span>`;
}

function formatOverviewNumber(value) {
    return Number(value || 0).toLocaleString('zh-CN');
}

function renderActivityOverviewSimpleTable(headers, rows, extraClass = '') {
    return `
    <table class="activity-overview-table ${extraClass}">
        <thead><tr>${headers.map(header => `<th>${escapeHtml(header)}</th>`).join('')}</tr></thead>
        <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${isHtmlCell(cell) ? cell : escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}
        </tbody>
    </table>`;
}

function isHtmlCell(value) {
    return typeof value === 'string' && /<[^>]+>/.test(value);
}

function openActivityOverviewAction(label = '操作') {
    openModal(label, `<p>${label}功能已预留，后续接入活动接口后按当前活动范围执行。</p>`, null, { confirmText: '知道了', hideCancel: true, modalClass: 'modal-sm' });
}

function renderActivityOverview() {
    const config = getUnifiedActivityOverviewConfig();
    if (!config) {
        return renderPlanningEmptyPage('活动概览', '当前活动类型暂未配置活动概况。');
    }
    return `
    ${pageHeader('📊 活动概况', '活动管理 / [当前活动] / 活动概况')}
    ${config.showModeTabs ? renderActivityOverviewModeTabs() : ''}

    <section class="activity-overview-hero">
        <div class="activity-overview-hero-main">
            <div class="activity-status-line">
                <span class="badge ${config.statusClass || 'badge-green'}">${currentManageActivity.status || '进行中'}</span>
                ${config.tags.map(tag => `<span>${tag}</span>`).join('')}
            </div>
            <h2>${escapeHtml(currentManageActivity.name)}</h2>
            <div class="activity-meta-grid">
                ${config.meta.map(item => `<span>${escapeHtml(item)}</span>`).join('')}
            </div>
        </div>
        <div class="activity-overview-actions">
            ${config.actions.map(action => `<button class="btn ${action.primary ? 'btn-primary' : 'btn-outline'}" type="button" onclick="${action.onclick || 'openActivityOverviewAction()'}">${action.label}</button>`).join('')}
        </div>
    </section>

    <div class="activity-metric-grid">
        ${config.metrics.map(metric => statMetricCard(metric.label, metric.value, metric.sub, metric.note, metric.subColor, metric.valueColor, metric.targetPage)).join('')}
    </div>

    <div class="activity-overview-grid">
        <section class="card activity-chart-card">
            <div class="activity-card-head">
                <div>
                    <h3>${config.trend.title}</h3>
                    <p>${config.trend.desc}</p>
                </div>
                <div class="activity-segment">
                    ${config.trend.segments.map((label, index) => `<button class="${index === 0 ? 'active' : ''}">${label}</button>`).join('')}
                </div>
            </div>
            ${renderTrendChart(config.trend)}
        </section>

        <section class="card activity-score-card">
            <div class="activity-card-head compact">
                <div>
                    <h3>待处理事项</h3>
                    <p>按当前活动数据生成的运营提醒</p>
                </div>
            </div>
            <div class="activity-todo-list">
                ${config.todos.map(item => todoItem(item.level, item.title, item.desc, item.targetPage)).join('')}
            </div>
        </section>
    </div>

    <div class="activity-overview-grid lower">
        <section class="card">
            <div class="activity-card-head">
                <div>
                    <h3>${config.funnel.title}</h3>
                    <p>${config.funnel.desc}</p>
                </div>
            </div>
            <div class="activity-funnel">
                ${config.funnel.steps.map(args => funnelStep(...args)).join('')}
            </div>
        </section>

        <section class="card">
            <div class="activity-card-head">
                <div>
                    <h3>快捷入口</h3>
                    <p>${config.moduleLabel}常用管理入口</p>
                </div>
            </div>
            <div class="activity-quick-grid">
                ${config.quickActions.map(action => `<button class="activity-quick-action" type="button" onclick="${action.onclick || `navigateTo('${action.page || 'more-functions'}')`}"><strong>${action.label}</strong><span>${action.desc || '进入管理'}</span></button>`).join('')}
            </div>
        </section>
    </div>

    <div class="activity-overview-grid table-row">
        <section class="card activity-table-card">
            <div class="activity-card-head">
                <div>
                    <h3>${config.detail.title}</h3>
                    <p>${config.detail.desc}</p>
                </div>
                <span class="action-link" onclick="navigateTo('${config.detail.page || 'more-functions'}')">查看全部</span>
            </div>
            ${renderActivityOverviewSimpleTable(config.detail.headers, config.detail.rows)}
        </section>

        <section class="card activity-table-card">
            <div class="activity-card-head">
                <div>
                    <h3>${config.secondary.title}</h3>
                    <p>${config.secondary.desc}</p>
                </div>
                <span class="action-link" onclick="navigateTo('${config.secondary.page || 'more-functions'}')">查看全部</span>
            </div>
            ${renderActivityOverviewSimpleTable(config.secondary.headers, config.secondary.rows, 'question')}
        </section>
    </div>`;
}

function renderTaskActivityOverview() {
    return renderActivityOverview();
}

function renderCollectionActivityOverview() {
    return renderActivityOverview();
}

function statMetricCard(label, value, sub, note, subColor, valueColor, targetPage) {
    const clickableClass = targetPage ? ' is-clickable' : '';
    const clickAttr = targetPage ? ` role="button" tabindex="0" onclick="navigateTo('${targetPage}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();navigateTo('${targetPage}')}"` : '';
    return `
    <div class="card activity-metric-card${clickableClass}"${clickAttr}>
        <div class="activity-metric-label">${label}</div>
        <div class="activity-metric-value" style="color:${valueColor}">${value}</div>
        <div class="activity-metric-sub" style="color:${subColor}">${sub}</div>
        <div class="activity-metric-note">${note}</div>
    </div>`;
}

function scoreBar(label, tag, pct, color) {
    return `
    <div class="activity-score-row">
        <div class="activity-score-label">
            <strong>${label}</strong>
            <span>${tag}</span>
        </div>
        <div class="activity-score-track">
            <div style="width:${pct}%;background:${color}"></div>
        </div>
        <span class="activity-score-pct">${pct}%</span>
    </div>`;
}

function renderTrendChart(trend = {}) {
    // Simple inline SVG line chart
    const days = trend.days || ['3/06','3/09','3/12','3/15','3/18','3/21','3/24','3/26'];
    const vals = trend.values || [45, 82, 110, 158, 210, 268, 340, 528];
    const max = Math.max(...vals);
    const W = 560, H = 180, pad = 24;
    const step = (W - pad * 2) / (vals.length - 1);
    const pts = vals.map((v, i) => `${pad + i * step},${H - pad - (v / max) * (H - pad * 2)}`).join(' ');
    const areaPath = `M${pad},${H - pad} L${pts.split(' ').join(' L')} L${pad + (vals.length - 1) * step},${H - pad} Z`;

    return `
    <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:220px" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="var(--primary)" stop-opacity="0"/>
            </linearGradient>
        </defs>
        <path d="${areaPath}" fill="url(#grad1)"/>
        <polyline points="${pts}" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        ${vals.map((v, i) => {
            const x = pad + i * step;
            const y = H - pad - (v / max) * (H - pad * 2);
            return `<circle cx="${x}" cy="${y}" r="3.5" fill="#fff" stroke="var(--primary)" stroke-width="2"/>`;
        }).join('')}
        ${days.map((d, i) => `<text x="${pad + i * step}" y="${H - 6}" text-anchor="middle" font-size="10" fill="var(--text-muted)">${d}</text>`).join('')}
    </svg>`;
}

function funnelStep(label, value, pct, color) {
    return `
    <div class="activity-funnel-step">
        <div class="activity-funnel-top"><span>${label}</span><strong>${value}</strong></div>
        <div class="activity-funnel-track"><div style="width:${pct}%;background:${color}"></div></div>
        <div class="activity-funnel-pct">${pct}%</div>
    </div>`;
}

function todoItem(level, title, desc, targetPage) {
    const map = { high: '高', medium: '中', low: '低' };
    const clickableClass = targetPage ? ' is-clickable' : '';
    const clickAttr = targetPage ? ` role="button" tabindex="0" onclick="navigateTo('${targetPage}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();navigateTo('${targetPage}')}"` : '';
    return `
    <div class="activity-todo-item ${level}${clickableClass}"${clickAttr}>
        <span>${map[level]}</span>
        <div><strong>${title}</strong><p>${desc}</p></div>
    </div>`;
}

function orgRow(name, total, done, completion, avg, pass, state) {
    const stateClass = state ? ` ${state}` : '';
    return `<tr><td><strong>${name}</strong></td><td>${total}</td><td>${done}</td><td><span class="activity-rate${stateClass}">${completion}</span></td><td>${avg}</td><td>${pass}</td></tr>`;
}

function questionRow(title, type, topic, rate, wrong) {
    return `<tr><td><strong>${title}</strong></td><td><span class="badge ${questionTypeBadgeClass(type)}">${type}</span></td><td>${topic}</td><td><span class="activity-rate ${rate < 55 ? 'risk' : 'warn'}">${rate}%</span></td><td>${wrong}</td></tr>`;
}

// ===== 机构管理 =====
registerPage('org-mgmt', () => renderPublicFeatureEmptyPage());
registerPage('activity-feedback', () => renderActivityFeedbackPage());

let activityFeedbackFilters = getDefaultActivityFeedbackFilters();
let activityFeedbackDraft = { ...activityFeedbackFilters };

const ACTIVITY_FEEDBACK_ROWS = [
    { id: 'fb-001', userName: '林悦', phone: '138****1234', userNo: '123456', org: '广州市图书馆', submittedAt: '2026-06-26 16:18', score: 5, scoreLabel: '非常满意', comment: '签到流程很顺畅，讲师内容也很扎实，现场志愿者响应很快。' },
    { id: 'fb-002', userName: '黄嘉', phone: '136****9012', userNo: '345678', org: '天河区图书馆', submittedAt: '2026-06-26 16:25', score: 4, scoreLabel: '满意', comment: '整体不错，建议下次增加亲子互动环节，孩子会更投入。' },
    { id: 'fb-003', userName: '苏晴', phone: '133****1122', userNo: '789012', org: '海珠区图书馆', submittedAt: '2026-06-26 16:42', score: 3, scoreLabel: '一般', comment: '场地后排音响有些听不清，希望后续优化设备和指引。' },
    { id: 'fb-004', userName: '程默', phone: '132****4509', userNo: '112358', org: '佛山市图书馆', submittedAt: '2026-06-26 17:05', score: 2, scoreLabel: '不满意', comment: '报名后没有及时收到入场提醒，差点错过活动开始时间。' },
    { id: 'fb-005', userName: '赵明', phone: '134****2345', userNo: '678901', org: '徐汇区文化馆', submittedAt: '2026-06-26 17:18', score: 1, scoreLabel: '很不满意', comment: '现场座位安排比较混乱，签到后找座位花了很多时间。' }
];

function getDefaultActivityFeedbackFilters() {
    return {
        keyword: '',
        score: '全部评分',
        submittedAt: ''
    };
}

function renderActivityFeedbackPage() {
    const rows = getActivityFeedbackRows();
    return `
    <section class="card activity-feedback-filter-card">
        <div class="activity-feedback-filter-grid compact">
            <label>
                <span>用户信息</span>
                <input class="form-control" value="${escapeHtml(activityFeedbackDraft.keyword)}" placeholder="姓名 / 手机号 / 文遇号 / 选送单位" oninput="updateActivityFeedbackDraft('keyword', this.value)">
            </label>
            <label>
                <span>满意度评分</span>
                <select class="form-control" onchange="updateActivityFeedbackDraft('score', this.value)">
                    ${['全部评分', '5分', '4分', '3分', '2分', '1分'].map(item => `<option ${activityFeedbackDraft.score === item ? 'selected' : ''}>${item}</option>`).join('')}
                </select>
            </label>
            <label>
                <span>提交时间</span>
                <input class="form-control" value="${escapeHtml(activityFeedbackDraft.submittedAt)}" placeholder="2026-06-26 至 2026-06-27" oninput="updateActivityFeedbackDraft('submittedAt', this.value)">
            </label>
            <div class="activity-feedback-filter-actions">
                <button class="btn btn-primary" type="button" onclick="applyActivityFeedbackFilters()">查询</button>
                <button class="btn btn-outline" type="button" onclick="resetActivityFeedbackFilters()">重置</button>
                <button class="btn btn-outline" type="button" onclick="openActivityFeedbackExport()">导出</button>
            </div>
        </div>
    </section>
    <section class="card activity-feedback-table-card">
        <div class="activity-feedback-table-head">
            <div>
                <h3>反馈列表</h3>
            </div>
        </div>
        ${renderActivityFeedbackTable(rows)}
    </section>`;
}

function updateActivityFeedbackDraft(field, value) {
    activityFeedbackDraft[field] = value;
}

function applyActivityFeedbackFilters() {
    activityFeedbackFilters = { ...activityFeedbackDraft };
    navigateTo('activity-feedback');
}

function resetActivityFeedbackFilters() {
    activityFeedbackFilters = getDefaultActivityFeedbackFilters();
    activityFeedbackDraft = { ...activityFeedbackFilters };
    navigateTo('activity-feedback');
}

function getActivityFeedbackRows() {
    const filters = activityFeedbackFilters;
    return ACTIVITY_FEEDBACK_ROWS
        .filter(row => {
            if (filters.keyword) {
                const keyword = filters.keyword.trim();
                const text = [row.userName, row.phone, row.userNo, row.org].join(' ');
                if (!text.includes(keyword)) return false;
            }
            if (filters.score !== '全部评分' && `${row.score}分` !== filters.score) return false;
            if (filters.submittedAt && !isActivityFeedbackDateInRange(row.submittedAt, filters.submittedAt)) return false;
            return true;
        })
        .sort((a, b) => new Date(String(b.submittedAt).replace(/-/g, '/')) - new Date(String(a.submittedAt).replace(/-/g, '/')));
}

function isActivityFeedbackDateInRange(dateText, rangeText) {
    const parts = String(rangeText).split('至').map(item => item.trim()).filter(Boolean);
    if (!parts.length) return true;
    const current = new Date(String(dateText).replace(/-/g, '/')).getTime() || 0;
    const start = parts[0] ? new Date(`${parts[0].replace(/-/g, '/')} 00:00`).getTime() : 0;
    const end = parts[1] ? new Date(`${parts[1].replace(/-/g, '/')} 23:59`).getTime() : Number.MAX_SAFE_INTEGER;
    return current >= start && current <= end;
}

function renderActivityFeedbackTable(rows) {
    if (!rows.length) {
        return `
        <div class="empty-state">
            <div class="empty-state-title">未找到符合条件的反馈记录</div>
            <div class="empty-state-desc">请调整筛选条件后重试。</div>
        </div>`;
    }
    return `
    <div class="table-wrap activity-feedback-table-wrap">
        <table class="activity-feedback-table">
            <thead>
                <tr>
                    <th>序号</th>
                    <th>文遇号</th>
                    <th>用户姓名</th>
                    <th>手机号</th>
                    <th>选送单位</th>
                    <th>满意度</th>
                    <th>反馈内容</th>
                    <th>提交时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                ${rows.map((row, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${escapeHtml(row.userNo)}</td>
                        <td>${escapeHtml(row.userName)}</td>
                        <td>${escapeHtml(row.phone)}</td>
                        <td>${escapeHtml(row.org)}</td>
                        <td>${renderActivityFeedbackScore(row.score, row.scoreLabel)}</td>
                        <td><span class="activity-feedback-comment" title="${escapeHtml(row.comment)}">${escapeHtml(row.comment)}</span></td>
                        <td>${escapeHtml(row.submittedAt)}</td>
                        <td>
                            <div class="activity-feedback-row-actions">
                                <button class="btn btn-outline btn-sm" type="button" onclick="openActivityFeedbackDetail('${row.id}')">查看详情</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ${renderStandardPagination(rows.length)}`;
}

function renderActivityFeedbackScore(score, label) {
    return `
    <div class="activity-feedback-score">
        <strong>${score}.0</strong>
        <span>${escapeHtml(label)}</span>
    </div>`;
}

function openActivityFeedbackDetail(id) {
    const row = ACTIVITY_FEEDBACK_ROWS.find(item => item.id === id);
    if (!row) return;
    openModal('反馈详情', `
        <div class="activity-feedback-detail-modal">
            <div class="activity-feedback-detail-head">
                <strong>${escapeHtml(row.userName)}</strong>
                <span>${escapeHtml(row.phone)} · ${escapeHtml(row.userNo)} · ${escapeHtml(row.org)}</span>
            </div>
            <div class="activity-feedback-detail-grid">
                <div><span>满意度</span><strong>${row.score}.0 分 / ${escapeHtml(row.scoreLabel)}</strong></div>
                <div><span>提交时间</span><strong>${escapeHtml(row.submittedAt)}</strong></div>
                <div><span>文遇号</span><strong>${escapeHtml(row.userNo)}</strong></div>
                <div><span>所属单位</span><strong>${escapeHtml(row.org)}</strong></div>
            </div>
            <label class="activity-feedback-detail-block">
                <span>反馈内容</span>
                <p>${escapeHtml(row.comment)}</p>
            </label>
        </div>
    `, null, { confirmText: '知道了', hideCancel: true, modalClass: 'modal-lg' });
}

function openActivityFeedbackExport() {
    openModal('导出反馈', '<p>将按当前筛选条件导出活动反馈列表。</p>', null, { confirmText: '开始导出', modalClass: 'modal-sm' });
}

function roleBadge(role) {
    const map = {
        '主': { cls: 'badge-category', label: '主办单位' },
        '承': { cls: 'badge-quiz', label: '承办单位' },
        '协': { cls: 'badge-mode', label: '协办单位' },
        '支': { cls: 'badge-gray', label: '支持单位' }
    };
    const m = map[role] || map['支'];
    return `<span class="badge ${m.cls}" style="display:inline-flex;align-items:center;gap:6px;font-weight:600">
        <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:currentColor;color:#fff;text-align:center;line-height:16px;font-size:10px;opacity:0.8">${role}</span>
        ${m.label}
    </span>`;
}

// ===== 奖证管理 =====
registerPage('certificate-mgmt', () => renderPlanningEmptyPage('奖项列表', '奖项列表模块正在规划中。'));
registerPage('certificates', () => renderActivityCertificatePage());

const activityCertificateState = {
    keyword: '',
    status: '全部'
};

const activityCertificateList = [
    { id: 1, name: '参赛证明', isDefault: true, method: '自动发放', createTime: '-', issueTime: '-', status: '-', actions: ['record'] },
    { id: 2, name: '活动证明二', method: '手动发放', createTime: '2026-01-03 15:21', issueTime: '-', status: '未发放', actions: ['issue', 'record', 'edit', 'delete'] },
    { id: 3, name: '活动证明三', method: '手动发放', createTime: '2026-01-03 15:21', issueTime: '2026-01-08 15:21', status: '已发放', actions: ['issue', 'revoke', 'record', 'edit', 'delete'] }
];

function renderActivityCertificatePage() {
    const rows = getFilteredActivityCertificates().map(renderActivityCertificateRow).join('');

    return `
    <section class="activity-certificate-page">
        <div class="activity-certificate-title"><span>奖证管理</span> / <strong>活动证明</strong></div>

        <div class="activity-certificate-panel">
            <div class="activity-certificate-tip">
                <h3>活动证明说明</h3>
                <ul>
                    <li><strong>发放对象：</strong>考试答题用户提交答卷后自动发放参与证明；每日答题用户完成任意一天答题并提交结果后自动发放参与证明；趣味闯关用户开始答题并产生有效答题记录后自动发放参与证明。</li>
                    <li><strong>自动发放：</strong>系统已内置默认「参赛证明」模板，投稿成功后自动发放给选手。</li>
                    <li><strong>手动发放：</strong>支持新建自定义活动证明，此类证明需由管理员手动发放。</li>
                </ul>
            </div>

            <button class="btn activity-certificate-create" type="button" onclick="openActivityCertificateCreateModal()">+ 新建证明</button>

            <div class="activity-certificate-filter">
                <label>
                    <span>证明名称</span>
                    <input id="activityCertificateKeyword" class="form-control" value="${escapeHtml(activityCertificateState.keyword)}" placeholder="请输入证明名称">
                </label>
                <label>
                    <span>发放状态</span>
                    <select id="activityCertificateStatus" class="form-control">
                        ${['全部', '未发放', '已发放'].map(item => `<option ${activityCertificateState.status === item ? 'selected' : ''}>${item}</option>`).join('')}
                    </select>
                </label>
                <div class="activity-certificate-filter-actions">
                    <button class="btn activity-certificate-query" type="button" onclick="queryActivityCertificates()">查询</button>
                    <button class="btn activity-certificate-reset" type="button" onclick="resetActivityCertificateFilter()">重置</button>
                </div>
            </div>

            <div class="activity-certificate-table-wrap">
                <table class="activity-certificate-table">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>名称</th>
                            <th>发放方式</th>
                            <th>创建时间</th>
                            <th>发放时间</th>
                            <th>发放状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || `<tr><td colspan="7" class="activity-certificate-empty">暂无符合条件的活动证明</td></tr>`}
                    </tbody>
                </table>
            </div>

            <div class="activity-certificate-pagination">
                <strong>共${getFilteredActivityCertificates().length}条</strong>
                <button class="activity-certificate-page-btn disabled" type="button">‹</button>
                <button class="activity-certificate-page-btn active" type="button">1</button>
                <span>...</span>
                <button class="activity-certificate-page-btn" type="button">4</button>
                <button class="activity-certificate-page-btn" type="button">5</button>
                <button class="activity-certificate-page-btn" type="button">6</button>
                <button class="activity-certificate-page-btn" type="button">7</button>
                <button class="activity-certificate-page-btn" type="button">8</button>
                <span>...</span>
                <button class="activity-certificate-page-btn" type="button">100</button>
                <button class="activity-certificate-page-btn" type="button">›</button>
            </div>
        </div>
    </section>`;
}

function getFilteredActivityCertificates() {
    return activityCertificateList.filter(item => {
        const matchKeyword = !activityCertificateState.keyword || item.name.includes(activityCertificateState.keyword);
        const matchStatus = activityCertificateState.status === '全部' || item.status === activityCertificateState.status;
        return matchKeyword && matchStatus;
    });
}

function renderActivityCertificateRow(item) {
    return `
    <tr>
        <td>${item.id}</td>
        <td>
            <span class="activity-certificate-name">${escapeHtml(item.name)}</span>
            ${item.isDefault ? '<span class="activity-certificate-default">默认</span>' : ''}
        </td>
        <td>${item.method}</td>
        <td>${item.createTime}</td>
        <td>${item.issueTime}</td>
        <td>${renderActivityCertificateStatus(item.status)}</td>
        <td><div class="activity-certificate-actions">${renderActivityCertificateActions(item)}</div></td>
    </tr>`;
}

function renderActivityCertificateStatus(status) {
    if (status === '已发放') return '<span class="activity-certificate-issued">已发放</span>';
    if (status === '未发放') return '<span class="activity-certificate-unissued">未发放</span>';
    return '-';
}

function renderActivityCertificateActions(item) {
    const actionMap = {
        issue: { label: '发放', fn: 'issueActivityCertificate' },
        revoke: { label: '撤回', fn: 'revokeActivityCertificate' },
        record: { label: '发放记录', fn: 'openActivityCertificateRecord' },
        edit: { label: '编辑', fn: 'editActivityCertificate' },
        delete: { label: '删除', fn: 'deleteActivityCertificate' }
    };
    return item.actions.map(action => {
        const meta = actionMap[action];
        return `<button type="button" onclick="${meta.fn}(${item.id})">${meta.label}</button>`;
    }).join('');
}

function rerenderActivityCertificates() {
    navigateTo('certificates', { fromTabSwitch: true, reuseTabKey: activeTabKey });
}

function queryActivityCertificates() {
    activityCertificateState.keyword = document.getElementById('activityCertificateKeyword')?.value.trim() || '';
    activityCertificateState.status = document.getElementById('activityCertificateStatus')?.value || '全部';
    rerenderActivityCertificates();
}

function resetActivityCertificateFilter() {
    activityCertificateState.keyword = '';
    activityCertificateState.status = '全部';
    rerenderActivityCertificates();
}

function openActivityCertificateCreateModal() {
    openModal('新建证明', `
        <div class="activity-certificate-modal-form">
            <label><span>证明名称</span><input class="form-control" id="newCertificateName" placeholder="请输入证明名称"></label>
            <label><span>发放方式</span><select class="form-control"><option>手动发放</option><option>自动发放</option></select></label>
            <label><span>适用模式</span><select class="form-control"><option>全部知识问答模式</option><option>考试答题</option><option>每日答题</option><option>闯关答题</option></select></label>
        </div>
    `, () => {
        const name = document.getElementById('newCertificateName')?.value.trim();
        if (!name) return false;
        activityCertificateList.push({
            id: activityCertificateList.length + 1,
            name,
            method: '手动发放',
            createTime: '2026-01-03 15:21',
            issueTime: '-',
            status: '未发放',
            actions: ['issue', 'record', 'edit', 'delete']
        });
        rerenderActivityCertificates();
    }, { confirmText: '保存' });
}

function issueActivityCertificate(id) {
    const item = activityCertificateList.find(cert => cert.id === id);
    if (!item) return;
    item.status = '已发放';
    item.issueTime = '2026-01-08 15:21';
    if (!item.actions.includes('revoke')) item.actions.splice(1, 0, 'revoke');
    rerenderActivityCertificates();
}

function revokeActivityCertificate(id) {
    const item = activityCertificateList.find(cert => cert.id === id);
    if (!item) return;
    item.status = '未发放';
    item.issueTime = '-';
    item.actions = item.actions.filter(action => action !== 'revoke');
    rerenderActivityCertificates();
}

function openActivityCertificateRecord(id) {
    const item = activityCertificateList.find(cert => cert.id === id);
    openModal('发放记录', `
        <div class="activity-certificate-record">
            <p><strong>${escapeHtml(item?.name || '活动证明')}</strong></p>
            <p>已生成参与证明记录，支持按知识问答参与记录自动匹配发放对象。</p>
        </div>
    `, null, { confirmText: '知道了', hideCancel: true });
}

function editActivityCertificate(id) {
    const item = activityCertificateList.find(cert => cert.id === id);
    if (!item) return;
    openModal('编辑证明', `
        <div class="activity-certificate-modal-form">
            <label><span>证明名称</span><input class="form-control" id="editCertificateName" value="${escapeHtml(item.name)}"></label>
            <label><span>发放方式</span><select class="form-control"><option selected>${item.method}</option></select></label>
        </div>
    `, () => {
        const name = document.getElementById('editCertificateName')?.value.trim();
        if (!name) return false;
        item.name = name;
        rerenderActivityCertificates();
    }, { confirmText: '保存' });
}

function deleteActivityCertificate(id) {
    const index = activityCertificateList.findIndex(cert => cert.id === id);
    if (index === -1) return;
    openModal('删除证明', '<p>确认删除该活动证明吗？删除后不可恢复。</p>', () => {
        activityCertificateList.splice(index, 1);
        rerenderActivityCertificates();
    }, { confirmText: '删除', danger: true });
}
