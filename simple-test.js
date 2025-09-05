const { RiseEmpireGenerator } = require('./rise-empire-backend');

async function simpleTest() {
    console.log('🚀 Simple Rise Empire Test...\n');
    
    const generator = new RiseEmpireGenerator();
    
    try {
        // Test logo creation first
        console.log('🎨 Testing logo creation...');
        const logo = await generator.createLogo();
        console.log('✅ Logo created:', logo);
        
        // Test fallback image generation
        console.log('\n🖼️ Testing image generation...');
        const image = await generator.generateFallbackImage('Test motivational scene', 1);
        console.log('✅ Image created:', image.imagePath);
        
        // Test voice generation (will likely fail but we'll handle it)
        console.log('\n🎤 Testing voice generation...');
        const voice = await generator.generateVoice(['Test sentence for voice generation'], {});
        console.log('✅ Voice result:', voice.source);
        
        console.log('\n🎉 Basic tests completed!');
        console.log(`📁 Check the generated-content folder for results`);
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
    }
}

// Run the simple test
simpleTest();
