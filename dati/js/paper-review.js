/* paper-review.js — 阅卷管理 */

const REVIEW_EXAMS = [
  { id: 'exam-2024-safety', name: '2024年度员工安全生产知识考试', paperType: 'fixed', time: '2024-03-01 09:00:00', startTime: '2024-03-01 09:00:00', endTime: '2024-03-01 11:00:00', subjective: 5, pending: 15, reviewed: 35, assignStatus: '已分配', assignMethod: 'question', status: '阅卷中', scorePublishStatus: '未发布', abnormal: 1, totalQuestions: 10, reviewedQuestions: 7, pendingQuestions: 3, totalStudents: 50, reviewedStudents: 35, pendingStudents: 15 },
  { id: 'exam-2024-culture-q2', name: '2024年第二季度企业文化考试', paperType: 'fixed', time: '2024-03-05 14:00:00', startTime: '2024-03-05 14:00:00', endTime: '2024-03-05 16:00:00', subjective: 3, pending: 0, reviewed: 50, assignStatus: '已分配', assignMethod: 'paper-quota', status: '已完成', scorePublishStatus: '未发布', abnormal: 0, totalQuestions: 8, reviewedQuestions: 8, pendingQuestions: 0, totalStudents: 50, reviewedStudents: 50, pendingStudents: 0 },
  { id: 'exam-fixed-all-review', name: '固定题目复核考试', paperType: 'fixed', time: '2024-03-08 09:30:00', startTime: '2024-03-08 09:30:00', endTime: '2024-03-08 11:30:00', subjective: 4, pending: 20, reviewed: 40, assignStatus: '已分配', assignMethod: 'paper-all', status: '阅卷中', scorePublishStatus: '未发布', abnormal: 0, totalQuestions: 7, reviewedQuestions: 4, pendingQuestions: 3, totalStudents: 60, reviewedStudents: 40, pendingStudents: 20 },
  { id: 'exam-random-quota', name: '随机抽题能力测评', paperType: 'random', time: '2024-03-10 10:00:00', startTime: '2024-03-10 10:00:00', endTime: '2024-03-10 12:00:00', subjective: 4, pending: 30, reviewed: 0, assignStatus: '已分配', assignMethod: 'paper-quota', status: '待阅', scorePublishStatus: '未发布', abnormal: 0, totalQuestions: 6, reviewedQuestions: 0, pendingQuestions: 6, totalStudents: 30, reviewedStudents: 0, pendingStudents: 30 },
  { id: 'exam-random-all-review', name: '随机抽题复评考试', paperType: 'random', time: '2024-03-12 15:30:00', startTime: '2024-03-12 15:30:00', endTime: '2024-03-12 17:30:00', subjective: 3, pending: 12, reviewed: 18, assignStatus: '未分配', assignMethod: 'paper-all', status: '待阅', scorePublishStatus: '未发布', abnormal: 0, totalQuestions: 5, reviewedQuestions: 0, pendingQuestions: 5, totalStudents: 30, reviewedStudents: 18, pendingStudents: 12 }
];

const REVIEW_ALL_PAPERS = [
  { id: 'all-1', examId: 'exam-2024-safety', activity: '阅启新篇·读享时光 —— 阅途成长共读计划', exam: '2024年度员工安全生产知识考试', paper: '安全生产知识主观题试卷', time: '2024-03-01 09:00:00', pending: 15, reviewed: 35, status: '阅卷中' },
  { id: 'all-2', examId: 'exam-2024-culture-q2', activity: '企业文化共学月', exam: '2024年第二季度企业文化考试', paper: '企业文化综合测评卷', time: '2024-03-05 14:00:00', pending: 0, reviewed: 50, status: '已完成' },
  { id: 'all-3', examId: 'exam-random-quota', activity: '新员工训练营', exam: '新员工入职培训考试', paper: '入职培训问答试卷', time: '2024-03-10 10:00:00', pending: 30, reviewed: 0, status: '待阅' },
  { id: 'all-4', examId: 'exam-random-all-review', activity: '消防安全专题学习', exam: '消防安全应急知识考试', paper: '消防应急简答题试卷', time: '2024-03-12 15:30:00', pending: 6, reviewed: 24, status: '阅卷中' }
];

const REVIEW_REVIEWERS = [
  { name: '张老师', assigned: 25, reviewed: 20, pending: 5, scopes: ['安全生产知识主观题试卷', '消防应急简答题试卷'], totalAssigned: 120, totalReviewed: 86, totalPending: 34 },
  { name: '李老师', assigned: 25, reviewed: 15, pending: 10, scopes: ['安全生产知识主观题试卷'], totalAssigned: 25, totalReviewed: 15, totalPending: 10 }
];

const REVIEW_PROGRESS_QUESTIONS = [
  { id: 'progress-q6', no: '第 6 题', type: '简答题', score: 10, teachers: ['张老师', '李老师', '王老师'], total: 328, reviewed: 0, pending: 328, status: '待阅', mode: '按比例分配', teacherRows: [
    { name: '张老师', assigned: 164, reviewed: 0, pending: 164 },
    { name: '李老师', assigned: 98, reviewed: 0, pending: 98 },
    { name: '王老师', assigned: 66, reviewed: 0, pending: 66 }
  ] },
  { id: 'progress-q7', no: '第 7 题', type: '简答题', score: 20, teachers: ['张老师', '李老师', '王老师'], total: 328, reviewed: 56, pending: 272, status: '阅卷中', mode: '按比例分配', teacherRows: [
    { name: '张老师', assigned: 164, reviewed: 28, pending: 136 },
    { name: '李老师', assigned: 98, reviewed: 18, pending: 80 },
    { name: '王老师', assigned: 66, reviewed: 10, pending: 56 }
  ] },
  { id: 'progress-q8', no: '第 8 题', type: '简答题', score: 30, teachers: ['张老师', '李老师', '王老师'], total: 328, reviewed: 0, pending: 328, status: '待阅', mode: '按比例分配', teacherRows: [
    { name: '张老师', assigned: 164, reviewed: 0, pending: 164 },
    { name: '李老师', assigned: 98, reviewed: 0, pending: 98 },
    { name: '王老师', assigned: 66, reviewed: 0, pending: 66 }
  ] },
  { id: 'progress-q9', no: '第 9 题', type: '简答题', score: 8, teachers: ['张老师'], total: 328, reviewed: 328, pending: 0, status: '已完成', mode: '平均分配', teacherRows: [
    { name: '张老师', assigned: 328, reviewed: 328, pending: 0 }
  ] },
  { id: 'progress-q10', no: '第 10 题', type: '简答题', score: 12, teachers: ['张老师', '李老师', '王老师'], total: 328, reviewed: 0, pending: 328, status: '待阅', mode: '按比例分配', teacherRows: [
    { name: '张老师', assigned: 164, reviewed: 0, pending: 164 },
    { name: '李老师', assigned: 98, reviewed: 0, pending: 98 },
    { name: '王老师', assigned: 66, reviewed: 0, pending: 66 }
  ] }
];

const REVIEW_MY_TASKS = [
  { id: 'task-1', examId: 'exam-2024-safety', teacherName: '张老师', paper: '安全生产知识主观题试卷', question: '第 1 题 · 简答题', assigned: 42, reviewed: 28, deadline: '2026-05-20 18:00', status: '阅卷中', questions: [
    { id: 'q1', no: '1', type: '简答题', title: '请简述安全生产的"三不伤害"原则是什么？', score: 10, assigned: 20, reviewed: 15 },
    { id: 'q2', no: '2', type: '简答题', title: '请描述发生火灾时的正确逃生步骤。', score: 15, assigned: 22, reviewed: 13 }
  ] },
  { id: 'task-2', examId: 'exam-2024-culture-q2', teacherName: '张老师', paper: '初赛第一期试卷', question: '第 7 题 · 简答题', assigned: 56, reviewed: 56, deadline: '2026-05-18 20:00', status: '已完成', questions: [
    { id: 'q2', no: '7', type: '简答题', title: '阅读材料后，分析公共图书馆在城市文化建设中的作用。', score: 20, assigned: 56, reviewed: 56 }
  ] },
  { id: 'task-3', examId: 'exam-new-employee', teacherName: '张老师', paper: '消防应急简答题试卷', question: '第 3 题 · 简答题', assigned: 30, reviewed: 0, deadline: '2026-05-22 12:00', status: '待阅卷', questions: [
    { id: 'q2', no: '3', type: '简答题', title: '请说明灭火器使用前需要检查的关键事项。', score: 12, assigned: 30, reviewed: 0 }
  ] }
];

const REVIEW_MY_PAPER_TASKS = [
  { id: 'paper-task-1', examId: 'exam-2024-safety', activity: '阅启新篇·读享时光 —— 阅途成长共读计划', exam: '2024年度员工安全生产知识考试', paper: '安全生产知识主观题试卷', paperType: '固定题目', examTime: '2024-03-01 09:00:00', scoreRule: '每人限答 1 次', assignedAttempts: 42, reviewedAttempts: 28, pendingAttempts: 14, subjectiveQuestions: 5, assignMode: '按题目分配', deadline: '2026-05-20 18:00', status: '阅卷中' },
  { id: 'paper-task-2', examId: 'exam-2024-culture-q2', activity: '企业文化共学月', exam: '2024年第二季度企业文化考试', paper: '企业文化综合测评卷', paperType: '固定题目', examTime: '2024-03-05 14:00:00', scoreRule: '每人限答 1 次', assignedAttempts: 56, reviewedAttempts: 56, pendingAttempts: 0, subjectiveQuestions: 3, assignMode: '按答卷分配', deadline: '2026-05-18 20:00', status: '已完成' },
  { id: 'paper-task-3', examId: 'exam-new-employee', activity: '新员工训练营', exam: '新员工入职培训考试', paper: '入职培训问答试卷', paperType: '随机抽题', examTime: '2024-03-10 10:00:00', scoreRule: '每人限答 1 次', assignedAttempts: 30, reviewedAttempts: 0, pendingAttempts: 30, subjectiveQuestions: 4, assignMode: '按答卷分配', deadline: '2026-05-22 12:00', status: '待阅卷' }
];

const REVIEW_ATTEMPT_INSTANCES = [
  { id: 'attempt-001', paperTaskId: 'paper-task-1', student: '张小刚', unit: '销售部', attemptNo: 1, submitTime: '2026-05-18 10:24', objectiveScore: 42, subjectiveStatus: '待批阅', pendingQuestions: 2, reviewedQuestions: 3, status: '待阅' },
  { id: 'attempt-002', paperTaskId: 'paper-task-1', student: '王小明', unit: '生产部', attemptNo: 1, submitTime: '2026-05-18 11:08', objectiveScore: 48, subjectiveStatus: '阅卷中', pendingQuestions: 1, reviewedQuestions: 4, status: '阅卷中' },
  { id: 'attempt-003', paperTaskId: 'paper-task-1', student: '李小红', unit: '技术部', attemptNo: 1, submitTime: '2026-05-18 12:16', objectiveScore: 45, subjectiveStatus: '已批阅', pendingQuestions: 0, reviewedQuestions: 5, status: '已完成' },
  { id: 'attempt-004', paperTaskId: 'paper-task-3', student: '陈一', unit: '培训一组', attemptNo: 1, submitTime: '2026-05-19 09:20', objectiveScore: 36, subjectiveStatus: '待批阅', pendingQuestions: 4, reviewedQuestions: 0, status: '待阅' },
  { id: 'attempt-005', paperTaskId: 'paper-task-3', student: '钱十', unit: '培训二组', attemptNo: 1, submitTime: '2026-05-19 10:02', objectiveScore: 40, subjectiveStatus: '待批阅', pendingQuestions: 4, reviewedQuestions: 0, status: '待阅' }
];

const REVIEW_ATTEMPT_QUESTION_TEMPLATES = [
  { id: 'paper-q1', no: 1, type: '简答题', source: '安全意识', score: 10, title: '请简述安全生产的“三不伤害”原则是什么？', standard: '不伤害自己、不伤害他人、不被他人伤害。', rule: '三项原则各 3 分，表述完整 1 分。', answers: {
    'attempt-001': '保护自己、保护他人、互相保护。',
    'attempt-002': '不伤害自己、不伤害他人、不被他人伤害。',
    'attempt-003': '不伤害自己、不伤害别人、不被别人伤害。',
    'attempt-004': '不伤害自己、不伤害他人，注意安全。',
    'attempt-005': '自己不受伤，也不要让别人受伤。'
  } },
  { id: 'paper-q2', no: 2, type: '简答题', source: '消防逃生', score: 15, title: '请描述发生火灾时的正确逃生步骤。', standard: '保持冷静，判断火势方向；湿毛巾捂住口鼻；低姿沿安全通道撤离；不乘坐电梯；到达安全地点后报警。', rule: '防烟、路线、电梯、报警等关键要点完整给满分。', answers: {
    'attempt-001': '用湿毛巾捂住口鼻，从安全出口跑出去。',
    'attempt-002': '保持冷静，用湿毛巾捂住口鼻，弯腰前进，走安全通道，不坐电梯，到安全地点报警。',
    'attempt-003': '先报警，再从楼梯有序撤离，不能坐电梯。',
    'attempt-004': '听从指挥，走楼梯撤离，不要坐电梯。',
    'attempt-005': '捂住口鼻，弯腰从最近出口离开。'
  } },
  { id: 'paper-q3', no: 3, type: '简答题', source: '隐患排查', score: 10, title: '发现生产现场存在安全隐患时，员工应如何处理？', standard: '立即停止相关危险操作，提醒周边人员，向负责人或安全管理人员报告，并配合整改闭环。', rule: '报告、控制风险、配合整改三类要点均需覆盖。', answers: {
    'attempt-001': '告诉主管，让专业人员处理。',
    'attempt-002': '先提醒附近同事远离，再上报班组长和安全员，记录并跟进整改。',
    'attempt-003': '马上上报，等待处理。',
    'attempt-004': '停止作业并报告安全员，现场设置提醒。',
    'attempt-005': '拍照发群里，让大家注意。'
  } },
  { id: 'paper-q4', no: 4, type: '简答题', source: '事故复盘', score: 20, title: '阅读事故案例后，简要分析该事故暴露出的管理问题，并提出两条改进建议。', standard: '可从培训不足、检查不到位、责任链条不清、应急预案执行弱等方面分析，并提出制度化检查、专项培训、责任追踪等建议。', rule: '问题分析 10 分，改进建议 8 分，表达结构 2 分。', answers: {
    'attempt-001': '主要是员工安全意识不够，建议加强培训和检查。',
    'attempt-002': '暴露出日常巡检没有闭环、岗位培训不足、现场责任人不明确。建议建立隐患台账并限期复查，同时按岗位开展案例化培训。',
    'attempt-003': '管理不到位，应加强管理，完善制度。',
    'attempt-004': '检查没有落实，员工不会处理。建议每日检查，定期演练。',
    'attempt-005': '领导要重视，员工要认真，发现问题及时处理。'
  } },
  { id: 'paper-q5', no: 5, type: '简答题', source: '岗位责任', score: 10, title: '请结合本岗位，简述如何落实安全生产责任。', standard: '围绕岗位操作规范、风险识别、设备点检、同伴提醒和异常上报展开即可。', rule: '结合岗位 4 分，责任动作 4 分，表达完整 2 分。', answers: {
    'attempt-001': '遵守制度，发现问题及时汇报。',
    'attempt-002': '每天开工前检查设备和防护用品，按流程操作，发现异常先停机再上报，并提醒同事遵守安全要求。',
    'attempt-003': '认真工作，按照安全要求完成任务。',
    'attempt-004': '培训中学习制度，工作时按规定穿戴防护用品。',
    'attempt-005': '听从安排，不违规操作。'
  } }
];

const ATTEMPT_PAPER_SECTION_ORDINALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

const REVIEW_TEACHERS = [
  { id: 'teacher-001', name: '张三', account: 'zhangsan', password: '******', addedAt: '2025-10-22 14:33:34' },
  { id: 'teacher-002', name: '李四', account: 'lisi', password: '******', addedAt: '2025-10-23 09:18:10' },
  { id: 'teacher-003', name: '王五', account: 'wangwu', password: '******', addedAt: '2025-10-24 10:05:46' }
];

const REVIEW_USER_DIRECTORY = [
  { id: 'user-zhang', account: 'zhanglaoshi', phone: '13800001024', name: '张老师', unit: '上海市图书馆', identity: '老师', accountStatus: '正常', isCurrentActivityReviewer: true, existingRoles: ['子管理员-阅卷老师'] },
  { id: 'user-li', account: 'lilaoshi', phone: '13900002368', name: '李老师', unit: '华东政法大学图书馆', identity: '老师', accountStatus: '正常', isCurrentActivityReviewer: true, existingRoles: ['子管理员-阅卷老师'] },
  { id: 'user-chen', account: 'chenlaoshi', phone: '13500006677', name: '陈老师', unit: '杭州图书馆', identity: '老师', accountStatus: '正常', isCurrentActivityReviewer: false, existingRoles: [] },
  { id: 'user-lin', account: 'lin_admin', phone: '13700008888', name: '林老师', unit: '浦东新区图书馆', identity: '活动管理员', accountStatus: '正常', isCurrentActivityReviewer: false, existingRoles: ['子管理员-活动管理员'] },
  { id: 'user-zhou', account: 'zhou.review', phone: '13600001111', name: '周老师', unit: '徐汇区图书馆', identity: '老师', accountStatus: '禁用', isCurrentActivityReviewer: false, existingRoles: [] },
  { id: 'user-wang-a', account: 'wang001', phone: '18800009999', name: '王评审', unit: '主办方评审组', identity: '专家', accountStatus: '正常', isCurrentActivityReviewer: false, existingRoles: ['子管理员-评审组'] },
  { id: 'user-wang-b', account: 'wang002', phone: '18800009999', name: '王老师', unit: '闵行区图书馆', identity: '老师', accountStatus: '正常', isCurrentActivityReviewer: false, existingRoles: [] }
];

const QUESTION_ASSIGN_PAPER = {
  activityName: '2026 年全民阅读知识竞赛',
  paperName: '初赛第一期试卷',
  reviewEntryUrl: 'https://www.yuetu.com/123456',
  examType: '分期多试卷考试',
  paperType: 'fixed',
  subjectiveQuestionCount: 10,
  submittedPaperCount: 1000,
  totalMarkingTaskCount: 1000,
  assignedTaskCount: 656,
  unassignedTaskCount: 656,
  assignStatus: '部分分配'
};

const QUESTION_ASSIGN_TEACHERS = [
  { id: 't001', name: '张老师', orgName: '杭州市图书馆', roleName: '阅卷老师', currentTaskCount: 120, finishedTaskCount: 80, paperReviewedCount: 86 },
  { id: 't002', name: '李老师', orgName: '西湖区图书馆', roleName: '阅卷老师', currentTaskCount: 98, finishedTaskCount: 60, paperReviewedCount: 42 },
  { id: 't003', name: '王老师', orgName: '主办方评审组', roleName: '阅卷老师', currentTaskCount: 230, finishedTaskCount: 180, paperReviewedCount: 128 },
  { id: 't004', name: '赵老师', orgName: '长宁区图书馆', roleName: '阅卷老师', currentTaskCount: 72, finishedTaskCount: 20, paperReviewedCount: 20 },
  { id: 't005', name: '周老师', orgName: '浦东新区图书馆', roleName: '阅卷老师', currentTaskCount: 65, finishedTaskCount: 32, paperReviewedCount: 32 }
];

const DEFAULT_PAPER_QUOTA_TEACHER_COUNT = 3;

function getActiveAssignTeachers() {
  return QUESTION_ASSIGN_TEACHERS.filter(t => t.name !== '赵老师');
}

function getDefaultPaperQuotaTeachers() {
  return getActiveAssignTeachers().slice(0, DEFAULT_PAPER_QUOTA_TEACHER_COUNT);
}

let questionAssignOnlyUnassigned = false;
let questionAssignExpanded = false;
let questionAssignSelectedId = 'q006';
let questionAssignSelectedIds = [];
let questionAssignScope = 'unassigned';
let reviewAssignPaperType = QUESTION_ASSIGN_PAPER.paperType || 'fixed';
let reviewAssignDimension = 'question';
let reviewAssignPaperMode = 'quota';
let reviewAssignSaved = false;
let paperQuotaConfigured = false;
let reviewTeacherLookupState = {
  keyword: '',
  matches: [],
  selectedUserId: '',
  error: '',
  sendNotice: true,
  enabledStatus: '启用',
  remark: ''
};
let QUESTION_ASSIGN_LIST = [
  { id: 'q006', questionNo: '第 6 题', questionType: '简答题', score: 10, titleSummary: '请简述阅读推广活动对青少年成长的意义。', titleContent: '请结合实际案例，简述阅读推广活动对青少年成长的意义。', referenceAnswer: '可从阅读兴趣培养、知识积累、表达能力提升等方面作答。', scoringRule: '观点明确 4 分，结合案例 4 分，表达清晰 2 分。', answerCount: 1000, teacherIds: ['t001'], assignMode: 'by-question', reviewersPerAnswer: 1, finishedCount: 0, totalCount: 1000, assignStatus: '已分配' },
  { id: 'q007', questionNo: '第 7 题', questionType: '简答题', score: 20, titleSummary: '阅读材料后，分析公共图书馆在城市文化建设中的作用。', titleContent: '阅读以下材料，结合材料内容分析公共图书馆在城市文化建设中的作用。', referenceAnswer: '可从公共文化服务、城市精神塑造、全民阅读推动等方面作答。', scoringRule: '材料理解 6 分，观点分析 8 分，逻辑表达 6 分。', answerCount: 1000, teacherIds: ['t002'], assignMode: 'by-question', reviewersPerAnswer: 1, finishedCount: 56, totalCount: 1000, assignStatus: '阅卷中' },
  { id: 'q008', questionNo: '第 8 题', questionType: '简答题', score: 30, titleSummary: '请围绕“我与阅读”写一段短文。', titleContent: '请围绕“我与阅读”写一段不少于 600 字的短文，题目自拟。', referenceAnswer: '', scoringRule: '主题立意 10 分，内容表达 10 分，结构语言 10 分。', answerCount: 1000, teacherIds: ['t003'], assignMode: 'by-question', reviewersPerAnswer: 1, finishedCount: 0, totalCount: 1000, assignStatus: '已分配' },
  { id: 'q009', questionNo: '第 9 题', questionType: '简答题', score: 8, titleSummary: '请说明图书馆读者服务流程中的关键节点。', titleContent: '请说明图书馆读者服务流程中的关键节点，并说明每个节点的服务目标。', referenceAnswer: '预约、到馆、咨询、借阅、反馈等。', scoringRule: '节点完整 5 分，说明准确 3 分。', answerCount: 1000, teacherIds: ['t001'], assignMode: 'average', reviewersPerAnswer: 1, finishedCount: 1000, totalCount: 1000, assignStatus: '已完成' },
  { id: 'q010', questionNo: '第 10 题', questionType: '简答题', score: 12, titleSummary: '结合本次活动主题，提出一项可落地的阅读推广方案。', titleContent: '结合本次活动主题，面向社区读者提出一项可落地的阅读推广方案。', referenceAnswer: '方案应包含目标人群、活动形式、执行步骤和效果评估。', scoringRule: '目标清晰 3 分，方案完整 5 分，执行可行 4 分。', answerCount: 1000, teacherIds: ['t002'], assignMode: 'by-question', reviewersPerAnswer: 1, finishedCount: 0, totalCount: 1000, assignStatus: '已分配' },
  { id: 'q011', questionNo: '第 11 题', questionType: '简答题', score: 10, titleSummary: '请说明如何提升社区读者持续参与阅读活动的积极性。', titleContent: '请结合社区服务场景，说明如何提升读者持续参与阅读活动的积极性。', referenceAnswer: '可从主题设计、激励机制、社群运营、反馈闭环等方面作答。', scoringRule: '策略完整 4 分，场景结合 4 分，表达清晰 2 分。', answerCount: 1000, teacherIds: ['t003'], assignMode: 'by-question', reviewersPerAnswer: 1, finishedCount: 12, totalCount: 1000, assignStatus: '阅卷中' },
  { id: 'q012', questionNo: '第 12 题', questionType: '简答题', score: 18, titleSummary: '阅读活动数据材料，分析不同年龄段读者的参与差异。', titleContent: '阅读给定活动数据材料，分析不同年龄段读者的参与差异，并提出优化建议。', referenceAnswer: '可从参与频次、内容偏好、渠道触达和时间安排等方面作答。', scoringRule: '数据理解 6 分，差异分析 6 分，建议可行 6 分。', answerCount: 1000, teacherIds: ['t004'], assignMode: 'by-question', reviewersPerAnswer: 1, finishedCount: 0, totalCount: 1000, assignStatus: '已分配' },
  { id: 'q013', questionNo: '第 13 题', questionType: '简答题', score: 15, titleSummary: '请谈谈数字阅读服务对公共文化服务均等化的意义。', titleContent: '请结合公共文化服务实践，谈谈数字阅读服务对服务均等化的意义。', referenceAnswer: '可从资源可达性、服务覆盖、特殊群体支持和线上线下融合等方面作答。', scoringRule: '观点明确 5 分，论证充分 6 分，结构表达 4 分。', answerCount: 1000, teacherIds: ['t001'], assignMode: 'by-question', reviewersPerAnswer: 1, finishedCount: 0, totalCount: 1000, assignStatus: '已分配' },
  { id: 'q014', questionNo: '第 14 题', questionType: '简答题', score: 8, titleSummary: '请说明阅读推广项目复盘报告中的关键指标。', titleContent: '请说明阅读推广项目复盘报告中的关键指标，并说明其中两个指标的用途。', referenceAnswer: '参与人数、完赛率、留存率、满意度、传播量等。', scoringRule: '指标完整 5 分，用途说明 3 分。', answerCount: 1000, teacherIds: [], assignMode: 'by-question', reviewersPerAnswer: 1, finishedCount: 0, totalCount: 1000, assignStatus: '未分配' },
  { id: 'q015', questionNo: '第 15 题', questionType: '简答题', score: 25, titleSummary: '请以“阅读让城市更有温度”为主题写一段活动倡议。', titleContent: '请以“阅读让城市更有温度”为主题，面向市民写一段不少于 400 字的活动倡议。', referenceAnswer: '', scoringRule: '主题契合 8 分，内容感染力 9 分，语言结构 8 分。', answerCount: 1000, teacherIds: [], assignMode: 'by-question', reviewersPerAnswer: 1, finishedCount: 0, totalCount: 1000, assignStatus: '未分配' }
];

