const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
// Use built-in fetch for Node.js 18+
const fetch = globalThis.fetch || require('node-fetch');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const RiseEmpireImageGenerator = require('./image-generator');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// API Configuration
const GOOGLE_AI_API_KEY = config.GOOGLE_AI_API_KEY;
const ELEVENLABS_API_KEY = config.ELEVENLABS_API_KEY;
const ELEVENLABS_AGENT_ID = config.ELEVENLABS_AGENT_ID;

// Initialize clients
const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);
const elevenlabs = new ElevenLabsClient({
    apiKey: ELEVENLABS_API_KEY
});

// Rise Empire Scripts Database
const RISE_EMPIRE_SCRIPTS = {
    discipline: {
        title: "Discipline Over Motivation",
        script: [
            "Discipline is the bridge between goals and accomplishment.",
            "While others sleep, you grind. While others quit, you persist.",
            "Motivation gets you started, but discipline keeps you going.",
            "Every day you choose discipline, you choose your future self.",
            "The pain of discipline is temporary, the pain of regret is permanent.",
            "Rise Empire is built on discipline, not dreams."
        ],
        keywords: ["discipline", "motivation", "grind", "persistence", "goals", "accomplishment"],
        icon: "💪"
    },
    fear: {
        title: "Fear is a Liar",
        script: [
            "Fear is not real. It's a product of thoughts you create.",
            "Do not let fear control your destiny. Control your fear.",
            "The only thing to fear is never trying at all.",
            "Courage is not the absence of fear, but action despite it.",
            "Your comfort zone is your enemy. Break free from it.",
            "Rise Empire means facing every fear and conquering it."
        ],
        keywords: ["fear", "courage", "comfort zone", "destiny", "trying", "conquering"],
        icon: "🔥"
    },
    success: {
        title: "Success is a Choice",
        script: [
            "Success is not an accident. It's a choice you make daily.",
            "Every champion was once a beginner who refused to give up.",
            "Your success is determined by your daily habits, not your dreams.",
            "Success requires sacrifice, discipline, and unwavering commitment.",
            "The difference between winners and losers is persistence.",
            "Rise Empire by choosing success every single day."
        ],
        keywords: ["success", "choice", "champion", "habits", "sacrifice", "winners"],
        icon: "👑"
    }
};

class RiseEmpireGenerator {
    constructor() {
        this.outputDir = path.join(__dirname, 'generated-content');
        this.ensureOutputDir();
        this.imageGenerator = new RiseEmpireImageGenerator(this.outputDir);
    }

