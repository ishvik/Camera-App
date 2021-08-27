let video = document.querySelector("video");  //getting element from html of video
let body = document.querySelector("body");
let vidbtn = document.querySelector("button#record");   //getting button of record
let captureBtn = document.querySelector("button#capture"); //getting button of capture

let filterBtn = document.querySelector(".filter-btn");
let zoomIn = document.querySelector(".zoom-in");
let zoomOut = document.querySelector(".zoom-out");
let minZoom = 1;
let maxZoom = 3;
let currZoom = -1;

let galleryBtn = document.querySelector(".galleryBtn");

let constraints = { video: true, audio: true };      //giving constraint like video true if we want video, audio true if we want audio
let mediaRecorder;                          //variable used for creating object of mediaRecorder

navigator // inbuilt browser object which is used to access camera
    .mediaDevices  //object of navigator
    .getUserMedia(constraints)  //getting media of users like camera,this function returns promise
    .then(function (mediaStream) {   //handling resolving through then if user click on allow then it will open the camera else not
        video.srcObject = mediaStream;   //adding source of webcam through video.srcObject
        mediaRecorder = new MediaRecorder(mediaStream);

        mediaRecorder.addEventListener("dataavailable", function (e) {  //when video start this function will invoke
            chunks.push(e.data);                                        //push each data to chunks    
        });

        mediaRecorder.addEventListener("stop", function () {             //when you stop media recorder this event will invoke   
            let blob = new Blob(chunks, { type: "video/mp4" });         //making a blob of chunks as one unit
            addMedia("video",blob);
            chunks = [];                                                 //empty the chunk

            // let url = URL.createObjectURL(blob);                        //creating object of blob
            // let a = document.createElement("a");                        //creating anchor tag
            // a.href = url;                                               //set anchor's tag href to blob's url
            // a.download = "video.mp4";                                   //download video as video.mp4
            // a.click();                                                  //click anchor tag
            // a.remove();                                                 //remove anchor tag
        });
    });
let isRecording = false;                    //variable for checking recording is on or not
let chunks = [];                            //used for storing different element of video while recording
//adding event listener 
vidbtn.addEventListener("click", function () {      //event listener will invoke on click
    let innerDiv = vidbtn.querySelector("div");
    if (isRecording) {                            //if recording is on
        mediaRecorder.stop();                   //then stop() function will invoke and recoding stop
        isRecording = false;                    //making isRecoring = false for knowing that recording is stop              //making innerText agian record bcz recording is stop
        innerDiv.classList.remove("record-animation");
    } else {
        mediaRecorder.start();              //if isRecording is false then it will start 
        filter = "";
        removeFilter();
        video.style.transform = `scale(1)`;
        currZoom = 1;
        isRecording = true;
        innerDiv.classList.add("record-animation");
    }
});

captureBtn.addEventListener("click", function () {        //invoke when click capture button
    let innerDiv = captureBtn.querySelector("div");
    innerDiv.classList.add("capture-animation");
    setTimeout(function () {
        innerDiv.classList.remove("capture-animation");
    }, 900)
    captuteImg();
});

//function for click image
function captuteImg() {
    let c = document.createElement("canvas");      //creating canvas tag
    c.width = video.videoWidth;                    //fixing width of canvas as video's width
    c.height = video.videoHeight;                  //fixing height of canvas as video's height
    let ctx = c.getContext("2d");

    ctx.translate(c.width / 2, c.height / 2);
    ctx.scale(currZoom, currZoom);
    ctx.translate(-c.width / 2, -c.height / 2);

    ctx.drawImage(video, 0, 0);                     //drawing image through video tag
    if (filter != "") {
        ctx.fillStyle = filter;
        ctx.fillRect(0, 0, c.width, c.height);
    }
    // let a = document.createElement("a");            //creating an anchor tag
    // a.download = "image.png";                       //save image as image.png
    // a.href = c.toDataURL();                         //href of download
    addMedia("img",c.toDataURL());
    // a.click();                                      //clicking anchor tag for download image        
    // a.remove();                                     //after downloading remove anchor tag        
}

zoomIn.addEventListener("click", function () {
    let vidCurrScale = video.style.transform.split("(")[1].split(")")[0];
    if (vidCurrScale > maxZoom) {
        return;
    } else {
        currZoom = Number(vidCurrScale) + 0.1;
        video.style.transform = `scale(${currZoom})`;
    }
})

zoomOut.addEventListener("click", function () {
    if (currZoom > minZoom) {
        currZoom -= 0.1;
        video.style.transform = `scale(${currZoom})`;
    }
})

let filters = document.querySelectorAll(".filters-color");
console.log(filters);
let filterContainer = document.querySelector(".filters-container")
filterBtn.addEventListener("click", function (e) {
    if(filterContainer.style.display == "block"){
        filterContainer.style.display = "none";
    }else{
        filterContainer.style.display = "block";
    }

})

let filter = "";
for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", function (e) {
        filter = e.currentTarget.style.backgroundColor;
        // console.log(filter);
        removeFilter();
        applyFilter(filter);
    })
}

function applyFilter(filterColor) {
    let filterDiv = document.createElement("div");
    filterDiv.classList.add("filter-div");
    filterDiv.style.backgroundColor = filterColor;
    body.appendChild(filterDiv);
}

function removeFilter() {
    let filterDiv = document.querySelector(".filter-div");
    if (filterDiv) filterDiv.remove();
}

galleryBtn.addEventListener("click",function(){
    location.assign(gallery.html);
})