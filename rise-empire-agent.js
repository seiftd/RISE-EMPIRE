// Rise Empire Content Generation Agent
// This agent processes JSON files and generates real motivational content

class RiseEmpireAgent {
    constructor() {
        this.apiKey = 'AIzaSyCQqVPdDJrf46Ir8DKfGfhf8xiEZswge5E';
        this.elevenLabsAgentId = 'agent_6701k4ddqqjkf48r526gs3v001ck';
        this.generationHistory = [];
        this.autoGenerationEnabled = false;
        this.autoGenerationInterval = null;
    }

    // Main method to process JSON and generate real content
    async processJsonFile(jsonData) {
        try {
            console.log('🎯 Rise Empire Agent: Processing JSON file...');
            
            // Validate JSON structure
            this.validateJsonStructure(jsonData);
            
            // Generate enhanced content
            const enhancedContent = await this.generateEnhancedContent(jsonData);
            
            // Generate real production assets
            const productionAssets = await this.generateProductionAssets(enhancedContent);
            
            // Create final output
            const finalOutput = {
                ...enhancedContent,
                productionAssets,
                metadata: {
                    generatedAt: new Date().toISOString(),
                    agentVersion: '1.0.0',
                    source: 'json',
                    enhanced: true
                }
            };
            
            // Save to history
            this.saveToHistory(finalOutput);
            
            console.log('✅ Rise Empire Agent: Content generated successfully!');
            return finalOutput;
            
        } catch (error) {
            console.error('❌ Rise Empire Agent Error:', error.message);
            throw error;
        }
    }

