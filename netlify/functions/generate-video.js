const fetch = require('node-fetch');

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
        const { theme, content, images, music, voice } = JSON.parse(event.body);
        
        // For Netlify, we'll return the processed content and prompts
        // The actual video generation will need to be done client-side or with a different service
        
        const result = {
            success: true,
            message: "Content processed successfully. Video generation requires server-side processing.",
            content: content,
            images: images,
            music: music,
            voice: voice,
            videoUrl: null, // Will be null for Netlify deployment
            assets: {
                images: images || [],
                music: music || null,
                voice: voice || null
            }
        };
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result)
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