    ensureOutputDir() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
    }

    // Generate Image Prompts from Script
    generateImagePrompts(script) {
        const scriptArray = Array.isArray(script) ? script : [script];
        return scriptArray.map((sentence, index) => {
            const keywords = sentence.toLowerCase().split(' ').filter(word => 
                word.length > 3 && 
                !['the', 'and', 'you', 'are', 'for', 'with', 'this', 'that', 'from', 'they', 'have', 'been', 'will', 'your', 'into', 'time', 'more', 'very', 'what', 'know', 'just', 'first', 'also', 'after', 'back', 'well', 'work', 'life', 'make', 'take', 'come', 'look', 'want', 'give', 'use', 'find', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call', 'good', 'new', 'first', 'last', 'long', 'great', 'little', 'own', 'other', 'old', 'right', 'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young', 'important', 'few', 'public', 'bad', 'same', 'able'].includes(word)
            );
            
            return `Creative motivational masterpiece: ${sentence}, featuring ${keywords.slice(0, 3).join(', ')}, dramatic cinematic lighting, 8K ultra-realistic, professional photography, vertical orientation, inspiring atmosphere`;
        });
    }

    // Generate Images with Google AI
    async generateImages(imagePrompts) {
        console.log('🎨 Generating images with Google AI...');
        const generatedImages = [];

        for (let i = 0; i < imagePrompts.length; i++) {
            try {
                const prompt = imagePrompts[i] + ', 8K ultra-realistic, cinematic quality, motivational atmosphere, professional photography, vertical orientation, 9:16 aspect ratio';
                
                console.log(`Generating image ${i + 1}: ${prompt.substring(0, 50)}...`);

                // Use Gemini 2.0 Flash for image generation with proper prompt
                const model = genAI.getGenerativeModel({ 
                    model: "gemini-2.0-flash-exp-image-generation" 
                });

                // Create a more specific prompt for image generation
                const imagePrompt = `Generate a high-quality 8K cinematic image: ${prompt}. The image should be vertical (9:16 aspect ratio), ultra-realistic, motivational atmosphere, professional photography quality, cinematic lighting, dramatic composition.`;

                const result = await model.generateContent(imagePrompt);
                const response = await result.response;
                
                // Check if we got an image
                if (response.candidates && response.candidates[0] && response.candidates[0].content) {
                    const content = response.candidates[0].content;
                    if (content.parts && content.parts[0]) {
                        const part = content.parts[0];
                        
                        if (part.inlineData && part.inlineData.data) {
                            // Save base64 image
                            const imageBuffer = Buffer.from(part.inlineData.data, 'base64');
                            const imagePath = path.join(this.outputDir, `image_${i + 1}.jpg`);
                            fs.writeFileSync(imagePath, imageBuffer);
                            
                            generatedImages.push({
                                prompt: imagePrompts[i],
                                imagePath: imagePath,
                                index: i + 1,
                                real: true,
                                source: 'Google AI'
                            });
                            
                            console.log(`✅ Image ${i + 1} generated successfully`);
                        } else if (part.text) {
                            console.log(`⚠️ Got text response for image ${i + 1}, using Rise Empire image generator`);
                            // Use our custom Rise Empire image generator
                            try {
                                const motivationalImage = await this.imageGenerator.generateMotivationalImage(imagePrompts[i], i + 1);
                                generatedImages.push(motivationalImage);
                            } catch (genError) {
                                console.log(`Rise Empire image generator failed, using canvas fallback`);
                                const fallbackImage = await this.generateFallbackImage(imagePrompts[i], i + 1);
                                generatedImages.push(fallbackImage);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(`❌ Error generating image ${i + 1}:`, error.message);
                // Use Rise Empire image generator as fallback
                try {
                    const motivationalImage = await this.imageGenerator.generateMotivationalImage(imagePrompts[i], i + 1);
                    generatedImages.push(motivationalImage);
                } catch (genError) {
                    console.log(`Rise Empire image generator failed, using canvas fallback`);
                    const fallbackImage = await this.generateFallbackImage(imagePrompts[i], i + 1);
                    generatedImages.push(fallbackImage);
                }
            }
        }

        return generatedImages;
    }

    // Generate alternative image using real image APIs
    async generateAlternativeImage(prompt, index) {
        try {
            console.log(`🎨 Generating alternative image ${index}...`);
            
            // Try multiple image generation services
            const services = [
                {
                    name: 'Unsplash API',
                    url: 'https://api.unsplash.com/photos/random',
                    headers: {
                        'Authorization': 'Client-ID YOUR_UNSPLASH_ACCESS_KEY', // You'd need to get this
                        'Accept-Version': 'v1'
                    },
                    params: {
                        query: prompt.split(' ').slice(0, 3).join(' '),
                        orientation: 'portrait',
                        w: 1080,
                        h: 1920
                    }
                },
                {
                    name: 'Pexels API',
                    url: 'https://api.pexels.com/v1/search',
                    headers: {
                        'Authorization': 'YOUR_PEXELS_API_KEY' // You'd need to get this
                    },
                    params: {
                        query: prompt.split(' ').slice(0, 3).join(' '),
                        orientation: 'portrait',
                        per_page: 1,
                        size: 'large'
                    }
                }
            ];

            // For now, use a high-quality placeholder service
            const placeholderServices = [
                `https://picsum.photos/1080/1920?random=${index}&blur=1`,
                `https://source.unsplash.com/1080x1920/?${encodeURIComponent(prompt.split(' ')[0])}`,
                `https://via.placeholder.com/1080x1920/FFD700/000000?text=Motivational+${index}`
            ];

            // Use the first working placeholder service
            for (const serviceUrl of placeholderServices) {
                try {
                    const response = await fetch(serviceUrl, { method: 'HEAD' });
                    if (response.ok) {
                        const imagePath = path.join(this.outputDir, `image_${index}_real.jpg`);
                        
                        // Download the image
                        const imageResponse = await fetch(serviceUrl);
                        const imageBuffer = await imageResponse.arrayBuffer();
                        fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
                        
                        return {
                            prompt: prompt,
                            imagePath: imagePath,
                            index: index,
                            real: true,
                            source: 'Real Image Service'
                        };
                    }
                } catch (serviceError) {
                    continue;
                }
            }

            throw new Error('All alternative image services failed');
            
        } catch (error) {
            console.error(`Alternative image generation failed:`, error.message);
            throw error;
        }
    }

    // Generate fallback image using canvas
    async generateFallbackImage(prompt, index) {
        const canvas = require('canvas');
        const { createCanvas } = canvas;
        
        const canvasElement = createCanvas(1080, 1920);
        const ctx = canvasElement.getContext('2d');
        
        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, '#FF8C00');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1920);
        
        // Add text
        ctx.fillStyle = '#000';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Motivational ${index}`, 540, 960);
        
        ctx.font = '24px Arial';
        ctx.fillText(prompt.substring(0, 50) + '...', 540, 1000);
        
        // Save image
        const imagePath = path.join(this.outputDir, `image_${index}_fallback.jpg`);
        const buffer = canvasElement.toBuffer('image/jpeg');
        fs.writeFileSync(imagePath, buffer);
        
        return {
            prompt: prompt,
            imagePath: imagePath,
            index: index,
            real: true,
            source: 'Canvas Fallback'
        };
    }

    // Generate Voice with ElevenLabs
    async generateVoice(script, voiceSettings = {}) {
        console.log('🎤 Generating voice with ElevenLabs...');
        
        try {
            const text = Array.isArray(script) ? script.join(' ') : script;
            console.log(`Generating voice for: ${text.substring(0, 50)}...`);

            // Determine voice ID based on gender preference
            let voiceId = 'pNInz6obpgDQGcFmaJgB'; // Default male voice
            if (voiceSettings.gender === 'female') {
                voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Female voice
            } else if (voiceSettings.gender === 'male') {
                voiceId = 'pNInz6obpgDQGcFmaJgB'; // Male voice
            }

            // Try multiple ElevenLabs endpoints
            const endpoints = [
                {
                    name: 'Conversational AI Agent',
                    url: `https://api.elevenlabs.io/v1/conversational-ai/agents/${ELEVENLABS_AGENT_ID}/conversation`,
                    body: {
                        message: text,
                        conversation_config: {
                            agent: {
                                prompt: {
                                    prompt: "You are a motivational speaker. Speak with energy and conviction."
                                }
                            }
                        }
                    }
                },
                {
                    name: 'Text-to-Speech with Agent ID',
                    url: `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_AGENT_ID}`,
                    body: {
                        text: text,
                        model_id: 'eleven_monolingual_v1',
                        voice_settings: {
                            stability: 0.75,
                            similarity_boost: 0.75,
                            style: 0.0,
                            use_speaker_boost: true
                        }
                    }
                },
                {
                    name: `Text-to-Speech with ${voiceSettings.gender || 'Default'} Voice`,
                    url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
                    body: {
                        text: text,
                        model_id: 'eleven_monolingual_v1',
                        voice_settings: {
                            stability: 0.75,
                            similarity_boost: 0.75,
                            style: 0.0,
                            use_speaker_boost: true
                        }
                    }
                }
            ];

            for (const endpoint of endpoints) {
                try {
                    console.log(`Trying ${endpoint.name}...`);
                    const response = await fetch(endpoint.url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'audio/mpeg',
                            'Content-Type': 'application/json',
                            'xi-api-key': ELEVENLABS_API_KEY
                        },
                        body: JSON.stringify(endpoint.body)
                    });

                    if (response.ok) {
                        const audioBuffer = await response.arrayBuffer();
                        const audioPath = path.join(this.outputDir, 'voice.mp3');
                        fs.writeFileSync(audioPath, Buffer.from(audioBuffer));

                        console.log(`✅ Voice generated successfully with ${endpoint.name}`);
                        
                        return {
                            audioPath: audioPath,
                            text: text,
                            duration: script.length * 8, // 8 seconds per sentence
                            real: true,
                            source: `ElevenLabs (${endpoint.name})`
                        };
                    } else {
                        console.log(`${endpoint.name} failed: ${response.status}`);
                    }
                } catch (endpointError) {
                    console.log(`${endpoint.name} error:`, endpointError.message);
                    continue;
                }
            }

            throw new Error('All ElevenLabs endpoints failed');
            
        } catch (error) {
            console.error('❌ Voice generation failed:', error.message);
            
            // Create a simple audio file as fallback
            const audioPath = path.join(this.outputDir, 'voice_fallback.mp3');
            // For now, create an empty file - in production you'd generate actual audio
            fs.writeFileSync(audioPath, Buffer.alloc(0));
            
            return {
                audioPath: audioPath,
                text: script.join(' '),
                duration: script.length * 8,
                real: false,
                source: 'Fallback'
            };
        }
    }

    // Generate Music (using royalty-free music)
    async generateMusic(musicPrompt) {
        console.log('🎵 Generating music...');
        
        try {
            // Download a calm, ambient music file for background
            const calmMusicUrls = [
                'https://www.bensound.com/bensound-music/bensound-relaxing.mp3',
                'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
                'https://www.bensound.com/bensound-music/bensound-creativeminds.mp3'
            ];
            
            // Try to download calm music
            let musicUrl = calmMusicUrls[0]; // Default to first option
            const response = await fetch(musicUrl);
            
            if (response.ok) {
                const musicBuffer = await response.arrayBuffer();
                const musicPath = path.join(this.outputDir, 'music.mp3');
                fs.writeFileSync(musicPath, Buffer.from(musicBuffer));
                
                console.log('✅ Music downloaded successfully');
                
                return {
                    audioPath: musicPath,
                    prompt: musicPrompt,
                    duration: 45,
                    real: true,
                    source: 'Royalty-free Music'
                };
            } else {
                throw new Error('Failed to download music');
            }
        } catch (error) {
            console.error('❌ Music download failed:', error.message);
            
            // Create a simple silent audio file as fallback
            const musicPath = path.join(this.outputDir, 'music.mp3');
            // Create a minimal MP3 file (just header)
            const silentMp3 = Buffer.from([
                0xFF, 0xFB, 0x90, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
            ]);
            fs.writeFileSync(musicPath, silentMp3);
            
            console.log('✅ Music fallback created');
            
            return {
                audioPath: musicPath,
                prompt: musicPrompt,
                duration: 45,
                real: false,
                source: 'Silent Fallback'
            };
        }
    }

    // Create Rise Empire Logo
    async createLogo() {
        console.log('🎨 Creating Rise Empire logo...');
        
        const canvas = require('canvas');
        const { createCanvas } = canvas;
        
        const canvasElement = createCanvas(200, 200);
        const ctx = canvasElement.getContext('2d');
        
        // Create dark textured background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, 200, 200);
        
        // Add subtle texture
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < 50; i++) {
            ctx.fillRect(Math.random() * 200, Math.random() * 200, 1, 1);
        }
        
        // Create lion head with better gradient
        const lionGradient = ctx.createRadialGradient(100, 100, 0, 100, 100, 100);
        lionGradient.addColorStop(0, '#FFD700'); // Bright yellow center
        lionGradient.addColorStop(0.2, '#FFA500'); // Orange
        lionGradient.addColorStop(0.4, '#FF6347'); // Tomato
        lionGradient.addColorStop(0.6, '#FF1493'); // Deep pink
        lionGradient.addColorStop(0.8, '#4169E1'); // Royal blue
        lionGradient.addColorStop(1, '#191970'); // Midnight blue
        
        // Draw lion head (more detailed)
        ctx.fillStyle = lionGradient;
        ctx.beginPath();
        // Main head shape
        ctx.ellipse(100, 100, 65, 85, 0, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add mane details
        ctx.fillStyle = lionGradient;
        ctx.beginPath();
        ctx.arc(100, 100, 90, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw lion features
        ctx.fillStyle = '#000';
        // Eye
        ctx.beginPath();
        ctx.arc(120, 85, 8, 0, 2 * Math.PI);
        ctx.fill();
        // Nose
        ctx.beginPath();
        ctx.arc(130, 105, 5, 0, 2 * Math.PI);
        ctx.fill();
        // Mouth
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(130, 115, 8, 0, Math.PI);
        ctx.stroke();
        
        // Draw rising sun with better design
        const sunGradient = ctx.createRadialGradient(40, 60, 0, 40, 60, 30);
        sunGradient.addColorStop(0, '#FFD700');
        sunGradient.addColorStop(0.7, '#FF8C00');
        sunGradient.addColorStop(1, '#FF4500');
        
        ctx.fillStyle = sunGradient;
        ctx.beginPath();
        ctx.arc(40, 60, 28, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw sun rays with better styling
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12;
            const x1 = 40 + Math.cos(angle) * 35;
            const y1 = 60 + Math.sin(angle) * 35;
            const x2 = 40 + Math.cos(angle) * 50;
            const y2 = 60 + Math.sin(angle) * 50;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        // Add "RISE EMPIRE" text with better styling
        ctx.fillStyle = '#E6E6FA';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.fillText('RISE EMPIRE', 100, 175);
        
        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Save logo
        const logoPath = path.join(this.outputDir, 'logo.png');
        const buffer = canvasElement.toBuffer('image/png');
        fs.writeFileSync(logoPath, buffer);
        
        console.log('✅ Logo created successfully');
        return logoPath;
    }

    // Create Video with FFmpeg
    async createVideo(images, music, voice, content, logoPath) {
        console.log('🎬 Creating video with FFmpeg...');
        
        return new Promise((resolve, reject) => {
            const outputPath = path.join(this.outputDir, `${content.title.replace(/[^a-zA-Z0-9]/g, '-')}.mp4`);
            
            let command = ffmpeg();
            
            // Add images as input
            images.forEach((image, index) => {
                command = command.input(image.imagePath);
            });
            
            // Add audio inputs
            if (voice.audioPath) {
                command = command.input(voice.audioPath);
            }
            if (music.audioPath) {
                command = command.input(music.audioPath);
            }
            
            // Add logo
            command = command.input(logoPath);
            
            // Create filter complex for video composition with proper audio mixing
            const imageCount = images.length;
            const videoInputs = images.map((_, i) => `[v${i}]`).join('');
            
            const filterComplex = [
                // Scale all images to same size
                ...images.map((_, i) => `[${i}:v]scale=1080:1920[v${i}]`),
                // Concatenate all images dynamically
                `${videoInputs}concat=n=${imageCount}:v=1:a=0[video]`,
                // Mix audio with voice at 100% and music at 30%
                voice.audioPath && music.audioPath ? 
                    `[${images.length}:a]volume=1.0[voice_audio];[${images.length + 1}:a]volume=0.3[music_audio];[voice_audio][music_audio]amix=inputs=2:duration=first[audio]` :
                    `[${images.length}:a]acopy[audio]`,
                // Overlay logo
                `[video][${images.length + (voice.audioPath ? 2 : 1)}:v]overlay=20:20[final]`
            ].filter(Boolean).join(';');
            
            command
                .complexFilter(filterComplex)
                .outputOptions([
                    '-map [final]',
                    '-map [audio]',
                    '-c:v libx264',
                    '-c:a aac',
                    '-pix_fmt yuv420p',
                    '-r 1', // 1 FPS for slideshow effect
                    '-t 45' // 45 seconds duration
                ])
                .output(outputPath)
                .on('end', () => {
                    console.log('✅ Video created successfully');
                    resolve({
                        videoPath: outputPath,
                        data: {
                            title: content.title,
                            images: images,
                            music: music,
                            voice: voice,
                            logo: logoPath,
                            duration: 45,
                            format: 'mp4',
                            resolution: '1080x1920'
                        },
                        real: true
                    });
                })
                .on('error', (err) => {
                    console.error('❌ Video creation failed:', err.message);
                    reject(err);
                })
                .run();
        });
    }

    // Create video from provided assets
    async createVideoFromAssets(content, images, music, voice) {
        try {
            console.log(`🎬 Creating video from provided assets...`);
            
            // Use the provided assets directly - download them to local files
            console.log('🔄 Processing provided assets for video creation...');
            
            // Download and save images
            const backendImages = [];
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const imagePath = path.join(this.outputDir, `provided_image_${i + 1}.jpg`);
                
                if (img.imageUrl.startsWith('data:')) {
                    // Handle base64 data URLs
                    const base64Data = img.imageUrl.split(',')[1];
                    const imageBuffer = Buffer.from(base64Data, 'base64');
                    fs.writeFileSync(imagePath, imageBuffer);
                } else if (img.imageUrl.startsWith('blob:')) {
                    // For blob URLs, we need to generate a new image
                    const imagePrompts = this.generateImagePrompts(content.script);
                    const generatedImages = await this.generateImages(imagePrompts);
                    backendImages.push(...generatedImages);
                    break;
                } else {
                    // Download from URL
                    const response = await fetch(img.imageUrl);
                    const imageBuffer = await response.arrayBuffer();
                    fs.writeFileSync(imagePath, Buffer.from(imageBuffer));
                }
                
                backendImages.push({
                    prompt: img.prompt,
                    imagePath: imagePath,
                    index: i,
                    real: img.real,
                    source: img.source
                });
            }
            
            // Download and save voice
            const voicePath = path.join(this.outputDir, 'provided_voice.mp3');
            if (voice.audioUrl.startsWith('data:')) {
                const base64Data = voice.audioUrl.split(',')[1];
                const audioBuffer = Buffer.from(base64Data, 'base64');
                fs.writeFileSync(voicePath, audioBuffer);
            } else if (voice.audioUrl.startsWith('blob:')) {
                // Generate new voice
                const scriptText = Array.isArray(content.script) ? content.script.join(' ') : content.script;
                const generatedVoice = await this.generateVoice(scriptText);
                const backendVoice = {
                    audioPath: generatedVoice.audioPath,
                    text: generatedVoice.text,
                    duration: generatedVoice.duration,
                    real: generatedVoice.real,
                    source: generatedVoice.source
                };
                
                // Download and save music
                const musicPath = path.join(this.outputDir, 'provided_music.mp3');
                if (music.audioUrl.startsWith('data:')) {
                    const base64Data = music.audioUrl.split(',')[1];
                    const audioBuffer = Buffer.from(base64Data, 'base64');
                    fs.writeFileSync(musicPath, audioBuffer);
                } else {
                    // Download from URL
                    const response = await fetch(music.audioUrl);
                    const audioBuffer = await response.arrayBuffer();
                    fs.writeFileSync(musicPath, Buffer.from(audioBuffer));
                }
                
                const backendMusic = {
                    audioPath: musicPath,
                    prompt: music.prompt,
                    duration: music.duration,
                    real: music.real,
                    source: music.source
                };
                
                // Create logo
                const logo = await this.createLogo();
                
                // Create final video
                const video = await this.createVideo(backendImages, backendMusic, backendVoice, content, logo);

                console.log('🎉 Video created successfully from provided assets!');
                return {
                    success: true,
                    video: video,
                    assets: {
                        images: backendImages,
                        voice: backendVoice,
                        music: backendMusic,
                        logo: logo
                    },
                    content: content
                };
            }
            
            const backendVoice = {
                audioPath: voicePath,
                text: voice.text,
                duration: voice.duration,
                real: voice.real,
                source: voice.source
            };
            
            // Download and save music
            const musicPath = path.join(this.outputDir, 'provided_music.mp3');
            if (music.audioUrl.startsWith('data:')) {
                const base64Data = music.audioUrl.split(',')[1];
                const audioBuffer = Buffer.from(base64Data, 'base64');
                fs.writeFileSync(musicPath, audioBuffer);
            } else {
                // Download from URL
                const response = await fetch(music.audioUrl);
                const audioBuffer = await response.arrayBuffer();
                fs.writeFileSync(musicPath, Buffer.from(audioBuffer));
            }
            
            const backendMusic = {
                audioPath: musicPath,
                prompt: music.prompt,
                duration: music.duration,
                real: music.real,
                source: music.source
            };
            
            // Create logo
            const logo = await this.createLogo();
            
            // Create final video
            const video = await this.createVideo(backendImages, backendMusic, backendVoice, content, logo);

            console.log('🎉 Video created successfully from provided assets!');
            return {
                success: true,
                video: video,
                assets: {
                    images: backendImages,
                    voice: backendVoice,
                    music: backendMusic,
                    logo: logo
                },
                content: content
            };
        } catch (error) {
            console.error('❌ Video creation from assets failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Generate complete video
    async generateCompleteVideo(theme) {
        console.log(`🚀 Generating complete Rise Empire video: ${theme}`);
        
        try {
            const content = RISE_EMPIRE_SCRIPTS[theme];
            if (!content) {
                throw new Error(`Theme ${theme} not found`);
            }

            // Generate image prompts
            const imagePrompts = content.script.map(sentence => 
                `Creative motivational masterpiece: ${sentence}, dramatic cinematic lighting, 8K ultra-realistic, professional photography, vertical orientation, inspiring atmosphere`
            );

            // Generate all assets
            const [images, voice, music, logo] = await Promise.all([
                this.generateImages(imagePrompts),
                this.generateVoice(content.script, {}),
                this.generateMusic('Epic cinematic background music, motivational build-up, climax after 30-40 seconds'),
                this.createLogo()
            ]);

            // Create final video
            const video = await this.createVideo(images, music, voice, content, logo);

            console.log('🎉 Complete video generated successfully!');
            return {
                success: true,
                video: video,
                assets: {
                    images: images,
                    voice: voice,
                    music: music,
                    logo: logo
                },
                content: content
            };
        } catch (error) {
            console.error('❌ Video generation failed:', error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Export for use
module.exports = { RiseEmpireGenerator, RISE_EMPIRE_SCRIPTS };

// CLI usage
if (require.main === module) {
    const generator = new RiseEmpireGenerator();
    const theme = process.argv[2] || 'discipline';
    
    generator.generateCompleteVideo(theme)
        .then(result => {
            if (result.success) {
                console.log(`\n🎬 Video created: ${result.video.videoPath}`);
                console.log('📁 All assets saved in:', generator.outputDir);
            } else {
                console.error('❌ Generation failed:', result.error);
            }
        })
        .catch(error => {
            console.error('❌ Fatal error:', error.message);
        });
}
