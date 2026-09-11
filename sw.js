const CACHE_NAME = 'samo-wms-v26';

// عند التثبيت: مسح أي كاش قديم وتفعيل الإصدار الجديد فوراً
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

// عند التفعيل: حذف جميع النسخ المخزنة القديمة نهائياً
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            return caches.delete(k); // مسح تلقائي للذاكرة القديمة
          }
        })
      );
    })
  );
  self.clients.claim();
});

// استراتيجية الجلب: جلب الملفات المحدثة من السيرفر وتجاوز الكاش العالق
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('script.google.com')) {
    return; // استثناء جوجل شيت ليبقى متصلاً بالداتا سورس
  }
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