    // Validate JSON structure
    validateJsonStructure(jsonData) {
        const requiredFields = ['title', 'script'];
        const missingFields = requiredFields.filter(field => !jsonData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        
        if (!Array.isArray(jsonData.script) || jsonData.script.length !== 6) {
            throw new Error('Script must be an array of exactly 6 sentences');
        }
        
        console.log('✅ JSON structure validation passed');
    }

    // Generate enhanced content from JSON
    async generateEnhancedContent(jsonData) {
        const enhancedContent = {
            title: jsonData.title,
            script: jsonData.script,
            imagePrompts: this.generateImagePrompts(jsonData.script),
            musicPrompt: this.generateMusicPrompt(jsonData.title),
            seoTags: this.generateSEOTags(jsonData),
            voiceSettings: this.generateVoiceSettings(),
            originalData: jsonData
        };
        
        // Enhance with AI if available
        if (this.apiKey) {
            try {
                enhancedContent.aiEnhanced = await this.enhanceWithAI(jsonData);
            } catch (error) {
                console.warn('AI enhancement failed, using fallback:', error.message);
            }
        }
        
        return enhancedContent;
    }

    // Generate production assets
    async generateProductionAssets(content) {
        return {
            videoSpecs: {
                duration: '40-50 seconds',
                format: 'Vertical (1080x1920)',
                platforms: ['YouTube Shorts', 'TikTok', 'Instagram Reels'],
                aspectRatio: '9:16'
            },
            voiceProduction: {
                agentId: this.elevenLabsAgentId,
                settings: content.voiceSettings,
                estimatedDuration: '48 seconds',
                outputFormat: 'MP3',
                quality: 'High'
            },
            imageProduction: {
                prompts: content.imagePrompts,
                recommendedTools: ['DALL-E 3', 'Midjourney', 'Stable Diffusion'],
                specifications: '8K, cinematic, motivational',
                count: 6
            },
            musicProduction: {
                prompt: content.musicPrompt,
                recommendedSources: ['Epidemic Sound', 'AudioJungle', 'Artlist'],
                duration: '40-50 seconds',
                style: 'Epic cinematic'
            },
            publishing: {
                hashtags: content.seoTags,
                platforms: ['YouTube', 'TikTok', 'Instagram'],
                optimalTimes: ['6-9 AM', '12-2 PM', '6-9 PM'],
                crossPosting: true
            }
        };
    }

    // Generate image prompts for each script sentence
    generateImagePrompts(script) {
        const basePrompts = [
            "Cinematic sunrise over mountains, golden hour lighting, 8K ultra-realistic, motivational atmosphere, wide shot",
            "Athlete training in gym, dramatic lighting, sweat and determination, high contrast, 8K, close-up",
            "Silhouette of person running on beach at sunset, inspirational mood, cinematic composition, medium shot",
            "Hands breaking chains, symbolic freedom, dramatic lighting, 8K detailed, powerful imagery, macro shot",
            "Person climbing mountain peak, victory pose, epic landscape, golden hour, 8K realistic, wide shot",
            "Close-up of determined eyes, intense gaze, cinematic lighting, motivational portrait, 8K, extreme close-up"
        ];
        
        return script.map((sentence, index) => {
            const basePrompt = basePrompts[index] || basePrompts[0];
            return `${basePrompt}, representing: "${sentence.substring(0, 50)}..."`;
        });
    }

    // Generate music prompt
    generateMusicPrompt(title) {
        const musicStyles = {
            'discipline': 'Epic orchestral with powerful drums, building intensity, motivational climax',
            'fear': 'Dramatic piano building to triumphant orchestral, overcoming adversity theme',
            'success': 'Victorious orchestral music, brass and strings, celebratory but powerful',
            'mindset': 'Thoughtful piano melody building to full orchestral, mental transformation',
            'default': 'Epic cinematic background, piano + strings + drums, motivational build-up'
        };
        
        const titleKey = title.toLowerCase().replace(/\s+/g, '');
        const style = musicStyles[titleKey] || musicStyles.default;
        
        return `${style}, 40-50 seconds duration, 120 BPM, professional quality, emotional crescendo at 30-40 seconds`;
    }

    // Generate SEO tags
    generateSEOTags(jsonData) {
        const baseTags = [
            '#RiseEmpire', '#Motivation', '#Inspiration', '#Success', '#Mindset',
            '#Discipline', '#Hustle', '#Greatness', '#Motivational', '#SelfImprovement'
        ];
        
        const titleTags = jsonData.title.toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(' ')
            .filter(word => word.length > 2)
            .map(word => `#${word.charAt(0).toUpperCase() + word.slice(1)}`);
        
        const keywordTags = (jsonData.keywords || [])
            .map(keyword => `#${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`);
        
        return [...baseTags, ...titleTags, ...keywordTags].slice(0, 15);
    }

    // Generate voice settings
    generateVoiceSettings() {
        return {
            gender: 'male',
            tone: 'deep',
            pace: '8 seconds per sentence with 0.5s pause',
            accent: 'American English',
            emphasis: 'Key motivational words',
            style: 'Deep male voice, inspiring and powerful delivery',
            agentId: this.elevenLabsAgentId
        };
    }

    // Enhance content with AI
    async enhanceWithAI(jsonData) {
        try {
            const prompt = `Enhance this motivational content for maximum viral potential:
            
            Title: ${jsonData.title}
            Script: ${jsonData.script.join(' ')}
            
            Provide:
            1. Enhanced title variations (3 options)
            2. Improved script with more powerful words
            3. Additional SEO keywords
            4. Viral potential score (1-10)
            5. Target audience insights`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            throw new Error(`AI enhancement failed: ${error.message}`);
        }
    }

    // Auto-generation system
    enableAutoGeneration(intervalDays = 3) {
        this.autoGenerationEnabled = true;
        const intervalMs = intervalDays * 24 * 60 * 60 * 1000;
        
        this.autoGenerationInterval = setInterval(() => {
            this.performAutoGeneration();
        }, intervalMs);
        
        console.log(`🔄 Auto-generation enabled: Every ${intervalDays} days`);
    }

    disableAutoGeneration() {
        this.autoGenerationEnabled = false;
        if (this.autoGenerationInterval) {
            clearInterval(this.autoGenerationInterval);
            this.autoGenerationInterval = null;
        }
        console.log('⏹️ Auto-generation disabled');
    }

    async performAutoGeneration() {
        try {
            console.log('🤖 Performing auto-generation...');
            
            // Select random theme
            const themes = Object.keys(this.getAvailableThemes());
            const randomTheme = themes[Math.floor(Math.random() * themes.length)];
            
            // Generate content
            const content = await this.generateRandomContent(randomTheme);
            
            // Save to history
            this.saveToHistory(content);
            
            console.log(`✅ Auto-generated: ${content.title}`);
            return content;
            
        } catch (error) {
            console.error('❌ Auto-generation failed:', error.message);
        }
    }

    // Generate random content
    async generateRandomContent(theme) {
        const themeData = this.getAvailableThemes()[theme];
        if (!themeData) {
            throw new Error(`Theme not found: ${theme}`);
        }
        
        const jsonData = {
            title: themeData.title,
            script: themeData.script,
            keywords: themeData.keywords
        };
        
        return await this.processJsonFile(jsonData);
    }

    // Get available themes
    getAvailableThemes() {
        return {
            discipline: {
                title: "Discipline Over Motivation",
                script: [
                    "Discipline is the bridge between goals and accomplishment.",
                    "While others sleep, you grind. While others quit, you persist.",
                    "Every morning you have two choices: continue to sleep with your dreams or wake up and chase them.",
                    "The pain of discipline weighs ounces, but the pain of regret weighs tons.",
                    "Champions aren't made in comfort zones. They're forged in the fire of daily discipline.",
                    "Your future self is counting on the discipline you show today."
                ],
                keywords: ["discipline", "consistency", "habits", "routine", "commitment"]
            },
            fear: {
                title: "Fear is a Lie",
                script: [
                    "Fear is just excitement without breath. Take a deep breath and step forward.",
                    "The cave you fear to enter holds the treasure you seek.",
                    "Courage isn't the absence of fear; it's action in spite of it.",
                    "Every hero's journey begins with a single step into the unknown.",
                    "Your comfort zone is a beautiful place, but nothing ever grows there.",
                    "The only way to overcome fear is to face it head-on and keep moving."
                ],
                keywords: ["fear", "courage", "bravery", "overcoming", "challenge"]
            },
            success: {
                title: "Grind Now Shine Later",
                script: [
                    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
                    "The road to success is always under construction, but that's what makes it an adventure.",
                    "Your dreams are valid, your goals are achievable, and your potential is unlimited.",
                    "Success is the sum of small efforts repeated day in and day out.",
                    "The difference between ordinary and extraordinary is that little extra effort.",
                    "Your time is now. Your moment is here. Your success is inevitable."
                ],
                keywords: ["success", "achievement", "victory", "triumph", "winning"]
            }
        };
    }

    // Save to generation history
    saveToHistory(content) {
        const historyEntry = {
            timestamp: new Date().toISOString(),
            content: content,
            type: 'generated'
        };
        
        this.generationHistory.unshift(historyEntry);
        
        // Keep only last 100 entries
        if (this.generationHistory.length > 100) {
            this.generationHistory.splice(100);
        }
        
        // Save to localStorage if available
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('riseEmpire_agentHistory', JSON.stringify(this.generationHistory));
        }
    }