const REVIEW_STUDENTS = [
  { id: 'stu-wxm', name: '王小明', unit: '生产部', pending: 2, reviewed: 3 },
  { id: 'stu-lxh', name: '李小红', unit: '技术部', pending: 0, reviewed: 5 },
  { id: 'stu-zxg', name: '张小刚', unit: '销售部', pending: 5, reviewed: 0 }
];

const REVIEW_QUESTIONS = [
  {
    id: 'q1',
    no: '1',
    type: '简答题',
    title: '请简述安全生产的"三不伤害"原则是什么？',
    score: 10,
    pending: 5,
    reviewed: 15,
    standard: '不伤害自己、不伤害他人、不被他人伤害',
    analysis: '三不伤害原则是安全生产的基本原则，要求每个员工都要做到这三点。',
    answers: [
      { id: 'ans-zxg', student: '张小刚', unit: '销售部', submitUnit: '华东一区选送单位', groupName: '企业组', answer: '保护自己、保护他人、互相保护', status: '待批阅' },
      { id: 'ans-wxm', student: '王小明', unit: '生产部', submitUnit: '安全生产示范单位', groupName: '职工组', answer: '不伤害自己、不伤害他人、不被他人伤害', status: '已批阅', score: 10, comment: '答案正确，表述清晰', reviewTime: '2024-03-01 14:00:00' },
      { id: 'ans-lxh', student: '李小红', unit: '技术部', submitUnit: '研发中心选送单位', groupName: '技术组', answer: '不伤害自己、不伤害别人、不被别人伤害', status: '已批阅', score: 9, comment: '答案基本正确，表述略有差异', reviewTime: '2024-03-01 14:05:00' }
    ]
  },
  {
    id: 'q2',
    no: '2',
    type: '简答题',
    title: '请描述发生火灾时的正确逃生步骤。',
    score: 15,
    pending: 10,
    reviewed: 10,
    standard: '1. 保持冷静，判断火势方向；2. 用湿毛巾捂住口鼻；3. 弯腰低姿前进；4. 沿安全通道撤离；5. 不乘坐电梯；6. 到达安全地点后报警。',
    analysis: '从判断火情、防烟、撤离路线和报警四个方面评价答案完整性。',
    answers: [
      { id: 'ans-fire-wxm', student: '王小明', unit: '生产部', submitUnit: '安全生产示范单位', groupName: '职工组', answer: '保持冷静，用湿毛巾捂住口鼻，弯腰前进，走安全通道，不坐电梯。', status: '待批阅' },
      { id: 'ans-fire-lxh', student: '李小红', unit: '技术部', submitUnit: '研发中心选送单位', groupName: '技术组', answer: '先报警，再从楼梯有序撤离，不能坐电梯。', status: '待批阅' },
      { id: 'ans-fire-zxg', student: '张小刚', unit: '销售部', submitUnit: '华东一区选送单位', groupName: '企业组', answer: '用湿毛巾捂住口鼻，从安全出口跑出去。', status: '已批阅', score: 8, comment: '覆盖部分要点，缺少冷静判断和报警说明', reviewTime: '2024-03-01 15:10:00' }
    ]
  }
];

const REVIEW_MARKING = {
  examId: 'exam-2024-safety',
  examName: '2024年度员工安全生产知识考试',
  studentId: 'stu-wxm',
  studentName: '王小明',
  questionId: 'q1',
  no: '第1题',
  type: '简答题',
  score: 10,
  content: '请简述安全生产的"三不伤害"原则是什么？',
  answer: '不伤害自己、不伤害他人、不被他人伤害',
  standard: '不伤害自己、不伤害他人、不被他人伤害'
};

let reviewScore = '';
let reviewComment = '';
let questionReviewAnswerId = 'ans-wxm';
let questionReviewScore = '';
let questionReviewComment = '';
let questionReviewFilter = 'all';
let questionReviewSearch = '';
let questionReviewSearchTimer = null;
let questionReviewSort = 'status';
let reviewListScope = 'activity';
let reviewConfigStatusFilter = 'all';
let reviewDetailView = 'paper';
let reviewProgressDetailExamId = null;
let reviewProgressDetailView = 'question';
let reviewAssignDetailExamId = null;
let activePaperReviewTaskId = '';
let activeAttemptReviewId = 'attempt-001';
let activeAttemptQuestionIndex = 0;
let attemptReviewMode = 'paper';
let attemptReviewAutoSaveTimer = null;
let studentReviewActiveAttemptId = 'attempt-002';
let reviewTeacherFormState = {
  id: '',
  name: '',
  account: '',
  password: '',
  addedAt: '',
  showPassword: false
};

registerPage('paper-review-all', () => renderAllReviewPaperListPage());
registerPage('paper-review', () => renderActivityReviewPaperListPage());
registerPage('paper-review-student-list', () => renderReviewStudentListPage());
registerPage('paper-review-question-list', () => renderReviewQuestionListPage());
registerPage('paper-review-attempt-list', () => renderReviewAttemptListPage());
registerPage('paper-review-marking', () => renderReviewMarkingPage());
registerPage('paper-review-marking_init', () => initAttemptReviewHotkeys());
registerPage('paper-review-question-marking', () => renderQuestionReviewMarkingPage());
registerPage('paper-review-question-marking_init', () => initQuestionReviewHotkeys());
registerPage('paper-review-detail', () => renderReviewDetailPage());
registerPage('paper-review-teachers', () => renderReviewTeacherManagePage());
registerPage('paper-review-teachers-all', () => renderReviewTeacherManagePage({ scope: 'all' }));
registerPage('paper-review-assign-question', () => renderQuestionAssignPage());
registerPage('paper-review-my-tasks', () => renderMyReviewTasksPage());
registerPage('paper-review-quick-my-tasks', () => renderMyReviewTasksPage({ scope: 'quick' }));
registerPage('paper-review-quick-question-list', () => renderReviewQuestionListPage());
registerPage('paper-review-quick-attempt-list', () => renderReviewAttemptListPage());
registerPage('paper-review-quick-student-list', () => renderReviewStudentListPage());
registerPage('paper-review-quick-question-marking', () => renderQuestionReviewMarkingPage());
registerPage('paper-review-quick-question-marking_init', () => initQuestionReviewHotkeys());
registerPage('paper-review-quick-marking', () => renderReviewMarkingPage());
registerPage('paper-review-quick-marking_init', () => initAttemptReviewHotkeys());

