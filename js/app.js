// Core App - Arquivo Principal
// Carrega todos os módulos e inicializa a aplicação

// Carrega os módulos na ordem correta
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa a aplicação
    new CoreApp();
});

// Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}