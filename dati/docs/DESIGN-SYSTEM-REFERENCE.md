# Design System Visual Reference

Quick reference guide for common design patterns and component usage.

## Color Palette

### Brand Colors
```
Primary Blue         #2F54EB   var(--color-brand-500)  ┃ Main actions, links
Gold Accent         ┃ #B8956A  ┃ var(--color-gold-500)   ┃ Navigation highlights
```

### Functional Colors
```
Success             ┃ #52C41A  ┃ var(--color-success-500)  ┃ Positive states
Warning             ┃ #FAAD14  ┃ var(--color-warning-500)  ┃ Caution states  
Error               ┃ #F5222D  ┃ var(--color-error-500)    ┃ Destructive actions
Info                ┃ #1890FF  ┃ var(--color-info-500)     ┃ Informational
```

### Neutral Scale
```
Text Primary        ┃ #262626  ┃ var(--color-neutral-850)
Text Secondary      ┃ #595959  ┃ var(--color-neutral-700)
Text Tertiary       ┃ #8C8C8C  ┃ var(--color-neutral-600)
Border              ┃ #E8E8E8  ┃ var(--color-neutral-300)
Background App      ┃ #F5F6F8  ┃ var(--bg-app)
Background Card     ┃ #FFFFFF  ┃ var(--color-neutral-0)
```

## Typography Examples

```html
<!-- Page Title -->
<h1 style="font-size:var(--font-size-xl); font-weight:var(--font-weight-bold)">
  页面标题
</h1>

<!-- Section Header -->
<h2 style="font-size:var(--font-size-md); font-weight:var(--font-weight-semibold)">
  章节标题
</h2>

<!-- Body Text -->
<p style="font-size:var(--font-size-base); line-height:var(--line-height-base)">
  正文内容
</p>

<!-- Meta Text -->
<span style="font-size:var(--font-size-xs); color:var(--text-tertiary)">
  辅助信息
</span>
```

## Spacing Examples

```html
<!-- Tight spacing (related items) -->
<div style="display:flex; gap:var(--spacing-xxs)">4px gap</div>
<div style="display:flex; gap:var(--spacing-xs)">8px gap</div>

<!-- Standard spacing (form elements) -->
<div style="display:flex; gap:var(--spacing-sm)">12px gap</div>
<div style="display:flex; gap:var(--spacing-md)">16px gap</div>

<!-- Loose spacing (sections) -->
<div style="margin-bottom:var(--spacing-xl)">24px margin</div>
<div style="margin-bottom:var(--spacing-2xl)">32px margin</div>
```

## Button Variants

```html
<!-- Primary Button -->
<button class="btn btn-primary">主要按钮</button>

<!-- Success Button -->
<button class="btn btn-success">成功按钮</button>

<!-- Warning Button -->
<button class="btn btn-warning">警告按钮</button>

<!-- Danger Button -->
<button class="btn btn-danger">危险按钮</button>

<!-- Ghost Button -->
<button class="btn btn-ghost">幽灵按钮</button>

<!-- Outline Button -->
<button class="btn btn-outline">描边按钮</button>

<!-- Gold Outline Button -->
<button class="btn btn-outline-gold">金色描边</button>

<!-- Small Button -->
<button class="btn btn-primary btn-sm">小按钮</button>

<!-- Large Button -->
<button class="btn btn-primary btn-lg">大按钮</button>
```

## Badge Variants

```html
<!-- Blue Badge -->
<span class="badge badge-blue">蓝色徽章</span>

<!-- Green Badge -->
<span class="badge badge-green">绿色徽章</span>

<!-- Yellow Badge -->
<span class="badge badge-yellow">黄色徽章</span>

<!-- Red Badge -->
<span class="badge badge-red">红色徽章</span>

<!-- Gray Badge -->
<span class="badge badge-gray">灰色徽章</span>

<!-- Gold Badge -->
<span class="badge badge-gold">金色徽章</span>
```

## Card Pattern

```html
<div class="card">
  <div style="font-size:var(--font-size-md); font-weight:var(--font-weight-semibold); margin-bottom:var(--spacing-md)">
    卡片标题
  </div>
  <p style="color:var(--text-secondary)">
    卡片内容...
  </p>
</div>
```

## Form Pattern

```html
<div class="form-group">
  <label>
    字段名称
    <span class="req">*</span>
  </label>
  <input type="text" class="form-control" placeholder="请输入...">
  <div class="hint">辅助说明文字</div>
</div>
```

## Table Pattern

```html
<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>列标题 1</th>
        <th>列标题 2</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>数据 1</td>
        <td>数据 2</td>
        <td>
          <span class="action-link">编辑</span>
          <span class="action-link danger">删除</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## Stat Card Pattern

```html
<div class="stat-grid">
  <div class="stat-card">
    <h3>180</h3>
    <p>总活动数量</p>
  </div>
  <div class="stat-card">
    <h3>528</h3>
    <p>参与人数</p>
  </div>
  <div class="stat-card">
    <h3>73.1%</h3>
    <p>完成率</p>
  </div>
  <div class="stat-card">
    <h3>85.2</h3>
    <p>平均分</p>
  </div>
