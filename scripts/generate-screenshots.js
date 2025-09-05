const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Criar screenshot wide (1280x720)
function createWideScreenshot() {
    const canvas = createCanvas(1280, 720);
    const ctx = canvas.getContext('2d');

    // Fundo gradiente
    const gradient = ctx.createLinearGradient(0, 0, 1280, 720);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1280, 720);

    // Título
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Core - Controle Financeiro', 640, 100);

    // Cards simulados
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(100, 200, 300, 150);
    ctx.fillRect(450, 200, 300, 150);
    ctx.fillRect(800, 200, 300, 150);

    // Texto nos cards
    ctx.fillStyle = '#333';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Receitas: R$ 5.200', 120, 250);
    ctx.fillText('Despesas: R$ 3.800', 470, 250);
    ctx.fillText('Saldo: R$ 1.400', 820, 250);

    return canvas.toBuffer('image/png');
}

// Criar screenshot narrow (750x1334)
function createNarrowScreenshot() {
    const canvas = createCanvas(750, 1334);
    const ctx = canvas.getContext('2d');

    // Fundo gradiente
    const gradient = ctx.createLinearGradient(0, 0, 750, 1334);
    gradient.addColorStop(0, '#6366f1');
    gradient.addColorStop(1, '#8b5cf6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 750, 1334);

    // Título
    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Core', 375, 80);

    // Cards simulados
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(50, 150, 650, 120);
    ctx.fillRect(50, 300, 650, 120);
    ctx.fillRect(50, 450, 650, 120);

    // Texto nos cards
    ctx.fillStyle = '#333';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Receitas: R$ 5.200', 70, 200);
    ctx.fillText('Despesas: R$ 3.800', 70, 350);
    ctx.fillText('Saldo: R$ 1.400', 70, 500);

    return canvas.toBuffer('image/png');
}

// Gerar screenshots
async function generateScreenshots() {
    console.log('Gerando screenshots PWA...');

    try {
        // Screenshot wide
        const wideBuffer = createWideScreenshot();
        fs.writeFileSync(path.join(__dirname, 'assets', 'screenshot-wide.png'), wideBuffer);
        console.log('✓ screenshot-wide.png criado');

        // Screenshot narrow
        const narrowBuffer = createNarrowScreenshot();
        fs.writeFileSync(path.join(__dirname, 'assets', 'screenshot-narrow.png'), narrowBuffer);
        console.log('✓ screenshot-narrow.png criado');

        console.log('Screenshots gerados com sucesso!');
    } catch (error) {
        console.error('Erro ao gerar screenshots:', error.message);
    }
}

generateScreenshots();
