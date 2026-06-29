# Element Plus 使用规范

## 一、基础原则

本项目后台页面必须优先使用 Element Plus 组件实现。

除非业务场景确实无法满足，否则不要自行封装与 Element Plus 重复的基础组件。

## 二、常用组件映射

| 业务场景 | Element Plus 组件 |
|---|---|
| 按钮 | el-button |
| 输入框 | el-input |
| 下拉选择 | el-select |
| 单选 | el-radio / el-radio-group |
| 多选 | el-checkbox / el-checkbox-group |
| 日期时间 | el-date-picker |
| 表单 | el-form |
| 表格 | el-table |
| 分页 | el-pagination |
| 弹窗 | el-dialog |
| 抽屉 | el-drawer |
| 标签页 | el-tabs |
| 卡片 | el-card |
| 状态标签 | el-tag |
| 提示 | el-alert / el-tooltip |
| 空状态 | el-empty |
| 消息提示 | ElMessage |
| 确认弹窗 | ElMessageBox |
| 气泡确认 | el-popconfirm |
| 上传 | el-upload |
| 步骤条 | el-steps |
| 开关 | el-switch |

## 三、禁止事项

1. 禁止自行写一套按钮样式替代 `el-button`。
2. 禁止自行写一套输入框样式替代 `el-input`。
3. 禁止自行写一套表格样式替代 `el-table`。
4. 禁止自行写一套分页样式替代 `el-pagination`。
5. 禁止自行写一套弹窗样式替代 `el-dialog`。
6. 禁止自行写一套状态标签样式替代 `el-tag`。
7. 禁止自行用普通 div 模拟空状态，应使用 `el-empty`。

## 四、允许自定义的情况

以下情况可以进行轻量自定义：

1. 业务专属卡片布局。
2. 数据概况统计卡片。
3. 特殊步骤流程。
4. 活动配置类复杂组合组件。
5. 上传预览、富文本、图表等 Element Plus 未完整覆盖的场景。

但即使自定义，也应保持与 Element Plus 视觉风格一致。
