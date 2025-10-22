# Design Guidelines: NVTI Kanda Professional School Website

## Design Approach
**Reference-Based + Design System Hybrid**: Drawing inspiration from top-tier educational institutions (MIT, Stanford, Harvard) combined with modern minimalistic design principles. Clean, professional aesthetic that builds trust and credibility.

## Core Design Philosophy
- **Minimalistic Professional**: Generous whitespace, focused content, clear visual hierarchy
- **Trust & Excellence**: Design signals credibility, stability, and educational excellence
- **User-Centric**: Intuitive navigation, clear calls-to-action, accessible information architecture

## Color Palette

**Primary Colors:**
- Navy Blue: 222 73% 29% (primary brand color, headers, CTAs)
- Deep Navy: 222 73% 20% (hover states, footer)
- Light Navy: 222 73% 40% (accents, borders)

**Accent:**
- Gold: 38 95% 48% (secondary CTAs, highlights, badges)
- Light Gold: 38 95% 65% (hover effects)

**Neutrals:**
- Background: 210 20% 98% (main background)
- Light Gray: 220 14% 96% (card backgrounds)
- Medium Gray: 215 16% 47% (body text)
- Dark Gray: 220 25% 12% (headings, primary text)

**Status Colors:**
- Success Green: 142 71% 45% (published posts)
- Warning Amber: 38 92% 50% (draft posts)

## Typography

**Font Families:**
- Headings: Inter (weight: 600-700)
- Body: Inter (weight: 400-500)

**Scale:**
- Hero Headline: text-6xl lg:text-7xl (60-72px)
- Section Headers: text-4xl lg:text-5xl (36-48px)
- Subsection Headers: text-2xl lg:text-3xl (24-36px)
- Card Titles: text-xl lg:text-2xl (20-24px)
- Body Text: text-base lg:text-lg (16-18px)
- Small Text: text-sm (14px)

**Line Heights:**
- Headings: leading-tight (1.2)
- Body: leading-relaxed (1.6)

## Layout System

**Spacing Primitives:**
Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-16 lg:py-24
- Card gaps: gap-6 lg:gap-8
- Element margins: mb-4, mb-6, mb-8

**Container Widths:**
- Full-width sections: w-full with inner max-w-7xl
- Content sections: max-w-6xl
- Text content: max-w-4xl
- Forms: max-w-2xl

**Grid Layouts:**
- Desktop: 3-4 columns (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Tablet: 2 columns
- Mobile: Single column stack

## Component Library

### Hero Section
- Full viewport height (min-h-screen) with gradient overlay
- Large logo placement (w-32 h-32)
- Compelling headline (text-5xl lg:text-7xl font-bold)
- Subheadline mission statement (text-xl lg:text-2xl)
- Dual CTAs: Primary (filled navy) + Secondary (outline with blur)
- Scroll indicator with animation
- Background: High-quality campus/students image with dark overlay (bg-navy-900/50)

### Quick Stats Bar
- Dark navy background (bg-navy-900)
- 4-column grid with count-up animations
- Large numbers (text-4xl font-bold text-gold)
- Icon above number (w-8 h-8)
- Label below (text-sm text-gray-300)

### Cards (Programs, News, Facilities)
- White background with subtle shadow (shadow-md hover:shadow-xl)
- Rounded corners (rounded-lg)
- Image aspect ratio 16:9 or 4:3
- Padding: p-6
- Hover lift effect (hover:-translate-y-1 transition-transform)
- Category badge (rounded-full px-3 py-1 text-xs bg-gold/10 text-gold)

### News Section Layout
- **Featured Story**: 60% width, large card
  - Full-width image (aspect-video)
  - Category badge top-left
  - Large headline (text-2xl)
  - 2-line excerpt
  - Date + Read More link
- **Recent Posts**: 40% width, 3 stacked cards
  - Thumbnail image (w-24 h-24)
  - Compact headline (text-lg)
  - Date + brief excerpt

### Dashboard Components
- **Sidebar**: Fixed left, dark navy bg (bg-navy-900), width w-64
- **Content Area**: ml-64, light background
- **Tables**: Striped rows, hover highlight
- **Forms**: Clean inputs with focus rings (focus:ring-2 ring-navy-500)
- **Rich Text Editor**: White card with toolbar
- **Buttons**: Primary (navy), Secondary (outline), Danger (red for delete)

### Forms
- Input fields: border-gray-300, focus:border-navy-500, rounded-md
- Labels: text-sm font-medium text-gray-700, mb-2
- Validation errors: text-red-600 text-sm mt-1
- Submit buttons: Large, full-width on mobile

### Navigation
- **Header**: Sticky, white bg with shadow on scroll
- Logo left (h-12)
- Menu items center (text-gray-700 hover:text-navy-600)
- CTA button right (navy bg)
- Mobile: Hamburger menu, slide-in drawer

### Footer
- Dark navy background (bg-navy-900)
- 4-column grid on desktop
- Logo and mission statement
- Quick links sections
- Social icons (hover:text-gold)
- Copyright centered

## Animations & Interactions

**Micro-interactions (subtle only):**
- Fade-in on scroll (opacity-0 to opacity-100, duration-700)
- Slide-up on scroll (translate-y-4 to translate-y-0)
- Button hover scale (hover:scale-105 transition-transform)
- Card lift on hover (hover:-translate-y-1)
- Count-up animations for stats (on viewport entry)

**NO excessive animations** - maintain professional feel

## Images

### Hero Section
Large hero image required: Students in classroom/campus setting, professional photography, overlay with navy gradient

### Section Images
- **About**: Students collaborating, modern facility (2-column layout)
- **Programs**: Icon or representative image per course card
- **News**: Featured story full-width, recent posts thumbnails
- **Facilities**: Photo gallery grid (masonry layout), lightbox enabled
- **Testimonials**: Student photos (circular crop, w-16 h-16)
- **Contact**: Background map or campus aerial view

All images: High-quality, professional, from Unsplash education category, proper alt text

## Accessibility
- Semantic HTML5 (header, nav, main, section, footer)
- ARIA labels for icon buttons
- Focus visible states (focus:ring-2 ring-offset-2)
- Minimum touch targets 44x44px
- Color contrast ratio 4.5:1 for text

## Responsive Breakpoints
- Mobile: 640px and below (single column, stacked layouts)
- Tablet: 768px (2-column grids)
- Desktop: 1024px+ (full 3-4 column layouts)
- Large: 1280px+ (max content width)

## Dashboard-Specific Design
- Clean admin aesthetic, data-focused
- Table-heavy layouts with search/filter
- Action buttons grouped (Edit, Delete, View)
- Toast notifications (top-right, slide-in)
- Modal overlays for confirmations (centered, dark backdrop)
- Rich text editor with minimal toolbar
- Image upload: Drag & drop zone with preview