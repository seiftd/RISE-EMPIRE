const { RiseEmpireGenerator } = require('../../rise-empire-backend');

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
        
        const generator = new RiseEmpireGenerator();
        
        let result;
        if (content && images && music && voice) {
            result = await generator.createVideoFromAssets(content, images, music, voice);
        } else {
            result = await generator.generateCompleteVideo(theme);
        }
        
        if (result.success) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    video: result.video,
                    assets: result.assets,
                    content: result.content
                })
            };
        } else {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: result.error
                })
            };
        }
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