function paperReviewStatusBadge(status) {
  const map = {
    '阅卷中': 'badge-yellow',
    '已完成': 'badge-green',
    '待阅': 'badge-gray',
    '异常': 'badge-red'
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function paperReviewCompletionBadge(status) {
  return paperReviewStatusBadge(status === '已完成' ? '已完成' : '未完成');
}

function reviewAssignMethodText(method) {
  const map = {
    question: '按题目分配',
    'paper-quota': '按答卷分配-按数量分配答卷',
    'paper-all': '按答卷分配-每位老师评阅全部答卷'
  };
  return map[method] || '-';
}

function reviewProgress(pending, reviewed, color = 'var(--primary)') {
  const total = pending + reviewed;
  const pct = total ? Math.round((reviewed / total) * 100) : 0;
  return `
    <div class="review-progress">
      <div class="review-progress-track"><div style="width:${pct}%;background:${color}"></div></div>
      <strong>${pct}%</strong>
    </div>`;
}

function reviewEscapeAttr(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatExamTimeRange(exam) {
  if (exam.startTime && exam.endTime) return `${formatDateTimeSecond(exam.startTime)} 至 ${formatDateTimeSecond(exam.endTime)}`;
  return formatDateTimeSecond(exam.time || '-');
}

function getPaperAssignStatus(exam) {
  return exam?.assignStatus === '未分配' ? '未开启' : '已开启';
}

function canToggleReviewOpen(exam) {
  if (!exam) return { ok: false, message: '未找到试卷信息' };
  if (!exam.subjective) return { ok: false, message: '该试卷暂无主观题，无需开启人工阅卷。' };
  if ((exam.pending + exam.reviewed) <= 0) return { ok: false, message: '该试卷暂无提交答卷，暂不能开启阅卷。' };
  if (exam.assignStatus === '未分配') return { ok: false, message: '请先完成阅卷老师与分配规则配置，再开启阅卷。' };
  return { ok: true, message: '' };
}

function renderReviewOpenSwitch(exam) {
  const opened = isReviewOpened(exam);
  return `
    <div class="review-open-switch-cell">
      <label class="switch review-open-switch" title="${opened ? '点击可暂停阅卷入口' : '点击可开启阅卷入口'}">
        <input type="checkbox" ${opened ? 'checked' : ''} onchange="toggleReviewOpenStatus('${exam.id}', this.checked)">
        <span class="sw-slider"></span>
      </label>
      <span class="${opened ? 'is-open' : 'is-closed'}">${opened ? '已开启' : '未开启'}</span>
    </div>`;
}

function getReviewEntryUrl(examOrId) {
  const exam = typeof examOrId === 'string'
    ? REVIEW_EXAMS.find(item => item.id === examOrId)
    : examOrId;
  const id = exam?.id || '123456';
  return exam?.reviewEntryUrl || `https://www.yuetu.com/review/${id}`;
}

function renderReviewEntryCell(exam) {
  const url = getReviewEntryUrl(exam);
  return `
    <div class="review-entry-cell">
      <a href="javascript:void(0)" title="${reviewEscapeAttr(url)}" onclick="openReviewEntryPage('${exam.id}')">${url}</a>
      <div class="review-entry-row-actions">
        <button class="review-entry-icon" data-tooltip="访问阅卷页面" aria-label="访问阅卷页面" onclick="openReviewEntryPage('${exam.id}')">↗</button>
        <button class="review-entry-icon" data-tooltip="复制链接" aria-label="复制链接" onclick="copyReviewEntryLink('${exam.id}')">⧉</button>
      </div>
    </div>`;
}

function paperTypeText(type) {
  return type === 'random' ? '随机抽题' : '固定题目';
}

function getProgressTaskTotal(exam) {
  const paperCount = exam.pending + exam.reviewed;
  if (exam.assignMethod === 'question') return paperCount * exam.subjective;
  if (exam.assignMethod === 'paper-all') return paperCount * getDefaultPaperQuotaTeachers().length;
  return paperCount;
}

function getProgressReviewedTotal(exam) {
  if (exam.assignMethod === 'question') {
    return Math.round(getProgressTaskTotal(exam) * (exam.reviewed / Math.max(1, exam.pending + exam.reviewed)));
  }
  if (exam.assignMethod === 'paper-all') {
    return exam.reviewed * getDefaultPaperQuotaTeachers().length;
  }
  return exam.reviewed;
}

function progressTaskUnitText(exam) {
  if (exam.assignMethod === 'question') return '题目答案';
  if (exam.assignMethod === 'paper-all') return '老师-答卷任务';
  return '整份答卷';
}

function renderAllReviewPaperListPage() {
  reviewListScope = 'all';
  return `
  <div class="review-shell">
    ${shouldHideSecondaryMenuReturnBar('paper-review-all') ? '' : `
    <div class="review-crumb-card platform-review-back">
      ${renderSourceBack('paper-review-all')}
      <span class="review-divider"></span>
      <strong>阅卷管理</strong>
    </div>`}
    ${renderReviewFilterCard({ scope: 'all' })}
    <div class="card review-table-card">
      <div class="review-list-title">全部答题活动试卷</div>
      <table class="review-table review-all-table">
        <thead>
          <tr>
            <th>活动名称</th>
            <th>考试名称</th>
            <th>试卷名称</th>
            <th>考试时间</th>
            <th>待阅数量</th>
            <th>已阅数量</th>
            <th>阅卷进度</th>
            <th>阅卷入口</th>
            <th>阅卷状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${REVIEW_ALL_PAPERS.map((item, index) => `
            <tr>
              <td><strong title="${reviewEscapeAttr(item.activity)}">${item.activity}</strong></td>
              <td>${item.exam}</td>
              <td>${item.paper}</td>
              <td>${formatDateTimeSecond(item.time)}</td>
              <td>${item.pending}</td>
              <td>${item.reviewed}</td>
              <td>${reviewProgress(item.pending, item.reviewed, item.status === '已完成' ? 'var(--success)' : 'var(--primary)')}</td>
              <td>${renderReviewEntryCell(REVIEW_EXAMS.find(exam => exam.id === item.examId) || { id: item.examId })}</td>
              <td>${paperReviewStatusBadge(item.status)}</td>
              <td>
                <span class="action-link" onclick="openQuestionAssign('${item.examId}')">分配阅卷人</span>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
      ${renderStandardPagination(REVIEW_ALL_PAPERS.length)}
    </div>
  </div>`;
}

function renderActivityReviewPaperListPage() {
  reviewListScope = 'activity';
  const filteredExams = getReviewConfigFilteredExams();
  return `
  <div class="review-config-page">
    <div class="card review-table-card review-config-table-card">
      <div class="review-config-table-head">
        <div class="review-list-title">试卷列表</div>
      </div>
      <table class="review-table review-config-table">
        <thead>
          <tr>
            <th>考试名称</th>
            <th>组卷方式</th>
            <th>考试时间</th>
            <th>主观题数量</th>
            <th>阅卷入口</th>
            <th>完成进度</th>
            <th>阅卷状态</th>
            <th>成绩发布状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${filteredExams.map(exam => `
            <tr>
              <td><strong title="${exam.name}">${exam.name}</strong></td>
              <td>${paperTypeText(exam.paperType)}</td>
              <td class="review-exam-time-cell">${formatExamTimeRange(exam)}</td>
              <td>${exam.subjective}</td>
              <td>${renderReviewEntryCell(exam)}</td>
              <td>${getProgressReviewedTotal(exam)}/${getProgressTaskTotal(exam)}</td>
              <td>${paperReviewCompletionBadge(exam.status)}</td>
              <td>${scorePublishStatusBadge(exam)}</td>
              <td>
                <div class="review-operation-actions">
                ${renderReviewPublishScoreButton(exam)}
                <span class="action-link" onclick="openQuestionAssignWithTeacherReminder('${exam.id}')">分配任务</span>
                <span class="action-link" onclick="openReviewProgressDetail('${exam.id}')">进度详情</span>
                </div>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
      ${renderStandardPagination(filteredExams.length)}
    </div>
  </div>`;
}

function isReviewOpened(exam) {
  return getPaperAssignStatus(exam) !== '未开启';
}

function toggleReviewOpenStatus(examId, shouldOpen) {
  const exam = REVIEW_EXAMS.find(item => item.id === examId);
  if (!exam) return;
  if (shouldOpen) {
    const validation = canToggleReviewOpen(exam);
    if (!validation.ok) {
      openModal('暂不能开启阅卷', `
        <p>${validation.message}</p>
        <div class="review-modal-note">开启阅卷后，阅卷老师将能从阅卷入口领取并处理该试卷的批阅任务。</div>
      `, () => openQuestionAssign(exam.id), { confirmText: '去配置分配', cancelText: '稍后处理' });
      navigateTo('paper-review', { source: currentPageSource });
      return;
    }
    exam.assignStatus = exam.assignStatus === '未分配' ? '已分配' : exam.assignStatus;
    exam.status = exam.status === '待阅' ? '阅卷中' : exam.status;
    navigateTo('paper-review', { source: currentPageSource });
    return;
  }
  openModal('确认关闭阅卷？', `
    <p>关闭后，阅卷老师将暂时不能继续处理 <strong>${exam.name}</strong> 的阅卷任务。</p>
    <div class="review-modal-note">已保存的评分记录会保留；如果有老师正在批阅，建议先通知后再关闭。</div>
  `, () => {
    exam.assignStatus = '未分配';
    exam.status = '待阅';
    navigateTo('paper-review', { source: currentPageSource });
  }, { confirmText: '确认关闭', cancelText: '保持开启', danger: true });
  navigateTo('paper-review', { source: currentPageSource });
}

function getReviewConfigFilteredExams() {
  if (reviewConfigStatusFilter === 'not-opened') {
    return REVIEW_EXAMS.filter(exam => !isReviewOpened(exam));
  }
  if (reviewConfigStatusFilter === 'opened') {
    return REVIEW_EXAMS.filter(exam => isReviewOpened(exam));
  }
  return REVIEW_EXAMS;
}

function renderReviewConfigStatusTabs() {
  return '';
}

function setReviewConfigStatusFilter(filter) {
  reviewConfigStatusFilter = filter;
  navigateTo('paper-review', { source: currentPageSource });
}

function renderReviewPublishScoreButton(exam) {
  const enabled = exam?.status === '已完成' && getScorePublishStatus(exam) !== '已发布';
  return `<button class="btn btn-sm review-publish-score-btn ${enabled ? 'btn-primary' : 'is-disabled'}" ${enabled ? `onclick="openReviewPublishScoreConfirm('${exam.id}')"` : 'disabled'}>发布成绩</button>`;
}

function getScorePublishStatus(exam) {
  return exam?.scorePublishStatus === '已发布' ? '已发布' : '未发布';
}

function scorePublishStatusBadge(exam) {
  const status = getScorePublishStatus(exam);
  return `<span class="badge ${status === '已发布' ? 'badge-green' : 'badge-gray'}">${status}</span>`;
}

function openReviewPublishScoreConfirm(examId) {
  const exam = REVIEW_EXAMS.find(item => item.id === examId);
  if (!exam || exam.status !== '已完成') return;
  openModal('确认发布成绩？', `
    <p>发布后，用户端将立即可见本次成绩。请确认主观题评分无误后再继续。

</p>
  `, () => {
    exam.scorePublishStatus = '已发布';
    navigateTo(currentPage || 'paper-review');
  }, { confirmText: '确认发布', cancelText: '暂不发布', danger: true });
}

function renderReviewEntryBar() {
  const url = QUESTION_ASSIGN_PAPER.reviewEntryUrl || 'https://www.yuetu.com/123456';
  return `
    <section class="review-entry-bar">
      <span>阅卷入口：</span>
      <a href="javascript:void(0)" onclick="openReviewEntryPage()">${url}</a>
      <button class="review-entry-icon" data-tooltip="访问阅卷页面" aria-label="访问阅卷页面" onclick="openReviewEntryPage()">↗</button>
      <button class="review-entry-icon" data-tooltip="复制链接" aria-label="复制链接" onclick="copyReviewEntryLink()">⧉</button>
    </section>`;
}

function renderReviewFilterCard({ scope }) {
  return `
  <div class="review-filter-card ${scope === 'all' ? 'all-scope' : ''}">
    ${scope === 'all' ? `
      <label>活动名称</label>
      <input class="form-control" placeholder="请输入活动名称">
    ` : ''}
    <label>考试名称</label>
    <input class="form-control" placeholder="请输入考试名称">
    <label>考试时间</label>
    <input class="form-control" type="date" aria-label="开始日期">
    <span class="review-filter-to">至</span>
    <input class="form-control" type="date" aria-label="结束日期">
    <label>阅卷状态</label>
    <select class="form-control"><option>全部</option><option>待阅</option><option>阅卷中</option><option>已完成</option></select>
    <label>分配状态</label>
    <select class="form-control"><option>全部</option><option>未分配</option><option>部分分配</option><option>已分配</option></select>
    <button class="btn btn-primary" onclick="filterReviewTasks()">查询</button>
    <button class="btn btn-outline" onclick="resetReviewFilters()">重置</button>
  </div>`;
}

function openReviewEntryPage(examId = '') {
  navigateTo('paper-review-my-tasks', { source: { pageId: currentPage, params: currentPageParams || {}, tabKey: activeTabKey } });
}

function copyReviewEntryLink(examId = '') {
  const url = getReviewEntryUrl(examId || QUESTION_ASSIGN_PAPER);
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      openModal('复制成功', `<p>阅卷入口链接已复制：${url}</p>`, null, { hideCancel: true, confirmText: '知道了' });
    });
    return;
  }
  openModal('复制链接', `<p>请手动复制阅卷入口链接：</p><p><strong>${url}</strong></p>`, null, { hideCancel: true, confirmText: '知道了' });
}

function renderReviewStructureNav(active) {
  return '';
}

function renderReviewOverviewCard(label, value, unit = '', tone = '') {
  return `
  <div class="review-overview-card ${tone}">
    <span>${label}</span>
    <strong>${value}</strong>
    ${unit ? `<em>${unit}</em>` : ''}
  </div>`;
}

function renderReviewPageTitle(title, desc, actions = '') {
  return `
  <section class="card review-page-title">
    <div>
      <h2>${title}</h2>
      <p>${desc}</p>
    </div>
    ${actions ? `<div class="review-page-actions">${actions}</div>` : ''}
  </section>`;
}

function renderReviewHeaderCard({ title, subtitle = '', backText = '', backAction = '' }) {
  return `
    <section class="review-header-card">
      ${backText ? `<button class="review-header-back" onclick="${backAction}">‹ ${backText}</button><span class="review-header-divider"></span>` : ''}
      <div>
        <h2>${title}</h2>
        ${subtitle ? `<p>${subtitle}</p>` : ''}
      </div>
    </section>`;
}

function renderReviewAssignSteps(activeStep) {
  const steps = [
    { no: 1, title: '阅卷老师配置', desc: '维护本次阅卷可选老师', page: 'paper-review-teachers' },
    { no: 2, title: '分配阅卷老师', desc: '按主观题答案分配', page: 'paper-review-assign-question' }
  ];
  return `
  <section class="review-assign-steps card">
    <div>
      <span>分配阅卷人配置流程</span>
      <strong>先维护阅卷老师，再进行主观题阅卷分配</strong>
    </div>
    <div class="review-step-track">
      ${steps.map(step => `
        <button class="${activeStep === step.no ? 'active' : ''} ${activeStep > step.no ? 'done' : ''}" onclick="navigateTo('${step.page}')">
          <em>${step.no}</em>
          <span><strong>${step.title}</strong><small>${step.desc}</small></span>
        </button>
      `).join('')}
    </div>
  </section>`;
}

function renderReviewStudentListPage() {
  const exam = REVIEW_EXAMS.find(e => e.id === REVIEW_MARKING.examId);
  const students = getVisibleReviewStudents();
  return `
  <div class="review-crumb-card">${renderSourceBack(currentPage)}<span class="review-divider"></span><strong>${exam?.name || '阅卷任务'}</strong></div>
  <div class="card review-table-card">
    <table class="review-table">
      <thead>
        <tr><th>考生姓名</th><th>所属单位</th><th>待阅题数</th><th>已阅题数</th><th>批阅进度</th><th>操作</th></tr>
      </thead>
      <tbody>
        ${students.map(stu => `
          <tr>
            <td><strong>${stu.name}</strong></td>
            <td>${stu.unit}</td>
            <td>${stu.pending}</td>
            <td>${stu.reviewed}</td>
            <td>${reviewProgress(stu.pending, stu.reviewed)}</td>
            <td><span class="action-link" onclick="startStudentReview('${stu.id}')">开始批阅</span></td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function getVisibleReviewStudents() {
  const attempts = getActiveAttemptList();
  if (!attempts.length) return REVIEW_STUDENTS;
  return attempts.map(attempt => ({
    id: `stu-${attempt.id}`,
    name: attempt.student,
    unit: attempt.unit,
    pending: attempt.pendingQuestions,
    reviewed: attempt.reviewedQuestions,
    attemptId: attempt.id
  }));
}

function renderReviewQuestionListPage() {
  const exam = REVIEW_EXAMS.find(e => e.id === REVIEW_MARKING.examId);
  return `
  <div class="review-crumb-card">${renderSourceBack(currentPage)}<span class="review-divider"></span><strong>${exam.name}</strong></div>
  <div class="card review-table-card">
    <table class="review-table">
      <thead>
        <tr><th>题号</th><th>题目类型</th><th>题目内容</th><th>满分</th><th>待阅数量</th><th>已阅数量</th><th>批阅进度</th><th>操作</th></tr>
      </thead>
      <tbody>
        ${REVIEW_QUESTIONS.map(q => `
          <tr>
            <td><strong>${q.no}</strong></td>
            <td>${q.type}</td>
            <td><span class="review-question-title" title="${reviewEscapeAttr(q.title)}">${q.title}</span></td>
            <td>${q.score}</td>
            <td>${q.pending}</td>
            <td>${q.reviewed}</td>
            <td>${reviewProgress(q.pending, q.reviewed)}</td>
            <td><span class="action-link" onclick="startQuestionReview('${q.id}')">开始批阅</span></td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function renderQuestionReviewMarkingPage() {
  const q = getActiveReviewQuestion();
  const selected = q.answers.find(a => a.id === questionReviewAnswerId) || q.answers.find(a => a.status === '待批阅') || q.answers[0];
  questionReviewAnswerId = selected.id;
  const pending = q.answers.filter(a => a.status === '待批阅').length;
  const reviewed = q.answers.length - pending;
  const disputed = q.answers.filter(a => a.status === '有争议').length;
  const visibleAnswers = getFilteredQuestionAnswers(q);
  const selectedIndex = q.answers.findIndex(a => a.id === selected.id);
  const selectedScore = questionReviewScore || (selected.score !== undefined ? String(selected.score) : '');
  const selectedComment = questionReviewComment || '';
  return `
  <div class="review-crumb-card compact question-review-topbar">
    <div>
      ${renderSourceBack(currentPage)}
      <span class="review-divider"></span>
      <strong>第${q.no}题｜${q.type}｜满分 ${q.score} 分｜待批 ${pending}｜已批 ${reviewed}</strong>
    </div>
    <div class="question-review-top-actions">
      <button class="btn btn-ghost btn-sm" onclick="switchReviewQuestion(-1)">上一题</button>
      <button class="btn btn-ghost btn-sm" onclick="switchReviewQuestion(1)">下一题</button>
    </div>
  </div>
  <div class="question-review-workspace">
    <section class="card question-info-panel">
      <div class="question-panel-title">题目信息</div>
      <div class="question-info-body">
        <div class="question-info-meta">
          <span>题型：<strong>${q.type}</strong></span>
          <span>满分：<strong>${q.score}分</strong></span>
        </div>
        <h4>题目内容:</h4>
        <p>${q.title}</p>
        <h4>标准答案:</h4>
        <p>${q.standard}</p>
        <h4>答案解析:</h4>
        <p>${q.analysis}</p>
      </div>
    </section>

    <section class="card question-answer-panel">
      <div class="question-answer-head">
        <strong>考生答案列表</strong>
        <span>待批: ${pending} / 已批: ${reviewed}</span>
      </div>
      <div class="question-answer-tools">
        <div class="question-answer-tabs">
          ${renderQuestionAnswerFilterTab('all', `全部 ${q.answers.length}`)}
          ${renderQuestionAnswerFilterTab('pending', `待批 ${pending}`)}
          ${renderQuestionAnswerFilterTab('reviewed', `已批 ${reviewed}`)}
          ${renderQuestionAnswerFilterTab('disputed', `有争议 ${disputed}`)}
        </div>
        <div class="question-answer-search-row">
          <input class="form-control" value="${reviewEscapeAttr(questionReviewSearch)}" placeholder="搜索考生姓名/单位" oninput="queueQuestionReviewSearch(this.value)">
          <select class="form-control" onchange="setQuestionReviewSort(this.value)">
            <option value="status" ${questionReviewSort === 'status' ? 'selected' : ''}>排序：批阅状态</option>
            <option value="student" ${questionReviewSort === 'student' ? 'selected' : ''}>排序：考生姓名</option>
            <option value="score" ${questionReviewSort === 'score' ? 'selected' : ''}>排序：得分</option>
          </select>
        </div>
      </div>
      <div class="question-answer-list">
        ${visibleAnswers.length ? visibleAnswers.map(ans => renderQuestionAnswerCard(ans, selected.id, q)).join('') : '<div class="question-answer-empty">没有符合条件的答案。</div>'}
      </div>
    </section>

    <aside class="card question-score-panel">
      <div class="question-panel-title question-score-title">
        <strong>评分区｜${selected.student}</strong>
        <span title="快捷键：F 满分；H 半分；Z 零分；Ctrl + Enter 保存并下一份">?</span>
      </div>
      <div class="question-score-body">
        <div class="score-meta">
          <label>考生答案:</label>
          <div class="score-answer-box">
            <p>${selected.answer || '未作答'}</p>
            <button class="action-link" onclick="copyQuestionAnswer()">复制答案</button>
          </div>
        </div>
        <div class="question-score-divider"></div>
        <div class="question-score-row">
          <label>得分</label>
          <div class="question-score-control">
            <div class="review-stepper compact">
              <button onclick="adjustQuestionReviewScore(-1)">−</button>
              <input id="questionReviewScoreInput" type="number" min="0" max="${q.score}" step="0.5" value="${selectedScore}" placeholder="0-${q.score}" oninput="questionReviewScore=this.value">
              <button onclick="adjustQuestionReviewScore(1)">＋</button>
            </div>
            <span>/ ${q.score} 分</span>
          </div>
        </div>
        <div class="question-score-row">
          <label>快捷给分</label>
          <div class="question-score-presets">
            <button onclick="applyQuestionQuickScore(${q.score})">满分 F</button>
            <button onclick="applyQuestionQuickScore(${Math.round(q.score / 2)})">半分 H</button>
            <button onclick="applyQuestionQuickScore(0)">零分 Z</button>
          </div>
        </div>
        <div class="question-score-row vertical">
          <label>评语</label>
          <textarea id="questionReviewCommentInput" class="form-control" placeholder="请输入评语，方便考生或管理员查看评分依据" oninput="questionReviewComment=this.value">${selectedComment}</textarea>
        </div>
        <div class="question-score-row vertical">
          <label>评语库</label>
          <select class="form-control" onchange="useQuestionReviewComment(this.value)">
            <option value="">选择常用评语，自动填入评语框</option>
            <option>答案正确，表述清晰</option>
            <option>答案基本正确，表述略有差异</option>
            <option>答案部分正确，但关键点不完整</option>
            <option>要点不完整，建议补充关键步骤</option>
            <option>未覆盖核心知识点</option>
            <option>未作答</option>
          </select>
        </div>
        <label class="question-dispute-check"><input type="checkbox" ${selected.status === '有争议' ? 'checked' : ''} onchange="toggleQuestionAnswerDispute(this.checked)"> 标记为有争议，稍后复核</label>
        <div class="question-submit-row">
          <button class="btn btn-outline" onclick="submitQuestionReviewScore(false)">保存评分</button>
          <button class="btn btn-primary" onclick="submitQuestionReviewScore(true)">保存并下一份</button>
        </div>
      </div>
    </aside>
  </div>`;
}

function renderQuestionAnswerCard(ans, selectedId, q) {
  const reviewed = ans.status === '已批阅';
  return `
  <div class="question-answer-card ${ans.id === selectedId ? 'selected' : ''} ${reviewed ? 'is-reviewed' : ''}" onclick="selectQuestionAnswer('${ans.id}')">
    <div class="question-answer-top">
      <div><strong>${ans.student}</strong><span>${ans.submitUnit || ans.unit}</span><span>${ans.groupName || '-'}</span>${renderAnswerStatusBadge(ans)}</div>
      ${reviewed ? `<strong class="question-answer-score">${ans.score}分</strong>` : ''}
    </div>
    ${reviewed ? `<div class="question-reviewed-line">得分: ${ans.score}分${ans.comment ? ` | 评语: ${ans.comment}` : ''} | 批阅时间: ${ans.reviewTime}</div>` : ''}
  </div>`;
}

function renderQuestionAnswerFilterTab(value, label) {
  return `<button class="${questionReviewFilter === value ? 'active' : ''}" onclick="setQuestionReviewFilter('${value}')">${label}</button>`;
}

function getFilteredQuestionAnswers(q) {
  const term = String(questionReviewSearch || '').trim().toLowerCase();
  return [...q.answers]
    .filter(ans => {
      if (questionReviewFilter === 'pending' && ans.status !== '待批阅') return false;
      if (questionReviewFilter === 'reviewed' && ans.status !== '已批阅') return false;
      if (questionReviewFilter === 'disputed' && ans.status !== '有争议') return false;
      if (!term) return true;
      return `${ans.student} ${ans.unit}`.toLowerCase().includes(term);
    })
    .sort((a, b) => {
      if (questionReviewSort === 'student') return a.student.localeCompare(b.student, 'zh-Hans-CN');
      if (questionReviewSort === 'score') return (Number(b.score ?? -1) - Number(a.score ?? -1));
      const rank = { '待批阅': 0, '有争议': 1, '已批阅': 2 };
      return (rank[a.status] ?? 9) - (rank[b.status] ?? 9);
    });
}

function getAnswerStatusLabel(ans) {
  if (!ans.answer) return '无答案';
  return ans.status || '待批阅';
}

function renderAnswerStatusBadge(ans) {
  const label = getAnswerStatusLabel(ans);
  const map = {
    '待批阅': 'badge-yellow',
    '已批阅': 'badge-green',
    '有争议': 'badge-red',
    '无答案': 'badge-gray'
  };
  return `<em class="badge ${map[label] || 'badge-gray'}">${label}</em>`;
}

function renderReviewDetailPage() {
  if (reviewAssignDetailExamId) return renderReviewAssignDetailPage();
  if (reviewProgressDetailExamId) return renderSinglePaperProgressDetailPage();
  return `
  <div class="review-shell">
  ${renderReviewStructureNav('阅卷管理')}
  <section class="review-progress-views">
    <div class="review-list-title">试卷列表</div>
    <div class="reviewer-progress-table-wrap">
      <table class="reviewer-progress-table">
        <thead>
          <tr><th>考试名称</th><th>组卷方式</th><th>考试时间</th><th>主观题数量</th><th>完成进度</th><th>阅卷状态</th><th>成绩发布状态</th><th>操作</th></tr>
        </thead>
        <tbody>
          ${REVIEW_EXAMS.map(exam => `
            <tr>
              <td><strong>${exam.name}</strong></td>
              <td>${paperTypeText(exam.paperType)}</td>
              <td class="review-exam-time-cell">${formatExamTimeRange(exam)}</td>
              <td>${exam.subjective}</td>
              <td>${getProgressReviewedTotal(exam)}/${getProgressTaskTotal(exam)}</td>
              <td>${paperReviewStatusBadge(exam.status)}</td>
              <td>${scorePublishStatusBadge(exam)}</td>
              <td>
                <div class="review-operation-actions">
                ${renderReviewPublishScoreButton(exam)}
                <span class="action-link" onclick="openQuestionAssignWithTeacherReminder('${exam.id}')">分配任务</span>
                <span class="action-link" onclick="openReviewProgressDetail('${exam.id}')">进度详情</span>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ${renderStandardPagination(REVIEW_EXAMS.length)}
  </section>
  </div>`;
}

function switchReviewDetailView(view) {
  reviewDetailView = view === 'teacher' ? 'teacher' : 'paper';
  reviewAssignDetailExamId = null;
  reviewProgressDetailExamId = null;
  navigateTo('paper-review-detail');
}

function openReviewProgressList() {
  reviewAssignDetailExamId = null;
  reviewProgressDetailExamId = null;
  reviewDetailView = 'paper';
  navigateTo(getReviewListPage());
}

function renderReviewAssignDetailPage() {
  const exam = REVIEW_EXAMS.find(e => e.id === reviewAssignDetailExamId) || REVIEW_EXAMS[0];
  const totalAnswers = exam.pending + exam.reviewed;
  return `
  <div class="review-shell">
    ${renderReviewStructureNav('阅卷配置')}
    ${renderReviewHeaderCard({ title: '分配详情', subtitle: `${exam.name} / ${reviewAssignMethodText(exam.assignMethod)}`, backText: '返回上一级', backAction: `navigateTo('${getReviewListPage()}')` })}
    <section class="review-assign-detail-page">
      <div class="review-assign-detail-head">
        <div>
          <h2>${exam.name}</h2>
          <p>${reviewAssignMethodText(exam.assignMethod)} · ${formatDateTimeSecond(exam.time)}</p>
        </div>
        <button class="btn btn-outline" onclick="openQuestionAssignWithTeacherReminder('${exam.id}')">调整分配</button>
      </div>
      <div class="review-assign-detail-metrics">
        ${renderAssignDetailMetric('主观题数量', exam.subjective, '题')}
        ${renderAssignDetailMetric('答卷总份数', totalAnswers, '份')}
        ${renderAssignDetailMetric('分配方式', reviewAssignMethodText(exam.assignMethod), '')}
        ${renderAssignDetailMetric('分配状态', exam.assignStatus || '未分配', '')}
      </div>
      ${renderAssignDetailRuleCard(exam)}
      ${renderAssignDetailContent(exam)}
    </section>
  </div>`;
}

function renderAssignDetailMetric(label, value, unit = '') {
  return `
    <div class="review-assign-detail-metric">
      <span>${label}</span>
      <strong>${value}</strong>
      ${unit ? `<em>${unit}</em>` : ''}
    </div>`;
}

function renderAssignDetailRuleCard(exam) {
  const ruleMap = {
    question: {
      title: '按题目分配',
      desc: '每道主观题指定一位负责老师，该老师批阅所有考生在这道题下提交的答案，适合需要统一评分口径的固定题目。'
    },
    'paper-quota': {
      title: '按答卷分配-按数量分配答卷',
      desc: '系统按考生整份答卷分配给老师，每位老师只处理自己被分到的答卷，同一答卷中的人工阅卷题随整份答卷一起流转。'
    },
    'paper-all': {
      title: '按答卷分配-每位老师评阅全部答卷',
      desc: '每位阅卷老师都会收到当前试卷下的全部答卷，适合多老师独立复核或需要多人共同评阅同一批答卷的场景。'
    }
  };
  const rule = ruleMap[exam.assignMethod] || ruleMap.question;
  return `
    <div class="review-assign-rule-card">
      <span>当前分配规则</span>
      <strong>${rule.title}</strong>
      <p>${rule.desc}</p>
    </div>`;
}

function renderAssignDetailContent(exam) {
  if (exam.assignMethod === 'paper-quota') return renderPaperQuotaAssignDetail(exam);
  if (exam.assignMethod === 'paper-all') return renderPaperAllAssignDetail(exam);
  return renderQuestionAssignDetail(exam);
}

function renderQuestionAssignDetail(exam) {
  const rows = getQuestionAssignDetailRows(exam);
  return `
    <div class="review-assign-detail-modal">
    <div class="review-detail-title">题目分配明细</div>
    <div class="review-assign-detail-note">每道主观题由指定老师负责，该老师批阅所有考生在该题下提交的答案。</div>
    <div class="reviewer-progress-table-wrap">
      <table class="reviewer-progress-table assign-detail-table">
        <thead>
          <tr><th>题号</th><th>题型</th><th>负责老师</th><th>所属单位</th><th>答卷份数</th><th>已阅</th><th>待阅</th><th>评阅范围</th></tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td><strong>${row.no}</strong></td>
              <td>${row.type}</td>
              <td>${row.teacher}</td>
              <td>${row.orgName}</td>
              <td>${row.total}</td>
              <td>${row.reviewed}</td>
              <td>${row.pending}</td>
              <td>${row.scope}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    </div>`;
}

function getQuestionAssignDetailRows(exam) {
  const totalAnswers = exam.pending + exam.reviewed;
  const questions = QUESTION_ASSIGN_LIST.slice(0, exam.subjective);
  return questions.map((q, index) => {
    const teacher = getAssignTeacher(q.teacherIds[0]) || getDefaultPaperQuotaTeachers()[index % Math.max(1, getDefaultPaperQuotaTeachers().length)];
    const reviewed = Math.min(totalAnswers, Math.round(totalAnswers * (q.finishedCount / Math.max(1, q.totalCount))));
    return {
      no: q.questionNo,
      type: q.questionType,
      teacher: teacher?.name || '未分配',
      orgName: teacher?.orgName || '-',
      total: totalAnswers,
      reviewed,
      pending: Math.max(0, totalAnswers - reviewed),
      scope: `所有考生的${q.questionNo}答案`
    };
  });
}

function renderPaperQuotaAssignDetail(exam) {
  const rows = getPaperQuotaAssignDetailRows(exam);
  return `
    <div class="review-assign-detail-modal">
    <div class="review-detail-title">按答卷定量分配明细</div>
    <div class="review-assign-detail-note">每位老师按配置数量接收整份答卷；同一考生答卷中的人工阅卷题由同一位老师处理。</div>
    <div class="reviewer-progress-table-wrap">
      <table class="reviewer-progress-table assign-detail-table">
        <thead>
          <tr><th>阅卷老师</th><th>所属单位</th><th>分配答卷份数</th><th>已阅</th><th>待阅</th><th>评阅范围</th></tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td><strong>${row.teacher.name}</strong></td>
              <td>${row.teacher.orgName}</td>
              <td>${row.assigned}</td>
              <td>${row.reviewed}</td>
              <td>${row.pending}</td>
              <td>整份答卷 · ${exam.subjective} 道人工阅卷题</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    </div>`;
}

function getPaperQuotaAssignDetailRows(exam) {
  const teachers = getDefaultPaperQuotaTeachers();
  const total = exam.pending + exam.reviewed;
  const base = Math.floor(total / Math.max(1, teachers.length));
  const rest = total % Math.max(1, teachers.length);
  let reviewedLeft = exam.reviewed;
  return teachers.map((teacher, index) => {
    const assigned = base + (index < rest ? 1 : 0);
    const reviewed = Math.min(assigned, Math.max(0, reviewedLeft));
    reviewedLeft -= reviewed;
    return {
      teacher,
      assigned,
      reviewed,
      pending: assigned - reviewed
    };
  });
}

function renderPaperAllAssignDetail(exam) {
  const teachers = getDefaultPaperQuotaTeachers();
  const total = exam.pending + exam.reviewed;
  return `
    <div class="review-assign-detail-modal">
    <div class="review-detail-title">全部老师评阅明细</div>
    <div class="review-assign-detail-note">每位老师均评阅全部 ${total} 份答卷，系统会保留各老师独立评阅结果，便于复核与比对。</div>
    <div class="reviewer-progress-table-wrap">
      <table class="reviewer-progress-table assign-detail-table">
        <thead>
          <tr><th>阅卷老师</th><th>所属单位</th><th>需评阅答卷</th><th>已阅</th><th>待阅</th><th>评阅范围</th></tr>
        </thead>
        <tbody>
          ${teachers.map(teacher => `
            <tr>
              <td><strong>${teacher.name}</strong></td>
              <td>${teacher.orgName}</td>
              <td>${total}</td>
              <td>${exam.reviewed}</td>
              <td>${exam.pending}</td>
              <td>全部答卷 · ${exam.subjective} 道人工阅卷题</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    </div>`;
}

function renderSinglePaperProgressDetailPage() {
  const exam = REVIEW_EXAMS.find(e => e.id === reviewProgressDetailExamId) || REVIEW_EXAMS[0];
  reviewProgressDetailView = 'teacher';
  return `
  <div class="review-shell">
  ${renderReviewStructureNav('阅卷管理')}
  ${renderReviewHeaderCard({ title: '进度详情', backText: '返回上一级', backAction: 'openReviewProgressList()' })}
  <section class="review-progress-views single-paper-progress">
    <div class="progress-detail-context">
      <div>
        <h2>${exam.name}</h2>
        <p>${paperTypeText(exam.paperType)} · ${reviewAssignMethodText(exam.assignMethod)} · ${formatExamTimeRange(exam)}</p>
      </div>
    </div>
    ${renderSinglePaperTeacherProgress(exam)}
  </section>
  </div>`;
}

function renderSinglePaperQuestionProgress(exam) {
  const rows = getQuestionAssignDetailRows(exam);
  return `
    <div class="review-detail-title">题目维度进度</div>
    <div class="reviewer-progress-table-wrap">
      <table class="reviewer-progress-table progress-question-table">
        <thead>
          <tr><th>题号</th><th>题型</th><th>负责老师（1位）</th><th>已阅</th><th>阅卷进度</th><th>状态</th></tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td><strong>${row.no}</strong></td>
              <td>${row.type}</td>
              <td>${row.teacher}</td>
              <td>${row.reviewed} / ${row.total}</td>
              <td>${renderWideProgress(row.reviewed, row.total)}</td>
              <td>${paperReviewStatusBadge(getProgressRowStatus(row.reviewed, row.total))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

function renderSinglePaperTeacherProgress(exam) {
  const rows = getTeacherProgressRows(exam);
  return `
    <div class="reviewer-progress-table-wrap">
      <table class="reviewer-progress-table progress-teacher-table">
        <thead>
          <tr><th>老师姓名</th><th>已阅</th><th>最后批阅时间</th><th>状态</th></tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <td>${row.teacher.name}</td>
              <td>${row.reviewed} / ${row.assigned}</td>
              <td>${formatDateTimeSecond('2026-05-13 14:30')}</td>
              <td>${paperReviewStatusBadge(getProgressRowStatus(row.reviewed, row.assigned))}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>`;
}

function getProgressRowStatus(done, total) {
  if (!done) return '待阅';
  if (done >= total) return '已完成';
  return '阅卷中';
}

function getTeacherProgressRows(exam) {
  if (exam.assignMethod === 'question') return getQuestionTeacherProgressRows(exam);
  if (exam.assignMethod === 'paper-all') return getPaperAllAssignDetailRows(exam);
  return getPaperQuotaAssignDetailRows(exam).map(row => ({
    ...row,
    scope: `整份答卷 · ${exam.subjective} 道人工阅卷题`
  }));
}

function getQuestionTeacherProgressRows(exam) {
  const rows = getQuestionAssignDetailRows(exam);
  const byTeacher = new Map();
  rows.forEach(row => {
    if (!byTeacher.has(row.teacher)) {
      byTeacher.set(row.teacher, {
        teacher: { name: row.teacher, orgName: row.orgName },
        assigned: 0,
        reviewed: 0,
        pending: 0,
        questions: []
      });
    }
    const target = byTeacher.get(row.teacher);
    target.assigned += row.total;
    target.reviewed += row.reviewed;
    target.pending += row.pending;
    if (!target.questions.includes(row.no)) target.questions.push(row.no);
  });
  return [...byTeacher.values()].map(row => ({
    ...row,
    scope: row.questions.join('、')
  }));
}

function getPaperAllAssignDetailRows(exam) {
  const teachers = getDefaultPaperQuotaTeachers();
  const total = exam.pending + exam.reviewed;
  return teachers.map(teacher => ({
    teacher,
    assigned: total,
    reviewed: exam.reviewed,
    pending: exam.pending,
    scope: `全部答卷 · ${exam.subjective} 道人工阅卷题`
  }));
}

function switchSinglePaperProgressView(view) {
  const exam = REVIEW_EXAMS.find(e => e.id === reviewProgressDetailExamId);
  if (view === 'question' && !(exam?.paperType === 'fixed' && exam.assignMethod === 'question')) return;
  reviewProgressDetailView = view === 'teacher' ? 'teacher' : 'question';
  navigateTo('paper-review-detail');
}

function renderReviewTeacherManagePage(options = {}) {
  const isPlatformScope = options.scope === 'all';
  return `
  <div class="review-shell review-teacher-simple-page">
    ${shouldHideSecondaryMenuReturnBar('paper-review-teachers-all') ? '' : `
    <div class="review-crumb-card platform-review-back">
      ${renderSourceBack('paper-review-teachers-all')}
      <span class="review-divider"></span>
      <strong>阅卷老师配置</strong>
    </div>`}
    <div class="review-page-hero card">
      <div class="review-page-hero-copy">
        <h2>阅卷老师配置</h2>
        <p>统一维护阅卷老师账号、密码与添加时间，支持快速检索和复制信息。</p>
      </div>
      <div class="review-page-actions">
        <button class="btn btn-primary review-teacher-add-btn" onclick="openAddReviewTeacher()">添加阅卷老师</button>
      </div>
    </div>
    <div class="review-teacher-filter card">
      <label>阅卷老师姓名</label><input class="form-control" placeholder="请输入阅卷老师姓名">
      <label>阅卷老师账号</label><input class="form-control" placeholder="请输入阅卷老师账号">
      <button class="btn btn-primary review-teacher-search-btn" onclick="filterReviewTasks()">查询</button>
      <button class="btn btn-outline" onclick="resetReviewFilters()">重置</button>
    </div>

    <div class="card review-table-card review-teacher-table-card">
      <div class="review-teacher-list-head">
        <div>
          <div class="review-list-title">阅卷老师列表</div>
          <p class="review-teacher-list-desc">共 ${REVIEW_TEACHERS.length} 位老师，当前展示的是可参与阅卷配置的账号信息。</p>
        </div>
        <button class="btn btn-outline review-teacher-copy-btn" onclick="copyReviewTeacherTable()">复制表格信息</button>
      </div>
      <table class="review-table review-teacher-table review-teacher-simple-table">
        <thead>
          <tr>
            <th></th>
            <th>阅卷老师姓名</th>
            <th>阅卷老师账号</th>
            <th>密码</th>
            <th>添加时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          ${REVIEW_TEACHERS.map(t => `
            <tr>
              <td></td>
              <td><span class="review-inline-text">${t.name}</span></td>
              <td><span class="review-inline-text">${t.account}</span></td>
              <td><span class="review-inline-text review-password-text">${t.showPassword ? t.password : maskTeacherPassword(t.password)}</span><button class="icon-btn review-password-toggle" onclick="toggleReviewTeacherPassword('${t.id}')">👁</button></td>
              <td>${formatDateTimeSecond(t.addedAt || '-')}</td>
              <td>
                <span class="action-link" onclick="editReviewTeacher('${t.id}')">编辑</span>
                <span class="action-link" onclick="copyReviewTeacherRow('${t.id}')">复制信息</span>
                <span class="action-link danger-link" onclick="removeReviewTeacher('${t.id}')">删除</span>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
      ${renderStandardPagination(REVIEW_TEACHERS.length)}
    </div>
  </div>`;
}

function renderQuestionAssignPage() {
  const p = QUESTION_ASSIGN_PAPER;
  const effectivePaperType = reviewAssignPaperType === 'random' || p.paperType === 'random' ? 'random' : 'fixed';
  reviewAssignPaperType = effectivePaperType;
  reviewAssignDimension = 'paper';
  reviewAssignPaperMode = 'quota';
  normalizeQuestionOwnerAssignments();
  const list = QUESTION_ASSIGN_LIST;
  const activeQuestion = getVisibleAssignQuestion(list);
  return `
  <div class="question-assign-page assign-config-page">
    <div class="review-crumb-card platform-review-back">
      ${renderSourceBack('paper-review-assign-question')}
      <span class="review-divider"></span>
      <strong>主观题阅卷分配</strong>
    </div>

    <section class="assign-paper-card">
      <div class="assign-paper-main">
        <span>试卷名称</span><strong>${p.paperName}</strong>
      </div>
      <div class="assign-summary">
        ${renderAssignSummaryMetric('试卷类型', effectivePaperType === 'fixed' ? '固定题目' : '随机抽题')}
        ${renderAssignSummaryMetric('简答题', p.subjectiveQuestionCount, '', '道')}
      </div>
    </section>

    ${renderReviewAssignRulePage(list, activeQuestion)}

    <div class="assign-footer">
      <div>
        <button class="btn btn-outline" onclick="saveQuestionAssign()">保存</button>
        <button class="btn btn-primary" onclick="confirmQuestionAssign()">确认分配并开启</button>
      </div>
    </div>
  </div>`;
}

function normalizeQuestionOwnerAssignments() {
  if (reviewAssignDimension !== 'question') return;
  QUESTION_ASSIGN_LIST.forEach(q => {
    if (q.teacherIds.length > 1) {
      q.teacherIds = [q.teacherIds[0]];
      q.assignMode = 'by-question';
    }
  });
}

function renderMyReviewTasksPage(options = {}) {
  reviewListScope = options.scope || 'activity';
  const totalAssigned = REVIEW_MY_PAPER_TASKS.reduce((sum, task) => sum + task.assignedAttempts, 0);
  const totalReviewed = REVIEW_MY_PAPER_TASKS.reduce((sum, task) => sum + task.reviewedAttempts, 0);
  const pending = REVIEW_MY_PAPER_TASKS.reduce((sum, task) => sum + task.pendingAttempts, 0);
  return `
  <div class="review-shell">
    ${options.scope === 'quick' ? '' : renderReviewStructureNav('我的阅卷任务')}
    <div class="review-overview-grid my-review-answer-stats">
      ${renderReviewOverviewCard('待阅试卷', REVIEW_MY_PAPER_TASKS.length, '张')}
      ${renderReviewOverviewCard('已分配答卷', totalAssigned, '份')}
      ${renderReviewOverviewCard('已批阅答卷', totalReviewed, '份', 'success')}
      ${renderReviewOverviewCard('待批阅答卷', pending, '份', 'warning')}
      ${renderReviewOverviewCard('完成率', `${Math.round(totalReviewed / Math.max(1, totalAssigned) * 100)}%`, '', 'primary')}
    </div>
    <div class="card review-table-card my-review-task-table-card">
      <div class="my-review-task-head">
        <div>
          <div class="review-list-title">我的阅卷试卷</div>
        </div>
      </div>
      <table class="review-table my-review-paper-table">
        <thead>
          <tr><th>试卷信息</th><th>试卷类型</th><th>答题规则</th><th>主观题</th><th>答卷</th><th>阅卷进度</th><th>截止时间</th><th>状态</th><th>操作</th></tr>
        </thead>
        <tbody>
          ${REVIEW_MY_PAPER_TASKS.map(task => `
            <tr>
              <td>
                <div class="my-review-paper-info">
                  <strong>${task.paper}</strong>
                  <span>${task.exam}</span>
                  <em>${task.activity}</em>
                </div>
              </td>
              <td><span class="badge badge-blue">${task.paperType}</span></td>
              <td>
                <div class="my-review-attempt-rule">
                  <strong>单次答题</strong>
                  <span>${task.scoreRule}</span>
                </div>
              </td>
              <td>${task.subjectiveQuestions} 道</td>
              <td>
                <div class="my-review-attempt-count">
                  <strong>${task.assignedAttempts}</strong>
                  <span>已阅 ${task.reviewedAttempts} / 待阅 ${task.pendingAttempts}</span>
                </div>
              </td>
              <td>${renderWideProgress(task.reviewedAttempts, task.assignedAttempts)}</td>
              <td>${formatDateTimeSecond(task.deadline)}</td>
              <td>${paperReviewStatusBadge(task.status === '待阅卷' ? '待阅' : task.status)}</td>
              <td>
                <div class="my-review-actions">
                  <span class="action-link" onclick="openStudentReviewFromPaperTask('${task.id}')">按考生批阅</span>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${renderStandardPagination(REVIEW_MY_PAPER_TASKS.length)}
    </div>
  </div>`;
}

function renderMyTaskQuestionHover(task) {
  const questions = task.questions || [];
  const listHtml = questions.length
    ? questions.map(q => `
      <div class="my-task-question-popover-row">
        <span>${q.no}</span>
        <span>${q.type}</span>
        <strong title="${reviewEscapeAttr(q.title)}">${q.title}</strong>
      </div>`).join('')
    : '<div class="my-task-question-popover-empty">暂无题目明细</div>';
  return `
    <div class="my-task-question-cell" tabindex="0">
      <span>${task.question}</span>
      <div class="my-task-question-popover">
        <div class="my-task-question-popover-title">${task.paper}</div>
        <div class="my-task-question-popover-head"><span>序号</span><span>题目类型</span><span>题目名称</span></div>
        ${listHtml}
      </div>
    </div>`;
}

function renderReviewAttemptListPage() {
  const exam = REVIEW_EXAMS.find(e => e.id === REVIEW_MARKING.examId);
  const task = getActivePaperReviewTask();
  const attempts = REVIEW_ATTEMPT_INSTANCES.filter(item => !task || item.paperTaskId === task.id);
  return `
  <div class="review-crumb-card">${renderSourceBack(currentPage)}<span class="review-divider"></span><strong>${task?.paper || exam?.name || '答卷列表'}</strong></div>
  <div class="card review-table-card my-review-attempt-card">
    <div class="my-review-task-head">
      <div>
        <div class="review-list-title">答卷列表</div>
        <p>默认每位考生仅提交一份答卷；按考生批阅会处理该考生答卷下的整份主观题答案。</p>
      </div>
      <button class="btn btn-primary" onclick="startFirstAttemptReview()">进入流式工作台</button>
    </div>
    <table class="review-table my-review-attempt-table">
      <thead>
        <tr><th>考生</th><th>答卷状态</th><th>提交时间</th><th>客观题得分</th><th>主观题进度</th><th>阅卷状态</th><th>操作</th></tr>
      </thead>
      <tbody>
        ${attempts.map(attempt => `
          <tr>
            <td><strong>${attempt.student}</strong><br><span class="muted">${attempt.unit}</span></td>
            <td>已交卷</td>
            <td>${formatDateTimeSecond(attempt.submitTime)}</td>
            <td>${attempt.objectiveScore}</td>
            <td>${attempt.reviewedQuestions} / ${attempt.reviewedQuestions + attempt.pendingQuestions}</td>
            <td>${paperReviewStatusBadge(attempt.status)}</td>
            <td><span class="action-link" onclick="openAttemptReview('${attempt.id}')">按考生批阅</span></td>
          </tr>`).join('')}
      </tbody>
    </table>
    ${renderStandardPagination(attempts.length)}
  </div>`;
}

function getVisibleAssignQuestion(list) {
  if (!list.length) return null;
  const current = list.find(q => q.id === questionAssignSelectedId);
  if (current) return current;
  const firstEditable = list.find(q => q.assignStatus !== '已完成') || list[0];
  questionAssignSelectedId = firstEditable.id;
  return firstEditable;
}

function getSelectedAssignQuestions(list = QUESTION_ASSIGN_LIST) {
  const visibleIds = new Set(list.map(q => q.id));
  questionAssignSelectedIds = questionAssignSelectedIds.filter(id => visibleIds.has(id));
  return questionAssignSelectedIds.map(getAssignQuestion).filter(Boolean);
}

function renderReviewAssignRulePage(list, activeQuestion) {
  reviewAssignDimension = 'paper';
  reviewAssignPaperMode = 'quota';
  return renderPaperDimensionWorkbench();
}

function renderAssignDimensionCard(value, title, desc, disabled) {
  const active = reviewAssignDimension === value;
  return `
    <button class="assign-dimension-card ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}" onclick="${disabled ? '' : `setReviewAssignDimension('${value}')`}">
      <strong>${title}</strong>
      <span>${desc}</span>
      ${disabled ? '<em>随机抽题不可用</em>' : active ? '<em>当前方式</em>' : '<em>点击选择</em>'}
    </button>`;
}

function renderQuestionDimensionWorkbench(list, activeQuestion) {
  const visibleText = `共 ${list.length} 道主观题`;
  const pendingQuestionCount = list.filter(q => q.assignStatus !== '已完成' && !q.teacherIds.length).length;
  return `
    <section class="assign-toolbar card">
      <div class="assign-toolbar-actions">
        <span>${visibleText}，待分配题目 ${pendingQuestionCount} 道</span>
      </div>
    </section>
    <section class="assign-workbench assign-workbench-single">
      <div class="card assign-question-list-card assign-question-list-card-full">
        <div class="assign-section-title">
          <div>
            <strong>主观题清单</strong>
            <p>在线考试下仅简答题进入人工阅卷配置。</p>
          </div>
          <span>${visibleText}</span>
        </div>
        <div class="assign-question-list assign-question-table-list">
          <div class="assign-question-table-head">
            <span>题目</span>
            <span>阅卷进度</span>
            <span>负责老师</span>
            <span>操作</span>
          </div>
          ${list.map(q => renderAssignQuestionRow(q, activeQuestion?.id === q.id)).join('')}
        </div>
      </div>
    </section>`;
}

function renderPaperDimensionWorkbench() {
  const activeTeachers = getDefaultPaperQuotaTeachers();
  reviewAssignPaperMode = 'quota';
  const totalPaperCount = QUESTION_ASSIGN_PAPER.submittedPaperCount;
  const assignedTotal = getPaperAssignedPendingTotal(activeTeachers);
  const reviewedTotal = paperQuotaConfigured ? getPaperReviewedTotal(activeTeachers) : 0;
  const reviewedPercent = Math.min(100, Math.round(reviewedTotal / Math.max(1, totalPaperCount) * 100));
  return `
    <section class="assign-overview-card card">
      <div class="assign-overview-head">
        <div>
          <strong>主观题阅卷分配</strong>
        </div>
        <em>已阅卷率 ${reviewedPercent}%</em>
      </div>
      <div class="assign-overview-stats">
        ${renderAssignOverviewStat('总份数', totalPaperCount, '份', 'primary')}
        ${renderAssignOverviewStat('已分配', assignedTotal, '份', 'info')}
        ${renderAssignOverviewStat('已阅卷', reviewedTotal, '份', 'success')}
      </div>
    </section>
    <section class="assign-paper-workbench card">
      ${renderPaperAssignQuota()}
    </section>`;
}

function renderAssignOverviewStat(label, value, unit, tone = '') {
  return `
    <div class="assign-overview-stat ${tone}">
      <span>${label}</span>
      <strong>${value}<em>${unit}</em></strong>
    </div>`;
}

function renderAssignOverviewChip(label, value, unit) {
  return `
    <div class="assign-overview-chip">
      <span>${label}</span>
      <strong>${value}<em>${unit}</em></strong>
    </div>`;
}

function renderPaperAssignModeCard(value, title, desc) {
  return `
    <button class="assign-paper-mode-card ${reviewAssignPaperMode === value ? 'active' : ''}" onclick="setReviewAssignPaperMode('${value}')">
      <strong>${title}</strong>
      <span>${desc}</span>
      <em>${reviewAssignPaperMode === value ? '当前方式' : '点击选择'}</em>
    </button>`;
}

function renderQuestionOwnerInspector(q) {
  if (!q) {
    return `
      <aside class="card assign-inspector">
        <div class="assign-inspector-empty">
          <strong>没有可配置题目</strong>
          <span>请返回检查试卷主观题配置。</span>
        </div>
      </aside>`;
  }
  const selectedTeacher = q.teacherIds[0] ? getAssignTeacher(q.teacherIds[0]) : null;
  return `
    <aside class="card assign-inspector">
      <div class="assign-inspector-head">
        <div>
          <span>按题目分配</span>
          <h3>${q.questionNo} · ${q.questionType}</h3>
        </div>
        ${assignStatusBadge(q.assignStatus)}
      </div>
      <div class="assign-current-box">
        <div>
          <span>当前负责老师</span>
          <strong>${selectedTeacher ? selectedTeacher.name : '尚未分配'}</strong>
        </div>
        <div>
          <span>阅卷范围</span>
          <strong>${q.answerCount} 份该题答案</strong>
        </div>
      </div>
      <section class="assign-inspector-section">
        <div class="assign-section-title">
          <strong>当前分配结果</strong>
          <button class="btn btn-ghost btn-sm" onclick="openReviewTeacherManagePage(event)">管理老师</button>
        </div>
        ${selectedTeacher ? `
          <div class="assign-question-owner-preview">
            <strong>${selectedTeacher.name}</strong>
            <span>将批阅所有考生的 ${q.questionNo} 答案，共 ${q.answerCount} 份。</span>
            <em>同一道题不再拆分给多个老师，确保评分标准统一。</em>
          </div>
        ` : `
          <div class="assign-inspector-empty small">
            <strong>请选择 1 位老师</strong>
            <span>请在左侧题目行内直接选择负责老师。</span>
          </div>`}
      </section>
      <div class="assign-inspector-actions">
        <button class="btn btn-ghost" onclick="openAssignQuestionDetail('${q.id}')">查看题目</button>
        <button class="btn btn-ghost" onclick="openAssignQuestionProgress('${q.id}')">查看进度</button>
        <button class="btn btn-outline" onclick="clearQuestionAssign('${q.id}')">清空本题</button>
      </div>
    </aside>`;
}

function renderQuestionOwnerTeacherOption(q, t) {
  const disabled = q.assignStatus === '已完成' || t.name === '赵老师';
  const checked = q.teacherIds[0] === t.id;
  return `
    <label class="assign-teacher-option ${checked ? 'selected' : ''} ${disabled ? 'disabled' : ''}">
      <input type="radio" name="questionOwner-${q.id}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''} onchange="setQuestionOwnerTeacher('${q.id}', '${t.id}')">
      <span class="assign-teacher-avatar">${t.name.slice(0, 1)}</span>
      <span class="assign-teacher-copy">
        <strong>${t.name}${t.name === '赵老师' ? '<i class="assign-teacher-status">已停用</i>' : ''}</strong>
        <em>${t.orgName} · 当前 ${t.currentTaskCount} 道 · 已完成 ${t.finishedTaskCount} 道</em>
      </span>
      <span class="assign-teacher-load">${checked ? `负责 ${q.answerCount}` : '可选'}</span>
    </label>`;
}

function renderPaperAssignAllTeachers() {
  const activeTeachers = getDefaultPaperQuotaTeachers();
  return `
    <div class="assign-paper-mode-panel">
      <div class="assign-all-preview-head">
        <div>
          <strong>分配结果预览</strong>
          <span>${activeTeachers.length} 位老师都将收到当前试卷下全部 ${QUESTION_ASSIGN_PAPER.submittedPaperCount} 份答卷。</span>
        </div>
        <em>只读预览，不支持修改数量</em>
      </div>
      <div class="assign-all-preview-table">
        <div class="assign-all-preview-row head">
          <span>阅卷老师</span>
          <span>所属单位</span>
          <span>分配答卷</span>
          <span>已批阅</span>
          <span>待批阅</span>
          <span>配置方式</span>
        </div>
        ${activeTeachers.map(t => {
          const reviewed = t.paperReviewedCount || 0;
          const pending = Math.max(0, QUESTION_ASSIGN_PAPER.submittedPaperCount - reviewed);
          return `
          <div class="assign-all-preview-row">
            <span><b class="assign-teacher-avatar">${t.name.slice(0, 1)}</b><strong>${t.name}</strong></span>
            <span>${t.orgName}</span>
            <span><strong>${QUESTION_ASSIGN_PAPER.submittedPaperCount}</strong> 份</span>
            <span><strong>${reviewed}</strong> 份</span>
            <span><strong>${pending}</strong> 份</span>
            <span><em>不可修改</em></span>
          </div>`;
        }).join('')}
      </div>
      <div class="assign-quota-preview ok">预览结果：每位老师都会完整评阅当前试卷下的全部答卷；已批阅结果保留，未批阅答卷继续按该模式流转。</div>
      <div class="assign-disabled-note">适用于需要多位老师共同复核同一批答卷、或希望每份答卷被多位老师独立评阅的场景。</div>
    </div>`;
}

function renderPaperAssignQuota() {
  const activeTeachers = getDefaultPaperQuotaTeachers();
  return `
    <div class="assign-paper-mode-panel">
      <div class="assign-quota-head">
        <div>
          <strong>老师分配明细</strong>
          ${paperQuotaConfigured ? '' : '<em>尚未分配，列表展示待批阅初始值；点击“分配”统一配置。</em>'}
          <div class="assign-quota-actions">
            <button class="btn btn-primary btn-sm assign-quota-primary-btn" onclick="openPaperQuotaAssignModal()">分配</button>
          </div>
        </div>
      </div>
      <div class="assign-quota-list ${paperQuotaConfigured ? '' : 'is-initial'}">
        <div class="assign-quota-row assign-quota-row-head">
          <span>老师姓名</span>
          ${paperQuotaConfigured ? '<span>已批阅</span>' : ''}
          <span>待批阅</span>
        </div>
        ${activeTeachers.map(t => {
          const quota = getTeacherPaperQuota(t);
          const reviewed = getTeacherPaperReviewedCount(t);
          if (paperQuotaConfigured) {
            return `
            <div class="assign-quota-row">
              <span><strong>${t.name}</strong></span>
              <span>${reviewed}</span>
              <span>${Math.max(0, quota - reviewed)}</span>
            </div>`;
          }
          return `
          <div class="assign-quota-row">
            <span><strong>${t.name}</strong></span>
            <span>0</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

function setReviewAssignDimension(value) {
  if (reviewAssignPaperType === 'random' && value === 'question') return;
  reviewAssignDimension = value;
  reviewAssignSaved = false;
  navigateTo('paper-review-assign-question');
}

function setReviewAssignPaperMode(value) {
  reviewAssignPaperMode = value;
  reviewAssignSaved = false;
  navigateTo('paper-review-assign-question');
}

function setQuestionOwnerTeacher(questionId, teacherId) {
  const q = getAssignQuestion(questionId);
  const teacher = getAssignTeacher(teacherId);
  if (!q || !teacher || teacher.name === '赵老师' || q.assignStatus === '已完成') return;
  q.teacherIds = [teacherId];
  q.assignMode = 'by-question';
  if (q.assignStatus !== '阅卷中') q.assignStatus = '已分配';
  questionAssignSelectedId = questionId;
  navigateTo('paper-review-assign-question');
}

function getTeacherPaperQuota(t) {
  if (typeof t.paperQuota !== 'number') {
    const defaults = { t001: 334, t002: 333, t003: 333 };
    t.paperQuota = defaults[t.id] || 0;
  }
  return t.paperQuota;
}

function getTeacherPaperReviewedCount(t) {
  return Math.min(getTeacherPaperQuota(t), t.paperReviewedCount || 0);
}

function getTeacherPaperPendingCount(t) {
  return paperQuotaConfigured ? Math.max(0, getTeacherPaperQuota(t) - getTeacherPaperReviewedCount(t)) : 0;
}

function getPaperReviewedTotal(teachers = getDefaultPaperQuotaTeachers()) {
  return teachers.reduce((sum, t) => sum + getTeacherPaperReviewedCount(t), 0);
}

function getPaperAdjustableTotal(teachers = getDefaultPaperQuotaTeachers()) {
  return Math.max(0, QUESTION_ASSIGN_PAPER.submittedPaperCount - getPaperReviewedTotal(teachers));
}

function getPaperAssignedPendingTotal(teachers = getDefaultPaperQuotaTeachers()) {
  if (!paperQuotaConfigured) return 0;
  return teachers.reduce((sum, t) => sum + getTeacherPaperPendingCount(t), 0);
}

function getTeacherPendingDraft(t) {
  if (typeof t.paperPendingDraft === 'number') return t.paperPendingDraft;
  return getTeacherPaperPendingCount(t);
}

function openPaperQuotaAssignModal() {
  const activeTeachers = getDefaultPaperQuotaTeachers();
  const assignedTotal = activeTeachers.reduce((sum, t) => sum + getTeacherPendingDraft(t), 0);
  const reviewedTotal = getPaperReviewedTotal(activeTeachers);
  const totalPaperCount = QUESTION_ASSIGN_PAPER.submittedPaperCount;
  const adjustableTotal = Math.max(0, totalPaperCount - reviewedTotal);
  const assignSummary = paperQuotaConfigured ? `
      <div class="paper-quota-assign-metric">
        <span>当前已阅卷</span>
        <strong>${reviewedTotal}<em>份</em></strong>
      </div>
      <div class="paper-quota-assign-metric primary">
        <span>可调整</span>
        <strong>${adjustableTotal}<em>份</em></strong>
      </div>` : `
      <div class="paper-quota-assign-metric">
        <span>答卷份数</span>
        <strong>${totalPaperCount}<em>份</em></strong>
      </div>
      <div class="paper-quota-assign-metric primary">
        <span>待分配</span>
        <strong>${adjustableTotal}<em>份</em></strong>
      </div>`;
  const assignNotice = paperQuotaConfigured
    ? '已阅卷答卷会被锁定保留，本次只分配可调整的答卷。'
    : '管理员首次分配时，请为各阅卷老师配置待批阅答卷份数。';
  const rows = activeTeachers.map(t => `
    <tr>
      <td>${t.name}</td>
      <td><input class="form-control paper-quota-list-input" type="number" min="0" max="${adjustableTotal}" value="${getTeacherPendingDraft(t)}" data-teacher-id="${t.id}" oninput="updatePaperQuotaAssignModalTotal()"></td>
    </tr>`).join('');
  openModal('分配答卷', `
    <div class="paper-quota-assign-summary">
      ${assignSummary}
    </div>
    <div class="paper-quota-assign-notice">
      ${assignNotice}
    </div>
    <div class="paper-quota-assign-total" data-require-full="${paperQuotaConfigured ? 'false' : 'true'}" data-total="${adjustableTotal}">本次分配：<strong><b id="paperQuotaAssignTotal">${assignedTotal}</b>/${adjustableTotal}</strong></div>
    <table class="assign-modal-table paper-quota-assign-table">
      <thead><tr><th>老师姓名</th><th>待批阅</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `, applyPaperQuotaAssignList, { confirmText: '确定', cancelText: '取消', modalClass: 'modal-lg' });
  updatePaperQuotaAssignModalTotal();
}

function applyPaperQuotaAssignList() {
  if (!paperQuotaConfigured) {
    const assignedTotal = getPaperQuotaAssignModalTotal();
    const adjustableTotal = getPaperAdjustableTotal();
    if (assignedTotal !== adjustableTotal) return false;
  }
  document.querySelectorAll('.paper-quota-list-input').forEach(input => {
    const teacher = getAssignTeacher(input.dataset.teacherId);
    if (!teacher) return;
    const pending = Math.max(0, Number(input.value) || 0);
    teacher.paperPendingDraft = pending;
    teacher.paperQuota = getTeacherPaperReviewedCount(teacher) + pending;
  });
  paperQuotaConfigured = true;
  QUESTION_ASSIGN_PAPER.assignedTaskCount = getPaperAssignedPendingTotal();
  QUESTION_ASSIGN_PAPER.unassignedTaskCount = Math.max(0, getPaperAdjustableTotal() - QUESTION_ASSIGN_PAPER.assignedTaskCount);
  reviewAssignSaved = false;
  navigateTo('paper-review-assign-question');
}

function getPaperQuotaAssignModalTotal() {
  return Array.from(document.querySelectorAll('.paper-quota-list-input'))
    .reduce((sum, input) => sum + Math.max(0, Number(input.value) || 0), 0);
}

function updatePaperQuotaAssignModalTotal() {
  const total = getPaperQuotaAssignModalTotal();
  const target = document.getElementById('paperQuotaAssignTotal');
  if (target) target.textContent = total;
  const totalWrap = document.querySelector('.paper-quota-assign-total');
  const confirmBtn = document.getElementById('modalConfirm');
  if (!totalWrap || !confirmBtn) return;
  const requireFull = totalWrap.dataset.requireFull === 'true';
  const requiredTotal = Number(totalWrap.dataset.total) || 0;
  confirmBtn.disabled = requireFull && total !== requiredTotal;
}

function renderQuestionAssignPanel(list, activeQuestion, batchQuestions = []) {
  const totalCount = QUESTION_ASSIGN_LIST.length;
  const visibleText = questionAssignOnlyUnassigned ? `当前显示 ${list.length} 道未分配题目` : `共 ${totalCount} 道主观题`;
  const batchText = batchQuestions.length ? `已选择 ${batchQuestions.length} 道题，可批量设置阅卷老师` : '可勾选多道题批量设置';
  return `
    <section class="assign-toolbar card">
      <div class="assign-toolbar-notice"><strong>分配方式：</strong>左侧可单题配置，也可勾选多道题批量配置；批量设置时系统按每道题分别平均分配。</div>
      <div class="assign-toolbar-actions">
        <label class="assign-check"><input type="checkbox" ${questionAssignOnlyUnassigned ? 'checked' : ''} onchange="toggleOnlyUnassigned(this.checked)">仅看未分配题目</label>
        ${batchQuestions.length ? `<button class="btn btn-outline" onclick="clearBatchQuestionSelection()">取消批量选择</button>` : ''}
        <span>${visibleText}，${batchText}</span>
      </div>
    </section>
    <section class="assign-workbench">
      <div class="card assign-question-list-card">
        <div class="assign-section-title">
          <div>
            <strong>主观题清单</strong>
            <p>点击题目切换右侧配置，勾选题目进入批量配置。</p>
          </div>
          <span>${visibleText}</span>
        </div>
        <div class="assign-question-list">
          ${list.length ? list.map(q => renderAssignQuestionRow(q, activeQuestion?.id === q.id)).join('') : '<div class="assign-empty">当前没有符合条件的主观题。</div>'}
        </div>
      </div>
      ${batchQuestions.length ? renderBatchAssignInspector(batchQuestions) : renderAssignInspector(activeQuestion)}
    </section>`;
}

function renderAssignQuestionRow(q, active = false) {
  const disabled = q.assignStatus === '已完成';
  const taskDesc = getAssignTaskDesc(q);
  const selectedTeachers = q.teacherIds.map(getAssignTeacher).filter(Boolean);
  const ownerTeacher = selectedTeachers[0] || null;
  const checked = questionAssignSelectedIds.includes(q.id);
  const showBatchCheck = reviewAssignDimension !== 'question';
  return `
  <div class="assign-question-item ${showBatchCheck ? '' : 'no-check'} ${active ? 'active' : ''} ${checked ? 'checked' : ''} ${disabled ? 'is-locked' : ''}" onclick="selectQuestionAssign('${q.id}')">
    ${showBatchCheck ? `
      <label class="assign-question-check" onclick="event.stopPropagation()">
        <input type="checkbox" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''} onchange="toggleBatchQuestionSelection('${q.id}', this.checked)">
      </label>` : ''}
    <div class="assign-question-item-main">
      <div class="assign-question-item-head">
        <strong>${q.questionNo}</strong>
        <span class="badge badge-blue">${q.questionType}</span>
        <span>${q.score} 分</span>
      </div>
      <div class="assign-question-summary">${q.titleSummary}</div>
      ${questionAssignExpanded ? `<p class="assign-question-full">${q.titleContent}</p>` : ''}
    </div>
    <div class="assign-question-progress-cell">
      ${renderAssignProgress(q)}
    </div>
    <div class="assign-question-teacher-cell">
      ${reviewAssignDimension === 'question'
        ? renderInlineQuestionOwnerSelect(q, disabled)
        : `<em>${ownerTeacher ? ownerTeacher.name : '未选择老师'}</em>`}
    </div>
    <div class="assign-question-action-cell">
      ${reviewAssignDimension === 'question' ? `
        <div class="assign-row-actions">
          <span onclick="event.stopPropagation();openAssignQuestionDetail('${q.id}')">查看题目</span>
        </div>` : ''}
    </div>
  </div>`;
}

function renderInlineQuestionOwnerSelect(q, disabled) {
  const availableTeachers = getActiveAssignTeachers();
  return `
    <select class="assign-inline-teacher-select" ${disabled ? 'disabled' : ''} onclick="event.stopPropagation()" onchange="setQuestionOwnerTeacher('${q.id}', this.value)">
      <option value="">选择老师</option>
      ${availableTeachers.map(t => `<option value="${t.id}" ${q.teacherIds[0] === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
    </select>`;
}

function renderTeacherStat(label, value, unit, tone = '') {
  return `
  <div class="review-teacher-stat ${tone}">
    <span>${label}</span>
    <strong>${value}</strong>
    <em>${unit}</em>
  </div>`;
}

function assignMetric(label, value, unit, tone = '') {
  return `<div class="assign-metric ${tone}"><span>${label}</span><strong>${value}</strong><em>${unit}</em></div>`;
}

function renderAssignSummaryMetric(label, value, tone = '', unit = '') {
  return `
  <div class="assign-summary-metric ${tone}">
    <span>${label}</span>
    <strong>${value}</strong>
    ${unit ? `<em>${unit}</em>` : ''}
  </div>`;
}

function assignStatusBadge(status) {
  const map = {
    '未开启': 'badge-gray',
    '已开启': 'badge-blue',
    '未分配': 'badge-gray',
    '部分分配': 'badge-yellow',
    '已分配': 'badge-blue',
    '阅卷中': 'badge-yellow',
    '已完成': 'badge-green',
    '异常': 'badge-red'
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function getAssignTeacher(id) {
  return QUESTION_ASSIGN_TEACHERS.find(t => t.id === id);
}

function getAssignQuestion(id) {
  return QUESTION_ASSIGN_LIST.find(q => q.id === id);
}

function getAssignModeText(mode) {
  return mode ? '平均分配答卷份数' : '-';
}

function getAssignTaskDesc(q) {
  if (!q.teacherIds.length) return '-';
  if (reviewAssignDimension === 'question' || q.assignMode === 'by-question') return `负责 ${q.answerCount} 份`;
  const avg = Math.ceil(q.answerCount / q.teacherIds.length);
  return q.teacherIds.length === 1 ? `每人 ${q.answerCount} 份` : `每人约 ${avg} 份`;
}

function getQuestionTeacherTaskRows(q, teachers = q.teacherIds.map(getAssignTeacher).filter(Boolean)) {
  if (!teachers.length) return [];
  const base = Math.floor(q.answerCount / teachers.length);
  const rest = q.answerCount % teachers.length;
  return teachers.map((t, idx) => ({
    teacher: t,
    assigned: base + (idx < rest ? 1 : 0),
    note: '平均'
  }));
}

function renderAssignProgress(q) {
  const pct = q.totalCount ? Math.round((q.finishedCount / q.totalCount) * 100) : 0;
  return `
  <div class="assign-progress">
    <span>${q.finishedCount} / ${q.totalCount}</span>
    <div><em style="width:${pct}%"></em></div>
  </div>`;
}

function renderTeacherMultiSelect(q, disabled) {
  const selected = q.teacherIds.map(getAssignTeacher).filter(Boolean);
  const label = selected.length ? selected.map(t => t.name).join('、') : '请选择阅卷老师';
  return `
  <div class="assign-teacher-select ${disabled ? 'disabled' : ''}">
    <button onclick="${disabled ? '' : `toggleAssignTeacherMenu('${q.id}', event)`}" title="${label}">${label}</button>
    <div class="assign-teacher-menu" id="assignTeacherMenu-${q.id}" onclick="event.stopPropagation()">
      ${QUESTION_ASSIGN_TEACHERS.map(t => `
        <label class="${t.name === '赵老师' ? 'disabled' : ''}">
          <input type="checkbox" ${q.teacherIds.includes(t.id) ? 'checked' : ''} ${disabled || t.name === '赵老师' ? 'disabled' : ''} onchange="updateQuestionTeacher('${q.id}', '${t.id}', this.checked)">
          <span><strong>${t.name}${t.name === '赵老师' ? '<i class="assign-teacher-status">已停用</i>' : ''}</strong><em>${t.orgName}｜当前任务量：${t.currentTaskCount} 道</em></span>
        </label>
      `).join('')}
    </div>
  </div>`;
}

function renderAssignInspector(q) {
  if (!q) {
    return `
    <aside class="card assign-inspector">
      <div class="assign-inspector-empty">
        <strong>没有可配置的题目</strong>
        <span>切换筛选条件后，可在这里为单道题设置阅卷老师。</span>
      </div>
    </aside>`;
  }
  const disabled = q.assignStatus === '已完成';
  const selectedTeachers = q.teacherIds.map(getAssignTeacher).filter(Boolean);
  const rows = getQuestionTeacherTaskRows(q, selectedTeachers);
  const pending = Math.max(0, q.totalCount - q.finishedCount);
  const selectedTotalLoad = selectedTeachers.reduce((sum, t) => sum + t.currentTaskCount, 0);
  return `
    <aside class="card assign-inspector">
      <div class="assign-inspector-head">
        <div>
          <span>当前配置</span>
          <h3>${q.questionNo} · ${q.questionType}</h3>
        </div>
        ${assignStatusBadge(q.assignStatus)}
      </div>

      ${q.assignStatus === '阅卷中' ? `
        <div class="assign-warning compact">
          该题已有 ${q.finishedCount} 份完成阅卷。调整老师后，仅影响未完成任务，已完成记录保留。
        </div>` : ''}
      ${disabled ? `
        <div class="assign-inspector-locked">
          该题已完成阅卷，不能重新分配；可查看题目和进度。
        </div>` : ''}

      <div class="assign-current-box">
        <div>
          <span>当前老师</span>
          <strong>${selectedTeachers.length ? selectedTeachers.map(t => t.name).join('、') : '尚未分配'}</strong>
        </div>
        <div>
          <span>阅卷进度</span>
          <strong>${q.finishedCount} / ${q.totalCount}</strong>
        </div>
      </div>

      <section class="assign-inspector-section">
        <div class="assign-section-title">
          <strong>选择阅卷老师</strong>
          <button class="btn btn-ghost btn-sm" onclick="openReviewTeacherManagePage(event)">管理老师</button>
        </div>
        <div class="assign-teacher-picker">
          ${getActiveAssignTeachers().map(t => renderAssignTeacherOption(q, t, disabled)).join('')}
        </div>
      </section>

      <section class="assign-inspector-section">
        <div class="assign-section-title">
          <strong>设置分配规则</strong>
          <span>默认不覆盖已有任务</span>
        </div>
        <div class="assign-rule-card">
          <label class="assign-rule-selected">
            <input type="radio" checked disabled>
            <span>
              <strong>平均分配</strong>
              <em>按答卷提交时间顺序，尽量平均分给已选择老师。</em>
            </span>
          </label>
          <div class="assign-range-field">
            <label for="assignScopeSelect-${q.id}">分配范围</label>
            <select id="assignScopeSelect-${q.id}" onchange="changeQuestionAssignScope(this.value)">
              <option value="unassigned" ${questionAssignScope === 'unassigned' ? 'selected' : ''}>仅分配未分配答卷</option>
              <option value="not-started" ${questionAssignScope === 'not-started' ? 'selected' : ''}>重新分配未开始阅卷答卷</option>
              <option value="all" ${questionAssignScope === 'all' ? 'selected' : ''}>全部重新分配</option>
            </select>
            <p>${getAssignScopeHint()}</p>
          </div>
        </div>
      </section>

      <section class="assign-inspector-section">
        <div class="assign-section-title">
          <strong>确认后预览</strong>
          <span>${selectedTeachers.length ? `${selectedTeachers.length} 位老师 · ${q.answerCount} 份答案` : '选择老师后生成'}</span>
        </div>
        ${selectedTeachers.length ? `
          <div class="assign-preview-metrics">
            ${assignMetric('本题答案', q.answerCount, '份')}
            ${assignMetric('未完成', pending, '份', q.assignStatus === '阅卷中' ? 'warning' : '')}
            ${assignMetric('平均每人', Math.ceil(q.answerCount / selectedTeachers.length), '份', 'primary')}
            ${assignMetric('老师当前总负载', selectedTotalLoad, '道')}
          </div>
          <div class="assign-preview-list">
            ${rows.map(row => renderAssignPreviewTeacherRow(row.teacher, row.assigned)).join('')}
          </div>
          ${q.answerCount % selectedTeachers.length ? `<p class="assign-preview-tip">余数会按答卷提交顺序补给前 ${q.answerCount % selectedTeachers.length} 位老师。</p>` : ''}
        ` : `
          <div class="assign-inspector-empty small">
            <strong>先勾选老师</strong>
            <span>这里会展示每位老师将新增多少份、确认后总任务量是多少。</span>
          </div>`}
      </section>

      <div class="assign-inspector-actions">
        <button class="btn btn-ghost" onclick="openAssignQuestionDetail('${q.id}')">查看题目</button>
        <button class="btn btn-ghost" onclick="openAssignQuestionProgress('${q.id}')">查看进度</button>
        <button class="btn btn-outline ${disabled ? 'is-disabled' : ''}" onclick="${disabled ? '' : `clearQuestionAssign('${q.id}')`}">清空本题</button>
      </div>
    </aside>`;
}

function renderBatchAssignInspector(questions) {
  const editableQuestions = questions.filter(q => q.assignStatus !== '已完成');
  const selectedTeacherIds = getBatchSelectedTeacherIds(editableQuestions);
  const selectedTeachers = selectedTeacherIds.map(getAssignTeacher).filter(Boolean);
  const totalAnswers = editableQuestions.reduce((sum, q) => sum + q.answerCount, 0);
  const startedQuestions = editableQuestions.filter(q => q.assignStatus === '阅卷中');
  return `
    <aside class="card assign-inspector batch-inspector">
      <div class="assign-inspector-head">
        <div>
          <span>批量配置</span>
          <h3>已选择 ${editableQuestions.length} 道主观题</h3>
        </div>
        <span class="badge badge-blue">批量</span>
      </div>

      <div class="assign-batch-scope">
        <strong>影响范围</strong>
        <p>${editableQuestions.map(q => q.questionNo).join('、')}，合计 ${totalAnswers} 份答案。</p>
        <div>系统会按每道题分别平均分配，不会把多道题答案混在一起平均。</div>
      </div>

      ${startedQuestions.length ? `
        <div class="assign-warning compact">
          包含 ${startedQuestions.length} 道阅卷中题目。默认“仅分配未分配答卷”不会影响已分配、阅卷中或已完成答卷。
        </div>` : ''}

      <section class="assign-inspector-section">
        <div class="assign-section-title">
          <strong>批量选择阅卷老师</strong>
          <button class="btn btn-ghost btn-sm" onclick="openReviewTeacherManagePage(event)">管理老师</button>
        </div>
        <div class="assign-teacher-picker">
          ${getActiveAssignTeachers().map(t => renderBatchAssignTeacherOption(editableQuestions, t)).join('')}
        </div>
      </section>

      <section class="assign-inspector-section">
        <div class="assign-section-title">
          <strong>设置分配规则</strong>
          <span>默认不覆盖已有任务</span>
        </div>
        <div class="assign-rule-card">
          <label class="assign-rule-selected">
            <input type="radio" checked disabled>
            <span>
              <strong>平均分配</strong>
              <em>对每道题单独计算平均份数，适合多题协同阅卷。</em>
            </span>
          </label>
          <div class="assign-range-field">
            <label for="assignScopeSelect-batch">分配范围</label>
            <select id="assignScopeSelect-batch" onchange="changeQuestionAssignScope(this.value)">
              <option value="unassigned" ${questionAssignScope === 'unassigned' ? 'selected' : ''}>仅分配未分配答卷</option>
              <option value="not-started" ${questionAssignScope === 'not-started' ? 'selected' : ''}>重新分配未开始阅卷答卷</option>
              <option value="all" ${questionAssignScope === 'all' ? 'selected' : ''}>全部重新分配</option>
            </select>
            <p>${getAssignScopeHint()}</p>
          </div>
        </div>
      </section>

      <section class="assign-inspector-section">
        <div class="assign-section-title">
          <strong>批量预览</strong>
          <span>${selectedTeachers.length ? `${selectedTeachers.length} 位老师` : '选择老师后生成'}</span>
        </div>
        ${selectedTeachers.length ? renderBatchAssignPreview(editableQuestions, selectedTeachers) : `
          <div class="assign-inspector-empty small">
            <strong>先勾选老师</strong>
            <span>这里会逐题展示每位老师预计分配份数。</span>
          </div>`}
      </section>

      <div class="assign-inspector-actions">
        <button class="btn btn-ghost" onclick="clearBatchQuestionSelection()">取消选择</button>
        <button class="btn btn-outline" onclick="saveQuestionAssign()">保存</button>
        <button class="btn btn-primary" onclick="confirmQuestionAssign()">确认分配并开启</button>
      </div>
    </aside>`;
}

function getBatchSelectedTeacherIds(questions) {
  if (!questions.length) return [];
  const first = questions[0].teacherIds || [];
  return first.filter(id => questions.every(q => q.teacherIds.includes(id)));
}

function renderBatchAssignTeacherOption(questions, t) {
  const teacherDisabled = t.name === '赵老师' || !questions.length;
  const checked = questions.length ? questions.every(q => q.teacherIds.includes(t.id)) : false;
  const partial = !checked && questions.some(q => q.teacherIds.includes(t.id));
  const totalProjected = checked
    ? questions.reduce((sum, q) => {
        const rows = getQuestionTeacherTaskRows(q, q.teacherIds.map(getAssignTeacher).filter(Boolean));
        return sum + (rows.find(row => row.teacher.id === t.id)?.assigned || 0);
      }, 0)
    : 0;
  const loadTone = t.currentTaskCount >= 200 ? 'warning' : '';
  return `
    <label class="assign-teacher-option ${checked ? 'selected' : ''} ${partial ? 'partial' : ''} ${teacherDisabled ? 'disabled' : ''}">
      <input type="checkbox" ${checked ? 'checked' : ''} ${teacherDisabled ? 'disabled' : ''} onchange="updateBatchQuestionTeacher('${t.id}', this.checked)">
      <span class="assign-teacher-avatar">${t.name.slice(0, 1)}</span>
      <span class="assign-teacher-copy">
        <strong>${t.name}${t.name === '赵老师' ? '<i class="assign-teacher-status">已停用</i>' : ''}</strong>
        <em>${t.orgName} · 当前 ${t.currentTaskCount} 道 · 已完成 ${t.finishedTaskCount} 道${partial ? ' · 部分题已选' : ''}</em>
      </span>
      <span class="assign-teacher-load ${loadTone}">${checked ? `+${totalProjected}` : partial ? '部分' : '可选'}</span>
    </label>`;
}

function renderBatchAssignPreview(questions, teachers) {
  return `
    <div class="assign-batch-preview">
      <div class="assign-batch-preview-head">
        <span>题目</span><span>答案数</span><span>老师</span><span>预计分配</span>
      </div>
      ${questions.map(q => {
        const rows = getQuestionTeacherTaskRows(q, teachers);
        const avgText = teachers.length === 1 ? `每人 ${q.answerCount}` : `每人约 ${Math.ceil(q.answerCount / teachers.length)}`;
        return `
          <div class="assign-batch-preview-row">
            <strong>${q.questionNo}</strong>
            <span>${q.answerCount} 份</span>
            <span>${teachers.map(t => t.name).join('、')}</span>
            <em>${avgText} 份</em>
            <small>${rows.map(row => `${row.teacher.name} ${row.assigned}`).join('，')}</small>
          </div>`;
      }).join('')}
    </div>`;
}

function getAssignScopeHint() {
  const map = {
    unassigned: '默认仅对尚未分配阅卷老师的答卷生效，不影响已分配、阅卷中或已完成阅卷的答卷。',
    'not-started': '仅调整已分配但尚未开始阅卷的答卷；阅卷中、已完成、已锁定答卷不会参与。',
    all: '将尝试重新分配已有阅卷任务；已开始阅卷和已完成答卷建议保持不变，提交前需要二次确认。'
  };
  return map[questionAssignScope] || map.unassigned;
}

function getAssignScopeLabel() {
  const map = {
    unassigned: '仅分配未分配答卷',
    'not-started': '重新分配未开始阅卷答卷',
    all: '全部重新分配'
  };
  return map[questionAssignScope] || map.unassigned;
}

function changeQuestionAssignScope(value) {
  const previous = questionAssignScope;
  if (value === 'all') {
    openModal('确认重新分配范围', `
      <p>当前操作将重新分配已有阅卷任务，可能影响老师当前阅卷进度。</p>
      <p>已开始阅卷、已完成阅卷、已锁定或已发布成绩的答卷不建议重新分配。</p>
    `, () => {
      questionAssignScope = value;
      navigateTo('paper-review-assign-question');
    }, { confirmText: '确认重新分配' });
    setTimeout(() => {
      const select = document.querySelector('[id^="assignScopeSelect-"]');
      if (select) select.value = previous;
    }, 0);
    return;
  }
  if (value === 'not-started') {
    openModal('确认调整未开始任务', `
      <p>系统将只重新分配已分配但尚未开始阅卷的答卷，阅卷中和已完成答卷不会参与。</p>
    `, () => {
      questionAssignScope = value;
      navigateTo('paper-review-assign-question');
    }, { confirmText: '继续使用' });
    setTimeout(() => {
      const select = document.querySelector('[id^="assignScopeSelect-"]');
      if (select) select.value = previous;
    }, 0);
    return;
  }
  questionAssignScope = value;
  navigateTo('paper-review-assign-question');
}

function renderAssignTeacherOption(q, t, disabled) {
  const teacherDisabled = disabled || t.name === '赵老师';
  const checked = q.teacherIds.includes(t.id);
  const projectedRows = getQuestionTeacherTaskRows(q, q.teacherIds.map(getAssignTeacher).filter(Boolean));
  const projected = projectedRows.find(row => row.teacher.id === t.id)?.assigned || 0;
  const loadTone = t.currentTaskCount >= 200 ? 'warning' : '';
  return `
    <label class="assign-teacher-option ${checked ? 'selected' : ''} ${teacherDisabled ? 'disabled' : ''}">
      <input type="checkbox" ${checked ? 'checked' : ''} ${teacherDisabled ? 'disabled' : ''} onchange="updateQuestionTeacher('${q.id}', '${t.id}', this.checked)">
      <span class="assign-teacher-avatar">${t.name.slice(0, 1)}</span>
      <span class="assign-teacher-copy">
        <strong>${t.name}${t.name === '赵老师' ? '<i class="assign-teacher-status">已停用</i>' : ''}</strong>
        <em>${t.orgName} · 当前 ${t.currentTaskCount} 道 · 已完成 ${t.finishedTaskCount} 道</em>
      </span>
      <span class="assign-teacher-load ${loadTone}">${checked ? `+${projected}` : '可选'}</span>
    </label>`;
}

function renderAssignPreviewTeacherRow(t, assigned) {
  const after = t.currentTaskCount + assigned;
  const warning = after >= 300;
  return `
    <div class="assign-preview-row ${warning ? 'warning' : ''}">
      <div>
        <strong>${t.name}</strong>
        <span>${t.orgName}</span>
      </div>
      <em>${t.currentTaskCount} → ${after}</em>
      <b>新增 ${assigned} 份</b>
    </div>`;
}

function selectQuestionAssign(id) {
  questionAssignSelectedId = id;
  navigateTo('paper-review-assign-question');
}

function toggleBatchQuestionSelection(id, checked) {
  const q = getAssignQuestion(id);
  if (!q || q.assignStatus === '已完成') return;
  if (checked && !questionAssignSelectedIds.includes(id)) questionAssignSelectedIds.push(id);
  if (!checked) questionAssignSelectedIds = questionAssignSelectedIds.filter(item => item !== id);
  questionAssignSelectedId = id;
  navigateTo('paper-review-assign-question');
}

function clearBatchQuestionSelection() {
  questionAssignSelectedIds = [];
  navigateTo('paper-review-assign-question');
}

function toggleAssignTeacherMenu(questionId, event) {
  if (event) event.stopPropagation();
  document.querySelectorAll('.assign-teacher-menu.show').forEach(el => {
    if (el.id !== `assignTeacherMenu-${questionId}`) el.classList.remove('show');
  });
  document.getElementById(`assignTeacherMenu-${questionId}`)?.classList.toggle('show');
}

function updateQuestionTeacher(questionId, teacherId, checked) {
  const q = getAssignQuestion(questionId);
  const teacher = getAssignTeacher(teacherId);
  if (teacher?.name === '赵老师') return;
  if (!q || q.assignStatus === '已完成') return;
  if (q.assignStatus === '阅卷中') {
    const ok = window.confirm('当前题目已有阅卷进度，修改阅卷老师可能影响未完成任务归属。是否继续？');
    if (!ok) {
      navigateTo('paper-review-assign-question');
      return;
    }
  }
  if (checked && !q.teacherIds.includes(teacherId)) q.teacherIds.push(teacherId);
  if (!checked) q.teacherIds = q.teacherIds.filter(id => id !== teacherId);
  questionAssignSelectedId = questionId;
  q.assignMode = q.teacherIds.length ? 'average' : '';
  if (q.assignStatus !== '阅卷中') q.assignStatus = q.teacherIds.length ? '已分配' : '未分配';
  navigateTo('paper-review-assign-question');
}

function updateBatchQuestionTeacher(teacherId, checked) {
  const teacher = getAssignTeacher(teacherId);
  if (teacher?.name === '赵老师') return;
  const questions = getSelectedAssignQuestions().filter(q => q.assignStatus !== '已完成');
  if (!questions.length) return;
  const hasStarted = questions.some(q => q.assignStatus === '阅卷中');
  const apply = () => {
    questions.forEach(q => {
      if (checked && !q.teacherIds.includes(teacherId)) q.teacherIds.push(teacherId);
      if (!checked) q.teacherIds = q.teacherIds.filter(id => id !== teacherId);
      q.assignMode = q.teacherIds.length ? 'average' : '';
      if (q.assignStatus !== '阅卷中') q.assignStatus = q.teacherIds.length ? '已分配' : '未分配';
    });
    navigateTo('paper-review-assign-question');
  };
  if (hasStarted) {
    openModal('确认调整阅卷中题目', '<p>已选题目中包含阅卷中题目。默认仅分配未分配答卷，不会覆盖已分配、阅卷中或已完成答卷。是否继续批量设置老师？</p>', apply, { confirmText: '继续设置' });
    return;
  }
  apply();
}

function toggleOnlyUnassigned(checked) {
  questionAssignOnlyUnassigned = !!checked;
  questionAssignSelectedIds = [];
  navigateTo('paper-review-assign-question');
}

function setQuestionAssignExpanded(expanded) {
  questionAssignExpanded = !!expanded;
  navigateTo('paper-review-assign-question');
}

function openQuestionAssign(examId) {
  syncReviewExam(examId);
  const exam = REVIEW_EXAMS.find(e => e.id === examId);
  questionAssignOnlyUnassigned = false;
  questionAssignSelectedId = 'q006';
  questionAssignSelectedIds = [];
  questionAssignScope = 'unassigned';
  reviewAssignPaperType = exam?.paperType || QUESTION_ASSIGN_PAPER.paperType || 'fixed';
  reviewAssignDimension = reviewAssignPaperType === 'random' ? 'paper' : 'question';
  reviewAssignPaperMode = 'quota';
  reviewAssignSaved = false;
  navigateTo('paper-review-assign-question', { source: { pageId: currentPage, params: currentPageParams || {}, tabKey: activeTabKey } });
}

function openQuestionAssignWithTeacherReminder(examId) {
  openQuestionAssign(examId);
}

function openReviewTeacherManagePage(event) {
  if (event) event.preventDefault();
  window.open(`${window.location.pathname}#paper-review-teachers-all`, '_blank', 'noopener');
}

function clearQuestionAssign(id, silent = false) {
  const q = getAssignQuestion(id);
  if (!q || q.assignStatus === '已完成') return;
  const doClear = () => {
    q.teacherIds = [];
    q.assignMode = '';
    questionAssignSelectedId = id;
    if (q.assignStatus !== '阅卷中') q.assignStatus = '未分配';
    if (!silent) navigateTo('paper-review-assign-question');
  };
  if (silent) return doClear();
  if (q.assignStatus === '阅卷中') {
    openModal('清空提醒', `<p>${q.questionNo} 已开始阅卷，清空阅卷老师可能影响未完成任务归属。是否继续？</p>`, doClear, { confirmText: '继续清空' });
    return;
  }
  openModal('清空阅卷人', `<p>确认清空 ${q.questionNo} 的阅卷老师吗？清空后该题将变为未分配状态。</p>`, doClear, { confirmText: '确认清空' });
}

function openAssignQuestionDetail(id) {
  const q = getAssignQuestion(id);
  if (!q) return;
  openModal('查看题目', `
    <div class="assign-question-detail">
      <p><strong>${q.questionNo}</strong> <span class="badge badge-blue">${q.questionType}</span> <span>${q.score} 分</span></p>
      <h4>完整题干</h4><div>${q.titleContent}</div>
      <h4>参考答案</h4><div>${q.referenceAnswer || '暂无参考答案'}</div>
    </div>
  `, null, { hideCancel: true, confirmText: '关闭' });
}

function openAssignQuestionProgress(id) {
  const q = getAssignQuestion(id);
  if (!q) return;
  const teachers = q.teacherIds.map(getAssignTeacher).filter(Boolean);
  const rows = teachers.length ? teachers.map(t => {
    const taskRow = getQuestionTeacherTaskRows(q, teachers).find(row => row.teacher.id === t.id);
    const assigned = taskRow?.assigned || Math.ceil(q.answerCount / teachers.length);
    const done = Math.min(assigned, Math.round(q.finishedCount / Math.max(1, teachers.length)));
    const pct = assigned ? Math.round(done / assigned * 100) : 0;
    return `<tr><td>${t.name}</td><td>${assigned}</td><td>${done}</td><td>${assigned - done}</td><td>${pct}%</td></tr>`;
  }).join('') : '<tr><td colspan="5">该题尚未设置阅卷老师</td></tr>';
  openModal('查看阅卷进度', `
    <p><strong>${q.questionNo}</strong>｜平均分配｜${teachers.length || 0} 位老师</p>
    <table class="assign-modal-table">
      <thead><tr><th>阅卷老师</th><th>分配数量</th><th>已完成</th><th>未完成</th><th>完成率</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `, null, { hideCancel: true, confirmText: '关闭' });
}

function openSingleQuestionProgress(id) {
  const q = REVIEW_PROGRESS_QUESTIONS.find(item => item.id === id);
  if (!q) return;
  const teacherCount = q.teachers.length || 1;
  const base = Math.floor(q.total / teacherCount);
  const rest = q.total % teacherCount;
  const rows = q.teachers.map((name, idx) => {
    const assigned = base + (idx < rest ? 1 : 0);
    const done = Math.min(assigned, Math.round(q.reviewed / teacherCount));
    const pending = Math.max(0, assigned - done);
    const pct = assigned ? Math.round(done / assigned * 100) : 0;
    return `<tr><td>${name}</td><td>${assigned}</td><td>${done}</td><td>${pending}</td><td>${pct}%</td></tr>`;
  }).join('');
  openModal('查看阅卷进度', `
    <p><strong>${q.no}</strong> | 平均分配 | ${q.teachers.length} 位老师</p>
    <table class="assign-modal-table progress-modal-table">
      <thead><tr><th>阅卷老师</th><th>分配数量</th><th>已完成</th><th>未完成</th><th>完成率</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `, null, { hideCancel: true, confirmText: '关闭' });
}

function saveQuestionAssign() {
  reviewAssignDimension = 'paper';
  reviewAssignPaperMode = 'quota';
  if (!isPaperQuotaValid()) {
    openModal('无法保存', `<p>${getPaperQuotaValidationMessage()}</p>`, null, { hideCancel: true, confirmText: '知道了' });
    return;
  }
  reviewAssignSaved = true;
  openModal('保存成功', '<p>已保存按数量分配答卷规则。</p><p>点击“确认分配并开启”后将生成阅卷任务。</p>', () => navigateTo('paper-review-assign-question'), { hideCancel: true, confirmText: '知道了' });
}

function confirmQuestionAssign() {
  reviewAssignDimension = 'paper';
  reviewAssignPaperMode = 'quota';
  if (!isPaperQuotaValid()) {
    openModal('无法确认分配并开启', `<p>${getPaperQuotaValidationMessage()}</p>`, null, { hideCancel: true, confirmText: '知道了' });
    return;
  }
  reviewAssignSaved = false;
  openModal('确认分配并开启成功', '<p>阅卷任务已生成：<strong>系统已按老师配置数量分配答卷</strong>。阅卷老师可开始批改。</p>', () => navigateTo('paper-review'), { confirmText: '返回试卷列表' });
}

function isPaperQuotaValid() {
  const activeTeachers = getDefaultPaperQuotaTeachers();
  if (!paperQuotaConfigured) return false;
  return getPaperAssignedPendingTotal(activeTeachers) === getPaperAdjustableTotal(activeTeachers);
}

function getPaperQuotaValidationMessage() {
  if (!paperQuotaConfigured) return '请先点击“分配”，为老师配置待批阅答卷数量。';
  const activeTeachers = getDefaultPaperQuotaTeachers();
  return `本次分配数量需要等于可调整的 ${getPaperAdjustableTotal(activeTeachers)} 份答卷。`;
}

function cancelQuestionAssign() {
  openModal('确认离开', '<p>当前分配内容尚未保存，离开后将丢失本次修改，是否确认离开？</p>', () => navigateTo('paper-review'), { confirmText: '确认离开' });
}

if (typeof document !== 'undefined' && !window.__assignTeacherMenuCloseBound) {
  document.addEventListener('click', () => {
    document.querySelectorAll('.assign-teacher-menu.show').forEach(el => el.classList.remove('show'));
  });
  window.__assignTeacherMenuCloseBound = true;
}

function renderOverallMetric(label, value, tone = '') {
  return `
  <div class="review-overall-metric">
    <span>${label}</span>
    <strong class="${tone}">${value}</strong>
  </div>`;
}

function renderWideProgress(done, total, color = 'var(--primary)') {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return `
  <div class="wide-review-progress">
    <div><span style="width:${pct}%;background:${color}"></span></div>
    <strong>${pct}%</strong>
  </div>`;
}

function renderReviewMarkingPage() {
  return renderAttemptReviewWorkbench();
}

function renderReviewTabs(active) {
  const tabs = ['工作台', '考试管理', '试卷管理', '题库管理', '题目管理', '创建固定题目', '创建考试', '创建随机抽题', '阅卷管理', '题目列表', '考生列表', '按题目批阅', '按考生查看'];
  return tabs.map(t => `<span class="${t === active ? 'active' : ''}">${t}<button>×</button></span>`).join('') + '<span class="review-tab-more">⌄</span>';
}

function filterReviewTasks() {
  openModal('查询完成', '<p>已根据考试名称、考试时间和阅卷状态筛选阅卷任务。</p>', null, { hideCancel: true, confirmText: '知道了' });
}

function urgeReview(target) {
  openModal('催办已发送', `<p>已向 <strong>${target}</strong> 相关阅卷老师发送催办提醒。</p>`, null, { hideCancel: true, confirmText: '知道了' });
}

function openReviewException(name) {
  openModal('异常任务', `
    <div class="review-exception-modal">
      <p><strong>${name}</strong> 存在异常任务：老师超时未完成 1 份，建议改派或重新分配。</p>
      <div class="review-modal-note">可处理动作：查看明细、催办、改派、重新分配。</div>
    </div>
  `, null, { hideCancel: true, confirmText: '知道了' });
}

function resetReviewFilters() {
  document.querySelectorAll('.review-filter-card input').forEach(el => { el.value = ''; });
  document.querySelectorAll('.review-filter-card select').forEach(el => { el.selectedIndex = 0; });
  document.querySelectorAll('.review-teacher-filter input').forEach(el => { el.value = ''; });
  document.querySelectorAll('.review-teacher-filter select').forEach(el => { el.selectedIndex = 0; });
}

function openAddReviewTeacher() {
  reviewTeacherFormState = {
    id: '',
    name: '',
    account: '',
    password: '',
    addedAt: '',
    showPassword: false
  };
  renderAddReviewTeacherModal();
}

function renderAddReviewTeacherModal() {
  const isEdit = !!reviewTeacherFormState.id;
  const canSubmit = !!reviewTeacherFormState.name.trim() && !!reviewTeacherFormState.account.trim() && !!reviewTeacherFormState.password.trim();
  openModal(isEdit ? '编辑阅卷老师' : '添加阅卷老师', `
    <div class="review-teacher-modal review-teacher-add-modal review-teacher-simple-modal">
      <p class="review-teacher-modal-subtitle">${isEdit ? '修改阅卷老师信息。' : '新增阅卷老师请填写名称、账号和密码。'}</p>
      <div class="review-setting-grid review-teacher-simple-grid">
        <div class="form-group">
          <label>阅卷老师姓名</label>
          <input id="reviewTeacherName" class="form-control" placeholder="请输入阅卷老师姓名" value="${reviewEscapeAttr(reviewTeacherFormState.name)}" oninput="updateReviewTeacherForm('name', this.value)">
        </div>
        <div class="form-group">
          <label>阅卷老师账号</label>
          <input id="reviewTeacherAccount" class="form-control" placeholder="请输入阅卷老师账号" value="${reviewEscapeAttr(reviewTeacherFormState.account)}" oninput="updateReviewTeacherForm('account', this.value)">
        </div>
        <div class="form-group">
          <label>密码</label>
          <input id="reviewTeacherPassword" type="password" class="form-control" placeholder="请输入密码" value="${reviewEscapeAttr(reviewTeacherFormState.password)}" oninput="updateReviewTeacherForm('password', this.value)">
        </div>
      </div>
    </div>
  `, () => submitAddReviewTeacher(), { confirmText: isEdit ? '保存' : '确认添加', modalClass: 'modal-lg review-teacher-add-dialog' });
  const confirmBtn = document.getElementById('modalConfirm');
  if (confirmBtn) confirmBtn.disabled = !canSubmit;
}

function submitAddReviewTeacher() {
  const name = reviewTeacherFormState.name.trim();
  const account = reviewTeacherFormState.account.trim();
  const password = reviewTeacherFormState.password.trim();
  if (!name || !account || !password) {
    renderAddReviewTeacherModal();
    return false;
  }
  const existed = REVIEW_TEACHERS.find(item => item.id === reviewTeacherFormState.id || item.account === account);
  if (reviewTeacherFormState.id && existed) {
    existed.name = name;
    existed.account = account;
    existed.password = password;
    existed.addedAt = existed.addedAt || formatNowForReviewTeacher();
  } else {
    REVIEW_TEACHERS.unshift({
      id: `teacher-${String(REVIEW_TEACHERS.length + 1).padStart(3, '0')}`,
      name,
      account,
      password,
      addedAt: formatNowForReviewTeacher()
    });
  }
  closeModal();
  navigateTo(currentPage);
  openModal(reviewTeacherFormState.id ? '已保存阅卷老师' : '已成功添加阅卷老师', `
    <p>${reviewTeacherFormState.id ? '阅卷老师信息已更新。' : '新的阅卷老师账号已添加。'}</p>
  `, null, { hideCancel: true, confirmText: '知道了' });
  return true;
}

function maskPhone(phone) {
  const value = String(phone || '');
  return value.length === 11 ? `${value.slice(0, 3)}****${value.slice(-4)}` : value;
}

function maskTeacherPassword(password) {
  const value = String(password || '');
  if (!value) return '-';
  return '••••••';
}

function formatNowForReviewTeacher() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function getReviewTeacherStatusTone(user) {
  if (user.accountStatus === '禁用') return 'is-disabled';
  if (user.isCurrentActivityReviewer) return 'is-duplicated';
  return 'is-normal';
}

function openTeacherTasks(name) {
  const teacher = REVIEW_REVIEWERS.find(t => t.name === name) || REVIEW_TEACHERS.find(t => t.name === name);
  if (!teacher) return;
  const assigned = teacher.totalAssigned || teacher.assigned;
  const reviewed = teacher.totalReviewed || teacher.reviewed;
  const pending = teacher.totalPending || teacher.pending;
  openModal('老师任务', `
    <div class="teacher-task-modal">
      <p><strong>${teacher.name}</strong> 当前已分配 <strong>${assigned}</strong> 道题目，已阅 <strong>${reviewed}</strong> 道，待阅 <strong>${pending}</strong> 道。</p>
      <div class="teacher-task-list">
        ${(teacher.scopes || []).map((scope, i) => `<div><span>${scope}</span><em>${Math.max(0, pending - i * 4)} 道待阅</em></div>`).join('')}
      </div>
    </div>
  `, null, { hideCancel: true, confirmText: '知道了' });
}

function adjustTeacherAssignments(name) {
  openModal('调整分配', `
    <p>可将 <strong>${name}</strong> 未开始阅卷的答卷重新分配给其他阅卷老师。</p>
    <div class="review-modal-note">演示规则：待阅卷任务可重新分配；阅卷中任务需要二次确认；已阅卷任务建议先退回重评。</div>
  `, null, { hideCancel: true, confirmText: '知道了' });
}

function editReviewTeacher(id) {
  const teacher = REVIEW_TEACHERS.find(t => t.id === id);
  if (!teacher) return;
  reviewTeacherFormState = {
    id: teacher.id,
    name: teacher.name || '',
    account: teacher.account,
    password: teacher.password
  };
  renderAddReviewTeacherModal();
}

function removeReviewTeacher(id) {
  const index = REVIEW_TEACHERS.findIndex(t => t.id === id);
  if (index < 0) return;
  REVIEW_TEACHERS.splice(index, 1);
  navigateTo(currentPage, { params: currentPageParams, source: currentPageSource, refresh: true, fromTabSwitch: true, reuseTabKey: activeTabKey });
}

function toggleReviewTeacherPassword(id) {
  const teacher = REVIEW_TEACHERS.find(t => t.id === id);
  if (!teacher) return;
  teacher.showPassword = !teacher.showPassword;
  navigateTo(currentPage, { params: currentPageParams, source: currentPageSource, refresh: true, fromTabSwitch: true, reuseTabKey: activeTabKey });
}

function copyReviewTeacherRow(id) {
  const teacher = REVIEW_TEACHERS.find(t => t.id === id);
  if (!teacher || !navigator.clipboard?.writeText) return;
  navigator.clipboard.writeText(`阅卷老师姓名：${teacher.name}\n阅卷老师账号：${teacher.account}\n密码：${teacher.password}\n添加时间：${teacher.addedAt || ''}`);
}

function copyReviewTeacherTable() {
  if (!navigator.clipboard?.writeText) return;
  const text = REVIEW_TEACHERS.map(t => `${t.name}\t${t.account}\t${t.password}\t${t.addedAt || ''}`).join('\n');
  navigator.clipboard.writeText(text);
}

function updateReviewTeacherForm(field, value) {
  reviewTeacherFormState[field] = String(value || '');
  const confirmBtn = document.getElementById('modalConfirm');
  if (confirmBtn) confirmBtn.disabled = !(reviewTeacherFormState.name.trim() && reviewTeacherFormState.account.trim() && reviewTeacherFormState.password.trim());
}

function openQuestionReview(examId) {
  syncReviewExam(examId);
  reviewProgressDetailExamId = null;
  if (currentPage === 'paper-review-all') reviewListScope = 'all';
  navigateTo(getReviewQuestionListPage(), { source: { pageId: currentPage, params: currentPageParams || {}, tabKey: activeTabKey } });
}

function openStudentReview(examId) {
  syncReviewExam(examId);
  reviewProgressDetailExamId = null;
  if (currentPage === 'paper-review-all') reviewListScope = 'all';
  navigateTo(getReviewStudentListPage(), { source: { pageId: currentPage, params: currentPageParams || {}, tabKey: activeTabKey } });
}

function openReviewDetail(examId) {
  syncReviewExam(examId);
  reviewAssignDetailExamId = examId;
  reviewProgressDetailExamId = null;
  if (currentPage === 'paper-review-all') reviewListScope = 'all';
  navigateTo('paper-review-detail', { source: { pageId: getReviewListPage(), params: {}, tabKey: activeTabKey } });
}

function openReviewAssignDetailModal(examId) {
  const exam = REVIEW_EXAMS.find(e => e.id === examId);
  if (!exam) return;
  syncReviewExam(examId);
  openModal('查看分配详情', renderAssignDetailContent(exam), null, {
    hideCancel: true,
    confirmText: '关闭',
    modalClass: 'modal-lg review-assign-detail-dialog'
  });
}

function openReviewProgressDetail(examId) {
  syncReviewExam(examId);
  const exam = REVIEW_EXAMS.find(e => e.id === examId);
  reviewAssignDetailExamId = null;
  reviewProgressDetailExamId = examId;
  reviewProgressDetailView = exam?.paperType === 'fixed' && exam.assignMethod === 'question' ? 'question' : 'teacher';
  navigateTo('paper-review-detail', { source: { pageId: 'paper-review-detail', params: {}, tabKey: activeTabKey } });
}

function syncReviewExam(examId) {
  const exam = REVIEW_EXAMS.find(e => e.id === examId);
  if (!exam) return;
  REVIEW_MARKING.examId = exam.id;
  REVIEW_MARKING.examName = exam.name;
  QUESTION_ASSIGN_PAPER.paperName = exam.name;
  QUESTION_ASSIGN_PAPER.paperType = exam.paperType;
  QUESTION_ASSIGN_PAPER.subjectiveQuestionCount = exam.subjective;
  QUESTION_ASSIGN_PAPER.submittedPaperCount = 1000;
  QUESTION_ASSIGN_PAPER.totalMarkingTaskCount = 1000;
  QUESTION_ASSIGN_PAPER.assignedTaskCount = 656;
  QUESTION_ASSIGN_PAPER.assignStatus = exam.assignStatus || '未分配';
}

function getReviewListPage() {
  if (isQuickReviewPage()) return 'paper-review-quick-my-tasks';
  return reviewListScope === 'all' ? 'paper-review-all' : 'paper-review';
}

function isQuickReviewPage() {
  return reviewListScope === 'quick' || String(currentPage || '').startsWith('paper-review-quick-');
}

function getReviewQuestionListPage() {
  return isQuickReviewPage() ? 'paper-review-quick-question-list' : 'paper-review-question-list';
}

function getReviewAttemptListPage() {
  return isQuickReviewPage() ? 'paper-review-quick-attempt-list' : 'paper-review-attempt-list';
}

function getReviewStudentListPage() {
  return isQuickReviewPage() ? 'paper-review-quick-student-list' : 'paper-review-student-list';
}

function getReviewQuestionMarkingPage() {
  return isQuickReviewPage() ? 'paper-review-quick-question-marking' : 'paper-review-question-marking';
}

function getReviewMarkingPage() {
  return isQuickReviewPage() ? 'paper-review-quick-marking' : 'paper-review-marking';
}

function startStudentReview(studentId) {
  const student = REVIEW_STUDENTS.find(s => s.id === studentId) || getVisibleReviewStudents().find(s => s.id === studentId);
  const attempt = REVIEW_ATTEMPT_INSTANCES.find(item => item.student === student?.name && (!activePaperReviewTaskId || item.paperTaskId === activePaperReviewTaskId))
    || REVIEW_ATTEMPT_INSTANCES.find(item => item.student === student?.name)
    || getActiveAttemptList()[0];
  if (student) {
    REVIEW_MARKING.studentId = student.id;
    REVIEW_MARKING.studentName = student.name;
  }
  if (attempt) {
    activePaperReviewTaskId = attempt.paperTaskId || activePaperReviewTaskId;
    activeAttemptReviewId = attempt.id;
    studentReviewActiveAttemptId = attempt.id;
    ensureAttemptReviewItems(attempt);
  }
  navigateTo(getReviewMarkingPage(), { source: { pageId: currentPage, params: currentPageParams || {}, tabKey: activeTabKey } });
}

function startQuestionReview(questionId) {
  const question = REVIEW_QUESTIONS.find(q => q.id === questionId);
  if (question) {
    REVIEW_MARKING.questionId = question.id;
    REVIEW_MARKING.no = `第${question.no}题`;
    REVIEW_MARKING.type = question.type;
    REVIEW_MARKING.score = question.score;
    REVIEW_MARKING.content = question.title;
    questionReviewAnswerId = (question.answers.find(a => a.status === '待批阅') || question.answers[0]).id;
    questionReviewScore = '';
    questionReviewComment = '';
  }
  navigateTo(getReviewQuestionMarkingPage(), { source: { pageId: currentPage, params: currentPageParams || {}, tabKey: activeTabKey } });
}

function openMyReviewTask(taskId) {
  const task = REVIEW_MY_TASKS.find(item => item.id === taskId);
  if (task?.examId) syncReviewExam(task.examId);
  navigateTo(getReviewQuestionListPage(), { source: { pageId: currentPage, params: currentPageParams || {}, tabKey: activeTabKey } });
}

function openMyReviewPaperTask(taskId) {
  openQuestionReviewFromPaperTask(taskId);
}

function openQuestionReviewFromPaperTask(taskId) {
  const task = REVIEW_MY_PAPER_TASKS.find(item => item.id === taskId);
  activePaperReviewTaskId = task?.id || '';
  if (task?.examId) syncReviewExam(task.examId);
  navigateTo(getReviewQuestionListPage(), { source: { pageId: currentPage, params: currentPageParams || {}, tabKey: activeTabKey } });
}

function openStudentReviewFromPaperTask(taskId) {
  const task = REVIEW_MY_PAPER_TASKS.find(item => item.id === taskId);
  activePaperReviewTaskId = task?.id || '';
  if (task?.examId) syncReviewExam(task.examId);
  navigateTo(getReviewStudentListPage(), { source: { pageId: currentPage, params: currentPageParams || {}, tabKey: activeTabKey } });
}

function openAttemptReviewFromPaperTask(taskId) {
  const task = REVIEW_MY_PAPER_TASKS.find(item => item.id === taskId);
  activePaperReviewTaskId = task?.id || '';
  if (task?.examId) syncReviewExam(task.examId);
  navigateTo(getReviewAttemptListPage(), { source: { pageId: currentPage, params: currentPageParams || {}, tabKey: activeTabKey } });
}

function getActivePaperReviewTask() {
  return REVIEW_MY_PAPER_TASKS.find(item => item.id === activePaperReviewTaskId) || null;
}

function openAttemptReviewTodo(attemptId) {
  openAttemptReview(attemptId);
}

function getActiveAttemptList() {
  const task = getActivePaperReviewTask();
  return REVIEW_ATTEMPT_INSTANCES.filter(item => !task || item.paperTaskId === task.id);
}

function startFirstAttemptReview() {
  const attempts = getActiveAttemptList();
  const first = attempts.find(item => item.status !== '已完成') || attempts[0];
  if (first) openAttemptReview(first.id);
}

function openAttemptReview(attemptId, questionIndex = 0) {
  const attempt = REVIEW_ATTEMPT_INSTANCES.find(item => item.id === attemptId);
  if (!attempt) return;
  activePaperReviewTaskId = attempt.paperTaskId || activePaperReviewTaskId;
  activeAttemptReviewId = attempt.id;
  activeAttemptQuestionIndex = Math.max(0, Math.min(REVIEW_ATTEMPT_QUESTION_TEMPLATES.length - 1, questionIndex));
  attempt.status = attempt.status === '已完成' ? '已完成' : '阅卷中';
  navigateTo(getReviewMarkingPage(), { source: { pageId: currentPage, params: currentPageParams || {}, tabKey: activeTabKey } });
}

function getActiveAttempt() {
  return REVIEW_ATTEMPT_INSTANCES.find(item => item.id === activeAttemptReviewId) || getActiveAttemptList()[0] || REVIEW_ATTEMPT_INSTANCES[0];
}

function ensureAttemptReviewItems(attempt) {
  if (!attempt.reviewItems) {
    attempt.reviewItems = REVIEW_ATTEMPT_QUESTION_TEMPLATES.map((template, index) => {
      const isPreReviewed = index < attempt.reviewedQuestions;
      const presetScore = isPreReviewed ? Math.max(0, Math.min(template.score, Math.round(template.score * (index === 3 ? 0.75 : 0.9)))) : '';
      return {
        questionId: template.id,
        score: isPreReviewed ? presetScore : '',
        comment: isPreReviewed ? (presetScore === template.score ? '答案完整，表达清晰' : '要点基本覆盖，可再补充细节') : '',
        status: isPreReviewed ? '已评分' : '未评分',
        flagged: false,
        saved: isPreReviewed,
        updatedAt: isPreReviewed ? '已保存' : ''
      };
    });
  }
  return attempt.reviewItems;
}

function getAttemptQuestion(index = activeAttemptQuestionIndex) {
  return REVIEW_ATTEMPT_QUESTION_TEMPLATES[index] || REVIEW_ATTEMPT_QUESTION_TEMPLATES[0];
}

function getAttemptReviewItem(attempt = getActiveAttempt(), index = activeAttemptQuestionIndex) {
  return ensureAttemptReviewItems(attempt)[index];
}

function getAttemptReviewStats(attempt = getActiveAttempt()) {
  const items = ensureAttemptReviewItems(attempt);
  const reviewed = items.filter(item => item.status === '已评分').length;
  const total = items.length;
  const subjectiveScore = items.reduce((sum, item) => sum + (item.score === '' ? 0 : Number(item.score)), 0);
  const maxScore = REVIEW_ATTEMPT_QUESTION_TEMPLATES.reduce((sum, q) => sum + q.score, 0);
  return {
    reviewed,
    total,
    pending: total - reviewed,
    subjectiveScore,
    maxScore,
    totalScore: attempt.objectiveScore + subjectiveScore
  };
}

function renderAttemptReviewWorkbench() {
  const attempt = getActiveAttempt();
  if (!attempt) return '<div class="card review-table-card">暂无可批阅答卷</div>';
  const task = getActivePaperReviewTask();
  const question = getAttemptQuestion();
  const item = getAttemptReviewItem(attempt);
  const stats = getAttemptReviewStats(attempt);
  const allAttempts = getActiveAttemptList();
  const attemptIndex = allAttempts.findIndex(row => row.id === attempt.id);
  const pct = Math.round((stats.reviewed / stats.total) * 100);
  return `
  <div class="attempt-review-page">
    <section class="attempt-review-header card">
      <div class="attempt-review-title">
        <button class="review-header-back attempt-review-back" onclick="goBackFromPage('${currentPage}')">‹ 返回上一级</button>
        <strong>${task?.paper || '安全生产知识主观题试卷'}</strong>
        <span>${task?.exam || REVIEW_MARKING.examName}｜仅批阅简答题｜当前 ${attemptIndex + 1} / ${allAttempts.length}</span>
      </div>
      <div class="attempt-review-progress" title="当前批阅进度">
        <span>当前批阅进度：${stats.reviewed} / ${stats.total}</span>
        <div><em style="width:${pct}%"></em></div>
        <strong>${pct}%</strong>
      </div>
      <div class="attempt-review-save" id="attemptAutoSaveStatus">✓ 已保存</div>
    </section>

    <section class="attempt-review-workspace">
      <main class="attempt-question-panel card">
        <div class="attempt-mode-bar">
          <div>
            <strong>批阅模式</strong>
            <span>${attemptReviewMode === 'paper' ? '整卷下滑浏览，适合通读整份主观题答卷' : '按题目一题一题批阅，适合高节奏连续评分'}</span>
          </div>
          <div class="attempt-mode-toggle">
            <button class="${attemptReviewMode === 'paper' ? 'active' : ''}" onclick="setAttemptReviewMode('paper')">整卷浏览</button>
            <button class="${attemptReviewMode === 'question' ? 'active' : ''}" onclick="setAttemptReviewMode('question')">逐题批阅</button>
          </div>
        </div>
        ${attemptReviewMode === 'paper' ? renderAttemptPaperMode(attempt) : renderAttemptQuestionMode(attempt, question, item)}
      </main>

    </section>

    <section class="attempt-bottom-bar">
      <button class="btn btn-outline" onclick="${attemptReviewMode === 'paper' ? 'switchAttemptByOffset(-1)' : 'moveAttemptQuestion(-1)'}">${attemptReviewMode === 'paper' ? '上一份' : '上一题'}</button>
      <button class="btn btn-outline" onclick="saveAttemptReviewNow()">保存</button>
      <button class="btn btn-primary btn-lg" onclick="${attemptReviewMode === 'paper' ? 'completeAttemptAndPromptNext()' : 'goNextAttemptQuestion()'}">${attemptReviewMode === 'paper' ? '完成并下一份' : '下一题'}</button>
    </section>
  </div>`;
}

function renderAttemptQuestionMode(attempt, question, item) {
  return `
        <div class="attempt-question-top">
          <div>
            <strong>题目 ${question.no}</strong>
            <span class="badge badge-blue">${question.type}</span>
            <span>满分 ${question.score} 分</span>
          </div>
          <div class="attempt-question-jump">
            ${REVIEW_ATTEMPT_QUESTION_TEMPLATES.map((q, index) => {
              const reviewItem = ensureAttemptReviewItems(attempt)[index];
              return `<button class="${index === activeAttemptQuestionIndex ? 'active' : ''} ${reviewItem.status === '已评分' ? 'done' : ''}" onclick="selectAttemptQuestion(${index})">${q.no}</button>`;
            }).join('')}
          </div>
        </div>
        <div class="attempt-question-body">
          <div class="attempt-question-section">
            <h4>题干</h4>
            <p>${question.title}</p>
          </div>
          <div class="attempt-answer-grid">
            <div class="attempt-answer-box student">
              <span>学生答案</span>
              <p>${question.answers[attempt.id] || '该考生未作答。'}</p>
            </div>
            <div class="attempt-answer-box standard">
              <span>标准答案</span>
              <p>${question.standard}</p>
            </div>
          </div>
        </div>
        <div class="attempt-score-strip">
          <div class="attempt-score-main">
            <label>评分</label>
            <div class="review-stepper compact">
              <button onclick="adjustAttemptScore(-1)">−</button>
              <input id="attemptScoreInput" value="${item.score}" type="number" min="0" max="${question.score}" oninput="updateAttemptScore(this.value)">
              <button onclick="adjustAttemptScore(1)">＋</button>
            </div>
            <span>/ ${question.score}</span>
          </div>
          <textarea id="attemptCommentInput" class="form-control" placeholder="添加评语（可选）" oninput="updateAttemptComment(this.value)">${reviewEscapeAttr(item.comment || '')}</textarea>
        </div>
      `;
}

function renderAttemptPaperMode(attempt) {
  const items = ensureAttemptReviewItems(attempt);
  return `
    <div class="attempt-paper-scroll">
      ${getAttemptPaperSections().map((section, sectionIndex) => renderAttemptPaperSection(attempt, items, section, sectionIndex)).join('')}
    </div>`;
}

function getAttemptPaperSections() {
  const total = REVIEW_ATTEMPT_QUESTION_TEMPLATES.length;
  const sections = [];
  let cursor = 0;
  while (cursor < total) {
    const remaining = total - cursor;
    const size = remaining > 2 ? 2 : remaining;
    sections.push({
      title: `大题${ATTEMPT_PAPER_SECTION_ORDINALS[sections.length] || sections.length + 1}`,
      start: cursor,
      end: cursor + size
    });
    cursor += size;
  }
  return sections;
}

function renderAttemptPaperSection(attempt, items, section, sectionIndex) {
  const questions = REVIEW_ATTEMPT_QUESTION_TEMPLATES.slice(section.start, section.end);
  const sectionItems = items.slice(section.start, section.end);
  const totalScore = questions.reduce((sum, question) => sum + (Number(question.score) || 0), 0);
  const reviewedCount = sectionItems.filter(item => item.status === '已评分').length;
  return `
    <section class="attempt-paper-section" id="attemptPaperSection-${sectionIndex}">
      <div class="attempt-paper-section-head">
        <div>
          <strong>${section.title}</strong>
          <span>${questions.length} 题 · ${totalScore} 分</span>
        </div>
        <em>${reviewedCount}/${questions.length} 已评分</em>
      </div>
      <div class="attempt-paper-section-body">
        ${questions.map((question, index) => renderAttemptPaperQuestionCard(attempt, question, sectionItems[index], section.start + index)).join('')}
      </div>
    </section>`;
}

function renderAttemptPaperQuestionCard(attempt, question, item, index) {
  return `
    <article class="attempt-paper-question-card" id="attemptPaperQuestion-${index}">
      <div class="attempt-paper-question-head">
        <div>
          <strong>第 ${question.no} 题</strong>
          <span class="badge badge-blue">${question.type}</span>
          <span>满分 ${question.score} 分</span>
        </div>
        <span class="${item.status === '已评分' ? 'badge badge-green' : 'badge badge-gray'}">${item.status}</span>
      </div>
      <div class="attempt-question-body">
        <div class="attempt-question-section">
          <h4>题干</h4>
          <p>${question.title}</p>
        </div>
        <div class="attempt-answer-grid">
          <div class="attempt-answer-box student">
            <span>学生答案</span>
            <p>${question.answers[attempt.id] || '该考生未作答。'}</p>
          </div>
          <div class="attempt-answer-box standard">
            <span>参考答案</span>
            <p>${question.standard}</p>
          </div>
        </div>
      </div>
      <div class="attempt-score-strip paper">
        <div class="attempt-score-main">
          <label>评分</label>
          <div class="review-stepper compact">
            <button onclick="adjustAttemptPaperScore(${index}, -1)">−</button>
            <input id="attemptPaperScore-${index}" value="${item.score}" type="number" min="0" max="${question.score}" oninput="updateAttemptPaperScore(${index}, this.value)">
            <button onclick="adjustAttemptPaperScore(${index}, 1)">＋</button>
          </div>
          <span>/ ${question.score}</span>
        </div>
        <textarea id="attemptPaperComment-${index}" class="form-control" placeholder="添加本题评语（可选）" oninput="updateAttemptPaperComment(${index}, this.value)">${reviewEscapeAttr(item.comment || '')}</textarea>
      </div>
    </article>`;
}

function renderStudentReviewMarkingPage() {
  const attempt = getActiveAttempt();
  if (!attempt) return '<div class="card review-table-card">暂无可批阅答卷</div>';
  const task = getActivePaperReviewTask();
  const items = ensureAttemptReviewItems(attempt);
  const stats = getAttemptReviewStats(attempt);
  const pct = Math.round((stats.reviewed / stats.total) * 100);
  return `
  <div class="student-review-page">
    <section class="review-crumb-card student-review-header">
      <div>
        <button class="review-header-back" onclick="goBackFromPage('${currentPage}')">‹ 返回上一级</button>
        <strong>${attempt.student} - 批阅主观题</strong>
      </div>
      <div class="student-review-meta">
        <span>${task?.paper || '安全生产知识主观题试卷'}</span>
        <span>${attempt.unit}</span>
        <span>提交时间：${formatDateTimeSecond(attempt.submitTime)}</span>
      </div>
    </section>

    <section class="card student-review-summary">
      <div><span>客观题得分</span><strong>${attempt.objectiveScore}</strong></div>
      <div><span>主观题满分</span><strong>${stats.maxScore}</strong></div>
      <div><span>已评分题目</span><strong>${stats.reviewed} / ${stats.total}</strong></div>
      <div><span>当前总分</span><strong>${stats.totalScore}</strong></div>
      <div class="student-review-progress">${renderWideProgress(stats.reviewed, stats.total)}</div>
    </section>

    <section class="student-review-question-list">
      ${REVIEW_ATTEMPT_QUESTION_TEMPLATES.map((question, index) => renderStudentReviewQuestionBlock(attempt, question, items[index], index)).join('')}
    </section>

    <section class="student-review-submit">
      <button class="btn btn-outline" onclick="saveStudentReviewDraft()">保存草稿</button>
      <button class="btn btn-primary btn-lg" onclick="submitStudentReviewAll()">提交全部评分</button>
    </section>
  </div>`;
}

function renderStudentReviewQuestionBlock(attempt, question, item, index) {
  const answer = question.answers[attempt.id] || '该考生未作答。';
  return `
    <article class="card student-review-question-card">
      <div class="student-review-question-head">
        <div>
          <strong>第 ${question.no} 题</strong>
          <span class="badge badge-blue">${question.type}</span>
          <span>满分 ${question.score} 分</span>
        </div>
        <span class="${item.status === '已评分' ? 'badge badge-green' : 'badge badge-gray'}">${item.status}</span>
      </div>
      <div class="student-review-question-body">
        <section>
          <h4>题目内容</h4>
          <p>${question.title}</p>
        </section>
        <section class="student-review-answer-box">
          <h4>考生答案</h4>
          <p>${answer}</p>
        </section>
        <section class="student-review-reference">
          <h4>参考答案</h4>
          <p>${question.standard}</p>
        </section>
      </div>
      <div class="student-review-score-row">
        <label>得分</label>
        <div class="review-stepper compact">
          <button onclick="adjustStudentQuestionScore(${index}, -1)">−</button>
          <input id="studentReviewScore-${index}" value="${item.score}" type="number" min="0" max="${question.score}" oninput="updateStudentQuestionScore(${index}, this.value)">
          <button onclick="adjustStudentQuestionScore(${index}, 1)">＋</button>
        </div>
        <span>/ ${question.score}</span>
        <div class="student-review-presets">
          <button onclick="applyStudentQuestionQuickScore(${index}, 'full')">满分</button>
          <button onclick="applyStudentQuestionQuickScore(${index}, 'half')">半分</button>
          <button onclick="applyStudentQuestionQuickScore(${index}, 'zero')">零分</button>
        </div>
      </div>
      <div class="student-review-comment-row">
        <label>评语</label>
        <textarea id="studentReviewComment-${index}" class="form-control" placeholder="填写本题评语（可选）" oninput="updateStudentQuestionComment(${index}, this.value)">${reviewEscapeAttr(item.comment || '')}</textarea>
      </div>
    </article>`;
}

function renderAttemptStreamItem(attempt, index, activeId) {
  const stats = getAttemptReviewStats(attempt);
  const isActive = attempt.id === activeId;
  const relation = isActive ? '当前正在批阅' : index > getActiveAttemptList().findIndex(row => row.id === activeId) ? '下一份' : '上一份';
  return `
    <button class="attempt-stream-item ${isActive ? 'active' : ''}" onclick="openAttemptReview('${attempt.id}', ${activeAttemptQuestionIndex})">
      <span>${relation}</span>
      <strong>${attempt.student}<em>第 ${attempt.attemptNo} 次</em></strong>
      <small>${attempt.unit}</small>
      <div><b>${paperReviewStatusBadge(attempt.status)}</b><i>${attempt.objectiveScore + stats.subjectiveScore} 分</i></div>
    </button>`;
}

function getActiveReviewQuestion() {
  return REVIEW_QUESTIONS.find(q => q.id === REVIEW_MARKING.questionId) || REVIEW_QUESTIONS[0];
}

function rerenderAttemptWorkbench() {
  const main = document.getElementById('mainContent');
  if (main) main.innerHTML = renderAttemptReviewWorkbench();
}

function setAttemptReviewMode(mode) {
  saveAttemptReviewNow(false);
  attemptReviewMode = mode === 'question' ? 'question' : 'paper';
  rerenderAttemptWorkbench();
}

function setAttemptAutoSaveLabel(text, tone = '') {
  const el = document.getElementById('attemptAutoSaveStatus');
  if (!el) return;
  el.textContent = text;
  el.className = `attempt-review-save ${tone}`;
}

function queueAttemptAutoSave() {
  setAttemptAutoSaveLabel('正在保存...', 'saving');
  if (attemptReviewAutoSaveTimer) clearTimeout(attemptReviewAutoSaveTimer);
  attemptReviewAutoSaveTimer = setTimeout(() => saveAttemptReviewNow(false), 300);
}

function saveAttemptReviewNow(showToast = true) {
  const attempt = getActiveAttempt();
  if (attemptReviewMode === 'paper') {
    ensureAttemptReviewItems(attempt).forEach((item, index) => {
      const scoreInput = document.getElementById(`attemptPaperScore-${index}`);
      const commentInput = document.getElementById(`attemptPaperComment-${index}`);
      if (scoreInput) {
        item.score = scoreInput.value;
        item.status = scoreInput.value === '' ? '未评分' : '已评分';
      }
      if (commentInput) item.comment = commentInput.value;
      item.saved = true;
      item.updatedAt = '刚刚已保存';
    });
  } else {
    const item = getAttemptReviewItem(attempt);
    const scoreInput = document.getElementById('attemptScoreInput');
    const commentInput = document.getElementById('attemptCommentInput');
    if (scoreInput) item.score = scoreInput.value;
    if (commentInput) item.comment = commentInput.value;
    if (item.score !== '') item.status = '已评分';
    item.saved = true;
    item.updatedAt = '刚刚已保存';
  }
  syncAttemptProgress(attempt);
  setAttemptAutoSaveLabel('✓ 已保存');
  if (showToast) openModal('已保存', '<p>当前题评分已保存，自动保存仍会继续生效。</p>', null, { hideCancel: true, confirmText: '知道了' });
}

function syncAttemptProgress(attempt = getActiveAttempt()) {
  const stats = getAttemptReviewStats(attempt);
  attempt.reviewedQuestions = stats.reviewed;
  attempt.pendingQuestions = stats.pending;
  if (stats.pending === 0) {
    attempt.status = '已完成';
    attempt.subjectiveStatus = '已批阅';
  } else if (stats.reviewed > 0 || attempt.status === '阅卷中') {
    attempt.status = '阅卷中';
    attempt.subjectiveStatus = '阅卷中';
  } else {
    attempt.status = '待阅';
    attempt.subjectiveStatus = '待批阅';
  }
}

function validateAttemptScore(score, max) {
  if (score === '') return true;
  const value = Number(score);
  return !Number.isNaN(value) && value >= 0 && value <= max;
}

function updateAttemptScore(value) {
  const question = getAttemptQuestion();
  if (!validateAttemptScore(value, question.score)) return;
  const item = getAttemptReviewItem();
  item.score = value;
  if (value !== '') item.status = '已评分';
  queueAttemptAutoSave();
}

function updateAttemptComment(value) {
  getAttemptReviewItem().comment = value;
  queueAttemptAutoSave();
}

function adjustAttemptScore(delta) {
  const question = getAttemptQuestion();
  const item = getAttemptReviewItem();
  const current = Number(document.getElementById('attemptScoreInput')?.value || item.score || 0);
  const next = Math.max(0, Math.min(question.score, current + delta));
  item.score = String(next);
  item.status = '已评分';
  const input = document.getElementById('attemptScoreInput');
  if (input) input.value = item.score;
  queueAttemptAutoSave();
}

function applyAttemptQuickScore(kind) {
  const question = getAttemptQuestion();
  const score = kind === 'full' ? question.score : kind === 'zero' ? 0 : Math.round(question.score / 2);
  const item = getAttemptReviewItem();
  item.score = String(score);
  item.status = '已评分';
  const input = document.getElementById('attemptScoreInput');
  if (input) input.value = item.score;
  queueAttemptAutoSave();
}

function selectAttemptQuestion(index) {
  saveAttemptReviewNow(false);
  activeAttemptQuestionIndex = Math.max(0, Math.min(REVIEW_ATTEMPT_QUESTION_TEMPLATES.length - 1, index));
  rerenderAttemptWorkbench();
}

function moveAttemptQuestion(offset) {
  selectAttemptQuestion(activeAttemptQuestionIndex + offset);
}

function goNextAttemptQuestion() {
  saveAttemptReviewNow(false);
  if (activeAttemptQuestionIndex < REVIEW_ATTEMPT_QUESTION_TEMPLATES.length - 1) {
    activeAttemptQuestionIndex += 1;
    rerenderAttemptWorkbench();
    return;
  }
  completeAttemptAndPromptNext();
}

function completeAttemptAndPromptNext() {
  const attempt = getActiveAttempt();
  const stats = getAttemptReviewStats(attempt);
  if (stats.pending > 0) {
    openModal('还有题目未评分', `<p>当前答卷还有 <strong>${stats.pending}</strong> 题未评分。可以继续评分，也可以先标记疑难后稍后处理。</p>`, null, { hideCancel: true, confirmText: '继续批阅' });
    return;
  }
  syncAttemptProgress(attempt);
  const list = getActiveAttemptList();
  const index = list.findIndex(item => item.id === attempt.id);
  const next = list.slice(index + 1).find(item => item.status !== '已完成') || list.find(item => item.status !== '已完成' && item.id !== attempt.id);
  if (!next) {
    openModal('本组答卷已完成', '<p>当前试卷任务已经全部批阅完成。</p>', () => navigateTo(getReviewAttemptListPage()), { hideCancel: true, confirmText: '返回列表' });
    return;
  }
  openModal('当前答卷已完成', `
    <div class="attempt-next-modal">
      <p>下一份：</p>
      <strong>${next.student} 第 ${next.attemptNo} 次答题</strong>
      <span>${next.unit}｜客观题 ${next.objectiveScore} 分｜${formatDateTimeSecond(next.submitTime)}</span>
    </div>
  `, () => openAttemptReview(next.id, 0), { confirmText: '继续批阅' });
  const confirmBtn = document.getElementById('modalConfirm');
  if (confirmBtn) confirmBtn.focus();
  const cancelBtn = document.getElementById('modalFoot')?.querySelector('.btn-ghost');
  if (cancelBtn) {
    cancelBtn.textContent = '返回列表';
    cancelBtn.onclick = () => {
      closeModal();
      navigateTo(getReviewAttemptListPage());
    };
  }
}

function switchAttemptByOffset(offset) {
  saveAttemptReviewNow(false);
  const list = getActiveAttemptList();
  const idx = list.findIndex(item => item.id === activeAttemptReviewId);
  const next = list[Math.max(0, Math.min(list.length - 1, idx + offset))];
  if (next) openAttemptReview(next.id, 0);
}

function applyAttemptPaperTemplate(kind) {
  const attempt = getActiveAttempt();
  ensureAttemptReviewItems(attempt).forEach((item, index) => {
    const max = REVIEW_ATTEMPT_QUESTION_TEMPLATES[index].score;
    item.score = String(kind === 'full' ? max : kind === 'zero' ? 0 : Math.round(max * 0.6));
    item.status = '已评分';
    item.saved = true;
    item.comment = item.comment || (kind === 'full' ? '表达完整' : kind === 'zero' ? '概念不清晰' : '要点覆盖基本完整');
  });
  syncAttemptProgress(attempt);
  rerenderAttemptWorkbench();
}

function insertAttemptComment(text) {
  const item = getAttemptReviewItem();
  item.comment = item.comment ? `${item.comment}；${text}` : text;
  const input = document.getElementById('attemptCommentInput');
  if (input) input.value = item.comment;
  queueAttemptAutoSave();
}

function toggleAttemptFlag(checked) {
  getAttemptReviewItem().flagged = !!checked;
  queueAttemptAutoSave();
}

function updateAttemptPaperScore(index, value) {
  const question = REVIEW_ATTEMPT_QUESTION_TEMPLATES[index];
  if (!question || !validateAttemptScore(value, question.score)) return;
  const item = getAttemptReviewItem(getActiveAttempt(), index);
  item.score = value;
  item.status = value === '' ? '未评分' : '已评分';
  queueAttemptAutoSave();
}

function adjustAttemptPaperScore(index, delta) {
  const question = REVIEW_ATTEMPT_QUESTION_TEMPLATES[index];
  if (!question) return;
  const item = getAttemptReviewItem(getActiveAttempt(), index);
  const current = Number(document.getElementById(`attemptPaperScore-${index}`)?.value || item.score || 0);
  const next = Math.max(0, Math.min(question.score, current + delta));
  item.score = String(next);
  item.status = '已评分';
  const input = document.getElementById(`attemptPaperScore-${index}`);
  if (input) input.value = item.score;
  queueAttemptAutoSave();
}

function applyAttemptPaperQuestionScore(index, kind) {
  const question = REVIEW_ATTEMPT_QUESTION_TEMPLATES[index];
  if (!question) return;
  const item = getAttemptReviewItem(getActiveAttempt(), index);
  item.score = String(kind === 'full' ? question.score : kind === 'zero' ? 0 : Math.round(question.score / 2));
  item.status = '已评分';
  const input = document.getElementById(`attemptPaperScore-${index}`);
  if (input) input.value = item.score;
  queueAttemptAutoSave();
}

function updateAttemptPaperComment(index, value) {
  getAttemptReviewItem(getActiveAttempt(), index).comment = value;
  queueAttemptAutoSave();
}

function rerenderStudentReviewPage() {
  const main = document.getElementById('mainContent');
  if (main) main.innerHTML = renderStudentReviewMarkingPage();
}

function updateStudentQuestionScore(index, value) {
  const question = REVIEW_ATTEMPT_QUESTION_TEMPLATES[index];
  if (!question || !validateAttemptScore(value, question.score)) return;
  const item = getAttemptReviewItem(getActiveAttempt(), index);
  item.score = value;
  item.status = value === '' ? '未评分' : '已评分';
  item.saved = false;
  syncAttemptProgress(getActiveAttempt());
}

function adjustStudentQuestionScore(index, delta) {
  const question = REVIEW_ATTEMPT_QUESTION_TEMPLATES[index];
  if (!question) return;
  const item = getAttemptReviewItem(getActiveAttempt(), index);
  const current = Number(document.getElementById(`studentReviewScore-${index}`)?.value || item.score || 0);
  const next = Math.max(0, Math.min(question.score, current + delta));
  item.score = String(next);
  item.status = '已评分';
  item.saved = false;
  const input = document.getElementById(`studentReviewScore-${index}`);
  if (input) input.value = item.score;
  syncAttemptProgress(getActiveAttempt());
}

function applyStudentQuestionQuickScore(index, kind) {
  const question = REVIEW_ATTEMPT_QUESTION_TEMPLATES[index];
  if (!question) return;
  const item = getAttemptReviewItem(getActiveAttempt(), index);
  item.score = String(kind === 'full' ? question.score : kind === 'zero' ? 0 : Math.round(question.score / 2));
  item.status = '已评分';
  item.saved = false;
  const input = document.getElementById(`studentReviewScore-${index}`);
  if (input) input.value = item.score;
  syncAttemptProgress(getActiveAttempt());
}

function updateStudentQuestionComment(index, value) {
  const item = getAttemptReviewItem(getActiveAttempt(), index);
  item.comment = value;
  item.saved = false;
}

function saveStudentReviewDraft(showToast = true) {
  const attempt = getActiveAttempt();
  ensureAttemptReviewItems(attempt).forEach((item, index) => {
    const scoreInput = document.getElementById(`studentReviewScore-${index}`);
    const commentInput = document.getElementById(`studentReviewComment-${index}`);
    if (scoreInput) {
      item.score = scoreInput.value;
      item.status = scoreInput.value === '' ? '未评分' : '已评分';
    }
    if (commentInput) item.comment = commentInput.value;
    item.saved = true;
    item.updatedAt = '刚刚已保存';
  });
  syncAttemptProgress(attempt);
  if (showToast) openModal('已保存草稿', '<p>该考生的主观题评分草稿已保存。</p>', null, { hideCancel: true, confirmText: '知道了' });
}

function submitStudentReviewAll() {
  const attempt = getActiveAttempt();
  saveStudentReviewDraft(false);
  const items = ensureAttemptReviewItems(attempt);
  const missing = items.filter(item => item.score === '').length;
  if (missing > 0) {
    openModal('还有题目未评分', `<p>当前考生还有 <strong>${missing}</strong> 道主观题未填写得分，请补全后再提交。</p>`, null, { hideCancel: true, confirmText: '继续评分' });
    return;
  }
  syncAttemptProgress(attempt);
  openModal('评分已提交', `<p>${attempt.student} 的主观题评分已提交，当前总分 <strong>${getAttemptReviewStats(attempt).totalScore}</strong> 分。</p>`, () => navigateTo(getReviewStudentListPage()), { confirmText: '返回考生列表' });
}

function initAttemptReviewHotkeys() {
  document.onkeydown = (event) => {
    if (!String(currentPage || '').includes('marking') || String(currentPage || '').includes('question-marking')) return;
    const tag = event.target?.tagName?.toLowerCase();
    const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select';
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      saveAttemptReviewNow();
      return;
    }
    if (attemptReviewMode === 'paper') return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      goNextAttemptQuestion();
      return;
    }
    if (isTyping) return;
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      moveAttemptQuestion(-1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      moveAttemptQuestion(1);
    }
  };
}

function selectQuestionAnswer(answerId) {
  const q = getActiveReviewQuestion();
  const answer = q.answers.find(a => a.id === answerId);
  if (!answer) return;
  questionReviewAnswerId = answerId;
  questionReviewScore = answer.score !== undefined ? String(answer.score) : '';
  questionReviewComment = '';
  document.getElementById('mainContent').innerHTML = renderQuestionReviewMarkingPage();
}

function setQuestionReviewFilter(filter) {
  questionReviewFilter = filter;
  document.getElementById('mainContent').innerHTML = renderQuestionReviewMarkingPage();
}

function setQuestionReviewSearch(value) {
  questionReviewSearch = value;
  document.getElementById('mainContent').innerHTML = renderQuestionReviewMarkingPage();
}

function queueQuestionReviewSearch(value) {
  questionReviewSearch = value;
  if (questionReviewSearchTimer) clearTimeout(questionReviewSearchTimer);
  questionReviewSearchTimer = setTimeout(() => {
    document.getElementById('mainContent').innerHTML = renderQuestionReviewMarkingPage();
  }, 200);
}

function setQuestionReviewSort(value) {
  questionReviewSort = value;
  document.getElementById('mainContent').innerHTML = renderQuestionReviewMarkingPage();
}

function setQuestionReviewScore(score) {
  questionReviewScore = String(score);
  const input = document.getElementById('questionReviewScoreInput');
  if (input) input.value = questionReviewScore;
}

function applyQuestionQuickScore(score) {
  setQuestionReviewScore(score);
}

function adjustQuestionReviewScore(delta) {
  const max = getActiveReviewQuestion().score;
  const current = document.getElementById('questionReviewScoreInput')?.value || questionReviewScore || 0;
  setQuestionReviewScore(Math.max(0, Math.min(max, Number(current) + delta)));
}

function useQuestionReviewComment(text) {
  if (!text) return;
  questionReviewComment = text;
  const input = document.getElementById('questionReviewCommentInput');
  if (input) input.value = text;
}

function toggleQuestionAnswerDispute(checked) {
  const q = getActiveReviewQuestion();
  const answer = q.answers.find(a => a.id === questionReviewAnswerId);
  if (!answer) return;
  answer.status = checked ? '有争议' : (answer.score !== undefined ? '已批阅' : '待批阅');
  document.getElementById('mainContent').innerHTML = renderQuestionReviewMarkingPage();
}

function switchQuestionAnswerByOffset(offset) {
  const q = getActiveReviewQuestion();
  const idx = q.answers.findIndex(a => a.id === questionReviewAnswerId);
  if (idx < 0) return;
  const next = q.answers[Math.max(0, Math.min(q.answers.length - 1, idx + offset))];
  if (next) selectQuestionAnswer(next.id);
}

function switchReviewQuestion(offset) {
  const current = getActiveReviewQuestion();
  const idx = REVIEW_QUESTIONS.findIndex(q => q.id === current.id);
  const next = REVIEW_QUESTIONS[Math.max(0, Math.min(REVIEW_QUESTIONS.length - 1, idx + offset))];
  if (next && next.id !== current.id) startQuestionReview(next.id);
}

function copyQuestionAnswer() {
  const q = getActiveReviewQuestion();
  const answer = q.answers.find(a => a.id === questionReviewAnswerId);
  const text = answer?.answer || '';
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text);
  openModal('已复制答案', '<p>考生答案已复制到剪贴板。</p>', null, { hideCancel: true, confirmText: '知道了' });
}

function initQuestionReviewHotkeys() {
  document.onkeydown = (event) => {
    if (!String(currentPage || '').includes('question-marking')) return;
    const tag = event.target?.tagName?.toLowerCase();
    const isTyping = tag === 'input' || tag === 'textarea' || tag === 'select';
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      submitQuestionReviewScore(true);
      return;
    }
    if (isTyping) return;
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      switchQuestionAnswerByOffset(-1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      switchQuestionAnswerByOffset(1);
    } else if (event.key.toLowerCase() === 'f') {
      event.preventDefault();
      applyQuestionQuickScore(getActiveReviewQuestion().score);
    } else if (event.key.toLowerCase() === 'h') {
      event.preventDefault();
      applyQuestionQuickScore(Math.round(getActiveReviewQuestion().score / 2));
    } else if (event.key.toLowerCase() === 'z') {
      event.preventDefault();
      applyQuestionQuickScore(0);
    }
  };
}

function submitQuestionReviewScore(goNext = false) {
  const q = getActiveReviewQuestion();
  const answer = q.answers.find(a => a.id === questionReviewAnswerId);
  const score = document.getElementById('questionReviewScoreInput')?.value;
  const comment = document.getElementById('questionReviewCommentInput')?.value || '';
  if (!answer) return;
  if (score === '') {
    openModal('请填写得分', '<p>请填写得分后再保存评分。</p>', null, { hideCancel: true, confirmText: '知道了' });
    return;
  }
  if (Number(score) < 0 || Number(score) > q.score) {
    openModal('请检查得分', `<p>得分不能超过题目满分，需填写 0 至 ${q.score} 之间的数字。</p>`, null, { hideCancel: true, confirmText: '知道了' });
    return;
  }
  answer.status = '已批阅';
  answer.score = Number(score);
  answer.comment = comment;
  answer.reviewTime = '2024-03-01 14:10:00';
  q.pending = Math.max(0, q.answers.filter(a => a.status === '待批阅').length);
  q.reviewed = q.answers.length - q.pending;
  if (goNext) {
    const next = q.answers.find(a => a.status === '待批阅') || q.answers[q.answers.findIndex(a => a.id === answer.id) + 1];
    if (next) {
      questionReviewAnswerId = next.id;
      questionReviewScore = '';
      questionReviewComment = '';
      document.getElementById('mainContent').innerHTML = renderQuestionReviewMarkingPage();
      return;
    }
  }
  questionReviewScore = String(score);
  questionReviewComment = comment;
  document.getElementById('mainContent').innerHTML = renderQuestionReviewMarkingPage();
}

function setReviewScore(score) {
  reviewScore = String(score);
  const input = document.getElementById('reviewScoreInput');
  if (input) input.value = reviewScore;
}

function adjustReviewScore(delta) {
  const max = REVIEW_MARKING.score;
  const next = Math.max(0, Math.min(max, Number(reviewScore || 0) + delta));
  setReviewScore(next);
}

function submitReviewScore() {
  const score = document.getElementById('reviewScoreInput')?.value;
  const comment = document.getElementById('reviewCommentInput')?.value || '';
  if (score === '' || Number(score) < 0 || Number(score) > REVIEW_MARKING.score) {
    openModal('请检查得分', `<p>得分需填写 0 至 ${REVIEW_MARKING.score} 之间的数字。</p>`, null, { hideCancel: true, confirmText: '知道了' });
    return;
  }
  reviewScore = score;
  reviewComment = comment;
  openModal('评分已提交', `<p>${REVIEW_MARKING.studentName} ${REVIEW_MARKING.no} 已评分：<strong>${score}</strong> 分。</p>`, () => navigateTo(getReviewStudentListPage()), { confirmText: '返回考生列表' });
}
