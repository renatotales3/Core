// Service Worker para Core PWA
const CACHE_NAME = 'core-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/main.css',
    '/js/app.js',
    '/js/core/App.js',
    '/js/core/Router.js',
    '/js/core/Utils.js',
    '/js/modules/Dashboard.js',
    '/js/modules/Settings.js',
    '/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Install');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching files');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.log('Service Worker: Cache failed', error);
            })
    );
    // Força ativação imediata
    self.skipWaiting();
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Activate');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Toma controle imediatamente
    self.clients.claim();
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna cache se disponível
                if (response) {
                    return response;
                }

                // Faz requisição e cacheia se for GET
                return fetch(event.request).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(() => {
                // Fallback para página offline se necessário
                if (event.request.destination === 'document') {
                    return caches.match('/');
                }
            })
    );
});

// Sincronização em background (opcional)
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

function doBackgroundSync() {
    // Implementar sincronização de dados quando online
    console.log('Service Worker: Background sync');
}
