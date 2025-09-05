const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { RiseEmpireGenerator } = require('./rise-empire-backend');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Initialize generator
const generator = new RiseEmpireGenerator();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Generate video from theme
app.post('/api/generate-video', async (req, res) => {
    try {
        const { theme, content, images, music, voice } = req.body;
        console.log(`🎬 Generating video for theme: ${theme}`);
        
        let result;
        if (content && images && music && voice) {
            // Create video from provided assets
            console.log('Creating video from provided assets...');
            result = await generator.createVideoFromAssets(content, images, music, voice);
        } else {
            // Generate complete video from theme
            console.log('Generating complete video from theme...');
            result = await generator.generateCompleteVideo(theme);
        }
        
        if (result.success) {
            res.json({
                success: true,
                video: result.video,
                assets: result.assets,
                content: result.content
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('❌ Server error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Process JSON file
app.post('/api/process-json', upload.single('jsonFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const jsonData = JSON.parse(fs.readFileSync(req.file.path, 'utf8'));
        
        // Validate JSON structure
        if (!jsonData.title || !jsonData.script) {
            return res.status(400).json({ error: 'Invalid JSON structure' });
        }

        // Convert script to array if it's a string
        let script = jsonData.script;
        if (typeof script === 'string') {
            script = script.split('\n').filter(line => line.trim().length > 0);
        }
        if (!Array.isArray(script)) {
            script = [script];
        }

        if (script.length < 6) {
            return res.status(400).json({ error: 'Script must have at least 6 sentences' });
        }

        // Generate content
        const content = {
            title: jsonData.title,
            script: script,
            keywords: jsonData.keywords || []
        };

        // Generate image prompts
        const imagePrompts = script.map(sentence => 
            `Cinematic motivational scene: ${sentence}, 8K ultra-realistic, professional photography, vertical orientation`
        );

        // Generate all assets
        const [images, voice, music, logo] = await Promise.all([
            generator.generateImages(imagePrompts),
            generator.generateVoice(script, {}),
            generator.generateMusic('Epic cinematic background music, motivational build-up, climax after 30-40 seconds'),
            generator.createLogo()
        ]);

        // Create final video
        const video = await generator.createVideo(images, music, voice, content, logo);

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            video: video,
            assets: {
                images: images,
                voice: voice,
                music: music,
                logo: logo
            },
            content: content
        });

    } catch (error) {
        console.error('❌ JSON processing error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get available themes
app.get('/api/themes', (req, res) => {
    const { RISE_EMPIRE_SCRIPTS } = require('./rise-empire-backend');
    res.json(RISE_EMPIRE_SCRIPTS);
});

// Download generated files
app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(generator.outputDir, filename);
    
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: 'File not found' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Rise Empire Server running at http://localhost:${port}`);
    console.log(`📁 Generated content will be saved to: ${generator.outputDir}`);
});
