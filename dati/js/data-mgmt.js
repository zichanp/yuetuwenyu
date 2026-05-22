/* data-mgmt.js — 报名情况 + 答题情况 + 单位数据 */

// ===== 报名情况 =====
registerPage('registration', () => {
    const rows = REGISTRATION_ROWS;
    return `
    ${pageHeader('报名情况', '活动管理 / [当前活动] / 报名情况')}
    <section class="card registration-card">
        <div class="registration-filter">
            <label><span>用户编号</span><input class="form-control" placeholder="请输入用户编号"></label>
            <label><span>答题者</span><input class="form-control" placeholder="请输入答题者姓名"></label>
            <label><span>手机号码</span><input class="form-control" placeholder="请输入手机号码"></label>
            <label><span>答题状态</span>
                <select class="form-control">
                    <option>全部</option><option>未答题</option><option>答题中</option>
                </select>
            </label>
            <label><span>选送单位</span><input class="form-control" placeholder="请输入选送单位名称"></label>
            <label><span>报名时间</span><input class="form-control" placeholder="开始时间-结束时间"></label>
            <div class="registration-actions">
                <button class="btn btn-primary">查询</button>
                <button class="btn btn-outline">重置</button>
                <div class="registration-export">
                    <button class="btn btn-outline">导出</button>
                    <div class="registration-export-menu">
                        <button>导出当前组别</button>
                        <button>导出全部组别</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="registration-tabs">
            <button class="active">小学组</button>
            <button>初中组</button>
            <button>高中组</button>
            <button>教师组</button>
        </div>
        <div class="registration-table-wrap">
            <table class="registration-table">
                <thead>
                    <tr>
                        <th>序号</th><th>用户编号</th><th>所属组别</th><th>答题者</th><th>手机号码</th><th>选送单位</th><th>报名报表字段</th><th>报名时间</th><th>答题状态</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map((row, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${row.userNo}</td>
                            <td>${registrationGroupBadge(row.group)}</td>
                            <td>${row.name}</td>
                            <td>${row.phone}</td>
                            <td>${row.org}</td>
                            <td></td>
                            <td>${row.registeredAt}</td>
                            <td>${registrationStatusBadge(row.answerStatus)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        ${renderStandardPagination(300)}
    </section>`;
});

const REGISTRATION_ROWS = [
    { userNo: 'U001', group: '小学组', name: '张三', phone: '138****1234', org: '上海市图书馆', registeredAt: '2026-06-10 10:10', answerStatus: '未答题' },
    { userNo: 'U002', group: '小学组', name: '李四', phone: '139****5678', org: '复旦大学图书馆', registeredAt: '2026-06-10 10:10', answerStatus: '答题中' },
    { userNo: 'U003', group: '初中组', name: '王五', phone: '136****9012', org: '长宁区图书馆', registeredAt: '2026-06-10 10:10', answerStatus: '答题中' },
    { userNo: 'U004', group: '高中组', name: '赵六', phone: '137****3456', org: '华东政法大学图书馆', registeredAt: '2026-06-10 10:10', answerStatus: '答题中' },
    { userNo: 'U005', group: '小学组', name: '孙七', phone: '135****7890', org: '高中部选送单位', registeredAt: '2026-06-10 10:10', answerStatus: '答题中' },
    { userNo: 'U006', group: '初中组', name: '周八', phone: '134****2345', org: '徐汇区文化馆', registeredAt: '2026-06-10 10:10', answerStatus: '答题中' },
    { userNo: 'U007', group: '高中组', name: '吴九', phone: '133****6789', org: '教师发展中心', registeredAt: '2026-06-10 10:10', answerStatus: '未答题' }
];

function registrationGroupBadge(group) {
    const clsMap = { '小学组': 'badge-blue', '初中组': 'badge-green', '高中组': 'badge-yellow' };
    return `<span class="badge ${clsMap[group] || 'badge-gray'}">${group}</span>`;
}

function registrationStatusBadge(status) {
    const clsMap = { '答题中': 'badge-yellow', '未答题': 'badge-gray' };
    return `<span class="badge ${clsMap[status] || 'badge-gray'}">${status}</span>`;
}

let examRecordGroup = 'all';
let examRecordPaper = 'exam-1';
let answerStatsMode = 'exam';
let dailyRecordDay = 'all';
let dailyBoardView = 'calendar';
let levelRecordStage = 'all';
const DAILY_ACTIVITY_START = '2026-06-09';
const DAILY_ACTIVITY_END = '2026-07-09';
const DAILY_MAX_ATTEMPTS = 3;
const DAILY_SCORE_RULE = 'highest';
const DAILY_QUALIFIED_SCORE = 60;

const EXAM_RECORD_GROUPS = [
    { id: 'all', name: '全部组别', count: 528 },
    { id: 'primary', name: '小学组', count: 128 },
    { id: 'middle', name: '初中组', count: 256 },
    { id: 'high', name: '高中组', count: 198 },
    { id: 'teacher', name: '教师组', count: 64 }
];

const EXAM_RECORD_PAPERS = [
    { id: 'all', groupId: 'all', examName: '全部试卷', paper: '全部考试/试卷', time: '全部时间', status: '汇总', expected: 528, joined: 486, submitted: 386, pendingReview: 44, reviewed: 342, avg: 78.5, reviewProgress: 88 },
    { id: 'exam-1', groupId: 'primary', examName: '第一场考试', paper: '安全生产知识试卷', time: '2026-06-10 09:00 - 10:00', status: '已结束', expected: 128, joined: 120, submitted: 110, pendingReview: 18, reviewed: 92, avg: 82.5, reviewProgress: 84 },
    { id: 'exam-2', groupId: 'primary', examName: '第二场考试', paper: '安全生产进阶试卷', time: '2026-06-12 09:00 - 10:00', status: '进行中', expected: 128, joined: 92, submitted: 60, pendingReview: 20, reviewed: 40, avg: 76.8, reviewProgress: 67 },
    { id: 'exam-3', groupId: 'middle', examName: '初赛', paper: '图书馆知识竞赛试卷', time: '2026-06-10 14:00 - 15:00', status: '已结束', expected: 256, joined: 238, submitted: 220, pendingReview: 12, reviewed: 208, avg: 79.2, reviewProgress: 95 },
    { id: 'exam-4', groupId: 'middle', examName: '复赛', paper: '企业文化综合测评卷', time: '2026-06-13 14:00 - 15:00', status: '已结束', expected: 180, joined: 168, submitted: 156, pendingReview: 0, reviewed: 156, avg: 80.1, reviewProgress: 100 },
    { id: 'exam-5', groupId: 'high', examName: '决赛考试', paper: '安全生产决赛试卷', time: '2026-06-15 09:00 - 10:30', status: '未开始', expected: 198, joined: 0, submitted: 0, pendingReview: 0, reviewed: 0, avg: '-', reviewProgress: 0 },
    { id: 'exam-6', groupId: 'teacher', examName: '教师专场', paper: '新员工入职培训考试', time: '2026-06-16 09:00 - 10:00', status: '已结束', expected: 64, joined: 60, submitted: 58, pendingReview: 6, reviewed: 52, avg: 86.4, reviewProgress: 90 }
];

