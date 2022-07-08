const cacheName = "weatherApp-v1";

const OFFLINE_URL = "./offline.html";

// instalacija service worker-a
self.addEventListener("install", (event) => {
  console.log("service worker has been installed");
  event.waitUntil((async() => {
    const cache = await caches.open(cacheName);
    console.log("[Service Worker] Caching all: app shell and content");
    await cache.add(new Request(OFFLINE_URL, {cache: "reload"}))
  })()
  );
});

// listening aktivacijskog eventa service worker-a
// self.addEventListener("activate", (event) => {
//   console.log("service worker has been activated");
// });


//ovo treba popraviti
self.addEventListener("fetch", (e)=>{
    e.respondWith((async ()=> {


      // ovaj dio koda provjerava da li je traženi pojam u cache-u 
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if(r) {
          console.log("nasao u cache-u")
          return r;
      }

      // ovaj dio koda sprema podatke u cache ako prethodno pojam nije pronaden u cache-u 
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      console.log("nisam nasao u cache-u, spremam nađeno")
      return response;

    })());
})

