// if("serviceWorker" in navigator) { //provjeravamo da li browser podrzava service worker-e, ako da, u tom slucaju izvrsava kod
//     navigator.serviceWorker.register("./sw.js") //ovo je asinkron task i vraca Promise
//     .then((reg)=> console.log("service worker registered", reg))
//     .catch((err)=> console.log("service worker not registered", err)) 
// }