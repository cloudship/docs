const CACHE_NAME = "v33";
const cacheFiles = [
  "/docs/",
  "/docs/index.html",
  "/docs/bundle.js"
]

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log("start caching files: " + CACHE_NAME);
        return cache.addAll(cacheFiles)
      }, function (err) {
        console.log("fail to open cache: " + err)
      })
  )
})

self.addEventListener("fetch", function (event) {
  console.log("start loading cache content...")
  event.respondWith(
    caches.match(event.request).then(function (response) {
      //in case there's a match
      if (response) {
        console.log("now loading: " + event.request.url)
        return response;
      }
      //in case there's no match
      let req = event.request.clone();
      fetch(req).then(
        function (response) {
          if (!reponse || response.status != 200 || response.type !== 'basic') { return response }
          let res = response.clone();
          caches.open(CACHE_NAME)
            .then(function (cache) {
              console.log("start cahcing new files ...")
              cache.put(event.request, res)
            })
          return response;
        }).catch(function () {
          console.log("unable to resolve the request.")
          return "unable to resolve the request.";
        })
    })
  )
})
