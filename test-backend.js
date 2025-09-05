const { RiseEmpireGenerator } = require('./rise-empire-backend');

async function testBackend() {
    console.log('🧪 Testing backend video creation...');
    
    const generator = new RiseEmpireGenerator();
    
    try {
        // Test simple video creation
        const result = await generator.generateCompleteVideo('discipline');
        
        if (result.success) {
            console.log('✅ Backend test successful!');
            console.log('Video:', result.video.videoPath);
        } else {
            console.log('❌ Backend test failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Backend test error:', error.message);
    }
}

testBackend();
