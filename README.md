# Ring Customizer - Progressive Image E-commerce

A modern React-based ring customization platform with progressive image updates, inspired by Brilliant Earth. Users can customize rings step-by-step and see real-time visual updates as they make selections.

## Features

### Client Side
- **4-Step Customization Process**: Metal → Design → Diamond Shape → Carat Weight
- **Progressive Image Updates**: Ring image builds up progressively as selections are made
- **Visual Progress Indicator**: Shows completion status for each step
- **Real-time Preview**: Live ring preview with current selections
- **Modern UI**: Clean, responsive design with Tailwind CSS

### Admin Panel
- **Image Upload System**: Upload images for each ring combination
- **Progressive Structure**: Images organized by Metal → Design → Shape → Carat
- **Duplicate Prevention**: Prevents uploading duplicate combinations
- **Image Management**: View, delete, and manage uploaded images
- **Preview System**: Preview images before upload

## Image Structure

```
/images/
├── white-gold/
│   ├── band.png                    ← Just white gold band
│   ├── classic-solitaire/
│   │   ├── band.png               ← White gold classic band
│   │   ├── round/
│   │   │   ├── band.png          ← White gold classic round setting
│   │   │   ├── 1.0ct.png         ← Complete ring with 1.0ct diamond
│   │   │   ├── 1.5ct.png         ← Complete ring with 1.5ct diamond
│   │   │   ├── 2.0ct.png         ← Complete ring with 2.0ct diamond
│   │   │   └── 2.5ct.png         ← Complete ring with 2.5ct diamond
│   │   └── princess/
│   │       ├── band.png          ← White gold classic princess setting
│   │       ├── 1.0ct.png         ← Complete ring with 1.0ct princess
│   │       └── [other carats...]
│   │   └── [other designs...]
├── yellow-gold/
├── rose-gold/
└── platinum/
```

## Ring Options

### Metals (4 options)
- White Gold (14K/18K)
- Yellow Gold (14K/18K)
- Rose Gold (14K/18K)
- Platinum (950)

### Designs (4 options)
- Classic Solitaire
- Halo Setting
- Vintage/Antique Style
- Three Stone (Trinity)

### Diamond Shapes (4 options)
- Round Brilliant Cut
- Princess Cut (Square)
- Emerald Cut (Rectangular)
- Oval Brilliant Cut

### Carat Weights (4 options)
- 1.0 Carat
- 1.5 Carat
- 2.0 Carat
- 2.5 Carat

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install
```

### 2. Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)

2. **Run the SQL setup script**:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase-setup.sql`
   - Run the script

3. **Create Storage Bucket**:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket called `ring-images`
   - Set it as a public bucket

4. **Get your Supabase credentials**:
   - Go to Settings → API
   - Copy your Project URL and anon public key

### 3. Environment Configuration

Create a `.env` file in the `client` directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start the Application

```bash
# Start the development server
npm start
```

The application will be available at:
- **Ring Customizer**: http://localhost:3000/
- **Admin Panel**: http://localhost:3000/admin

## Usage

### For Clients
1. Visit http://localhost:3000/
2. Start by selecting a metal type
3. Choose a ring design
4. Select a diamond shape
5. Pick a carat weight
6. See the ring build up progressively at each step

### For Admins
1. Visit http://localhost:3000/admin
2. Upload images for each ring combination:
   - Select metal type (required)
   - Choose design (optional - for progressive updates)
   - Select diamond shape (optional - for progressive updates)
   - Pick carat weight (optional - for progressive updates)
   - Upload the corresponding image
3. Manage uploaded images in the table below

## Image Upload Guidelines

### Progressive Image Structure
- **Metal only**: Shows just the metal band (e.g., `rings/white-gold/band.png`)
- **Metal + Design**: Shows the design band (e.g., `rings/white-gold/classic-solitaire/band.png`)
- **Metal + Design + Shape**: Shows the setting (e.g., `rings/white-gold/classic-solitaire/round/band.png`)
- **Metal + Design + Shape + Carat**: Shows the complete ring (e.g., `rings/white-gold/classic-solitaire/round/1.0ct.png`)

### Image Requirements
- Format: PNG (recommended) or JPG
- Size: Recommended 800x800px or larger
- Background: Transparent or white background
- Quality: High resolution for best display

## Development

### Project Structure
```
client/
├── src/
│   ├── components/
│   │   ├── RingCustomizer.js    # Main customizer component
│   │   ├── AdminPanel.js        # Admin panel for image uploads
│   │   ├── RingPreview.js       # Ring image preview
│   │   ├── ProgressBar.js       # Step progress indicator
│   │   └── CustomizationStep.js # Individual step component
│   ├── lib/
│   │   └── supabaseClient.js    # Supabase configuration
│   └── App.js                   # Main app with routing
├── public/
│   └── placeholder-ring.png     # Fallback image
└── package.json
```

### Key Technologies
- **React 18** - Frontend framework
- **Tailwind CSS** - Styling
- **Supabase** - Backend (database + storage)
- **React Router** - Client-side routing

## Production Deployment

### Pre-deployment Checklist
- [ ] All environment variables are configured
- [ ] Supabase database is properly set up
- [ ] Storage bucket is configured and public
- [ ] Admin emails are configured
- [ ] SSL certificate is enabled (for HTTPS)

### Environment Setup
1. Copy `env.example` to `.env` in the client directory
2. Fill in all required environment variables:
   ```bash
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_ADMIN_EMAILS=admin@yourdomain.com,admin2@yourdomain.com
   ```

### Build for Production
```bash
cd client
npm install
npm run build
```

### Deploy Options

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Netlify
1. Drag and drop the `build` folder to Netlify
2. Set environment variables in Netlify dashboard
3. Configure custom domain if needed

#### AWS S3 + CloudFront
1. Upload `build` folder to S3 bucket
2. Configure CloudFront distribution
3. Set up custom domain with SSL

#### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Security Considerations
- ✅ Environment variables are properly configured
- ✅ Admin access is restricted to authorized emails
- ✅ Input validation is implemented
- ✅ Error boundaries are in place
- ✅ HTTPS is enforced in production
- ✅ CORS is properly configured in Supabase

### Performance Optimization
- ✅ Code splitting with lazy loading
- ✅ Optimized images and assets
- ✅ Minified production build
- ✅ CDN for static assets
- ✅ Proper caching headers

## Troubleshooting

### Common Issues

1. **Port 3000 in use**:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:3000 | xargs kill -9
   ```

2. **Supabase connection issues**:
   - Verify your environment variables
   - Check that your Supabase project is active
   - Ensure RLS policies are correctly set

3. **Image upload failures**:
   - Check file size (should be under 5MB)
   - Verify file format (PNG/JPG)
   - Ensure Supabase storage bucket exists and is public

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 