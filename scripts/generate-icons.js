const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Tamanhos de ícones necessários
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Função para criar ícone
async function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Fundo arredondado
    const radius = size * 0.25; // 25% do tamanho para bordas arredondadas
    ctx.fillStyle = '#6366f1';
    roundRect(ctx, 0, 0, size, size, radius);
    ctx.fill();

    // Círculo branco (cabeça)
    const centerY = size * 0.4;
    const circleRadius = size * 0.15;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(size/2, centerY, circleRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Retângulo branco (corpo)
    const rectWidth = size * 0.3;
    const rectHeight = size * 0.15;
    const rectY = size * 0.6;
    ctx.fillStyle = 'white';
    roundRect(ctx, (size - rectWidth)/2, rectY, rectWidth, rectHeight, rectHeight/2);
    ctx.fill();

    // Linha azul (detalhe)
    const lineWidth = size * 0.15;
    const lineHeight = size * 0.04;
    const lineY = size * 0.7;
    ctx.fillStyle = '#6366f1';
    roundRect(ctx, (size - lineWidth)/2, lineY, lineWidth, lineHeight, lineHeight/2);
    ctx.fill();

    return canvas.toBuffer('image/png');
}

// Função auxiliar para retângulos arredondados
function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Gerar todos os ícones
async function generateIcons() {
    console.log('Gerando ícones PWA...');

    for (const size of sizes) {
        try {
            const buffer = await createIcon(size);
            const filename = `icon-${size}x${size}.png`;
            const filepath = path.join(__dirname, 'assets', filename);

            fs.writeFileSync(filepath, buffer);
            console.log(`✓ ${filename} criado`);
        } catch (error) {
            console.error(`✗ Erro ao criar ícone ${size}x${size}:`, error.message);
        }
    }

    // Criar favicon.ico (usando o ícone 96x96 como base)
    try {
        const faviconBuffer = await createIcon(32);
        fs.writeFileSync(path.join(__dirname, 'assets', 'favicon.ico'), faviconBuffer);
        console.log('✓ favicon.ico criado');
    } catch (error) {
        console.error('✗ Erro ao criar favicon:', error.message);
    }

    console.log('Todos os ícones foram gerados!');
}

// Executar
generateIcons().catch(console.error);
