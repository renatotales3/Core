/**
 * Service Worker for Core Finance PWA
 * Handles offline functionality, caching, and app updates
 */

const CACHE_NAME = 'core-finance-v1.0.0';
const STATIC_CACHE = 'core-finance-static-v1.0.0';
const DYNAMIC_CACHE = 'core-finance-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/reset.css',
    '/css/variables.css',
    '/css/base.css',
    '/css/components.css',
    '/css/layout.css',
    '/css/pages.css',
    '/js/app.js',
    '/js/navigation.js',
    '/js/charts.js',
    '/manifest.json',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Failed to cache static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated successfully');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip non-HTTP requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests
    if (isStaticFile(request)) {
        event.respondWith(handleStaticFile(request));
    } else if (isAPIRequest(request)) {
        event.respondWith(handleAPIRequest(request));
    } else {
        event.respondWith(handleDynamicRequest(request));
    }
});

// Check if request is for a static file
function isStaticFile(request) {
    const url = new URL(request.url);
    return STATIC_FILES.some(file => url.pathname.endsWith(file));
}

// Check if request is for an API
function isAPIRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api/') || url.hostname.includes('api.');
}

// Handle static file requests
async function handleStaticFile(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Fallback to network
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Cache the response for future use
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Failed to fetch static file:', error);
        
        // Return offline fallback if available
        if (request.url.includes('.html')) {
            return caches.match('/index.html');
        }
        
        throw error;
    }
}

// Handle API requests
async function handleAPIRequest(request) {
    try {
        // Try network first for API requests
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful API responses
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('API request failed:', error);
        
        // Try to serve from cache as fallback
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline response
        return new Response(
            JSON.stringify({ 
                error: 'Offline', 
                message: 'No internet connection available' 
            }),
            {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// Handle dynamic requests
async function handleDynamicRequest(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            // Cache successful responses
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Dynamic request failed:', error);
        
        // Try to serve from cache as fallback
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync') {
        event.waitUntil(performBackgroundSync());
    }
});

// Perform background sync
async function performBackgroundSync() {
    try {
        // Get stored offline actions
        const offlineActions = await getOfflineActions();
        
        if (offlineActions.length === 0) {
            return;
        }
        
        console.log('Processing offline actions:', offlineActions.length);
        
        // Process each offline action
        for (const action of offlineActions) {
            try {
                await processOfflineAction(action);
                await removeOfflineAction(action.id);
            } catch (error) {
                console.error('Failed to process offline action:', error);
            }
        }
        
        // Notify clients that sync is complete
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'SYNC_COMPLETE',
                data: { processedActions: offlineActions.length }
            });
        });
        
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Get stored offline actions
async function getOfflineActions() {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = await cache.match('/offline-actions');
        
        if (response) {
            const data = await response.json();
            return data.actions || [];
        }
        
        return [];
    } catch (error) {
        console.error('Failed to get offline actions:', error);
        return [];
    }
}

// Process offline action
async function processOfflineAction(action) {
    // Implementation depends on action type
    switch (action.type) {
        case 'ADD_TRANSACTION':
            // Process transaction addition
            console.log('Processing offline transaction:', action.data);
            break;
            
        case 'UPDATE_BALANCE':
            // Process balance update
            console.log('Processing offline balance update:', action.data);
            break;
            
        default:
            console.warn('Unknown offline action type:', action.type);
    }
}

// Remove processed offline action
async function removeOfflineAction(actionId) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = await cache.match('/offline-actions');
        
        if (response) {
            const data = await response.json();
            data.actions = data.actions.filter(action => action.id !== actionId);
            
            const newResponse = new Response(JSON.stringify(data), {
                headers: { 'Content-Type': 'application/json' }
            });
            
            await cache.put('/offline-actions', newResponse);
        }
    } catch (error) {
        console.error('Failed to remove offline action:', error);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('Push notification received:', event);
    
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body || 'Nova notificação do Core Finance',
            icon: '/assets/icons/icon-192x192.png',
            badge: '/assets/icons/icon-72x72.png',
            tag: 'core-finance-notification',
            data: data.data || {},
            actions: data.actions || [],
            requireInteraction: data.requireInteraction || false,
            silent: data.silent || false
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'Core Finance', options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action) {
        // Handle specific action clicks
        handleNotificationAction(event.action, event.notification.data);
    } else {
        // Default click behavior - open app
        event.waitUntil(
            clients.matchAll({ type: 'window' })
                .then(clientList => {
                    if (clientList.length > 0) {
                        clientList[0].focus();
                    } else {
                        clients.openWindow('/');
                    }
                })
        );
    }
});

// Handle notification actions
function handleNotificationAction(action, data) {
    switch (action) {
        case 'view':
            // Open specific view
            clients.openWindow(`/#${data.page || 'dashboard'}`);
            break;
            
        case 'dismiss':
            // Dismiss notification (already closed)
            break;
            
        default:
            console.log('Unknown notification action:', action);
    }
}

// Message handling from main thread
self.addEventListener('message', (event) => {
    console.log('Message received in service worker:', event.data);
    
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_VERSION':
            event.ports[0].postMessage({ version: CACHE_NAME });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches();
            break;
            
        default:
            console.log('Unknown message type:', type);
    }
});

// Clear all caches
async function clearAllCaches() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
        );
        
        console.log('All caches cleared successfully');
        
        // Notify clients
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CACHE_CLEARED',
                data: { success: true }
            });
        });
        
    } catch (error) {
        console.error('Failed to clear caches:', error);
        
        // Notify clients of failure
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'CACHE_CLEARED',
                data: { success: false, error: error.message }
            });
        });
    }
}

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
    self.addEventListener('periodicsync', (event) => {
        console.log('Periodic sync triggered:', event.tag);
        
        if (event.tag === 'background-sync') {
            event.waitUntil(performBackgroundSync());
        }
    });
}

console.log('Service Worker loaded successfully');