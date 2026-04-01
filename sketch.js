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
let introTrans;
let introCursorY;
let intro1, intro2, intro3, intro4;
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

    intro1 = loadImage('Images/Intro/intro.png');
    intro2 = loadImage('Images/Intro/intro2.png');
    intro3 = loadImage('Images/Intro/intro3.png');
    intro4 = loadImage('Images/Intro/intro4.png');

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

    introTrans = 255.0;
    introCursorY = 0;
    //console.log(introTrans);
}

function dummyCoords(vwidth, vheight){
    if(!grab && lastgrab){
        dummy.xVel = (centerX - lastPinchX) / 10;
        dummy.yVel = (centerY - lastPinchY) / 10;
    }
    
    //dummy.xVel /= .95;
    //if(dummy.xPos < 20){dummy.xPos = 20; dummy.xVel = 0;} else if(dummy.xPos > window.innerWidth - 20){dummy.xPos = window.innerWidth - 20; dummy.xVel = 0;}
    //if(dummy.yPos < 20){dummy.yPos = 21; dummy.yVel = 0;} else if(dummy.yPos > window.innerHeight - dummyimage.height - 50){dummy.yPos = window.innerHeight - dummyimage.height - 50; dummy.yVel = 0;}
    
    if(dummy.xVel != 0 || dummy.yVel != 0){
        if(dummy.xPos > (window.innerWidth - dummyimage.width) / vwidth){
            dummy.xPos = (window.innerWidth - dummyimage.width) / vwidth;
            dummy.xVel = 0;
        } else if (dummy.xPos < (window.innerWidth - (window.innerWidth - dummyimage.width) ) / vwidth){
            dummy.xPos = (window.innerWidth - (window.innerWidth - dummyimage.width) ) / vwidth + 1;
            dummy.xVel = 0;
        }

        if(dummy.yPos > (window.innerHeight - dummyimage.height) / vheight ){
            dummy.yVel = 0;
            dummy.xVel = 0;
        } else if(dummy.yPos < 20  ){
            dummy.yPos = 21;
            if(dummy.yVel < 0){dummy.yVel /= 1.5;}
            dummy.xVel /= 1.3;
        }}

    

    //console.log(dummy.yVel);
    dummy.yPos += dummy.yVel;

    

    dummy.xPos += dummy.xVel;
    if(grab){dummy.xPos = lastPinchX;
    dummy.yPos = lastPinchY; dummy.yVel = 0;} else {dummy.yVel += 0.1;}
   
}

function detectGrab(){
    if(centerX > dummy.xPos - 15 && centerX < dummy.xPos + (dummyimage.width / 8) && centerY > dummy.yPos - 20 && centerY < dummy.yPos + (dummyimage.height / 18)){return true;}
}

function draw() {
    //console.log(dummy.yPos);
    createCanvas(window.innerWidth, window.innerHeight);
    //image(video, 0, 0, window.innerWidth, window.innerHeight);
    image(bgimage, 0, 0, window.innerWidth, window.innerHeight);

    // scale ratios 
    let vwidth = window.innerWidth / video.width;
    let vheight = window.innerHeight / video.height;
    dummyCoords(vwidth, vheight);
    image(dummyimage, dummy.xPos * vwidth - 80, dummy.yPos * vheight - 60);

    if(introTrans > 0){
        tint(255, introTrans); 
        image(intro1, 0, 0, window.innerWidth, window.innerHeight);
        image(intro2, 0, introCursorY, window.innerWidth, window.innerHeight);
        if(introTrans > 250) {
            image(intro3, 0, 0, window.innerWidth, window.innerHeight);
            introTrans -= 0.05;
        } else {
            if(introTrans < 210 && introTrans > 170){introCursorY+= 1.5;} else if (introTrans > 210) {introCursorY -= 1.5;} else (introTrans -= 2);
            
            
            image(intro4, 0, introCursorY, window.innerWidth, window.innerHeight);
            introTrans -= 0.25;
        }

        
    }
    noTint();
    

    if(hands.length > 0 && introTrans < 50){
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
        if(pinch < 65){image(handPinch, centerX * vwidth, centerY * vheight - 20, 50, 50); if(detectGrab()){grab = true}} else {image(handPinchOpen, centerX * vwidth, centerY * vheight, 50, 50); grab = false;}
        
    }
}