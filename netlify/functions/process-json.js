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
        const { jsonData } = JSON.parse(event.body);
        
        // Process JSON data (same logic as frontend)
        let script = jsonData.script;
        if (typeof script === 'string') {
            script = script.split('\n').filter(line => line.trim().length > 0);
        }
        if (!Array.isArray(script)) {
            script = [script];
        }
        
        // Clean script - remove any line numbers or prefixes
        script = script.map(line => {
            return line.replace(/^\d+\.\s*/, '').replace(/^Line\s+\d+:\s*/, '').replace(/^Sentence\s+\d+:\s*/, '').trim();
        }).filter(line => line.length > 0);
        
        // Generate image prompts
        const imagePrompts = script.map((sentence, index) => {
            const keywords = sentence.toLowerCase().split(' ').filter(word => 
                word.length > 3 && 
                !['the', 'and', 'you', 'are', 'for', 'with', 'this', 'that', 'from', 'they', 'have', 'been', 'will', 'your', 'into', 'time', 'more', 'very', 'what', 'know', 'just', 'first', 'also', 'after', 'back', 'well', 'work', 'life', 'make', 'take', 'come', 'look', 'want', 'give', 'use', 'find', 'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call', 'good', 'new', 'first', 'last', 'long', 'great', 'little', 'own', 'other', 'old', 'right', 'big', 'high', 'different', 'small', 'large', 'next', 'early', 'young', 'important', 'few', 'public', 'bad', 'same', 'able'].includes(word)
            );
            
            const creativePrompts = [
                `Epic cinematic scene: ${sentence}, dramatic golden hour lighting, 8K ultra-realistic, motivational atmosphere, professional photography, vertical orientation`,
                `Powerful motivational image: ${sentence}, intense dramatic lighting, high contrast, cinematic composition, 8K quality, inspiring mood`,
                `Stunning visual representation: ${sentence}, artistic lighting, emotional depth, professional photography, 8K ultra-realistic, vertical format`,
                `Dynamic motivational scene: ${sentence}, bold composition, dramatic shadows, cinematic quality, 8K resolution, inspiring atmosphere`,
                `Epic visual storytelling: ${sentence}, powerful imagery, dramatic lighting, professional photography, 8K ultra-realistic, motivational mood`,
                `Cinematic masterpiece: ${sentence}, artistic composition, dramatic atmosphere, high-quality photography, 8K resolution, inspiring visual`
            ];
            
            const keywordPrompt = keywords.length > 0 ? 
                `Creative motivational image: ${sentence}, featuring ${keywords.slice(0, 3).join(', ')}, dramatic lighting, 8K ultra-realistic, cinematic composition, vertical orientation` :
                creativePrompts[index] || creativePrompts[0];
            
            return keywordPrompt;
        });
        
        // Generate music prompt
        const musicPrompt = `Epic cinematic background music, piano + orchestral strings + powerful drums, motivational build-up, climax at 30-40 seconds, emotional and inspiring, 120 BPM, professional quality`;
        
        // Generate SEO tags
        const seoTags = [
            'motivation', 'mindset', 'success', 'discipline', 'hustle',
            'inspiration', 'growth', 'achievement', 'goals', 'mindset'
        ];
        
        // Generate voice settings
        const voiceSettings = {
            gender: jsonData.voiceSettings?.gender || 'male',
            tone: jsonData.voiceSettings?.tone || 'deep',
            pace: "8 seconds per sentence with 0.5s pause",
            accent: "American English",
            emphasis: "Key motivational words"
        };
        
        const enhancedContent = {
            title: jsonData.title,
            script: script,
            imagePrompts: imagePrompts,
            musicPrompt: musicPrompt,
            seoTags: seoTags,
            voiceSettings: voiceSettings,
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