</div>
```

## Info Box Pattern

```html
<!-- Blue Info Box -->
<div class="info-box blue">
  蓝色信息提示框
</div>

<!-- Yellow Warning Box -->
<div class="info-box yellow">
  黄色警告提示框
</div>

<!-- Green Success Box -->
<div class="info-box green">
  绿色成功提示框
</div>

<!-- Red Error Box -->
<div class="info-box red">
  红色错误提示框
</div>
```

## Responsive Grid

```html
<!-- 4 Column Grid -->
<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:var(--spacing-md)">
  <div>列 1</div>
  <div>列 2</div>
  <div>列 3</div>
  <div>列 4</div>
</div>

<!-- 3 Column Grid -->
<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:var(--spacing-md)">
  <div>列 1</div>
  <div>列 2</div>
  <div>列 3</div>
</div>

<!-- 2 Column Grid -->
<div style="display:grid; grid-template-columns:repeat(2,1fr); gap:var(--spacing-md)">
  <div>列 1</div>
  <div>列 2</div>
</div>
```

## Modal Pattern

```javascript
// Open Modal
document.getElementById('modalTitle').textContent = '模态框标题';
document.getElementById('modalBody').innerHTML = '模态框内容...';
document.getElementById('modalOverlay').classList.add('show');

// Close Modal
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}
```

## Common Patterns

### Page Header with Breadcrumb
```html
<div class="page-header">
  <div>
    <h2>页面标题</h2>
    <div class="breadcrumb">首页 / 模块 / 页面</div>
  </div>
  <button class="btn btn-primary">操作按钮</button>
</div>
```

### Filter Bar
```html
<div class="card" style="padding:var(--spacing-lg); margin-bottom:var(--spacing-lg)">
  <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:var(--spacing-md)">
    <div class="form-group">
      <label>筛选条件 1</label>
      <input type="text" class="form-control" placeholder="请输入...">
    </div>
    <div class="form-group">
      <label>筛选条件 2</label>
      <select class="form-control">
        <option>选项 1</option>
        <option>选项 2</option>
      </select>
    </div>
  </div>
  <div style="display:flex; justify-content:flex-end; gap:var(--spacing-xs); margin-top:var(--spacing-md)">
    <button class="btn btn-primary">搜索</button>
    <button class="btn btn-ghost">重置</button>
  </div>
</div>
```

### Action Bar
```html
<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--spacing-lg)">
  <button class="btn btn-primary">+ 创建</button>
  <div class="btn-group">
    <button class="btn btn-outline btn-sm">操作 1</button>
    <button class="btn btn-outline btn-sm">操作 2</button>
  </div>
</div>
```

## Migration Checklist

When updating existing pages to use the design system:

- [ ] Replace hardcoded colors with design tokens
- [ ] Replace pixel spacing with spacing tokens
- [ ] Replace hardcoded font sizes with typography tokens
- [ ] Replace basic shadows with shadow tokens
- [ ] Replace basic border-radius with radius tokens
- [ ] Add hover states to interactive elements
- [ ] Add focus states to form elements
- [ ] Use component classes (btn, card, badge, etc.)
- [ ] Ensure responsive behavior
- [ ] Test accessibility (contrast, focus, keyboard)

## Quick Token Reference

### Most Common Tokens

```css
/* Colors */
var(--primary)           /* Primary blue */
var(--success)           /* Success green */
var(--warning)           /* Warning yellow */
var(--danger)            /* Error red */
var(--text-primary)      /* Main text */
var(--text-secondary)    /* Secondary text */
var(--text-tertiary)     /* Meta text */
var(--bg-app)            /* Page background */
var(--bg-card)           /* Card background */
var(--border-color)      /* Standard border */

/* Spacing */
var(--spacing-xs)        /* 8px */
var(--spacing-sm)        /* 12px */
var(--spacing-md)        /* 16px */
var(--spacing-lg)        /* 20px */
var(--spacing-xl)        /* 24px */
var(--spacing-2xl)       /* 32px */

/* Typography */
var(--font-size-xs)      /* 12px */
var(--font-size-sm)      /* 13px */
var(--font-size-base)    /* 14px */
var(--font-size-md)      /* 16px */
var(--font-size-xl)      /* 20px */

/* Borders */
var(--radius-sm)         /* 4px */
var(--radius-md)         /* 6px */
var(--radius-lg)         /* 8px */
var(--radius-xl)         /* 12px */

/* Shadows */
var(--shadow-xs)         /* Top nav */
var(--shadow-sm)         /* Default card */
var(--shadow-md)         /* Hover card */
var(--shadow-lg)         /* Dropdown */
var(--shadow-xl)         /* Modal */
```

---

**Tip**: When in doubt, always use design tokens instead of hardcoded values. This ensures consistency and makes future theme changes effortless.
