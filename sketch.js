let video;
let handPose;
let hands = [];
let pastPinchX;
let pastPinchY;
let dummyimage;
let bgimage;
let go;
let centerX;
let centerY;
const dummy = {
    xPos: 0,
    yPos: 0,
    xVel: 0,
    YVel: 0
}

function preload(){
    handPose = ml5.handPose({flipped: true});
}

function mousePressed(){
    console.log(hands);
}

function gotHands(results){
    hands = results;
}

function setup() {
    centerX = 0;
    centerY = 0;
    lastPinchX = 0;
    lastPinchY = 0;
  go = false;
  dummyimage = loadImage('Images/Dummy.png');
  bgimage = loadImage('Images/TestingChamber.png');
  createCanvas(window.innerWidth, window.innerHeight);
  video = createCapture(VIDEO, {flipped: true});
  video.hide();
  handPose.detectStart(video, gotHands);
}

function dummyCoords(){
    /*if(go == false && lastgo == true){
        dummy.xVel = centerX - lastPinchX;
        dummy.yVel = centerY - lastPinchY;
    }
    dummy.yVel += 1;
    dummy.xVel /= .95;
    if(dummy.xPos < 20){dummy.xPos = 20; dummy.xVel = 0;} else if(dummy.xPos > window.innerWidth - 20){dummy.xPos = window.innerWidth - 20; dummy.xVel = 0;}
    if(dummy.yPos < 20){dummy.yPos = 20; dummy.yVel = 0;} else if(dummy.yPos > window.innerHeight - 20){dummy.yPos = window.innerHeight - 20; dummy.yVel = 0;}*/
    //dummy.xPos += dummy.xVel;
    //dummy.yPos += dummy.yVel;
    if(!go){dummy.xPos = lastPinchX;
    dummy.yPos = lastPinchY;}
   
}

function draw() {
  //image(video, 0, 0, window.innerWidth, window.innerHeight);
  image(bgimage, 0, 0, window.innerWidth, window.innerHeight);

  // scale ratios 
  let vwidth = window.innerWidth / video.width;
  let vheight = window.innerHeight / video.height;
  dummyCoords();
  image(dummyimage, dummy.xPos * vwidth - 80, dummy.yPos * vheight - 60);
  go = false;
  if(hands.length > 0){
    let lastgo = go;
    let hand = hands[0];
    let finger = hand.index_finger_tip;
    let thumb = hand.thumb_tip;
    lastPinchX = centerX;
    lastPinchY = centerY;
    // Draw circles at finger positions
    centerX = (finger.x + thumb.x) / 2;
    centerY = (finger.y + thumb.y) / 2;
    // Calculate the pinch "distance" between finger and thumb
    let pinch = dist(finger.x, finger.y, thumb.x, thumb.y);
    
    

    
    // This circle's size is controlled by a "pinch" gesture
    if(pinch < 30){fill(255, 0, 0, 200);} else {fill(0, 255, 0, 200); go = true;}
    
    stroke(0);
    strokeWeight(2);
    circle(centerX * vwidth, centerY * vheight, pinch);
    for (let i = 0; i < hand.keypoints.length; i++){
        let keypoint = hand.keypoints[i];
        fill(255,0,255);
        noStroke();
        circle(keypoint.x * vwidth, keypoint.y * vheight, 16);
        /*if (keypoint.confidence > 0.1){
            CSSNumericValue(keypoint.x, keypoint.y, 16);
        }*/

    }
  }
}