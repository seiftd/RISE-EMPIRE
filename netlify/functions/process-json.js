exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const jsonData = JSON.parse(event.body);
        
        // Process the JSON data and return enhanced content
        let script = jsonData.script;
        
        // Ensure script is an array
        if (typeof script === 'string') {
            script = script.split('\n').filter(line => line.trim().length > 0);
        }
        
        // Clean script lines
        script = script.map(line => {
            return line.replace(/^\d+\.\s*/, '').replace(/^Line\s+\d+:\s*/, '').replace(/^Sentence\s+\d+:\s*/, '').trim();
        }).filter(line => line.length > 0);
        
        // Generate image prompts
        const generateImagePrompts = (script) => {
            const scriptArray = Array.isArray(script) ? script : [script];
            return scriptArray.map((sentence, index) => {
                const keywords = sentence.toLowerCase().split(' ').filter(word => 
                    !['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'].includes(word)
                );
                
                const creativePrompts = [
                    `Epic cinematic scene: ${sentence}, dramatic lighting, 8K ultra-realistic, motivational atmosphere, vertical orientation`,
                    `Creative motivational image: ${sentence}, featuring ${keywords.slice(0, 3).join(', ')}, dramatic lighting, 8K ultra-realistic, cinematic composition, vertical orientation`,
                    `Inspirational visual: ${sentence}, powerful imagery, professional photography, 8K quality, vertical format`,
                    `Motivational masterpiece: ${sentence}, cinematic style, dramatic shadows, 8K resolution, vertical orientation`,
                    `Epic motivational scene: ${sentence}, inspiring composition, professional quality, 8K ultra-realistic, vertical format`,
                    `Creative inspirational image: ${sentence}, dramatic lighting, cinematic style, 8K quality, vertical orientation`
                ];
                
                const keywordPrompt = keywords.length > 0 ? 
                    `Creative motivational image: ${sentence}, featuring ${keywords.slice(0, 3).join(', ')}, dramatic lighting, 8K ultra-realistic, cinematic composition, vertical orientation` :
                    creativePrompts[index] || creativePrompts[0];
                
                return keywordPrompt;
            });
        };
        
        // Generate music prompt
        const generateMusicPrompt = (title) => {
            const theme = title.toLowerCase().replace(/\s+/g, '');
            const musicPrompts = {
                'discipline': 'Calm motivational background music, piano and strings, inspiring and uplifting, 45 seconds',
                'success': 'Epic cinematic music, building to climax, motivational and powerful, 45 seconds',
                'motivation': 'Uplifting background music, piano and orchestral, inspiring and energetic, 45 seconds',
                'hustle': 'Energetic motivational music, drums and bass, driving and powerful, 45 seconds',
                'mindset': 'Calm and focused background music, ambient and inspiring, 45 seconds',
                'grind': 'Intense motivational music, building energy, powerful and driving, 45 seconds',
                'fear': 'Overcoming fear music, building from calm to powerful, inspiring and uplifting, 45 seconds',
                'courage': 'Brave and bold music, orchestral and inspiring, building to triumph, 45 seconds',
                'failure': 'Rising from failure music, building from low to high, inspiring and hopeful, 45 seconds',
                'consistency': 'Steady and reliable music, consistent rhythm, motivational and persistent, 45 seconds',
                'legacy': 'Epic and grand music, orchestral and inspiring, building to greatness, 45 seconds',
                'money': 'Success and wealth music, confident and powerful, building to prosperity, 45 seconds',
                'time': 'Time management music, focused and efficient, motivational and productive, 45 seconds',
                'health': 'Healthy and energetic music, uplifting and positive, inspiring wellness, 45 seconds',
                'focus': 'Concentrated and focused music, minimal distractions, motivational and clear, 45 seconds',
                'resilience': 'Strong and unbreakable music, building resilience, powerful and enduring, 45 seconds'
            };
            return musicPrompts[theme] || 'Calm motivational background music, piano and strings, inspiring and uplifting, 45 seconds';
        };
        
        // Generate SEO tags
        const generateSEOTags = (data) => {
            const baseTags = ['motivation', 'mindset', 'success', 'discipline', 'hustle', 'grind', 'inspiration', 'selfimprovement', 'goals', 'achievement'];
            const keywordTags = data.keywords || [];
            const titleWords = jsonData.title.toLowerCase().split(' ').filter(word => word.length > 3);
            return [...new Set([...baseTags, ...keywordTags, ...titleWords])].slice(0, 10);
        };
        
        // Generate voice settings
        const generateVoiceSettings = (gender = 'male', tone = 'deep') => {
            const voices = {
                male: {
                    deep: { gender: 'male', tone: 'deep', pace: 'slow', accent: 'american', emphasis: 'strong' },
                    energetic: { gender: 'male', tone: 'energetic', pace: 'medium', accent: 'american', emphasis: 'dynamic' },
                    inspiring: { gender: 'male', tone: 'inspiring', pace: 'medium', accent: 'american', emphasis: 'motivational' }
                },
                female: {
                    deep: { gender: 'female', tone: 'deep', pace: 'slow', accent: 'american', emphasis: 'strong' },
                    energetic: { gender: 'female', tone: 'energetic', pace: 'medium', accent: 'american', emphasis: 'dynamic' },
                    inspiring: { gender: 'female', tone: 'inspiring', pace: 'medium', accent: 'american', emphasis: 'motivational' }
                }
            };
            return voices[gender]?.[tone] || voices.male.deep;
        };
        
        const enhancedContent = {
            title: jsonData.title,
            script: script,
            imagePrompts: generateImagePrompts(script),
            musicPrompt: generateMusicPrompt(jsonData.title.toLowerCase().replace(/\s+/g, '')),
            seoTags: generateSEOTags({ keywords: jsonData.keywords || [jsonData.title.toLowerCase()] }),
            voiceSettings: generateVoiceSettings(jsonData.voiceSettings?.gender || 'male', jsonData.voiceSettings?.tone || 'deep'),
            originalData: jsonData,
            enhanced: true
        };
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                content: enhancedContent
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};