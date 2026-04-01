let video;
let handPose;
let hands = [];
let pastPinchX;
let pastPinchY;
let dummyimage;
let handPinch, handPinchOpen, handPunch;
let bgimage;
let grab;
let centerX;
let lastgrab;
let centerY;
const dummy = {
    xPos: 100,
    yPos: 50,
    xVel: 0.0,
    YVel: 0.1
}

function preload(){
    handPose = ml5.handPose({flipped: true});
    //loads images
    dummyimage = loadImage('Images/Dummy.png');
    bgimage = loadImage('Images/TestingChamber.png');
    handPinch = loadImage('Images/Cursor/Pinch.png');
    handPinchOpen = loadImage('Images/Cursor/PinchOpen.png');
    handPunch = loadImage('Images/Cursor/Punch.png');
}

function mousePressed(){
    console.log(hands);
}

function gotHands(results){
    hands = results;
}

function calcHandAngle(x1, y1, x2, y2){ //Calculates the angle of the current hand pose. 
    return (Math.atan2(y2-y1, x2-x1) * 180) / Math.PI;
}

function setup() {
    centerX = 0;
    centerY = 0;
    lastPinchX = 0;
    lastPinchY = 0;
    grab = false;
    lastgrab = false;
    
    createCanvas(window.innerWidth, window.innerHeight);
    video = createCapture(VIDEO, {flipped: true});
    video.hide();
    handPose.detectStart(video, gotHands);

    dummy.yVel = 0.0;
    dummy.xVel = 0.0;
}

function dummyCoords(vwidth, vheight){
    /*if(grab == false && lastgrab == true){
        dummy.xVel = centerX - lastPinchX;
        dummy.yVel = centerY - lastPinchY;
    }*/
    
    //dummy.xVel /= .95;
    //if(dummy.xPos < 20){dummy.xPos = 20; dummy.xVel = 0;} else if(dummy.xPos > window.innerWidth - 20){dummy.xPos = window.innerWidth - 20; dummy.xVel = 0;}
    //if(dummy.yPos < 20){dummy.yPos = 21; dummy.yVel = 0;} else if(dummy.yPos > window.innerHeight - dummyimage.height - 50){dummy.yPos = window.innerHeight - dummyimage.height - 50; dummy.yVel = 0;}
    //dummy.xPos += dummy.xVel;
    
    if(dummy.yPos > (window.innerHeight - dummyimage.height) / vheight ){
        dummy.yVel = 0;
    }

    console.log(dummy.yVel);
    dummy.yPos += dummy.yVel;
    if(grab){dummy.xPos = lastPinchX;
    dummy.yPos = lastPinchY; dummy.yVel = 0;} else {dummy.yVel += 0.1;}
   
}

function detectGrab(){
    if(centerX > dummy.xPos - 15 && centerX < dummy.xPos + (dummyimage.width / 8) && centerY > dummy.yPos - 20 && centerY < dummy.yPos + (dummyimage.height / 18)){return true;}
}

function draw() {
    console.log(dummy.yPos);
    createCanvas(window.innerWidth, window.innerHeight);
    //image(video, 0, 0, window.innerWidth, window.innerHeight);
    image(bgimage, 0, 0, window.innerWidth, window.innerHeight);

    // scale ratios 
    let vwidth = window.innerWidth / video.width;
    let vheight = window.innerHeight / video.height;
    dummyCoords(vwidth, vheight);
    image(dummyimage, dummy.xPos * vwidth - 80, dummy.yPos * vheight - 60);
    if(hands.length > 0){
        lastgrab = grab;
        let hand = hands[0];
        let finger = hand.index_finger_tip;
        let thumb = hand.thumb_tip;
        lastPinchX = centerX;
        lastPinchY = centerY;
        centerX = (finger.x + thumb.x) / 2;
        centerY = (finger.y + thumb.y) / 2;
        // Calculate the pinch "distance" between finger and thumb
        let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);
        
        

        
        // Detects if the hand is pinching and changes the cursor accordingly
        if(pinch < 45){image(handPinch, centerX * vwidth, centerY * vheight - 20, 50, 50); if(detectGrab()){grab = true}} else {image(handPinchOpen, centerX * vwidth, centerY * vheight, 50, 50); grab = false;}
        
        /*stroke(0);
        strokeWeight(2);
        circle(centerX * vwidth, centerY * vheight, pinch);*/
        /*for (let i = 0; i < hand.keypoints.length; i++){
            let keypoint = hand.keypoints[i];
            fill(255,0,255);
            noStroke();
            circle(keypoint.x * vwidth, keypoint.y * vheight, 16);
            /*if (keypoint.confidence > 0.1){
                CSSNumericValue(keypoint.x, keypoint.y, 16);
            }

        }*/
    }
}