# TURUI 网页动效

标志图形「切」：方块被一条细光缝自上而下划开，两半轻轻打开，字母 TURUI 随后逐字显现。只播放一次，不循环。

## 推荐用法（内联 SVG）

把下面文件的内容直接粘贴进 HTML，并用 CSS 控制宽度：

- 组合标志（图形 + TURUI），浅底：`svg/lockup-animated.svg`
- 组合标志，深底：`svg/lockup-animated-on-dark.svg`
- 仅图形（适合导航栏小尺寸）：`svg/mark-animated.svg` 或 `svg/mark-animated-on-dark.svg`

参考 `web/snippet.html`，以及可在浏览器打开的 `preview.html`。

不要用 `<img src="...svg">` 来引用这些文件，多数浏览器不会播放其中的 CSS 动画。

## 备用：GIF

适合必须使用 `<img>`、邮件或不能内联的场合：

- `png/anim-lockup-light.gif` / `png/anim-lockup-dark.gif`（组合标志）
- `png/anim-light.gif` / `png/anim-dark.gif`（仅图形）

## 无障碍

系统开启「减少动态效果」（prefers-reduced-motion）时，SVG 会跳过动画，直接显示切开后的最终形态。

## 颜色

- 墨色 ink `#141414`
- 纸色 paper `#F4F3EF`
- 深色底 `#121212`
