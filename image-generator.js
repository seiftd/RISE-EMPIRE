const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

class RiseEmpireImageGenerator {
    constructor(outputDir) {
        this.outputDir = outputDir;
    }

    async generateMotivationalImage(prompt, index) {
        try {
            console.log(`🎨 Generating motivational image ${index}: ${prompt.substring(0, 50)}...`);
            
            const canvas = createCanvas(1080, 1920);
            const ctx = canvas.getContext('2d');
            
            // Create dynamic background based on prompt keywords
            const background = this.createDynamicBackground(prompt, ctx);
            
            // Add motivational elements
            this.addMotivationalElements(prompt, ctx);
            
            // Add text overlay (without scene numbers)
            this.addTextOverlay(prompt, ctx);
            
            // Add Rise Empire branding
            this.addRiseEmpireBranding(ctx);
            
            // Save image
            const imagePath = path.join(this.outputDir, `scene_${index}_motivational.jpg`);
            const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
            fs.writeFileSync(imagePath, buffer);
            
            console.log(`✅ Motivational image ${index} generated successfully`);
            
            return {
                prompt: prompt,
                imagePath: imagePath,
                index: index,
                real: true,
                source: 'Rise Empire Generator'
            };
            
        } catch (error) {
            console.error(`❌ Error generating image ${index}:`, error.message);
            throw error;
        }
    }

    createDynamicBackground(prompt, ctx) {
        // Extract keywords from prompt
        const keywords = prompt.toLowerCase();
        
        let gradient;
        if (keywords.includes('discipline') || keywords.includes('grind')) {
            // Orange to red gradient for discipline/grind
            gradient = ctx.createLinearGradient(0, 0, 0, 1920);
            gradient.addColorStop(0, '#FF6B35');
            gradient.addColorStop(0.5, '#F7931E');
            gradient.addColorStop(1, '#FFD23F');
        } else if (keywords.includes('success') || keywords.includes('victory')) {
            // Gold gradient for success
            gradient = ctx.createLinearGradient(0, 0, 0, 1920);
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(0.5, '#FFA500');
            gradient.addColorStop(1, '#FF8C00');
        } else if (keywords.includes('fear') || keywords.includes('courage')) {
            // Blue to purple gradient for courage
            gradient = ctx.createLinearGradient(0, 0, 0, 1920);
            gradient.addColorStop(0, '#4A90E2');
            gradient.addColorStop(0.5, '#7B68EE');
            gradient.addColorStop(1, '#9370DB');
        } else {
            // Default motivational gradient
            gradient = ctx.createLinearGradient(0, 0, 0, 1920);
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(0.5, '#FFA500');
            gradient.addColorStop(1, '#FF4500');
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1920);
        
        return gradient;
    }

    addMotivationalElements(prompt, ctx) {
        const keywords = prompt.toLowerCase();
        
        // Add geometric motivational elements
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 3;
        
        if (keywords.includes('discipline') || keywords.includes('grind')) {
            // Add geometric patterns for discipline
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(100 + i * 200, 200);
                ctx.lineTo(200 + i * 200, 400);
                ctx.lineTo(150 + i * 200, 600);
                ctx.closePath();
                ctx.stroke();
            }
        } else if (keywords.includes('success') || keywords.includes('victory')) {
            // Add success symbols
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(200 + i * 300, 400, 50, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else if (keywords.includes('fear') || keywords.includes('courage')) {
            // Add breaking chains pattern
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                ctx.arc(150 + i * 200, 500, 30, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        
        // Add motivational rays
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12;
            const x1 = 540 + Math.cos(angle) * 200;
            const y1 = 960 + Math.sin(angle) * 200;
            const x2 = 540 + Math.cos(angle) * 400;
            const y2 = 960 + Math.sin(angle) * 400;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    }

    addTextOverlay(prompt, ctx) {
        // Add motivational text overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 1600, 1080, 320);
        
        // Extract key words from prompt
        const words = prompt.split(' ').filter(word => 
            word.length > 4 && 
            !['cinematic', 'motivational', 'scene', 'ultra', 'realistic', 'professional', 'photography'].includes(word.toLowerCase())
        );
        
        const keyWords = words.slice(0, 3);
        
        // Add key words as overlay
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        
        keyWords.forEach((word, index) => {
            ctx.fillText(word.toUpperCase(), 540, 1650 + (index * 50));
        });
    }

    addRiseEmpireBranding(ctx) {
        // Add Rise Empire logo area
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(20, 20, 200, 80);
        
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('RISE', 30, 45);
        ctx.fillText('EMPIRE', 30, 70);
    }
}

module.exports = RiseEmpireImageGenerator;
