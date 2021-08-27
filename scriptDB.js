let dbAccess;
let request = indexedDB.open("camera", 1);
let container = document.querySelector(".container");
request.addEventListener("success", function () {
    dbAccess = request.result;
})

request.addEventListener("upgradeneeded", function () {
    let db = request.result;
    db.createObjectStore("gallery", { keyPath: "mId" });
});

request.addEventListener("error", function () {
    alert("some error occured");
})

function addMedia(type, media) {
    let tx = dbAccess.transaction("gallery", "readwrite");
    let galleryObjectStore = tx.objectStore("gallery");
    let data = {
        mId: Date.now(),
        type,
        media,
    };
    galleryObjectStore.add(data);
}

function viewMedia() {
    let tx = dbAccess.transaction("gallery", "readonly");
    let galleryObjectStore = tx.objectStore("gallery");
    let req = galleryObjectStore.openCursor();
    req.addEventListener("success", function () {
        let cursor = req.result;
        if (cursor) {
            let div = document.createElement("div");
            div.classList.add("media-card");
            div.innerHTML = `<div class="media-container">
                ${cursor.value.type}
            </div>
            <div class="action-container">
                <button class="media-download"></button>
                <button class="media-delete"></button>
            </div>`;
            container.appendChild(div);
            cursor.continue();
        }
    })
}