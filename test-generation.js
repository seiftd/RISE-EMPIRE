const { RiseEmpireGenerator } = require('./rise-empire-backend');

async function testGeneration() {
    console.log('🚀 Testing Rise Empire Video Generation...\n');
    
    const generator = new RiseEmpireGenerator();
    
    try {
        // Test with discipline theme
        const result = await generator.generateCompleteVideo('discipline');
        
        if (result.success) {
            console.log('\n✅ SUCCESS! Video generated successfully!');
            console.log(`📁 Video location: ${result.video.videoPath}`);
            console.log(`📁 Assets folder: ${generator.outputDir}`);
            console.log('\n🎬 Your Rise Empire video is ready!');
        } else {
            console.log('\n❌ FAILED:', result.error);
        }
    } catch (error) {
        console.error('\n❌ FATAL ERROR:', error.message);
    }
}

// Run the test
testGeneration();
