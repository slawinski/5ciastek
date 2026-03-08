# Responsive Breakpoints & PostCSS

This project uses `postcss-custom-media` to enable maintainable, variable-based breakpoints. 

## Variable Definitions
All shared breakpoints are defined in:
`src/media-queries.css`

```css
@custom-media --tablet (min-width: 768px);
@custom-media --laptop (min-width: 1024px);
@custom-media --desktop (min-width: 1440px);
@custom-media --wide (min-width: 1920px);

/* Helper aliases */
@custom-media --mobile-only (max-width: 767px);
@custom-media --compact (max-width: 640px);
```

## How to Use
Instead of hardcoding pixel values like `@media (min-width: 1024px)`, use the custom media variables:

```css
/* In any .module.css file */
.myComponent {
  padding: 10px;
}

@media (--laptop) {
  .myComponent {
    padding: 40px;
  }
}
```

## Why?
Native CSS variables (`--var`) cannot be used in media queries. This PostCSS plugin allows us to use a similar syntax that is processed at build time, ensuring consistency across the entire codebase.
