# Ring Customizer React Client

A modern React + Tailwind CSS ring customization interface with Supabase integration.

## Features

- **Step-by-step customization**: Metal → Design → Shape → Carat
- **Real-time preview**: Ring image updates as you make selections
- **Supabase integration**: Scalable image storage and metadata management
- **Responsive design**: Works on desktop and mobile
- **Professional UI**: Inspired by Brilliant Earth design

## Setup

1. **Install dependencies**:
   ```bash
   cd client
   npm install
   ```

2. **Configure Supabase** (optional for development):
   Create a `.env` file in the client directory:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Image Organization

Ring images are organized in Supabase Storage under:
```
/rings/{metal}/{design}/{shape}/weight-{carat}.png
```

Example:
- `/rings/white-gold/halo/round/weight-1.5.png`
- `/rings/yellow-gold/solitaire/princess/weight-2.0.png`

## Database Schema

The `ring_images` table in Supabase should have:
- `id` (UUID)
- `metal` (text)
- `design` (text)
- `diamond_shape` (text)
- `carat` (text)
- `image_url` (text)

## Components

- `RingCustomizer`: Main component with step-by-step interface
- `RingPreview`: Live ring preview with specifications
- `CustomizationStep`: Options selection for each step
- `ProgressBar`: Visual progress indicator

## Styling

Uses Tailwind CSS with custom design system:
- Primary colors: Orange/gold theme
- Typography: Inter (sans) + Playfair Display (serif)
- Shadows: Soft and elegant
- Responsive: Mobile-first design 