    // Load generation history
    loadHistory() {
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem('riseEmpire_agentHistory');
            if (stored) {
                this.generationHistory = JSON.parse(stored);
            }
        }
    }

    // Get generation statistics
    getStats() {
        return {
            totalGenerations: this.generationHistory.length,
            lastGeneration: this.generationHistory[0]?.timestamp || 'Never',
            autoGenerationEnabled: this.autoGenerationEnabled,
            themesUsed: [...new Set(this.generationHistory.map(entry => entry.content?.title))].length
        };
    }

    // Export content in various formats
    exportContent(content, format = 'json') {
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(content, null, 2);
            case 'txt':
                return this.formatAsText(content);
            case 'csv':
                return this.formatAsCSV(content);
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    formatAsText(content) {
        return `
RISE EMPIRE - MOTIVATIONAL CONTENT
Generated: ${new Date().toLocaleString()}

TITLE: ${content.title}

SCRIPT:
${content.script.map((sentence, index) => `${index + 1}. ${sentence}`).join('\n')}

IMAGE PROMPTS:
${content.imagePrompts.map((prompt, index) => `${index + 1}. ${prompt}`).join('\n')}

MUSIC PROMPT: ${content.musicPrompt}

SEO TAGS: ${content.seoTags.join(' ')}

VOICE SETTINGS:
${Object.entries(content.voiceSettings).map(([key, value]) => `${key}: ${value}`).join('\n')}

---
Generated by Rise Empire Agent v1.0.0
        `.trim();
    }

    formatAsCSV(content) {
        const rows = [
            ['Field', 'Value'],
            ['Title', content.title],
            ['Script', content.script.join(' | ')],
            ['Image Prompts', content.imagePrompts.join(' | ')],
            ['Music Prompt', content.musicPrompt],
            ['SEO Tags', content.seoTags.join(', ')],
            ['Voice Gender', content.voiceSettings.gender],
            ['Voice Tone', content.voiceSettings.tone]
        ];
        
        return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RiseEmpireAgent;
} else if (typeof window !== 'undefined') {
    window.RiseEmpireAgent = RiseEmpireAgent;
}

// Example usage:
/*
const agent = new RiseEmpireAgent();

// Process JSON file
const jsonData = {
    title: "Discipline Over Motivation",
    script: [
        "Discipline is the bridge between goals and accomplishment.",
        "While others sleep, you grind. While others quit, you persist.",
        "Every morning you have two choices: continue to sleep with your dreams or wake up and chase them.",
        "The pain of discipline weighs ounces, but the pain of regret weighs tons.",
        "Champions aren't made in comfort zones. They're forged in the fire of daily discipline.",
        "Your future self is counting on the discipline you show today."
    ],
    keywords: ["discipline", "consistency", "habits"]
};

agent.processJsonFile(jsonData).then(content => {
    console.log('Generated content:', content);
    console.log('Text format:', agent.exportContent(content, 'txt'));
});

// Enable auto-generation
agent.enableAutoGeneration(3); // Every 3 days
*/
