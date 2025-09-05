# Rise Empire Video Factory

A comprehensive web application for generating motivational YouTube content for the Rise Empire channel. This tool creates everything you need for viral motivational shorts including scripts, image prompts, music suggestions, and SEO optimization.

## Features

- 🎬 **Complete Video Generation**: Creates professional motivational videos with images, voice, and music
- 🎨 **AI Image Generation**: Uses Google AI Studio to generate cinematic motivational images
- 🎤 **Voice Generation**: ElevenLabs integration for professional voiceovers
- 🎵 **Music Integration**: Calm background music with perfect audio balance
- 📝 **Content Planning**: JSON-based content management with prompts and details
- 🏷️ **SEO Optimization**: Automatic tag generation for YouTube optimization
- 🎯 **Professional Logo**: Custom Rise Empire logo with lion and rising sun design

## Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```

3. **Open in Browser**:
   ```
   http://localhost:3000
   ```

## Netlify Deployment

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Use these build settings:
     - **Build command**: `npm run netlify-build`
     - **Publish directory**: `dist`
     - **Node version**: `18`

3. **Environment Variables**:
   Add these in Netlify dashboard under Site settings > Environment variables:
   ```
   GOOGLE_AI_API_KEY=your_google_ai_key
   ELEVENLABS_API_KEY=your_elevenlabs_key
   ELEVENLABS_AGENT_ID=your_agent_id
   MUSIC_API_KEY=your_music_key
   FIREBASE_API_KEY=your_firebase_key
   ```

### Option 2: Manual Deploy

1. **Build the Project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop the `dist` folder to [netlify.com/drop](https://netlify.com/drop)
   - Or use Netlify CLI: `netlify deploy --prod --dir=dist`

## ⚠️ Important Notes for Netlify Deployment

- **Video Generation**: Full video generation with FFmpeg requires server-side processing and won't work on Netlify
- **Content Processing**: JSON processing and content generation will work perfectly
- **API Integration**: All API integrations (Google AI, ElevenLabs, etc.) will work
- **For Full Video Generation**: Use the local server version (`node server.js`)

## API Keys Required

You need the following API keys for full functionality:

- **Google AI Studio**: For image generation
- **ElevenLabs**: For voice generation
- **Music API**: For background music
- **Firebase**: For additional services

## Project Structure

```
├── index.html              # Main web application
├── rise-empire-backend.js  # Backend logic
├── server.js               # Express server
├── netlify.toml            # Netlify configuration
├── netlify/
│   └── functions/          # Netlify serverless functions
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Usage

1. **Upload JSON File**: Upload your content JSON with script, title, and settings
2. **Review Content**: Check prompts and details in "Your Real Content" section
3. **Generate Video**: Click "Generate Complete Video" to create all assets
4. **Download**: Download individual assets or the complete video

## Features

- ✅ **Clean Voice Generation**: No line numbers or scene references
- ✅ **Gender Selection**: Male/female voice options from JSON
- ✅ **Creative Images**: Dynamic, keyword-based image prompts
- ✅ **All Images Used**: Video includes all 6 generated images
- ✅ **Professional Logo**: Custom Rise Empire branding
- ✅ **Real Assets**: All generated content is real and usable

## Support

For issues or questions, please check the console logs and ensure all API keys are properly configured.

## License

ISC License - See package.json for details.