const EXAM_RECORD_ROWS = [
    { groupId: 'primary', group: '小学组', paperId: 'exam-1', examName: '第一场考试', name: '张三', phone: '138****1234', org: '上海市图书馆', paper: '安全生产知识试卷', phase: '初赛第 1 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 60, subjective: 25, total: 85, full: 100, rank: 1, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-10 09:45', duration: '18分35秒', certificate: '已发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-2', examName: '第二场考试', name: '张三', phone: '138****1234', org: '上海市图书馆', paper: '安全生产进阶试卷', phase: '初赛第 2 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 64, subjective: 24, total: 88, full: 100, rank: 2, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-12 09:49', duration: '20分02秒', certificate: '已发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-1', examName: '第一场考试', name: '李四', phone: '139****5678', org: '复旦大学图书馆', paper: '安全生产知识试卷', phase: '初赛第 1 期', answerStatus: '已交卷', reviewStatus: '待阅卷', objective: 70, subjective: '待阅', total: '待生成', full: 100, rank: '-', passed: '待判定', promoted: '待判定', attempts: '1/1', submitTime: '2026-06-10 09:52', duration: '21分08秒', certificate: '未发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-1', examName: '第一场考试', name: '陈一', phone: '132****4567', org: '浦东新区图书馆', paper: '安全生产知识试卷', phase: '初赛第 1 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 58, subjective: 23, total: 81, full: 100, rank: 2, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-10 09:47', duration: '19分12秒', certificate: '已发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-2', examName: '第二场考试', name: '陈一', phone: '132****4567', org: '浦东新区图书馆', paper: '安全生产进阶试卷', phase: '初赛第 2 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 60, subjective: 20, total: 80, full: 100, rank: 4, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-12 09:55', duration: '22分12秒', certificate: '已发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-1', examName: '第一场考试', name: '刘二', phone: '131****8899', org: '上海少年儿童图书馆', paper: '安全生产知识试卷', phase: '初赛第 1 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 52, subjective: 18, total: 70, full: 100, rank: 3, passed: '达标', promoted: '待判定', attempts: '1/1', submitTime: '2026-06-10 09:58', duration: '24分06秒', certificate: '未发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-2', examName: '第二场考试', name: '赵六', phone: '137****3456', org: '华东政法大学图书馆', paper: '安全生产进阶试卷', phase: '初赛第 2 期', answerStatus: '答题中', reviewStatus: '-', objective: '-', subjective: '-', total: '-', full: 100, rank: '-', passed: '待判定', promoted: '待判定', attempts: '1/1', submitTime: '-', duration: '进行中', certificate: '未发放' },
    { groupId: 'primary', group: '小学组', paperId: 'exam-2', examName: '第二场考试', name: '钱十', phone: '130****5566', org: '静安区图书馆', paper: '安全生产进阶试卷', phase: '初赛第 2 期', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 62, subjective: 26, total: 88, full: 100, rank: 1, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-12 09:51', duration: '20分18秒', certificate: '已发放' },
    { groupId: 'middle', group: '初中组', paperId: 'exam-3', examName: '初赛', name: '王五', phone: '136****9012', org: '长宁区图书馆', paper: '图书馆知识竞赛试卷', phase: '初赛', answerStatus: '已交卷', reviewStatus: '无需阅卷', objective: 80, subjective: '-', total: 80, full: 100, rank: 2, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-10 14:48', duration: '16分20秒', certificate: '发放中' },
    { groupId: 'middle', group: '初中组', paperId: 'exam-3', examName: '初赛', name: '郑十一', phone: '139****1122', org: '闵行区图书馆', paper: '图书馆知识竞赛试卷', phase: '初赛', answerStatus: '已交卷', reviewStatus: '无需阅卷', objective: 92, subjective: '-', total: 92, full: 100, rank: 1, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-10 14:42', duration: '14分36秒', certificate: '已发放' },
    { groupId: 'middle', group: '初中组', paperId: 'exam-4', examName: '复赛', name: '周八', phone: '134****2345', org: '徐汇区文化馆', paper: '企业文化综合测评卷', phase: '复赛', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 66, subjective: 22, total: 88, full: 100, rank: 1, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-13 14:50', duration: '22分10秒', certificate: '已发放' },
    { groupId: 'middle', group: '初中组', paperId: 'exam-4', examName: '复赛', name: '冯十二', phone: '138****6677', org: '杨浦区文化馆', paper: '企业文化综合测评卷', phase: '复赛', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 61, subjective: 20, total: 81, full: 100, rank: 2, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-13 14:53', duration: '23分44秒', certificate: '已发放' },
    { groupId: 'high', group: '高中组', paperId: 'exam-5', examName: '决赛考试', name: '孙七', phone: '135****7890', org: '高中部选送单位', paper: '安全生产决赛试卷', phase: '决赛', answerStatus: '未开始', reviewStatus: '-', objective: '-', subjective: '-', total: '-', full: 100, rank: '-', passed: '待判定', promoted: '待判定', attempts: '0/1', submitTime: '-', duration: '-', certificate: '未发放' },
    { groupId: 'teacher', group: '教师组', paperId: 'exam-6', examName: '教师专场', name: '吴九', phone: '133****6789', org: '教师发展中心', paper: '新员工入职培训考试', phase: '教师专场', answerStatus: '缺考', reviewStatus: '-', objective: '-', subjective: '-', total: '-', full: 100, rank: '-', passed: '未达标', promoted: '未晋级', attempts: '0/1', submitTime: '-', duration: '-', certificate: '未发放' },
    { groupId: 'teacher', group: '教师组', paperId: 'exam-6', examName: '教师专场', name: '蒋十三', phone: '137****7788', org: '教师发展中心', paper: '新员工入职培训考试', phase: '教师专场', answerStatus: '已交卷', reviewStatus: '已阅卷', objective: 68, subjective: 24, total: 92, full: 100, rank: 1, passed: '达标', promoted: '晋级', attempts: '1/1', submitTime: '2026-06-16 09:43', duration: '17分02秒', certificate: '已发放' }
];

const DAILY_RECORD_DAYS = [
    { id: 'all', title: '全部日期', subtitle: '活动期累计', date: '2026-06-09 - 07-09', status: '汇总', rules: '50 题 / 100 分 / 达标 60 分', expected: 528, joined: 416, completed: 388, qualified: 302, avg: 82.6 },
    { id: 'day-01', title: '6月9日', subtitle: '每日答题', date: '2026-06-09', status: '已结束', rules: '50 题 / 100 分 / 达标 60 分', expected: 528, joined: 386, completed: 360, qualified: 286, avg: 84.2 },
    { id: 'day-02', title: '6月10日', subtitle: '每日答题', date: '2026-06-10', status: '已结束', rules: '50 题 / 100 分 / 达标 60 分', expected: 528, joined: 372, completed: 351, qualified: 271, avg: 81.8 },
    { id: 'day-03', title: '6月11日', subtitle: '每日答题', date: '2026-06-11', status: '进行中', rules: '50 题 / 100 分 / 达标 60 分', expected: 528, joined: 296, completed: 248, qualified: 180, avg: 79.6 },
    { id: 'day-04', title: '6月12日', subtitle: '每日答题', date: '2026-06-12', status: '未开始', rules: '50 题 / 100 分 / 达标 60 分', expected: 528, joined: 0, completed: 0, qualified: 0, avg: '-' }
];

const DAILY_RECORD_ROWS = [
    { groupId: 'primary', group: '小学组', dayId: 'day-01', name: '张三', phone: '138****1234', org: '上海市图书馆', dailyScore: 92, cumulativeScore: 256, qualifiedDays: 3, attempts: '1/1', bestScore: 92, accuracy: '92%', duration: '08分35秒', status: '已完成', submitTime: '2026-06-09 09:45', streak: 3 },
    { groupId: 'primary', group: '小学组', dayId: 'day-01', name: '李四', phone: '139****5678', org: '复旦大学图书馆', dailyScore: 86, cumulativeScore: 238, qualifiedDays: 3, attempts: '1/1', bestScore: 86, accuracy: '86%', duration: '09分12秒', status: '已完成', submitTime: '2026-06-09 10:08', streak: 3 },
    { groupId: 'middle', group: '初中组', dayId: 'day-01', name: '王五', phone: '136****9012', org: '长宁区图书馆', dailyScore: 78, cumulativeScore: 210, qualifiedDays: 2, attempts: '1/1', bestScore: 78, accuracy: '78%', duration: '10分20秒', status: '已完成', submitTime: '2026-06-09 11:18', streak: 2 },
    { groupId: 'middle', group: '初中组', dayId: 'day-02', name: '周八', phone: '134****2345', org: '徐汇区文化馆', dailyScore: 95, cumulativeScore: 269, qualifiedDays: 3, attempts: '1/1', bestScore: 95, accuracy: '95%', duration: '07分46秒', status: '已完成', submitTime: '2026-06-10 09:22', streak: 3 },
    { groupId: 'high', group: '高中组', dayId: 'day-02', name: '孙七', phone: '135****7890', org: '高中部选送单位', dailyScore: 58, cumulativeScore: 162, qualifiedDays: 1, attempts: '1/1', bestScore: 58, accuracy: '58%', duration: '12分30秒', status: '已完成', submitTime: '2026-06-10 15:41', streak: 0 },
    { groupId: 'primary', group: '小学组', dayId: 'day-03', name: '陈一', phone: '132****4567', org: '浦东新区图书馆', dailyScore: 88, cumulativeScore: 241, qualifiedDays: 3, attempts: '1/1', bestScore: 88, accuracy: '88%', duration: '08分54秒', status: '已完成', submitTime: '2026-06-11 09:33', streak: 3 },
    { groupId: 'teacher', group: '教师组', dayId: 'day-03', name: '吴九', phone: '133****6789', org: '教师发展中心', dailyScore: '-', cumulativeScore: 172, qualifiedDays: 2, attempts: '0/1', bestScore: '-', accuracy: '-', duration: '-', status: '未答题', submitTime: '-', streak: 0 },
    { groupId: 'middle', group: '初中组', dayId: 'day-03', name: '冯十二', phone: '138****6677', org: '杨浦区文化馆', dailyScore: '答题中', cumulativeScore: 196, qualifiedDays: 2, attempts: '1/1', bestScore: '-', accuracy: '-', duration: '进行中', status: '答题中', submitTime: '-', streak: 2 }
];

const DAILY_REGISTERED_USERS = [
    { userNo: 'U0001', groupId: 'primary', group: '小学组', name: '张三', phone: '138****1234', org: '上海市图书馆' },
    { userNo: 'U0002', groupId: 'primary', group: '小学组', name: '李四', phone: '139****5678', org: '复旦大学图书馆' },
    { userNo: 'U0003', groupId: 'middle', group: '初中组', name: '王五', phone: '136****9012', org: '长宁区图书馆' },
    { userNo: 'U0004', groupId: 'middle', group: '初中组', name: '周八', phone: '134****2345', org: '徐汇区文化馆' },
    { userNo: 'U0005', groupId: 'high', group: '高中组', name: '孙七', phone: '135****7890', org: '高中部选送单位' },
    { userNo: 'U0006', groupId: 'primary', group: '小学组', name: '陈一', phone: '132****4567', org: '浦东新区图书馆' },
    { userNo: 'U0007', groupId: 'teacher', group: '教师组', name: '吴九', phone: '133****6789', org: '教师发展中心' },
    { userNo: 'U0008', groupId: 'middle', group: '初中组', name: '冯十二', phone: '138****6677', org: '杨浦区文化馆' }
];

const DAILY_ATTEMPT_RECORDS = [
    { attemptId: 'daily-0609-zhangsan-1', dayId: 'day-01', name: '张三', attemptNo: 1, score: 76, accuracy: '76%', duration: '10分18秒', status: '已提交', startTime: '2026-06-09 09:20', submitTime: '2026-06-09 09:31', correct: 38, total: 50 },
    { attemptId: 'daily-0609-zhangsan-2', dayId: 'day-01', name: '张三', attemptNo: 2, score: 92, accuracy: '92%', duration: '08分35秒', status: '已提交', startTime: '2026-06-09 09:36', submitTime: '2026-06-09 09:45', correct: 46, total: 50 },
    { attemptId: 'daily-0609-lisi-1', dayId: 'day-01', name: '李四', attemptNo: 1, score: 86, accuracy: '86%', duration: '09分12秒', status: '已提交', startTime: '2026-06-09 09:58', submitTime: '2026-06-09 10:08', correct: 43, total: 50 },
    { attemptId: 'daily-0609-lisi-2', dayId: 'day-01', name: '李四', attemptNo: 2, score: 82, accuracy: '82%', duration: '08分58秒', status: '已提交', startTime: '2026-06-09 10:20', submitTime: '2026-06-09 10:30', correct: 41, total: 50 },
    { attemptId: 'daily-0609-wangwu-1', dayId: 'day-01', name: '王五', attemptNo: 1, score: 58, accuracy: '58%', duration: '11分06秒', status: '已提交', startTime: '2026-06-09 10:46', submitTime: '2026-06-09 10:58', correct: 29, total: 50 },
    { attemptId: 'daily-0609-wangwu-2', dayId: 'day-01', name: '王五', attemptNo: 2, score: 78, accuracy: '78%', duration: '10分20秒', status: '已提交', startTime: '2026-06-09 11:07', submitTime: '2026-06-09 11:18', correct: 39, total: 50 },
    { attemptId: 'daily-0610-zhouba-1', dayId: 'day-02', name: '周八', attemptNo: 1, score: 82, accuracy: '82%', duration: '09分18秒', status: '已提交', startTime: '2026-06-10 08:58', submitTime: '2026-06-10 09:08', correct: 41, total: 50 },
    { attemptId: 'daily-0610-zhouba-2', dayId: 'day-02', name: '周八', attemptNo: 2, score: 95, accuracy: '95%', duration: '07分46秒', status: '已提交', startTime: '2026-06-10 09:14', submitTime: '2026-06-10 09:22', correct: 48, total: 50 },
    { attemptId: 'daily-0610-zhouba-3', dayId: 'day-02', name: '周八', attemptNo: 3, score: 90, accuracy: '90%', duration: '08分02秒', status: '已提交', startTime: '2026-06-10 09:36', submitTime: '2026-06-10 09:44', correct: 45, total: 50 },
    { attemptId: 'daily-0610-sunqi-1', dayId: 'day-02', name: '孙七', attemptNo: 1, score: 58, accuracy: '58%', duration: '12分30秒', status: '已提交', startTime: '2026-06-10 15:28', submitTime: '2026-06-10 15:41', correct: 29, total: 50 },
    { attemptId: 'daily-0610-sunqi-2', dayId: 'day-02', name: '孙七', attemptNo: 2, score: 54, accuracy: '54%', duration: '13分02秒', status: '已提交', startTime: '2026-06-10 16:10', submitTime: '2026-06-10 16:24', correct: 27, total: 50 },
    { attemptId: 'daily-0610-sunqi-3', dayId: 'day-02', name: '孙七', attemptNo: 3, score: 52, accuracy: '52%', duration: '12分48秒', status: '已提交', startTime: '2026-06-10 16:38', submitTime: '2026-06-10 16:51', correct: 26, total: 50 },
    { attemptId: 'daily-0611-chenyi-1', dayId: 'day-03', name: '陈一', attemptNo: 1, score: 88, accuracy: '88%', duration: '08分54秒', status: '已提交', startTime: '2026-06-11 09:24', submitTime: '2026-06-11 09:33', correct: 44, total: 50 },
    { attemptId: 'daily-0611-fengshier-1', dayId: 'day-03', name: '冯十二', attemptNo: 1, score: '-', accuracy: '-', duration: '进行中', status: '答题中', startTime: '2026-06-11 10:12', submitTime: '-', correct: '-', total: 50 }
];

const LEVEL_RECORD_STAGES = [
    { id: 'all', title: '全部关卡', subtitle: '闯关总览', date: '2026-02-20 - 05-01', status: '汇总', rules: '按顺序解锁 / 达标通关', expected: 312, joined: 286, completed: 168, qualified: 168, avg: 76.9 },
    { id: 'level-01', title: '第 1 关', subtitle: '阅读常识', date: '开放中', status: '已开放', rules: '50 题 / 100 分 / 通关 60 分', expected: 312, joined: 286, completed: 260, qualified: 238, avg: 82.4 },
    { id: 'level-02', title: '第 2 关', subtitle: '历史文化', date: '顺序解锁', status: '已开放', rules: '50 题 / 150 分 / 通关 90 分', expected: 238, joined: 212, completed: 186, qualified: 168, avg: 118.6 },
    { id: 'level-03', title: '第 3 关', subtitle: '非遗知识', date: '顺序解锁', status: '未配置', rules: '待配置抽题规则', expected: 168, joined: 0, completed: 0, qualified: 0, avg: '-' }
];

const LEVEL_RECORD_ROWS = [
    { groupId: 'primary', group: '小学组', levelId: 'level-01', name: '张三', phone: '138****1234', org: '上海市图书馆', currentLevel: '第 2 关', passedLevels: 1, levelScore: 86, totalScore: 86, attempts: '1/3', passStatus: '已通关', unlockStatus: '已解锁下一关', accuracy: '86%', duration: '18分35秒', submitTime: '2026-02-20 09:45' },
    { groupId: 'primary', group: '小学组', levelId: 'level-02', name: '李四', phone: '139****5678', org: '复旦大学图书馆', currentLevel: '第 2 关', passedLevels: 2, levelScore: 132, totalScore: 220, attempts: '2/3', passStatus: '已通关', unlockStatus: '已解锁下一关', accuracy: '88%', duration: '21分08秒', submitTime: '2026-02-22 10:12' },
    { groupId: 'middle', group: '初中组', levelId: 'level-02', name: '王五', phone: '136****9012', org: '长宁区图书馆', currentLevel: '第 2 关', passedLevels: 1, levelScore: 82, totalScore: 168, attempts: '3/3', passStatus: '未通关', unlockStatus: '停留本关', accuracy: '55%', duration: '24分06秒', submitTime: '2026-02-22 15:20' },
    { groupId: 'middle', group: '初中组', levelId: 'level-01', name: '周八', phone: '134****2345', org: '徐汇区文化馆', currentLevel: '第 1 关', passedLevels: 1, levelScore: 94, totalScore: 94, attempts: '1/3', passStatus: '已通关', unlockStatus: '已解锁下一关', accuracy: '94%', duration: '16分20秒', submitTime: '2026-02-20 14:48' },
    { groupId: 'high', group: '高中组', levelId: 'level-01', name: '孙七', phone: '135****7890', org: '高中部选送单位', currentLevel: '第 1 关', passedLevels: 0, levelScore: 52, totalScore: 52, attempts: '2/3', passStatus: '未通关', unlockStatus: '停留本关', accuracy: '52%', duration: '22分10秒', submitTime: '2026-02-21 09:12' },
    { groupId: 'teacher', group: '教师组', levelId: 'level-03', name: '吴九', phone: '133****6789', org: '教师发展中心', currentLevel: '第 3 关', passedLevels: 2, levelScore: '-', totalScore: 238, attempts: '0/3', passStatus: '待挑战', unlockStatus: '未开放', accuracy: '-', duration: '-', submitTime: '-' }
];

const UNIT_DATA_ROWS = [
    { name: '上海市图书馆', group: '小学组', level: '市级', expected: 168, joined: 156, submitted: 143, absent: 25, pendingReview: 8, reviewed: 135, totalScore: 12384, avgScore: 86.6, highestScore: 98, lowestScore: 65, passed: 128, promoted: 42, rank: 1 },
    { name: '复旦大学图书馆', group: '小学组', level: '高校', expected: 112, joined: 104, submitted: 98, absent: 14, pendingReview: 6, reviewed: 92, totalScore: 8246, avgScore: 84.1, highestScore: 96, lowestScore: 62, passed: 84, promoted: 28, rank: 2 },
    { name: '长宁区图书馆', group: '初中组', level: '区级', expected: 96, joined: 88, submitted: 80, absent: 16, pendingReview: 0, reviewed: 80, totalScore: 6428, avgScore: 80.4, highestScore: 94, lowestScore: 58, passed: 68, promoted: 18, rank: 3 },
    { name: '徐汇区文化馆', group: '初中组', level: '区级', expected: 74, joined: 66, submitted: 58, absent: 16, pendingReview: 3, reviewed: 55, totalScore: 4652, avgScore: 80.2, highestScore: 92, lowestScore: 56, passed: 48, promoted: 12, rank: 4 },
    { name: '华东政法大学图书馆', group: '高中组', level: '高校', expected: 48, joined: 31, submitted: 22, absent: '-', pendingReview: 7, reviewed: 15, totalScore: 1168, avgScore: 77.9, highestScore: 90, lowestScore: 52, passed: 12, promoted: 5, rank: 5 },
    { name: '教师发展中心', group: '教师组', level: '市级', expected: 64, joined: 60, submitted: 58, absent: 6, pendingReview: 6, reviewed: 52, totalScore: 4493, avgScore: 86.4, highestScore: 99, lowestScore: 68, passed: 50, promoted: 20, rank: 6 }
];

// ===== 答题情况 =====
registerPage('exam-records', () => {
    if (answerStatsMode === 'daily') {
        return `
        <div class="exam-record-page">
            ${renderAnswerStatsModeSwitch()}
            ${renderDailyDaySwitcher()}
        </div>`;
    }
    const rows = getAnswerRecordRows();
    const displayRows = getRankedAnswerRows(rows);
    const pagedRows = displayRows.slice(0, 10);
    const scoreStats = getAnswerScoreStats(rows);
    return `
    <div class="exam-record-page">
        ${renderAnswerStatsModeSwitch()}
        ${renderAnswerObjectSwitcher()}
        <section class="card exam-score-filter">
            ${renderExamRecordFilter()}
        </section>
        ${renderAnswerScoreOverview(scoreStats)}
        <section class="card exam-score-table-card">
            <div class="review-list-title">${getAnswerTableTitle()}</div>
            <div class="exam-record-table-wrap">
                ${renderAnswerRecordTable(pagedRows)}
            </div>
            ${renderStandardPagination(displayRows.length)}
        </section>
    </div>`;
});

function getAnswerTableTitle() {
    if (answerStatsMode === 'level') {
        return levelRecordStage === 'all' ? '闯关进度总览列表' : '单关卡挑战明细列表';
    }
    return getAnswerModeConfig().tableTitle;
}

function renderExamRecordFilter() {
    if (answerStatsMode === 'level') return renderLevelRecordFilter();
    const config = getAnswerModeConfig();
    return `
    <div class="exam-score-filter-row">
        ${renderExamGroupSelect()}
        <input class="form-control" placeholder="请输入${config.userLabel}姓名">
        <input class="form-control" placeholder="请输入选送单位">
        ${config.extraFilter || ''}
        <span class="score-range-control">
            <input class="form-control" type="number" min="0" max="100" placeholder="最低分">
            <span>-</span>
            <input class="form-control" type="number" min="0" max="100" placeholder="最高分">
        </span>
        <button class="btn btn-primary btn-sm">搜索</button>
        <button class="btn btn-outline btn-sm">重置</button>
    </div>`;
}

function renderLevelRecordFilter() {
    const isAll = levelRecordStage === 'all';
    return `
    <div class="exam-score-filter-row level-filter-row">
        ${renderExamGroupSelect()}
        <input class="form-control" placeholder="请输入用户姓名">
        <input class="form-control" placeholder="请输入选送单位">
        ${isAll ? `
            <select class="form-control"><option>全部当前关卡</option><option>第 1 关</option><option>第 2 关</option><option>第 3 关</option></select>
            <select class="form-control"><option>全部进度状态</option><option>未开始闯关</option><option>闯关中</option><option>已全部通关</option></select>
            <span class="score-range-control">
                <input class="form-control" type="number" min="0" placeholder="最少通关数">
                <span>-</span>
                <input class="form-control" type="number" min="0" placeholder="最多通关数">
            </span>
        ` : `
            <select class="form-control"><option>全部通关状态</option><option>已通关</option><option>未通关</option><option>待挑战</option></select>
            <select class="form-control"><option>全部解锁状态</option><option>已解锁下一关</option><option>停留本关</option><option>未开放</option></select>
            <span class="score-range-control">
                <input class="form-control" type="number" min="0" placeholder="最低分">
                <span>-</span>
                <input class="form-control" type="number" min="0" placeholder="最高分">
            </span>
        `}
        <button class="btn btn-primary btn-sm">搜索</button>
        <button class="btn btn-outline btn-sm">重置</button>
    </div>`;
}

function getAnswerModeConfig() {
    const configs = {
        exam: {
            key: 'exam',
            title: '考试模式',
            desc: '按考试 / 试卷查看用户成绩、阅卷状态与交卷明细。',
            objectTitle: '考试 / 试卷',
            tableTitle: '成绩列表',
            userLabel: '考生',
            scoreField: 'total',
            extraFilter: ''
        },
        daily: {
            key: 'daily',
            title: '每日答题',
            desc: '按日期查看每日成绩、累计总分、达标天数和连续参与情况。',
            objectTitle: '每日计划',
            tableTitle: '每日答题成绩列表',
            userLabel: '用户',
            scoreField: 'dailyScore',
            extraFilter: `<select class="form-control"><option>全部答题状态</option><option>已完成</option><option>答题中</option><option>未答题</option><option>未达标</option></select>`
        },
        level: {
            key: 'level',
            title: '答题闯关',
            desc: '按关卡查看用户当前进度、通关状态、挑战次数和解锁情况。',
            objectTitle: '关卡',
            tableTitle: '闯关成绩列表',
            userLabel: '用户',
            scoreField: 'levelScore',
            extraFilter: `<select class="form-control"><option>全部通关状态</option><option>已通关</option><option>未通关</option><option>待挑战</option></select>`
        }
    };
    return configs[answerStatsMode] || configs.exam;
}

function renderAnswerStatsModeSwitch() {
    const modes = [
        { key: 'exam', label: '考试模式', count: EXAM_RECORD_ROWS.length },
        { key: 'daily', label: '每日答题', count: DAILY_RECORD_ROWS.length },
        { key: 'level', label: '答题闯关', count: LEVEL_RECORD_ROWS.length }
    ];
    return `
    <section class="card answer-mode-panel">
        <div class="answer-mode-tabs" role="tablist" aria-label="答题模式">
            ${modes.map(mode => `
                <button class="${answerStatsMode === mode.key ? 'active' : ''}" onclick="switchAnswerStatsMode('${mode.key}')">
                    <strong>${mode.label}</strong>
                </button>
            `).join('')}
        </div>
        <p>${getAnswerModeConfig().desc}</p>
    </section>`;
}

function switchAnswerStatsMode(mode) {
    answerStatsMode = mode;
    examRecordPaper = 'all';
    dailyRecordDay = 'all';
    dailyBoardView = 'calendar';
    levelRecordStage = mode === 'level' ? getDefaultLevelStageId() : 'all';
    navigateTo('exam-records');
}

function renderAnswerObjectSwitcher() {
    if (answerStatsMode === 'daily') return renderDailyDaySwitcher();
    if (answerStatsMode === 'level') return renderLevelStageSwitcher();
    return renderExamPaperSwitcher();
}

function getAnswerRecordRows() {
    if (answerStatsMode === 'daily') return getDailyRecordRows();
    if (answerStatsMode === 'level') return getLevelRecordRows();
    return getExamRecordRows();
}

function getDailyRecordRows() {
    const rows = DAILY_RECORD_DAYS
        .filter(day => day.id !== 'all')
        .flatMap(day => getDailyRowsForDate(day.date));
    return rows.filter(row => {
        if (examRecordGroup !== 'all' && row.groupId !== examRecordGroup) return false;
        if (dailyRecordDay !== 'all' && row.dayId !== dailyRecordDay) return false;
        return true;
    });
}

function getLevelRecordRows() {
    return LEVEL_RECORD_ROWS.filter(row => {
        if (examRecordGroup !== 'all' && row.groupId !== examRecordGroup) return false;
        if (levelRecordStage !== 'all' && row.levelId !== levelRecordStage) return false;
        return true;
    });
}

function getDefaultLevelStageId() {
    const stages = getLevelStagesForCurrentGroup().filter(stage => stage.id !== 'all');
    return stages[0]?.id || 'level-01';
}

function getRankedAnswerRows(rows) {
    if (answerStatsMode === 'daily') return rankRowsByField(rows, 'cumulativeScore');
    if (answerStatsMode === 'level') {
        return [...rows].sort((a, b) => b.passedLevels - a.passedLevels || numericScore(b.levelScore) - numericScore(a.levelScore)).map((row, index) => ({
            ...row,
            displayRank: row.passStatus === '待挑战' ? '-' : index + 1
        }));
    }
    return getRankedExamRows(rows);
}

function rankRowsByField(rows, field) {
    return [...rows].sort((a, b) => numericScore(b[field]) - numericScore(a[field])).map((row, index) => ({
        ...row,
        displayRank: typeof row[field] === 'number' ? index + 1 : '-'
    }));
}

function numericScore(value) {
    return typeof value === 'number' ? value : -1;
}

function getAnswerScoreStats(rows) {
    if (answerStatsMode === 'daily') return getDailyScoreStats(rows);
    if (answerStatsMode === 'level') return getLevelScoreStats(rows);
    return getExamScoreStats(rows);
}

function renderAnswerScoreOverview(stats) {
    if (answerStatsMode === 'level') return renderLevelScoreOverview(stats);
    return renderExamScoreOverview(stats);
}

function getDailyScoreStats(rows) {
    const doneRows = rows.filter(row => typeof row.dailyScore === 'number');
    const qualified = doneRows.filter(row => row.dailyScore >= 60);
    const totals = doneRows.map(row => row.dailyScore);
    return {
        participants: rows.filter(row => row.status !== '未答题').length,
        passed: qualified.length,
        passRate: doneRows.length ? `${Math.round(qualified.length / doneRows.length * 100)}%` : '-',
        avg: totals.length ? `${(totals.reduce((sum, value) => sum + value, 0) / totals.length).toFixed(1)}分` : '-',
        highest: totals.length ? `${Math.max(...totals)}分` : '-',
        lowest: totals.length ? `${Math.min(...totals)}分` : '-'
    };
}

function getLevelScoreStats(rows) {
    if (levelRecordStage === 'all') return getLevelOverallStats(rows);
    const challengedRows = rows.filter(row => typeof row.levelScore === 'number');
    const passedRows = rows.filter(row => row.passStatus === '已通关');
    const scores = challengedRows.map(row => row.levelScore);
    return {
        participants: rows.filter(row => row.passStatus !== '待挑战').length,
        passed: passedRows.length,
        passRate: challengedRows.length ? `${Math.round(passedRows.length / challengedRows.length * 100)}%` : '-',
        avg: scores.length ? `${(scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(1)}分` : '-',
        highest: scores.length ? `${Math.max(...scores)}分` : '-',
        lowest: scores.length ? `${Math.min(...scores)}分` : '-'
    };
}

function getLevelOverallStats(rows) {
    const totalLevels = Math.max(1, LEVEL_RECORD_STAGES.filter(stage => stage.id !== 'all' && stage.status !== '未配置').length);
    const startedRows = rows.filter(row => row.passStatus !== '待挑战');
    const completedRows = rows.filter(row => row.passedLevels >= totalLevels);
    const totalPassedLevels = rows.reduce((sum, row) => sum + (Number(row.passedLevels) || 0), 0);
    const totalAttempts = rows.reduce((sum, row) => sum + (Number(String(row.attempts || '0').split('/')[0]) || 0), 0);
    const maxAttempts = rows.reduce((sum, row) => sum + (Number(String(row.attempts || '0/3').split('/')[1]) || 3), 0);
    return {
        mode: 'level-overall',
        started: startedRows.length,
        completed: completedRows.length,
        completionRate: rows.length ? `${Math.round(completedRows.length / rows.length * 100)}%` : '-',
        avgPassedLevels: rows.length ? (totalPassedLevels / rows.length).toFixed(1) : '-',
        totalPassedLevels,
        challengeProgress: maxAttempts ? `${Math.round(totalAttempts / maxAttempts * 100)}%` : '-'
    };
}

function renderAnswerRecordTable(rows) {
    if (answerStatsMode === 'daily') return renderDailyRecordTable(rows);
    if (answerStatsMode === 'level') return renderLevelRecordTable(rows);
    return renderExamRecordTable(rows);
}

function renderExamRecordTable(rows) {
    return `
    <table class="exam-record-table">
        <thead>
            <tr><th>排名</th><th>用户姓名</th><th>手机号</th><th>所属组别</th><th>选送单位</th><th>参与场次</th><th>本场得分</th><th>本场是否及格</th><th>客观题得分</th><th>主观题得分</th><th>正确率</th><th>用时</th><th>累计得分</th><th>及格次数</th><th>状态</th><th>交卷时间</th><th>操作</th></tr>
        </thead>
        <tbody>
            ${rows.map((row) => `
                <tr>
                    <td>${row.displayRank}</td>
                    <td><strong>${row.name}</strong></td>
                    <td>${row.phone}</td>
                    <td>${row.group}</td>
                    <td>${row.org}</td>
                    <td><span class="action-link" onclick="openUserExamSessions('${escHtml(row.name)}', '${escHtml(row.phone)}')">${getUserExamSessionRows(row).length}场</span></td>
                    <td>${scoreValue(row.total, true)}</td>
                    <td>${examPassText(row.passed)}</td>
                    <td>${row.objective}</td>
                    <td>${scoreValue(row.subjective)}</td>
                    <td>${scoreAccuracy(row)}</td>
                    <td>${row.duration}</td>
                    <td>${scoreValue(getCumulativeScore(row), true)}</td>
                    <td>${getQualifiedDays(row)}</td>
                    <td>${scoreReviewStatus(row)}</td>
                    <td>${row.submitTime}</td>
                    <td class="exam-record-actions">
                        <span class="action-link" onclick="openAnswerDetail('${row.name}', '${row.paperId}')">查看详情</span>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

function renderDailyRecordTable(rows) {
    return `
    <table class="exam-record-table answer-record-table daily">
        <thead>
            <tr><th>排名</th><th>用户姓名</th><th>手机号</th><th>所属组别</th><th>选送单位</th><th>日期</th><th>累计总分</th><th>达标天数</th><th>连续达标</th><th>答题次数</th><th>达标次数</th><th>答题状态</th><th>最近提交时间</th><th>操作</th></tr>
        </thead>
        <tbody>
            ${rows.map(row => `
                <tr>
                    <td>${row.displayRank}</td>
                    <td><strong>${row.name}</strong></td>
                    <td>${row.phone}</td>
                    <td>${row.group}</td>
                    <td>${row.org}</td>
                    <td>${dailyDayLabel(row.dayId)}</td>
                    <td>${scoreValue(row.cumulativeScore, true)}</td>
                    <td>${row.qualifiedDays}</td>
                    <td>${row.streak}天</td>
                    <td>${row.attempts}</td>
                    <td>${dailyQualifiedAttemptCount(row)}</td>
                    <td>${dailyAnsweredStatusBadge(row)}</td>
                    <td>${row.submitTime}</td>
                    <td class="exam-record-actions"><span class="action-link" onclick="openDailyAnswerDetail('${row.name}', '${row.dayId}')">查看详情</span></td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

function renderLevelRecordTable(rows) {
    return `
    <table class="exam-record-table answer-record-table level">
        <thead>
            <tr><th>排名</th><th>用户姓名</th><th>手机号</th><th>所属组别</th><th>选送单位</th><th>参与关卡数</th><th>已通关数</th><th>本关得分</th><th>累计得分</th><th>挑战次数</th><th>用时</th><th>通关状态</th><th>操作</th></tr>
        </thead>
        <tbody>
            ${rows.map(row => `
                <tr>
                    <td>${row.displayRank}</td>
                    <td><strong>${row.name}</strong></td>
                    <td>${row.phone}</td>
                    <td>${row.group}</td>
                    <td>${row.org}</td>
                    <td><span class="action-link" onclick="openLevelChallengeDetail('${escHtml(row.name)}', '${escHtml(row.phone)}', 'participated')">${getUserLevelParticipationCount(row)}关</span></td>
                    <td><span class="action-link" onclick="openLevelChallengeDetail('${escHtml(row.name)}', '${escHtml(row.phone)}', 'passed')">${row.passedLevels}关</span></td>
                    <td>${scoreValue(row.levelScore, true)}</td>
                    <td>${scoreValue(row.totalScore, true)}</td>
                    <td>${row.attempts}</td>
                    <td>${row.duration}</td>
                    <td>${levelPassBadge(row.passStatus)}</td>
                    <td class="exam-record-actions"><span class="action-link" onclick="openLevelChallengeDetail('${escHtml(row.name)}', '${escHtml(row.phone)}', 'all')">查看详情</span></td>
                </tr>
            `).join('')}
        </tbody>
    </table>`;
}

registerPage('answer-detail', () => {
    const { name, paperId } = currentPageParams || {};
    const row = EXAM_RECORD_ROWS.find(item => item.name === name && item.paperId === paperId) || EXAM_RECORD_ROWS[0];
    return renderAnswerDetailPage(row);
});

function escHtml(s) { return s.replace(/'/g, "\\'").replace(/\n/g, ''); }

function getExamRecordRows() {
    return EXAM_RECORD_ROWS.filter(row => {
        if (examRecordGroup !== 'all' && row.groupId !== examRecordGroup) return false;
        if (examRecordPaper !== 'all' && row.paperId !== examRecordPaper) return false;
        return true;
    });
}

function getRankedExamRows(rows) {
    const scoredRows = rows
        .filter(row => typeof row.total === 'number')
        .sort((a, b) => b.total - a.total || String(a.submitTime).localeCompare(String(b.submitTime)));
    const rankMap = new Map(scoredRows.map((row, index) => [`${row.name}-${row.paperId}`, index + 1]));
    return [...rows].sort((a, b) => {
        const aScore = typeof a.total === 'number' ? a.total : -1;
        const bScore = typeof b.total === 'number' ? b.total : -1;
        return bScore - aScore;
    }).map(row => ({
        ...row,
        displayRank: rankMap.get(`${row.name}-${row.paperId}`) || '-'
    }));
}

function openAnswerDetail(name, paperId) {
    navigateTo('answer-detail', {
        params: { name, paperId },
        source: { pageId: 'exam-records', params: {}, tabKey: activeTabKey }
    });
}

function getLevelRecordKey(row) {
    return `${String(row.name || '').trim()}__${String(row.phone || '').trim()}`;
}

function parseLevelNo(levelLabel) {
    const match = String(levelLabel || '').match(/(\d+)/);
    return match ? Number(match[1]) || 0 : 0;
}

function getLevelRecordRowsForUser(row) {
    if (!row) return [];
    const participatedLevels = getUserLevelParticipationCount(row);
    const passedLevels = Number(row.passedLevels) || 0;
    const rows = [];
    for (let i = 1; i <= participatedLevels; i += 1) {
        const stage = LEVEL_RECORD_STAGES.find(item => item.id !== 'all' && parseLevelNo(item.title) === i) || LEVEL_RECORD_STAGES[i] || null;
        const isPassed = i <= passedLevels;
        const isCurrent = !isPassed && i === participatedLevels && row.passStatus !== '待挑战';
        const attempts = getLevelAttemptRecords(row, i, isCurrent);
        const latestAttempt = attempts[attempts.length - 1] || null;
        rows.push({
            levelNo: i,
            levelId: stage?.id || `level-${String(i).padStart(2, '0')}`,
            title: stage ? `${stage.title} · ${stage.subtitle}` : `第 ${i} 关`,
            attemptCount: attempts.length,
            passed: isPassed,
            status: isPassed ? '已通关' : isCurrent ? '未通关' : '待挑战',
            score: isPassed ? (typeof row.levelScore === 'number' && i === participatedLevels ? row.levelScore : Math.max(0, 100 - (i - 1) * 8)) : (isCurrent ? row.levelScore : '-'),
            duration: latestAttempt?.duration || row.duration || '-',
            submitTime: latestAttempt?.submitTime || row.submitTime || '-',
            attempts,
            current: isCurrent
        });
    }
    return rows;
}

function getUserLevelParticipationCount(row) {
    const currentLevelNo = parseLevelNo(row?.currentLevel);
    const passedLevels = Number(row?.passedLevels) || 0;
    if (row?.passStatus === '待挑战') {
        return Math.max(passedLevels, Math.max(1, currentLevelNo - 1));
    }
    return Math.max(passedLevels, currentLevelNo || passedLevels || 1);
}

function getLevelAttemptRecords(row, levelNo, isCurrent) {
    const baseScore = typeof row?.levelScore === 'number'
        ? row.levelScore
        : Math.max(50, 94 - levelNo * 6);
    const passed = levelNo <= (Number(row?.passedLevels) || 0);
    const attemptCount = passed ? Math.min(2, Math.max(1, levelNo)) : (isCurrent ? Math.max(1, Number(String(row?.attempts || '1/3').split('/')[0]) || 1) : 0);
    if (!attemptCount) return [];
    const startHour = 9 + (levelNo - 1) * 2;
    const records = [];
    for (let i = 1; i <= attemptCount; i += 1) {
        const success = passed && i === attemptCount;
        const score = success
            ? (i === 1 ? Math.max(60, baseScore - 6) : baseScore)
            : Math.max(40, baseScore - (attemptCount - i + 1) * 8);
        const date = row?.submitTime?.slice(0, 10) || '2026-02-20';
        records.push({
            attemptId: `${getLevelRecordKey(row)}__level-${levelNo}__${i}`,
            attemptNo: i,
            score: success || isCurrent ? score : score,
            accuracy: `${Math.max(40, Math.min(98, score))}%`,
            duration: `${String(12 - Math.min(4, i)).padStart(2, '0')}分${String(18 + levelNo * 2 + i).padStart(2, '0')}秒`,
            status: success ? '已提交' : (isCurrent && i === attemptCount ? '答题中' : '已提交'),
            startTime: `${date} ${String(startHour + i - 1).padStart(2, '0')}:${String(12 + i * 3).padStart(2, '0')}`,
            submitTime: success
                ? `${date} ${String(startHour + i - 1).padStart(2, '0')}:${String(20 + i * 4).padStart(2, '0')}`
                : (isCurrent && i === attemptCount ? '-' : `${date} ${String(startHour + i - 1).padStart(2, '0')}:${String(25 + i * 3).padStart(2, '0')}`),
            correct: Math.max(0, Math.floor(score / 2)),
            total: 50
        });
    }
    return records;
}

function openLevelChallengeDetail(name, phone, focus = 'all') {
    const row = LEVEL_RECORD_ROWS.find(item => item.name === name && item.phone === phone) || LEVEL_RECORD_ROWS[0];
    if (!row) return;
    const progressRows = getLevelRecordRowsForUser(row);
    openModal(`${row.name} - 答题闯关详情`, `
        <div class="daily-detail-modal level-detail-modal">
            ${renderLevelDetailSummary(row, progressRows, focus)}
            ${renderLevelProgressTable(row, progressRows, focus)}
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide level-detail-modal-shell' });
}

function renderLevelDetailSummary(row, progressRows, focus) {
    return `
        <section class="daily-detail-summary level-detail-summary">
            <div class="level-detail-summary-bar">
                <div class="level-detail-summary-user">
                    <strong>${row?.name || '-'}</strong>
                    <span>${row?.phone || '-'} · ${row?.group || '-'} · ${row?.org || '-'}</span>
                </div>
            </div>
        </section>`;
}

function renderLevelProgressTable(row, progressRows, focus) {
    const filteredRows = focus === 'passed'
        ? progressRows.filter(item => item.passed)
        : focus === 'participated'
            ? progressRows
            : progressRows;
    return `
        <section class="daily-detail-section level-progress-section">
            <div class="daily-detail-section-head">
                <h4>关卡进度明细</h4>
                <span>${focus === 'passed' ? '已通关关卡' : focus === 'participated' ? '参与关卡' : '全部关卡'}</span>
            </div>
            <div class="daily-attempt-table-wrap">
                <table class="daily-attempt-table level-progress-table">
                    <thead>
                        <tr><th>关卡</th><th>答题次数</th><th>本关得分</th><th>通关状态</th><th>最近提交时间</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                        ${filteredRows.map(level => `
                            <tr class="${level.current ? 'active' : ''}">
                                <td>
                                    <strong>${level.title}</strong>
                                </td>
                                <td>${level.attemptCount}次</td>
                                <td>${scoreValue(level.score, true)}</td>
                                <td>${levelPassBadge(level.status)}</td>
                                <td>${level.submitTime}</td>
                                <td><span class="action-link" onclick="openLevelAttemptDetail('${escHtml(row.name)}', '${escHtml(row.phone)}', '${escHtml(level.levelId)}')">查看详情</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>`;
}

function getLevelAttemptRowsForUser(row, levelId) {
    const levelNo = parseLevelNo(levelId);
    const progressRows = getLevelRecordRowsForUser(row);
    const target = progressRows.find(item => item.levelId === levelId) || progressRows.find(item => item.levelNo === levelNo) || null;
    return target?.attempts || [];
}

function openLevelAttemptDetail(name, phone, levelId, attemptId = '') {
    const row = LEVEL_RECORD_ROWS.find(item => item.name === name && item.phone === phone) || LEVEL_RECORD_ROWS[0];
    if (!row) return;
    const progressRows = getLevelRecordRowsForUser(row);
    const level = progressRows.find(item => item.levelId === levelId) || progressRows[0];
    const attempts = getLevelAttemptRowsForUser(row, level.levelId);
    const activeAttempt = attempts.find(item => item.attemptId === attemptId) || attempts[0] || null;
    openModal(`${row.name} - ${level.title} 答题详情`, `
        <div class="daily-detail-modal level-detail-modal">
            ${renderLevelAttemptTimeline(row, level, attempts, activeAttempt)}
            ${renderLevelAttemptPaperTabs(row, level, attempts, activeAttempt)}
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide level-detail-modal-shell' });
}

function renderLevelAttemptTimeline(row, level, attempts, activeAttempt) {
    if (!attempts.length) {
        return `<section class="daily-detail-section"><h4>答题次数明细</h4><div class="daily-detail-empty">该关暂无答题记录。</div></section>`;
    }
    return `
        <section class="daily-detail-section">
            <div class="daily-detail-section-head">
                <h4>答题次数明细</h4>
                <span>${level.title}</span>
            </div>
            <div class="daily-attempt-table-wrap">
                <table class="daily-attempt-table">
                    <thead>
                        <tr><th>次数</th><th>得分</th><th>是否通关</th><th>得分率</th><th>用时</th><th>开始时间</th><th>提交时间</th><th>状态</th></tr>
                    </thead>
                    <tbody>
                        ${attempts.map(attempt => `
                            <tr class="${activeAttempt?.attemptId === attempt.attemptId ? 'active' : ''}">
                                <td>第${attempt.attemptNo}次</td>
                                <td>${scoreValue(attempt.score, true)}</td>
                                <td>${attempt.score >= 60 ? '是' : '否'}</td>
                                <td>${attempt.accuracy}</td>
                                <td>${attempt.duration}</td>
                                <td>${attempt.startTime}</td>
                                <td>${attempt.submitTime}</td>
                                <td>${dailyStatusBadge(attempt.status === '已提交' && attempt.score >= 60 ? '已完成' : attempt.status)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </section>`;
}

function renderLevelAttemptPaperTabs(row, level, attempts, activeAttempt) {
    if (!attempts.length) {
        return `<section class="daily-detail-section daily-paper-section"><h4>答卷详情</h4><div class="daily-detail-empty">暂无可查看的答卷内容。</div></section>`;
    }
    return `
        <section class="daily-detail-section daily-paper-section">
            <div class="daily-paper-tabs">
                ${attempts.map(attempt => `
                    <button class="${activeAttempt?.attemptId === attempt.attemptId ? 'active' : ''}" onclick="openLevelAttemptDetail('${escHtml(row.name)}', '${escHtml(row.phone)}', '${escHtml(level.levelId)}', '${escHtml(attempt.attemptId)}')">
                        第${attempt.attemptNo}次答卷
                    </button>
                `).join('')}
            </div>
            ${renderLevelAttemptPaper(activeAttempt, row, level)}
        </section>`;
}

function renderLevelAttemptPaper(attempt, row, level) {
    if (!attempt) {
        return `<div class="daily-detail-empty">暂无可查看的答卷内容。</div>`;
    }
    if (attempt.status === '答题中') {
        return `<div class="daily-detail-empty">该关当前正在答题，提交后可查看题目答案、判分和解析。</div>`;
    }
    const questions = getLevelAttemptQuestions(level, attempt);
    return `
        <div>
            <div class="daily-detail-section-head">
                <h4>第${attempt.attemptNo}次答卷</h4>
                <span>${level.title} · ${attempt.score}分 · ${attempt.duration}</span>
            </div>
            <div class="daily-question-list">
                ${questions.map((question, index) => renderDailyQuestionCard(question, index)).join('')}
            </div>
        </div>`;
}

function getLevelAttemptQuestions(level, attempt) {
    const score = typeof attempt.score === 'number' ? attempt.score : 0;
    const levelName = level?.title || '当前关卡';
    return [
        { type: '单选题', title: `${levelName}中，哪项最符合活动要求？`, userAnswer: score >= 60 ? '符合' : '不符合', correctAnswer: '符合', score: 2, awardedScore: score >= 60 ? 2 : 0, status: score >= 60 ? '正确' : '错误', analysis: '这是一道用于展示关卡作答判分的示例题。' },
        { type: '判断题', title: `${levelName}中的基础规则是否需要按顺序完成？`, userAnswer: '正确', correctAnswer: '正确', score: 2, awardedScore: 2, status: '正确', analysis: '顺序闯关通常会保留关卡递进关系。' },
        { type: '多选题', title: `${levelName}中，哪些环节属于有效答题过程？`, userAnswer: score >= 80 ? '阅读题干、选择答案、提交' : '阅读题干、提交', correctAnswer: '阅读题干、选择答案、提交', score: 4, awardedScore: score >= 80 ? 4 : 2, status: score >= 80 ? '正确' : '部分正确', analysis: '多选题可以帮助管理员查看每次答卷的差异。' },
        { type: '填空题', title: `${levelName}的核心关键词是____。`, userAnswer: '闯关', correctAnswer: '闯关', score: 2, awardedScore: 2, status: '正确', analysis: '示例题用于展示答题详情与解析位置。' }
    ];
}

function renderAnswerDetailPage(row) {
    return `
    <div class="answer-detail-page">
        <section class="card answer-detail-titlebar">
            <div class="answer-detail-title-left">
                ${renderSourceBack('answer-detail')}
                <div class="answer-detail-heading">
                    <strong>答卷详情</strong>
                    <span>${row.name} / ${row.paper}</span>
                </div>
            </div>
            <div class="answer-detail-title-meta">
                <span class="action-link muted" onclick="openUserExamSessions('${escHtml(row.name)}', '${escHtml(row.phone)}')">查看全部场次</span>
                ${scoreReviewStatus(row)}
                <b>${scoreValue(row.total, true)}</b>
            </div>
        </section>
        ${renderAnswerPaperBanner(row)}
        ${answerInfoSection('答卷摘要', [
            ['姓名', row.name],
            ['所属组别', row.group],
            ['所属单位', row.org],
            ['参与场次', `${getUserExamSessionRows(row).length}场`],
            ['考试名称', row.examName],
            ['试卷名称', row.paper],
            ['本场得分', scoreWithUnit(row.total)],
            ['累计得分', scoreWithUnit(getCumulativeScore(row))],
            ['及格次数', `${getQualifiedDays(row)}次`],
            ['客观题得分', scoreWithUnit(row.objective)],
            ['主观题得分', scoreWithUnit(row.subjective)],
            ['答题用时', row.duration],
            ['交卷时间', row.submitTime]
        ], 'score')}
        <section class="card answer-detail-card">
            <h3>试卷详情</h3>
            <div class="answer-question-list paper-view">
                ${renderAnswerQuestionSections(row).join('')}
            </div>
        </section>
    </div>`;
}

function renderAnswerPaperBanner(row) {
    const paper = getAnswerPaperBlueprint(row);
    return `
    <section class="card answer-paper-banner">
        <div class="answer-paper-banner-head">
            <div class="answer-paper-banner-text">
                <span class="badge badge-blue">${paper.mode}</span>
                <strong>${paper.title}</strong>
                <p>${paper.subtitle}</p>
            </div>
            <div class="answer-paper-banner-score">
                <span>试卷总分</span>
                <strong>${paper.total} 分</strong>
            </div>
        </div>
        <div class="answer-paper-banner-meta">
            <span>${paper.sectionCount} 个大题</span>
            <span>${paper.questionCount} 道题</span>
            <span>按考试模式答题配置展示</span>
        </div>
    </section>`;
}

function answerInfoSection(title, items, variant = '') {
    return `
    <section class="card answer-detail-card">
        <h3>${title}</h3>
        <div class="answer-info-grid ${variant}">
            ${items.map(([label, value]) => `
                <div class="answer-info-item">
                    <span>${label}</span>
                    <strong>${value}</strong>
                </div>
            `).join('')}
        </div>
    </section>`;
}

function renderAnswerQuestionSections(row) {
    const paper = getAnswerPaperBlueprint(row);
    return paper.sections.map((section) => {
        const sectionScore = section.questions.reduce((sum, question) => sum + (Number(question.score) || 0), 0);
        return `
        <section class="answer-paper-section">
            <header class="answer-paper-section-head">
                <div>
                    <strong>${section.title}</strong>
                    <span>${section.questions.length} 题 · 共 ${sectionScore} 分</span>
                </div>
            </header>
            <div class="answer-paper-question-list">
                ${section.questions.map(question => renderAnswerQuestionCard(question)).join('')}
            </div>
        </section>`;
    });
}

function renderAnswerQuestionCard(question) {
    const statusClass = question.status === '正确' || question.status === '已批阅'
        ? 'badge-green'
        : question.status === '待阅'
            ? 'badge-yellow'
            : 'badge-gray';
    return `
        <article class="answer-question-card paper-question-card">
            <div class="answer-question-head">
                <div>
                    <strong>${question.sectionTitle} ${question.no}.</strong>
                    <span class="badge ${statusClass}">${question.status}</span>
                    <em>${question.type}</em>
                </div>
                <b>${question.score}分</b>
            </div>
            <p class="answer-question-title">${question.title}</p>
            <div class="answer-paper-question-body">
                <div class="answer-paper-answer-grid">
                    <div>
                        <span>考生答案</span>
                        <strong>${question.userAnswer}</strong>
                    </div>
                    <div>
                        <span>正确答案</span>
                        <strong>${question.correctAnswer}</strong>
                    </div>
                    <div>
                        <span>得分</span>
                        <strong>${question.awardedScore}分</strong>
                    </div>
                    <div>
                        <span>答题时间</span>
                        <strong>${question.answerTime}</strong>
                    </div>
                </div>
                ${question.analysis ? `
                <div class="answer-paper-analysis">
                    <span>解析</span>
                    <p>${question.analysis}</p>
                </div>` : ''}
            </div>
        </article>`;
}

function getAnswerPaperBlueprint(row) {
    const objectiveScore = typeof row.objective === 'number' ? row.objective : 0;
    const subjectiveScore = typeof row.subjective === 'number' ? row.subjective : 0;
    const sections = [
        {
            title: '第一大题',
            questions: [
                {
                    no: 1,
                    sectionTitle: '第一大题',
                    type: '单选题',
                    status: objectiveScore >= 5 ? '正确' : '错误',
                    score: 5,
                    title: '1 + 1 = ?',
                    userAnswer: '2',
                    correctAnswer: '2',
                    awardedScore: objectiveScore >= 5 ? 5 : 0,
                    answerTime: answerDetailDate(row, '09:05:00'),
                    analysis: '基础计算题，考查学生对加法运算的掌握情况。'
                },
                {
                    no: 2,
                    sectionTitle: '第一大题',
                    type: '多选题',
                    status: objectiveScore >= 10 ? '正确' : '错误',
                    score: 5,
                    title: '下列哪些属于常见的计算设备？',
                    userAnswer: '台式机、笔记本电脑',
                    correctAnswer: '台式机、笔记本电脑、平板电脑',
                    awardedScore: objectiveScore >= 10 ? 5 : 3,
                    answerTime: answerDetailDate(row, '09:08:00'),
                    analysis: '按答题配置中的客观题规则展示正确答案和部分得分。'
                },
                {
                    no: 3,
                    sectionTitle: '第一大题',
                    type: '判断题',
                    status: objectiveScore >= 15 ? '正确' : '错误',
                    score: 5,
                    title: '计算机可以帮助人们高效处理信息。',
                    userAnswer: '正确',
                    correctAnswer: '正确',
                    awardedScore: objectiveScore >= 15 ? 5 : 0,
                    answerTime: answerDetailDate(row, '09:10:00'),
                    analysis: '判断题展示标准答案与得分，方便核对客观题得分。'
                }
            ]
        },
        {
            title: '第二大题',
            questions: [
                {
                    no: 1,
                    sectionTitle: '第二大题',
                    type: '简答题',
                    status: subjectiveScore > 0 ? '已批阅' : row.subjective === '待阅' ? '待阅' : '未作答',
                    score: 10,
                    title: '请简述计算机的发展历史。',
                    userAnswer: '计算机的发展经历了电子管、晶体管、集成电路、超大规模集成电路四个阶段。',
                    correctAnswer: '计算机的发展经历了电子管、晶体管、集成电路、超大规模集成电路四个阶段。',
                    awardedScore: subjectiveScore > 0 ? 10 : 0,
                    answerTime: answerDetailDate(row, '09:20:00'),
                    analysis: '主观题按阅卷后的得分和参考答案展示，便于与答题配置对应。'
                },
                {
                    no: 2,
                    sectionTitle: '第二大题',
                    type: '简答题',
                    status: subjectiveScore > 0 ? '已批阅' : row.subjective === '待阅' ? '待阅' : '未作答',
                    score: 5,
                    title: '请结合实例说明信息技术在学习中的作用。',
                    userAnswer: '可以提高查找资料、整理知识和交流协作的效率。',
                    correctAnswer: '可从资料检索、协作学习、效率提升等角度作答。',
                    awardedScore: subjectiveScore > 0 ? 5 : 0,
                    answerTime: answerDetailDate(row, '09:24:00'),
                    analysis: '简答题通常需要按要点给分，这里展示标准答案与得分拆分。'
                },
                {
                    no: 3,
                    sectionTitle: '第二大题',
                    type: '简答题',
                    status: subjectiveScore > 0 ? '已批阅' : row.subjective === '待阅' ? '待阅' : '未作答',
                    score: 5,
                    title: '请说明日常学习中如何规范使用电脑。',
                    userAnswer: '注意正确坐姿、保护视力、合理安排使用时间。',
                    correctAnswer: '注意姿势、用眼卫生、设备安全与时间管理。',
                    awardedScore: subjectiveScore > 0 ? 5 : 0,
                    answerTime: answerDetailDate(row, '09:27:00'),
                    analysis: '按题目配置中对主观题的标准答案和评分规则进行展示。'
                }
            ]
        }
    ];
    return {
        title: row.paper || '考试答卷',
        subtitle: `${row.examName || '考试'} · ${row.name || '考生'} · ${row.group || '未知组别'}`,
        mode: '考试模式',
        total: typeof row.full === 'number' ? row.full : 100,
        sectionCount: sections.length,
        questionCount: sections.reduce((sum, section) => sum + section.questions.length, 0),
        sections
    };
}

function answerDetailPhone(phone) {
    return String(phone || '').replace('****', '0013');
}

function answerDetailDate(row, fallbackTime) {
    const date = row.submitTime && row.submitTime !== '-' ? row.submitTime.slice(0, 10) : '2024-06-15';
    return `${date} ${fallbackTime}`;
}

function scoreWithUnit(value) {
    if (typeof value === 'number') return `${value}分`;
    return scoreValue(value);
}

function getExamScoreStats(rows) {
    const numericRows = rows.filter(row => typeof row.total === 'number');
    const passRows = numericRows.filter(row => row.total >= 60);
    const totals = numericRows.map(row => row.total);
    return {
        participants: rows.filter(row => row.answerStatus !== '未开始' && row.answerStatus !== '缺考').length,
        passed: passRows.length,
        passRate: numericRows.length ? `${Math.round(passRows.length / numericRows.length * 100)}%` : '-',
        avg: numericRows.length ? `${(totals.reduce((sum, value) => sum + value, 0) / numericRows.length).toFixed(1)}分` : '-',
        highest: numericRows.length ? `${Math.max(...totals)}分` : '-',
        lowest: numericRows.length ? `${Math.min(...totals)}分` : '-'
    };
}

function renderExamScoreOverview(stats) {
    const items = [
        { label: '参考人数', value: `${stats.participants}人` },
        { label: '及格人数', value: `${stats.passed}人`, accent: 'green' },
        { label: '及格率', value: stats.passRate, accent: 'green' },
        { label: '平均分', value: stats.avg },
        { label: '最高分', value: stats.highest, accent: 'blue' },
        { label: '最低分', value: stats.lowest }
    ];
    return `
    <section class="card exam-score-overview">
        ${items.map(item => `
            <div class="exam-score-stat ${item.accent || ''}">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
            </div>
        `).join('')}
    </section>`;
}

function renderLevelScoreOverview(stats) {
    const isOverall = stats.mode === 'level-overall';
    const items = isOverall ? [
        { label: '已开始闯关人数', value: `${stats.started}人` },
        { label: '全部通关人数', value: `${stats.completed}人` },
        { label: '全部通关率', value: stats.completionRate },
        { label: '人均通关关数', value: `${stats.avgPassedLevels}关` },
        { label: '累计通关关次', value: `${stats.totalPassedLevels}次` },
        { label: '挑战进度', value: stats.challengeProgress }
    ] : [
        { label: '本关挑战人数', value: `${stats.participants}人` },
        { label: '本关通关人数', value: `${stats.passed}人` },
        { label: '本关通关率', value: stats.passRate },
        { label: '本关平均分', value: stats.avg },
        { label: '本关最高分', value: stats.highest },
        { label: '本关最低分', value: stats.lowest }
    ];
    return `
    <section class="card exam-score-overview level-score-overview">
        ${items.map(item => `
            <div class="exam-score-stat">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
            </div>
        `).join('')}
    </section>`;
}

function getExamRecordPapersForCurrentGroup() {
    const groupPapers = EXAM_RECORD_PAPERS.filter(item => item.id !== 'all' && (examRecordGroup === 'all' || item.groupId === examRecordGroup));
    return groupPapers.length ? groupPapers : [];
}

function getExamRecordStats(rows) {
    const selectedPaper = EXAM_RECORD_PAPERS.find(item => item.id === examRecordPaper);
    if (selectedPaper && selectedPaper.id !== 'all') return selectedPaper;
    const papers = EXAM_RECORD_PAPERS.filter(item => item.id !== 'all' && (examRecordGroup === 'all' || item.groupId === examRecordGroup));
    const expected = papers.reduce((sum, item) => sum + item.expected, 0);
    const joined = papers.reduce((sum, item) => sum + item.joined, 0);
    const submitted = papers.reduce((sum, item) => sum + item.submitted, 0);
    const pendingReview = papers.reduce((sum, item) => sum + item.pendingReview, 0);
    const reviewed = papers.reduce((sum, item) => sum + item.reviewed, 0);
    const avgRows = rows.filter(row => typeof row.total === 'number');
    const avg = avgRows.length ? (avgRows.reduce((sum, row) => sum + row.total, 0) / avgRows.length).toFixed(1) : '-';
    return { expected, joined, submitted, pendingReview, reviewed, avg };
}

function renderExamGroupSelect() {
    return `
    <select class="form-control" onchange="switchExamRecordGroup(this.value)">
        ${EXAM_RECORD_GROUPS.map(group => `
            <option value="${group.id}" ${examRecordGroup === group.id ? 'selected' : ''}>${group.name} ${group.count}人</option>
        `).join('')}
    </select>`;
}

function renderExamPaperSwitcher() {
    const papers = getExamRecordPapersForCurrentGroup();
    if (!papers.length) return `<section class="card exam-paper-switcher"><div class="exam-empty">当前组别暂未配置考试/试卷</div></section>`;
    return `
    <section class="card exam-paper-switcher">
        <div class="exam-section-title">考试 / 试卷</div>
        <div class="exam-paper-cards">
            ${papers.map(paper => `
                <button class="exam-paper-card ${examRecordPaper === paper.id ? 'active' : ''}" onclick="switchExamRecordPaper('${paper.id}')">
                    <strong>${paper.examName}</strong>
                    <span>试卷：${paper.paper}</span>
                    <span>时间：${paper.time}</span>
                    <div>
                        ${examPaperStatusBadge(paper.status)}
                        <em>已交卷 ${paper.submitted} / ${paper.expected}</em>
                    </div>
                    <small>阅卷进度：${paper.reviewProgress}% ｜ 平均分：${paper.avg}</small>
                </button>
            `).join('')}
        </div>
    </section>`;
}

function renderDailyDaySwitcher() {
    return `
    <section class="card daily-calendar-card">
        <div class="daily-calendar-head">
            <div>
                <div class="exam-section-title">${dailyBoardView === 'overview' ? '每日答题总览' : '每日答题日历看板'}</div>
                <p>${dailyBoardView === 'overview' ? '按用户查看活动周期内的累计参与天数、达标天数、累计总分与最近答题情况。' : '按日期查看每日答题人数、完成人数、达标人数与平均分，点击日期查看当天用户答题列表。'}</p>
            </div>
            <div class="daily-rule-summary">
                <span>题库：图书馆知识题库</span>
                <span>规则：50题 / 100分 / 达标60分</span>
                <span>开放：2026/06/09-2026/07/09</span>
                <span>时段：06:00-23:59</span>
            </div>
        </div>
        ${dailyBoardView === 'overview' ? renderDailyOverviewBoard() : renderDailyCalendarBoard()}
    </section>`;
}

function renderDailyCalendarBoard() {
    const cells = buildDailyCalendarCells(2026, 5);
    return `
    <div class="daily-calendar-toolbar">
        <div class="daily-calendar-tabs">
            <button class="active" onclick="switchDailyBoardView('calendar')">日历</button>
            <button onclick="switchDailyBoardView('overview')">总览</button>
        </div>
        <div class="daily-calendar-month">
            <button title="上一月">‹</button>
            <strong>2026 年 6 月</strong>
            <button title="下一月">›</button>
        </div>
        <div class="daily-calendar-legend">
            <span><i class="good"></i>达标率高</span>
            <span><i class="normal"></i>正常</span>
            <span><i class="risk"></i>偏低</span>
        </div>
    </div>
    <div class="daily-calendar-grid daily-calendar-weekdays">
        ${['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map(day => `<div>${day}</div>`).join('')}
    </div>
    <div class="daily-calendar-grid daily-calendar-days">
        ${cells.map(cell => renderDailyCalendarCell(cell)).join('')}
    </div>`;
}

function renderDailyOverviewBoard() {
    const rows = getDailyOverviewRows();
    return `
    <div class="daily-calendar-toolbar daily-overview-toolbar">
        <div class="daily-calendar-tabs">
            <button onclick="switchDailyBoardView('calendar')">日历</button>
            <button class="active" onclick="switchDailyBoardView('overview')">总览</button>
        </div>
        <span>共 ${rows.length} 名用户</span>
    </div>
    <div class="daily-overview-filter">
        <input class="form-control" placeholder="请输入用户编号">
        <input class="form-control" placeholder="请输入用户姓名">
        <input class="form-control" placeholder="请输入手机号">
        <select class="form-control"><option>全部组别</option><option>小学组</option><option>初中组</option><option>高中组</option><option>教师组</option></select>
        <input class="form-control" placeholder="请输入选送单位">
        <div class="daily-overview-actions">
            <button class="btn btn-primary">查询</button>
            <button class="btn btn-outline">重置</button>
            <button class="btn btn-outline">导出</button>
        </div>
    </div>
    <div class="daily-overview-table-wrap">
        <table class="daily-overview-table">
            <thead>
                <tr><th>排名</th><th>用户编号</th><th>用户姓名</th><th>手机号</th><th>所属组别</th><th>选送单位</th><th>参与天数</th><th>达标天数</th><th>累计答题次数 / 应答天数</th><th>缺答天数</th><th>连续达标</th><th>累计总分</th><th>平均分</th><th>最近一次得分</th><th>最近答题日期</th><th>今日状态</th><th>操作</th></tr>
            </thead>
            <tbody>
                ${rows.map((row, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${row.userNo}</td>
                        <td><strong>${row.name}</strong></td>
                        <td>${row.phone}</td>
                        <td>${row.group}</td>
                        <td>${row.org}</td>
                        <td>${row.participatedDays}</td>
                        <td>${row.qualifiedDays}</td>
                        <td>${row.totalAttempts}/${row.expectedDays}</td>
                        <td>${row.missedDays}</td>
                        <td>${row.streak}天</td>
                        <td>${scoreValue(row.cumulativeScore, true)}</td>
                        <td>${row.avgScore}</td>
                        <td>${scoreValue(row.latestScore, true)}</td>
                        <td>${row.latestDate}</td>
                        <td>${dailyStatusBadge(row.todayStatus)}</td>
                        <td><span class="action-link" onclick="openDailyUserOverview('${row.name}')">查看明细</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ${renderStandardPagination(rows.length)}`;
}

function buildDailyCalendarCells(year, monthIndex) {
    const first = new Date(year, monthIndex, 1);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const leading = (first.getDay() + 6) % 7;
    const cells = [];
    const prevDays = new Date(year, monthIndex, 0).getDate();
    for (let i = leading - 1; i >= 0; i -= 1) {
        cells.push({ day: prevDays - i, muted: true });
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push({ day, date: `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`, muted: false });
    }
    while (cells.length % 7 !== 0 || cells.length < 35) {
        cells.push({ day: cells.length - leading - daysInMonth + 1, muted: true });
    }
    return cells;
}

function renderDailyCalendarCell(cell) {
    if (cell.muted) return `<button class="daily-calendar-cell muted" disabled><strong>${cell.day}</strong></button>`;
    const day = DAILY_RECORD_DAYS.find(item => item.date === cell.date);
    const data = day || buildDailyFallbackDay(cell);
    const rate = data.expected ? Math.round((data.completed || 0) / data.expected * 100) : 0;
    const qualifiedRate = data.completed ? Math.round((data.qualified || 0) / data.completed * 100) : 0;
    const outOfRange = cell.date < DAILY_ACTIVITY_START || cell.date > DAILY_ACTIVITY_END;
    const tone = data.status === '未开始' ? 'empty' : qualifiedRate >= 80 ? 'good' : qualifiedRate >= 60 ? 'normal' : 'risk';
    if (outOfRange) {
        return `
        <button class="daily-calendar-cell empty" disabled>
            <strong>${cell.day}</strong>
            <div class="daily-calendar-metrics">
                <span>未开放</span>
            </div>
            <div class="daily-calendar-progress"><i style="width:0%"></i></div>
        </button>`;
    }
    return `
    <button class="daily-calendar-cell ${tone}" onclick="openDailyAnswerDayModal('${data.date}')">
        <strong>${cell.day}</strong>
        <div class="daily-calendar-metrics">
            <span>答题人数 <b>${data.joined}/${data.expected}</b></span>
            <span>完成人数 <b>${data.completed}</b></span>
            <span>达标人数 <b>${data.qualified}</b></span>
            <span>平均分 <b>${data.avg}</b></span>
        </div>
        <div class="daily-calendar-progress"><i style="width:${rate}%"></i></div>
    </button>`;
}

function buildDailyFallbackDay(cell) {
    const isBeforeStart = cell.date < DAILY_ACTIVITY_START;
    const isFuture = cell.date > DAILY_ACTIVITY_END;
    const expected = 528;
    const inactive = isBeforeStart || isFuture;
    const joined = inactive ? 0 : 180 + (cell.day % 6) * 18;
    const completed = inactive ? 0 : Math.max(0, joined - 12);
    const qualified = inactive ? 0 : Math.round(completed * (0.68 + (cell.day % 4) * 0.05));
    return {
        date: cell.date,
        status: inactive ? '未开始' : '已结束',
        expected,
        joined,
        completed,
        qualified,
        avg: inactive ? '-' : (76 + (cell.day % 8)).toFixed(1)
    };
}

function switchDailyBoardView(view) {
    dailyBoardView = view;
    dailyRecordDay = 'all';
    navigateTo('exam-records');
}

function getDailyOverviewRows() {
    const expectedDays = 31;
    const unique = new Map();
    DAILY_RECORD_ROWS.forEach((row, index) => {
        const current = unique.get(row.name) || {
            userNo: `U${String(index + 1).padStart(4, '0')}`,
            name: row.name,
            phone: row.phone,
            group: row.group,
            groupId: row.groupId,
            org: row.org,
            scores: [],
            totalAttempts: 0,
            participatedDays: 0,
            qualifiedDays: 0,
            streak: row.streak || 0,
            latestScore: '-',
            latestDate: '-',
            todayStatus: '未答题'
        };
        const score = typeof row.dailyScore === 'number' ? row.dailyScore : null;
        current.totalAttempts += Number(String(row.attempts || '0').split('/')[0]) || 0;
        if (row.status !== '未答题') current.participatedDays += 1;
        if (score !== null) current.scores.push(score);
        if (score !== null && score >= 60) current.qualifiedDays += 1;
        if (row.submitTime && row.submitTime !== '-') {
            current.latestDate = row.submitTime.slice(0, 10);
            current.latestScore = row.dailyScore;
            current.todayStatus = row.status;
        }
        current.streak = Math.max(current.streak, row.streak || 0);
        unique.set(row.name, current);
    });
    const rows = Array.from(unique.values()).map(row => {
        const cumulativeScore = row.scores.reduce((sum, value) => sum + value, 0);
        return {
            ...row,
            expectedDays,
            missedDays: Math.max(0, expectedDays - row.participatedDays),
            cumulativeScore,
            avgScore: row.scores.length ? (cumulativeScore / row.scores.length).toFixed(1) : '-'
        };
    });
    return rows.sort((a, b) => b.qualifiedDays - a.qualifiedDays || b.cumulativeScore - a.cumulativeScore);
}

function openDailyUserOverview(name) {
    const rows = DAILY_RECORD_ROWS.filter(row => row.name === name);
    const user = rows[0] || DAILY_RECORD_ROWS[0];
    openModal(`${name} 每日答题明细`, `
        <div class="daily-answer-modal">
            <div class="unit-detail-meta">
                <div><span>用户姓名</span><strong>${name}</strong></div>
                <div><span>所属组别</span><strong>${user.group}</strong></div>
                <div><span>选送单位</span><strong>${user.org}</strong></div>
                <div><span>累计记录</span><strong>${rows.length} 天</strong></div>
            </div>
            <div class="daily-answer-table-wrap">
                <table class="daily-answer-table daily-user-detail-table">
                    <thead>
                        <tr><th>日期</th><th>当日得分</th><th>是否达标</th><th>累计总分</th><th>达标天数</th><th>连续达标</th><th>答题次数</th><th>得分率</th><th>用时</th><th>答题状态</th><th>提交时间</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                        ${(rows.length ? rows : getDailyRowsForDate('2026-06-09').filter(row => row.name === name)).map(row => `
                            <tr>
                                <td>${dailyDayLabel(row.dayId)}</td>
                                <td>${scoreValue(row.dailyScore, true)}</td>
                                <td>${dailyPassText(row)}</td>
                                <td>${scoreValue(row.cumulativeScore, true)}</td>
                                <td>${row.qualifiedDays}</td>
                                <td>${row.streak}天</td>
                                <td>${row.attempts}</td>
                                <td>${row.accuracy}</td>
                                <td>${row.duration}</td>
                                <td>${dailyStatusBadge(row.status)}</td>
                                <td>${row.submitTime}</td>
                                <td><span class="action-link" onclick="openDailyAnswerDetail('${row.name}', '${row.dayId}')">查看详情</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide daily-answer-modal-shell' });
}

function renderLevelStageSwitcher() {
    const stages = getLevelStagesForCurrentGroup().filter(stage => stage.id !== 'all');
    if (!stages.some(stage => stage.id === levelRecordStage) && stages.length) {
        levelRecordStage = stages[0].id;
    }
    return `
    <section class="card exam-paper-switcher answer-object-switcher level">
        <div class="exam-section-title">关卡</div>
        <div class="exam-paper-cards">
            ${stages.map(stage => `
                <button class="exam-paper-card answer-object-card ${levelRecordStage === stage.id ? 'active' : ''}" onclick="switchLevelRecordStage('${stage.id}')">
                    <strong>${stage.id === 'all' ? '全部关卡' : `${stage.title} · ${stage.subtitle}`}</strong>
                    <span>开放：${stage.date}</span>
                    <span>规则：${stage.rules}</span>
                    <div>
                        ${levelStageStatusBadge(stage.status)}
                        <em>已挑战 ${stage.joined} / ${stage.expected}</em>
                    </div>
                    <small>通关人数：${stage.qualified} ｜ 平均分：${stage.avg}</small>
                </button>
            `).join('')}
        </div>
    </section>`;
}

function getDailyDaysForCurrentGroup() {
    if (examRecordGroup === 'all') return DAILY_RECORD_DAYS;
    const activeDayIds = new Set(DAILY_RECORD_ROWS.filter(row => row.groupId === examRecordGroup).map(row => row.dayId));
    return DAILY_RECORD_DAYS.filter(day => day.id === 'all' || activeDayIds.has(day.id));
}

function getLevelStagesForCurrentGroup() {
    if (examRecordGroup === 'all') return LEVEL_RECORD_STAGES;
    const activeLevelIds = new Set(LEVEL_RECORD_ROWS.filter(row => row.groupId === examRecordGroup).map(row => row.levelId));
    return LEVEL_RECORD_STAGES.filter(stage => stage.id === 'all' || activeLevelIds.has(stage.id));
}

function switchExamRecordGroup(groupId) {
    examRecordGroup = groupId;
    examRecordPaper = 'all';
    dailyRecordDay = 'all';
    levelRecordStage = answerStatsMode === 'level' ? getDefaultLevelStageId() : 'all';
    navigateTo(currentPage === 'unit-data' ? 'unit-data' : 'exam-records');
}

function switchExamRecordPaper(paperId) {
    examRecordPaper = paperId;
    navigateTo(currentPage === 'unit-data' ? 'unit-data' : 'exam-records', { keepExamRecordPaper: true });
}

function switchDailyRecordDay(dayId) {
    dailyRecordDay = dayId;
    navigateTo('exam-records');
}

function openDailyAnswerDayModal(date) {
    const rows = getDailyRowsForDate(date);
    openModal(`${date} 每日答题情况`, `
        <div class="daily-answer-modal">
            <div class="daily-answer-modal-filter">
                <label><span>用户编号</span><input class="form-control" placeholder="请输入用户编号"></label>
                <label><span>用户姓名</span><input class="form-control" placeholder="请输入用户姓名"></label>
                <label><span>手机号码</span><input class="form-control" placeholder="请输入手机号码"></label>
                <label><span>所属组别</span><select class="form-control"><option>全部</option><option>小学组</option><option>初中组</option><option>高中组</option><option>教师组</option></select></label>
                <label><span>选送单位</span><input class="form-control" placeholder="请输入选送单位"></label>
                <label><span>达标状态</span><select class="form-control"><option>全部</option><option>已达标</option><option>未达标</option><option>未答题</option></select></label>
                <div class="daily-answer-modal-actions">
                    <button class="btn btn-primary">查询</button>
                    <button class="btn btn-outline">重置</button>
                    <button class="btn btn-outline">导出</button>
                </div>
            </div>
            <div class="daily-answer-table-wrap">
                <table class="daily-answer-table">
                    <thead>
                        <tr><th>用户编号</th><th>用户姓名</th><th>手机号</th><th>所属组别</th><th>选送单位</th><th>答题次数</th><th>达标次数</th><th>最近提交时间</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                        ${rows.map((row, index) => `
                            <tr>
                                <td>${row.userNo || `U${String(index + 1).padStart(4, '0')}`}</td>
                                <td><strong>${row.name}</strong></td>
                                <td>${row.phone}</td>
                                <td>${row.group}</td>
                                <td>${row.org}</td>
                                <td>${row.attempts}</td>
                                <td>${dailyQualifiedAttemptCount(row)}</td>
                                <td>${row.submitTime}</td>
                                <td>${row.status === '未答题' ? '<span style="color:var(--text-tertiary)">-</span>' : `<span class="action-link" onclick="openDailyAnswerDetail('${row.name}', '${row.dayId}')">查看详情</span>`}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${renderStandardPagination(rows.length)}
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide daily-answer-modal-shell' });
}

function getDailyRowsForDate(date) {
    const day = DAILY_RECORD_DAYS.find(item => item.date === date);
    const baseRows = day ? DAILY_RECORD_ROWS.filter(row => row.dayId === day.id) : [];
    if (baseRows.length) return buildDailyRowsWithAbsences(date, day.id, baseRows);
    const seedRows = DAILY_RECORD_ROWS.slice(0, 7);
    const fallbackRows = seedRows.map((row, index) => {
        const score = index === 6 ? '-' : Math.max(52, 94 - index * 6 + (Number(date.slice(-2)) % 5));
        return {
            ...row,
            userNo: `U${date.slice(-2)}${String(index + 1).padStart(3, '0')}`,
            dailyScore: score,
            attempts: index === 6 ? '0/1' : '1/1',
            accuracy: typeof score === 'number' ? `${score}%` : '-',
            duration: index === 6 ? '-' : `${String(7 + index).padStart(2, '0')}分${String(22 + index * 3).padStart(2, '0')}秒`,
            status: index === 6 ? '未答题' : score >= 60 ? '已完成' : '未达标',
            submitTime: index === 6 ? '-' : `${date} ${String(9 + index).padStart(2, '0')}:${String(12 + index * 4).padStart(2, '0')}`
        };
    });
    return buildDailyRowsWithAbsences(date, day?.id || date, fallbackRows);
}

function getDailyAttemptsForUserDay(name, dayId) {
    return DAILY_ATTEMPT_RECORDS
        .filter(item => item.name === name && item.dayId === dayId)
        .sort((a, b) => a.attemptNo - b.attemptNo);
}

function getScoredDailyAttempts(name, dayId) {
    return getDailyAttemptsForUserDay(name, dayId).filter(item => typeof item.score === 'number');
}

function getCountedDailyAttempt(name, dayId) {
    const scored = getScoredDailyAttempts(name, dayId);
    if (!scored.length) return null;
    if (DAILY_SCORE_RULE === 'last') {
        return scored[scored.length - 1];
    }
    return [...scored].sort((a, b) => b.score - a.score || a.submitTime.localeCompare(b.submitTime))[0];
}

function getDailyRuleLabel() {
    return DAILY_SCORE_RULE === 'last' ? '最后一次计入' : '最高分计入';
}

function getDailyMaxAttemptsLabel() {
    return DAILY_MAX_ATTEMPTS ? String(DAILY_MAX_ATTEMPTS) : '不限';
}

function dailyQualifiedAttemptCount(row) {
    const attempts = getScoredDailyAttempts(row.name, row.dayId);
    const qualified = attempts.filter(item => item.score >= DAILY_QUALIFIED_SCORE).length;
    return `${qualified}/${getDailyMaxAttemptsLabel()}`;
}

function buildDailyRowsWithAbsences(date, dayId, rows) {
    const rowMap = new Map(rows.map(row => [row.name, row]));
    return DAILY_REGISTERED_USERS
        .filter(user => examRecordGroup === 'all' || user.groupId === examRecordGroup)
        .map(user => {
            const row = rowMap.get(user.name);
            const attempts = getDailyAttemptsForUserDay(user.name, dayId);
            const submittedAttempts = attempts.filter(item => item.status === '已提交');
            const countedAttempt = getCountedDailyAttempt(user.name, dayId);
            const latestSubmitted = submittedAttempts[submittedAttempts.length - 1];
            if (row) {
                return {
                    ...user,
                    ...row,
                    userNo: user.userNo,
                    countedAttemptId: countedAttempt?.attemptId || '',
                    dailyScore: countedAttempt ? countedAttempt.score : row.dailyScore,
                    attempts: `${submittedAttempts.length}/${getDailyMaxAttemptsLabel()}`,
                    accuracy: countedAttempt ? countedAttempt.accuracy : row.accuracy,
                    duration: countedAttempt ? countedAttempt.duration : row.duration,
                    status: attempts.some(item => item.status === '答题中') ? '答题中' : submittedAttempts.length >= DAILY_MAX_ATTEMPTS ? '次数已用完' : row.status,
                    submitTime: latestSubmitted?.submitTime || row.submitTime,
                    scoreRule: getDailyRuleLabel()
                };
            }
            return {
                ...user,
                dayId,
                dailyScore: '-',
                cumulativeScore: '-',
                qualifiedDays: 0,
                attempts: '0/1',
                bestScore: '-',
                accuracy: '-',
                duration: '-',
                status: '未答题',
                submitTime: '-',
                streak: 0,
                absenceDate: date,
                countedAttemptId: '',
                scoreRule: getDailyRuleLabel()
            };
        });
}

function dailyPassBadge(row) {
    if (row.status === '答题中' || row.dailyScore === '答题中') return '<span class="badge badge-yellow">待提交</span>';
    if (row.status === '未答题' || row.dailyScore === '-') return '<span class="badge badge-gray">未答题</span>';
    return typeof row.dailyScore === 'number' && row.dailyScore >= 60
        ? '<span class="badge badge-green">已达标</span>'
        : '<span class="badge badge-red">未达标</span>';
}

function dailyPassText(row) {
    if (row.status === '答题中' || row.dailyScore === '答题中') return '待提交';
    if (row.status === '未答题' || row.dailyScore === '-') return '未答题';
    return typeof row.dailyScore === 'number' && row.dailyScore >= DAILY_QUALIFIED_SCORE ? '是' : '否';
}

function formatDailyModalDate(date) {
    const [, month, day] = date.split('-');
    return `${Number(month)}月${Number(day)}日`;
}

function switchLevelRecordStage(stageId) {
    levelRecordStage = stageId;
    navigateTo('exam-records');
}

function examAnswerStatusBadge(status) {
    const map = {
        '未开始': 'badge-gray',
        '答题中': 'badge-yellow',
        '已交卷': 'badge-blue',
        '缺考': 'badge-red'
    };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function examReviewStatusBadge(status) {
    if (status === '-') return '<span style="color:var(--text-tertiary)">-</span>';
    const map = {
        '无需阅卷': 'badge-gray',
        '待阅卷': 'badge-yellow',
        '阅卷中': 'badge-blue',
        '已阅卷': 'badge-green'
    };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function examPaperStatusBadge(status) {
    const map = { '汇总': 'badge-gray', '未开始': 'badge-gray', '进行中': 'badge-yellow', '已结束': 'badge-green' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function levelStageStatusBadge(status) {
    const map = { '汇总': 'badge-gray', '已开放': 'badge-green', '未配置': 'badge-yellow', '未开放': 'badge-gray' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function dailyStatusBadge(status) {
    const map = { '已完成': 'badge-green', '答题中': 'badge-yellow', '未答题': 'badge-gray', '未达标': 'badge-red', '次数已用完': 'badge-blue' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function dailyAnsweredStatusBadge(row) {
    const answered = (Number(String(row.attempts || '0').split('/')[0]) || 0) > 0;
    return answered
        ? '<span class="badge badge-green">已答题</span>'
        : '<span class="badge badge-gray">未答题</span>';
}

function levelPassBadge(status) {
    const map = { '已通关': 'badge-green', '未通关': 'badge-red', '待挑战': 'badge-gray' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function dailyDayLabel(dayId) {
    const day = DAILY_RECORD_DAYS.find(item => item.id === dayId);
    return day ? `${day.title} ${day.date}` : '-';
}

function passBadge(status) {
    const map = { '达标': 'badge-green', '未达标': 'badge-red', '待判定': 'badge-gray' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function examPassText(status) {
    if (status === '达标') return '是';
    if (status === '未达标') return '否';
    return status || '-';
}

function promoteBadge(status) {
    const map = { '晋级': 'badge-green', '未晋级': 'badge-red', '待判定': 'badge-gray' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function certificateBadge(status) {
    const map = { '已发放': 'badge-green', '发放中': 'badge-yellow', '未发放': 'badge-gray', '发放失败': 'badge-red' };
    return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function scoreValue(value, primary = false) {
    if (value === '待生成') return '<span class="badge badge-yellow">待生成</span>';
    if (value === '待阅') return '<span class="badge badge-yellow">待阅</span>';
    if (value === '-') return '<span style="color:var(--text-tertiary)">-</span>';
    return primary ? `<strong style="color:var(--primary)">${value}</strong>` : value;
}

function scoreAccuracy(row) {
    return typeof row.total === 'number' && typeof row.full === 'number' ? `${Math.round(row.total / row.full * 100)}%` : '-';
}

function scoreReviewStatus(row) {
    if (row.answerStatus === '未开始' || row.answerStatus === '答题中' || row.answerStatus === '缺考') {
        return examAnswerStatusBadge(row.answerStatus);
    }
    return examReviewStatusBadge(row.reviewStatus);
}

function getUserExamKey(row) {
    return `${String(row.name || '').trim()}__${String(row.phone || '').trim()}`;
}

function getUserExamSessionRows(row) {
    if (!row) return [];
    const key = getUserExamKey(row);
    return EXAM_RECORD_ROWS
        .filter(item => getUserExamKey(item) === key)
        .sort((a, b) => String(a.submitTime || '').localeCompare(String(b.submitTime || '')));
}

function getUserExamSessionStats(row) {
    const rows = getUserExamSessionRows(row);
    const scoredRows = rows.filter(item => typeof item.total === 'number');
    const scores = scoredRows.map(item => item.total);
    const cumulativeScore = scores.reduce((sum, value) => sum + value, 0);
    const passedRows = scoredRows.filter(item => item.total >= 60);
    return {
        sessionCount: rows.length,
        cumulativeScore: scoredRows.length ? cumulativeScore : '-',
        avgScore: scoredRows.length ? (cumulativeScore / scoredRows.length).toFixed(1) : '-',
        highestScore: scoredRows.length ? Math.max(...scores) : '-',
        lowestScore: scoredRows.length ? Math.min(...scores) : '-',
        passCount: passedRows.length,
        passRate: scoredRows.length ? `${Math.round(passedRows.length / scoredRows.length * 100)}%` : '-'
    };
}

function getCumulativeScore(row) {
    if (typeof row.cumulativeScore !== 'undefined') return row.cumulativeScore;
    return getUserExamSessionStats(row).cumulativeScore;
}

function getQualifiedDays(row) {
    if (typeof row.qualifiedDays !== 'undefined') return row.qualifiedDays;
    return getUserExamSessionStats(row).passCount;
}

function sessionStatCard(label, value, hint = '') {
    return `
        <div style="padding:14px 16px;border:1px solid var(--border-color-light);border-radius:8px;background:#fff;display:grid;gap:6px">
            <span style="font-size:12px;color:var(--text-secondary)">${label}</span>
            <strong style="font-size:22px;line-height:1.1;color:var(--text-primary)">${value}</strong>
            ${hint ? `<em style="font-size:12px;color:var(--text-tertiary);font-style:normal">${hint}</em>` : ''}
        </div>`;
}

function renderUserExamSessionsTable(row) {
    const rows = getUserExamSessionRows(row);
    return `
        <div class="exam-session-table-wrap">
            <table class="exam-session-table">
                <thead>
                    <tr><th>场次</th><th>考试 / 试卷</th><th>本场得分</th><th>状态</th><th>操作</th></tr>
                </thead>
                <tbody>
                    ${rows.map((item, index) => {
                        return `
                            <tr>
                                <td>第${index + 1}场</td>
                                <td>
                                    <strong>${item.examName}</strong>
                                    <div style="margin-top:4px;color:var(--text-tertiary);font-size:12px">${item.paper} · ${item.submitTime}</div>
                                </td>
                                <td>${scoreValue(item.total, true)}</td>
                                <td>${scoreReviewStatus(item)}</td>
                                <td><span class="action-link" onclick="closeModal();openAnswerDetail('${escHtml(item.name)}', '${escHtml(item.paperId)}')">查看详情</span></td>
                            </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`;
}

function openUserExamSessions(name, phone) {
    const row = EXAM_RECORD_ROWS.find(item => item.name === name && item.phone === phone) || EXAM_RECORD_ROWS[0];
    if (!row) return;
    const stats = getUserExamSessionStats(row);
    openModal(`${row.name} - 参与考试场次记录`, `
        <div style="display:grid;gap:var(--spacing-md)">
            <div style="display:flex;justify-content:space-between;gap:16px;align-items:flex-start">
                <div style="display:grid;gap:4px">
                    <strong style="font-size:16px">${row.name}</strong>
                    <span style="color:var(--text-secondary)">手机号 ${row.phone} · ${row.group} · ${row.org}</span>
                </div>
            </div>
            <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px">
                ${sessionStatCard('参与场次', `${stats.sessionCount}场`)}
                ${sessionStatCard('累计得分', scoreValue(stats.cumulativeScore, true), '已出分场次汇总')}
                ${sessionStatCard('平均分', stats.avgScore === '-' ? '-' : `${stats.avgScore}分`)}
                ${sessionStatCard('及格次数', `${stats.passCount}次`, `及格率 ${stats.passRate}`)}
            </div>
            ${renderUserExamSessionsTable(row)}
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide' });
}

function openAnswerSheet(name, paper) {
    openModal('查看答卷', `
        <div style="display:grid;gap:var(--spacing-md)">
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border-color-light);padding-bottom:var(--spacing-sm)"><span>考生</span><strong>${name}</strong></div>
            <div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--border-color-light);padding-bottom:var(--spacing-sm)"><span>试卷</span><strong>${paper}</strong></div>
            <div class="info-box blue">这里展示用户本次作答详情、题目答案、客观题判分和主观题评分明细。</div>
        </div>
    `, null, { confirmText: '关闭', hideCancel: true });
}

function openDailyAnswerDetail(name, dayId, attemptId = '') {
    const day = DAILY_RECORD_DAYS.find(item => item.id === dayId) || DAILY_RECORD_DAYS[1];
    const row = getDailyRowsForDate(day.date).find(item => item.name === name) || DAILY_REGISTERED_USERS.find(item => item.name === name);
    const attempts = getDailyAttemptsForUserDay(name, dayId);
    const countedAttempt = getCountedDailyAttempt(name, dayId);
    const activeAttempt = attempts.find(item => item.attemptId === attemptId) || countedAttempt || attempts[0] || null;
    openModal(`${name} - ${day.date} 每日答题详情`, `
        <div class="daily-detail-modal">
            ${renderDailyDetailSummary(row, day, attempts, countedAttempt)}
            ${renderDailyAttemptTimeline(name, dayId, attempts, activeAttempt)}
            ${renderDailyAttemptPaperTabs(name, dayId, attempts, activeAttempt, row, day)}
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide daily-detail-modal-shell' });
}

function renderDailyDetailSummary(row, day, attempts, countedAttempt) {
    const submittedCount = attempts.filter(item => item.status === '已提交').length;
    const maxLabel = getDailyMaxAttemptsLabel();
    return `
        <section class="daily-detail-summary">
            <div class="daily-detail-user">
                <strong>${row?.name || '-'}</strong>
                <span>${row?.phone || '-'} · ${row?.group || '-'} · ${row?.org || '-'}</span>
            </div>
            <div class="daily-detail-stat-grid">
                ${dailyDetailStat('答题次数', `${submittedCount}/${maxLabel}`, attempts.some(item => item.status === '答题中') ? '有进行中答题' : '已提交次数')}
                ${dailyDetailStat('最近提交时间', attempts.filter(item => item.submitTime !== '-').at(-1)?.submitTime || '-', day.date)}
            </div>
        </section>`;
}

function dailyDetailStat(label, value, hint = '') {
    return `
        <div class="daily-detail-stat">
            <span>${label}</span>
            <strong>${value}</strong>
            ${hint ? `<em>${hint}</em>` : ''}
        </div>`;
}

function renderDailyAttemptTimeline(name, dayId, attempts, activeAttempt) {
    if (!attempts.length) {
        return `<section class="daily-detail-section"><h4>答题次数明细</h4><div class="daily-detail-empty">当天暂无答题记录。</div></section>`;
    }
    return `
        <section class="daily-detail-section">
            <div class="daily-detail-section-head">
                <h4>答题次数明细</h4>
            </div>
            <div class="daily-attempt-table-wrap">
                <table class="daily-attempt-table">
                    <thead>
                        <tr><th>次数</th><th>得分</th><th>是否达标</th><th>得分率</th><th>用时</th><th>开始时间</th><th>提交时间</th><th>状态</th></tr>
                    </thead>
                    <tbody>
                        ${attempts.map(attempt => {
                            return `
                                <tr class="${activeAttempt?.attemptId === attempt.attemptId ? 'active' : ''}">
                                    <td>第${attempt.attemptNo}次</td>
                                    <td>${scoreValue(attempt.score, true)}</td>
                                    <td>${dailyPassText({ dailyScore: attempt.score, status: attempt.status === '答题中' ? '答题中' : '已完成' })}</td>
                                    <td>${attempt.accuracy}</td>
                                    <td>${attempt.duration}</td>
                                    <td>${attempt.startTime}</td>
                                    <td>${attempt.submitTime}</td>
                                    <td>${dailyStatusBadge(attempt.status === '已提交' ? '已完成' : attempt.status)}</td>
                                </tr>`;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        </section>`;
}

function renderDailyAttemptPaperTabs(name, dayId, attempts, activeAttempt, row, day) {
    if (!attempts.length) {
        return `<section class="daily-detail-section"><h4>答卷详情</h4><div class="daily-detail-empty">暂无可查看的答卷内容。</div></section>`;
    }
    return `
        <section class="daily-detail-section daily-paper-section">
            <div class="daily-paper-tabs">
                ${attempts.map(attempt => `
                    <button class="${activeAttempt?.attemptId === attempt.attemptId ? 'active' : ''}" onclick="openDailyAnswerDetail('${name}', '${dayId}', '${attempt.attemptId}')">
                        第${attempt.attemptNo}次答卷
                    </button>
                `).join('')}
            </div>
            ${renderDailyAttemptPaper(activeAttempt, row, day)}
        </section>`;
}

function renderDailyAttemptPaper(attempt, row, day) {
    if (!attempt) {
        return `<div class="daily-detail-empty">暂无可查看的答卷内容。</div>`;
    }
    if (attempt.status === '答题中') {
        return `
        <div>
            <div class="daily-detail-empty">该用户当前正在答题，提交后可查看题目答案、判分和解析。</div>
        </div>`;
    }
    const questions = getDailyAttemptQuestions(attempt);
    return `
        <div>
            <div class="daily-detail-section-head">
                <h4>第${attempt.attemptNo}次答卷</h4>
                <span>${day.date} · ${row?.group || '-'} · ${attempt.score}分 · ${attempt.duration}</span>
            </div>
            <div class="daily-question-list">
                ${questions.map((question, index) => renderDailyQuestionCard(question, index)).join('')}
            </div>
        </div>`;
}

function getDailyAttemptQuestions(attempt) {
    const score = typeof attempt.score === 'number' ? attempt.score : 0;
    return [
        { type: '单选题', title: '公共图书馆向社会公众提供服务应遵循哪项原则？', userAnswer: score >= 60 ? '免费、平等、开放' : '仅面向会员开放', correctAnswer: '免费、平等、开放', score: 2, awardedScore: score >= 60 ? 2 : 0, status: score >= 60 ? '正确' : '错误', analysis: '公共文化服务强调均等、开放和公益属性。' },
        { type: '判断题', title: '读者证遗失后应及时挂失，避免被他人冒用。', userAnswer: '正确', correctAnswer: '正确', score: 2, awardedScore: 2, status: '正确', analysis: '证件遗失后及时挂失是常见读者服务规范。' },
        { type: '多选题', title: '下列哪些属于图书馆常见数字资源？', userAnswer: score >= 80 ? '电子书、数据库、数字报刊' : '电子书、数据库', correctAnswer: '电子书、数据库、数字报刊', score: 4, awardedScore: score >= 80 ? 4 : 2, status: score >= 80 ? '正确' : '部分正确', analysis: '多选题可展示部分得分，便于管理员核对得分率。' },
        { type: '填空题', title: '世界读书日是每年的____。', userAnswer: '4月23日', correctAnswer: '4月23日', score: 2, awardedScore: 2, status: '正确', analysis: '本题为标准答案填空题，系统自动判分。' }
    ];
}

function renderDailyQuestionCard(question, index) {
    const statusClass = question.status === '正确' ? 'badge-green' : question.status === '部分正确' ? 'badge-yellow' : 'badge-red';
    return `
        <article class="daily-question-card">
            <div class="daily-question-head">
                <div>
                    <strong>${index + 1}. ${question.type}</strong>
                    <span class="badge ${statusClass}">${question.status}</span>
                </div>
                <b>${question.awardedScore}/${question.score} 分</b>
            </div>
            <p>${question.title}</p>
            <div class="daily-question-answer-grid">
                <div><span>用户答案</span><strong>${question.userAnswer}</strong></div>
                <div><span>正确答案</span><strong>${question.correctAnswer}</strong></div>
            </div>
            <div class="daily-question-analysis"><span>解析</span><p>${question.analysis}</p></div>
        </article>`;
}

function openExamRecord(name, phone, org, status, examName, score, total, pass, passed, startTime, endTime, submitTime) {
    const statusBadge = status === '已交卷' ? 'badge-green' : status === '进行中' ? 'badge-yellow' : 'badge-gray';
    openModal('考试记录', `<div style="display:grid;gap:var(--spacing-md)">
        <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">考试名称</span><strong>${examName}</strong></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-sm)">
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">姓名</span><strong>${name}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">手机号</span><span>${phone}</span></div>
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">得分</span><strong style="color:var(--primary)">${score}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">总分</span><strong>${total}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">及格分</span><strong>${pass}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">是否及格</span><span class="badge badge-green">${passed}</span></div>
        </div>
        <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">状态</span><span class="badge ${statusBadge}">${status}</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--spacing-sm)">
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">开始时间</span><span>${startTime}</span></div>
            <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0;border-bottom:1px solid var(--border-light)"><span style="color:var(--text-muted)">结束时间</span><span>${endTime}</span></div>
        </div>
        <div style="display:flex;justify-content:space-between;padding:var(--spacing-xs) 0"><span style="color:var(--text-muted)">交卷时间</span><span>${submitTime}</span></div>
    </div>`, null, { confirmText: '关闭', hideCancel: true });
}

// renderExamRecordModal — kept as reference for future dynamic data


// ===== 单位数据 =====
registerPage('unit-data', () => {
    return `
    ${pageHeader('🏢 单位数据情况', '活动管理 / [当前活动] / 单位数据情况')}
    <div class="unit-data-page">
        ${renderExamPaperSwitcher()}
        <section class="card exam-score-filter unit-data-filter">
            ${renderUnitDataFilter()}
        </section>

        <section class="card unit-data-table-card">
            <div class="review-list-title">单位数据情况列表</div>
            <div class="unit-data-table-wrap">
                <table class="unit-data-table">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>单位名称</th>
                            <th>应参与人数</th>
                            <th>已参与人数</th>
                            <th>已交卷人数</th>
                            <th>缺考人数</th>
                            <th>完成率 ${fieldHelpIcon('完成率 = 已交卷人数 / 应参与人数')}</th>
                            <th>单位平均分</th>
                            <th>最高分</th>
                            <th>最低分</th>
                            <th>及格人数</th>
                            <th>及格率 ${fieldHelpIcon('及格率基于已生成有效成绩人数计算')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${UNIT_DATA_ROWS.map((row, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td><strong>${row.name}</strong></td>
                                <td>${row.expected}</td>
                                <td>${row.joined}</td>
                                <td><strong>${row.submitted}</strong></td>
                                <td>${unitAbsenceValue(row.absent)}</td>
                                <td>${unitRateBadge(formatPercent(row.submitted, row.expected))}</td>
                                <td><strong>${row.avgScore}</strong></td>
                                <td>${row.highestScore}</td>
                                <td>${row.lowestScore}</td>
                                <td>${row.passed}</td>
                                <td>${formatPercent(row.passed, row.reviewed)}%</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ${renderStandardPagination(UNIT_DATA_ROWS.length)}
        </section>
    </div>`;
});

function renderUnitDataFilter() {
    return `
    <div class="unit-data-filter-row">
        ${renderExamGroupSelect()}
        <input class="form-control" placeholder="单位名称">
        <select class="form-control">
            <option>全部考试 / 试卷</option>
            <option>第一场考试</option>
            <option>第二场考试</option>
            <option>第三场考试</option>
        </select>
        <button class="btn btn-primary btn-sm">查询</button>
        <button class="btn btn-outline btn-sm">重置</button>
    </div>`;
}

function getUnitDataSummary() {
    const expected = UNIT_DATA_ROWS.reduce((sum, row) => sum + row.expected, 0);
    const submitted = UNIT_DATA_ROWS.reduce((sum, row) => sum + row.submitted, 0);
    const pendingReview = UNIT_DATA_ROWS.reduce((sum, row) => sum + row.pendingReview, 0);
    const reviewed = UNIT_DATA_ROWS.reduce((sum, row) => sum + row.reviewed, 0);
    const totalScore = UNIT_DATA_ROWS.reduce((sum, row) => sum + row.totalScore, 0);
    return {
        unitCount: UNIT_DATA_ROWS.length,
        expected,
        submitted,
        pendingReview,
        avgScore: reviewed ? (totalScore / reviewed).toFixed(1) : '-'
    };
}

function unitOverviewCard(label, value, desc) {
    return `
    <div class="unit-overview-card">
        <span>${label}</span>
        <strong>${value}</strong>
        <em>${desc}</em>
    </div>`;
}

function fieldHelpIcon(text) {
    return `<span class="field-help tooltip" data-tooltip="${text}" aria-label="${text}">?</span>`;
}

function formatPercent(part, total) {
    if (!total || total === '-') return '0';
    return Math.round(part / total * 1000) / 10;
}

function unitAbsenceValue(value) {
    if (value === '-') return '<span style="color:var(--text-tertiary)">暂未统计</span>';
    return value > 0 ? `<span class="badge badge-red">${value}</span>` : '<span class="badge badge-green">0</span>';
}

function unitPendingReviewValue(value) {
    return value > 0 ? `<span class="badge badge-yellow">${value}</span>` : '<span class="badge badge-green">0</span>';
}

function unitRateBadge(rate) {
    const cls = rate >= 80 ? 'badge-green' : rate >= 60 ? 'badge-yellow' : 'badge-red';
    return `<span class="badge ${cls}">${rate}%</span>`;
}

function openUnitAnswerDetail(unitName) {
    const rows = EXAM_RECORD_ROWS.filter(row => row.org === unitName);
    const fallbackRows = rows.length ? rows : EXAM_RECORD_ROWS.slice(0, 4).map(row => ({ ...row, org: unitName }));
    openModal('单位答题明细', `
        <div class="unit-detail-meta">
            <div><span>单位名称</span><strong>${unitName}</strong></div>
            <div><span>明细人数</span><strong>${fallbackRows.length}</strong></div>
        </div>
        <div class="unit-detail-table-wrap">
            <table class="unit-detail-table">
                <thead>
                    <tr><th>姓名</th><th>手机号</th><th>组别</th><th>考试名称</th><th>试卷名称</th><th>答题状态</th><th>阅卷状态</th><th>客观题得分</th><th>主观题得分</th><th>总得分</th><th>排名</th><th>是否达标</th><th>是否晋级</th><th>交卷时间</th><th>答题用时</th><th>证书状态</th><th>操作</th></tr>
                </thead>
                <tbody>
                    ${fallbackRows.map(row => `
                        <tr>
                            <td><strong>${row.name}</strong></td>
                            <td>${row.phone}</td>
                            <td>${row.group}</td>
                            <td>${row.examName}</td>
                            <td>${row.paper}</td>
                            <td>${examAnswerStatusBadge(row.answerStatus)}</td>
                            <td>${examReviewStatusBadge(row.reviewStatus)}</td>
                            <td>${row.objective}</td>
                            <td>${scoreValue(row.subjective)}</td>
                            <td>${scoreValue(row.total, true)}</td>
                            <td>${row.rank}</td>
                            <td>${examPassText(row.passed)}</td>
                            <td>${promoteBadge(row.promoted)}</td>
                            <td>${row.submitTime}</td>
                            <td>${row.duration}</td>
                            <td>${certificateBadge(row.certificate)}</td>
                            <td><span class="action-link" onclick="openAnswerSheet('${row.name}', '${row.paper}')">查看答卷</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `, null, { confirmText: '关闭', hideCancel: true, modalClass: 'modal-wide' });
}
