---
description: 网站全面优化审核工作流
---

# 网站全面优化审核工作流

本工作流用于对 Web 项目进行性能、可访问性、SEO 和代码质量的全面审核与优化。

## 1. 准备阶段
- [ ] 确保项目可本地运行 (`npm run dev`)
- [ ] 截取关键页面基准截图（Desktop/Mobile）

## 2. 性能优化
// turbo
- [ ] **Vite 配置**: 检查 `vite.config.ts`，配置 `manualChunks` 拆分 vendor 和 UI 库。
- [ ] **图片优化**: 检查 `<img>` 标签，非首屏图片添加 `loading="lazy"`。
- [ ] **资源预连接**: 在 `index.html` 添加第三方域名的 `preconnect` 链接。

## 3. SEO 与 Meta
- [ ] **Meta 标签**: 完善 `description`, `keywords`, `author`, `og:*` 标签。
- [ ] **Lang 属性**: 确保 `<html>` 标签 `lang` 属性正确（如 `zh-CN`）。

## 4. 可访问性 (A11y)
- [ ] **交互元素**: 确保所有 `button`, `a` 标签有清晰的 `aria-label`。
- [ ] **键盘导航**: 确保自定义组件支持 `Tab` 键聚焦和 `Enter`/`Space` 键激活。
- [ ] **ARIA Role**: 为非原生交互元素（如 `div` 按钮）添加 `role="button"`。

## 5. 代码质量
// turbo
- [ ] **Lint**: 运行 `npm run lint` 并修复所有错误。
// turbo
- [ ] **Type Check**: 运行 `tsc` (或 `npm run build`) 确保无类型错误。
- [ ] **清理**: 移除未使用的 CSS 文件和死代码。

## 6. 验证
// turbo
- [ ] 运行构建命令 (`npm run build`) 验证无误。
- [ ] 再次截取截图并与基准对比，确保无视觉回退。
