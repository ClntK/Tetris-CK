// Project: Tetris CK
// Filename: tetrisck.js
// Created date: 12/30/2021
// Author: Clint Kline
// Purpose:
//  - Create my own version of the game tetris

// ========================
// searchbox :>> console
// ========================

//  a variable for the frames per second
const fps = 7.5;
// a variable to represent the width of the canvas
const W = 432;
// a variable to represent the height of the canvas
const H = 528;
// variable to represent the vertical position of a shape
const X = 0;
// variable to represent the horizontal position of a shape
const Y = 0;

// a variable to keep track of the iteration count
let ITER = 0;
// var indicating game state
let paused = false;

// assign a var to the canvas
const canvas = document.getElementById("canvas");
// create a var to rep the current canvas to display the gamebox
// "2d", leading to the creation of a CanvasRenderingContext2D object representing a two-dimensional rendering context.
const ctx = canvas.getContext("2d");

// assign a var to the mini canvas
const minicanvas = document.getElementById("minicanvas");
// create a var to rep the current minicanvas to display the next tetromino
const minictx = minicanvas.getContext("2d");

// create a variable to represent the score displays
const score = document.getElementsByClassName("score");

// CANVAS
// canvas background color
ctx.fillStyle = "#000000";
// context.fillRect(x,y,width,height);
ctx.fillRect(0, 0, 432, 528);
// 'screenshot' the canvas and save in temp mem
let canvasData = ctx.getImageData(0, 0, 432, 528);
// paints data from the given ImageData object onto the canvas
ctx.putImageData(canvasData, 0, 0);

// MINI-CANVAS
// minicanvas background color
minictx.fillStyle = "#000000";
// context.fillRect(x,y,width,height);
minictx.fillRect(0, 0, 120, 120);
// 'screenshot' the canvas and save in temp mem
let minicanvasData = minictx.getImageData(0, 0, 120, 120);
// paints data from the given ImageData object onto the canvas
minictx.putImageData(minicanvasData, 0, 0);


// vars to test for overlap of tets at top of gamebox as indicator for lost game
var safetyFlag = false;
var overlapFlag = false;


// create a var to track the game status
const gameStatus = {
    points: 0,
    fps: 7.5,
    boardW: 432,
    boardH: 528
}

// create a var to track of keypresses
const keyPresses = [0];

// var to rep tet position and boundaries
const tetromino = {
    position: { x: (W - 48) / 2, y: 0 },
    collisionPt: [[18,
        36,
        54,
        { x: 24, y: 48 },
        { x: 48, y: 48 }],
    [48, 48, 48]]
}

// func to create a tetromino object
function Tetromino(imgSrc, collPt1x, collPt1y, collPt2x, collPt2y, collPt3x, collPt3y) {
    this.image = new Image();
    this.image.crossOrigin = "Anonymous";
    this.image.src = imgSrc,
        // template to define boundaries
        this.collisionPt = [collPt1x, collPt1y, collPt2x, collPt2y, collPt3x, collPt3y]
}


// assign images to tetrominoes and set boundary points
const square = new Tetromino("images/tetromino_sq.png", 12, 48, 36, 48, 36, 48);

const theT = new Tetromino("images/tetromino_t.png", 12, 48, 36, 48, 60, 48);
const theTw = new Tetromino("images/tetromino_t1.png", 12, 48, 36, 72, 36, 72);
const theTs = new Tetromino("images/tetromino_t2.png", 12, 24, 36, 48, 60, 24);
const theTe = new Tetromino("images/tetromino_t3.png", 12, 72, 36, 48, 36, 48);

const theI = new Tetromino("images/tetromino_i.png", 12, 96, 12, 96, 12, 96);
const theIew = new Tetromino("images/tetromino_i1.png", 12, 24, 36, 24, 84, 24);

const theJ = new Tetromino("images/tetromino_j.png", 12, 48, 36, 48, 60, 48);
const theJw = new Tetromino("images/tetromino_j1.png", 12, 72, 36, 72, 12, 72);
const theJs = new Tetromino("images/tetromino_j2.png", 12, 24, 36, 24, 60, 48);
const theJe = new Tetromino("images/tetromino_j3.png", 12, 72, 36, 24, 36, 24);

const theL = new Tetromino("images/tetromino_l.png", 12, 48, 36, 48, 60, 48);
const theLw = new Tetromino("images/tetromino_l1.png", 12, 24, 36, 72, 36, 72);
const theLs = new Tetromino("images/tetromino_l2.png", 12, 48, 36, 24, 60, 24);
const theLe = new Tetromino("images/tetromino_l3.png", 12, 72, 36, 72, 36, 72);

const theZ = new Tetromino("images/tetromino_z.png", 12, 24, 36, 48, 60, 48);
const theZ1 = new Tetromino("images/tetromino_z1.png", 12, 72, 36, 48, 36, 48);

const theS = new Tetromino("images/tetromino_s.png", 12, 48, 36, 48, 60, 24);
const theS1 = new Tetromino("images/tetromino_s1.png", 12, 48, 36, 72, 36, 72);

// var to rep current/an initial tetromino ???
let currentTet = new Tetromino("images/tetromino_sq.png", 12, 48, 36, 48, 36, 48)


// create a var to rep the random tetromino placed on the canvas at the beginning of each turn
const storedTet = [square, theI, theJ, theL, theT, theZ, theS];

// function to rotate tetrominoes
function rotateTetromino() {

    // for the J
    if (currentTet === theJ) {
        // 90 degrees counter-clockwise
        currentTet = theJw;
    } else if (currentTet === theJw) {
        // 90 degrees counter-clockwise
        currentTet = theJs;
    } else if (currentTet === theJs) {
        // 90 degrees counter-clockwise
        currentTet = theJe;
    } else if (currentTet === theJe) {
        // 90 degrees counter-clockwise  << same for all tets
        currentTet = theJ;

        // for the T
    } else if (currentTet === theT) {
        currentTet = theTw;
    } else if (currentTet === theTw) {
        currentTet = theTs;
    } else if (currentTet === theTs) {
        currentTet = theTe;
    } else if (currentTet === theTe) {
        currentTet = theT;

        // for the I
    } else if (currentTet === theI) {
        currentTet = theIew;
    } else if (currentTet === theIew) {
        currentTet = theI;

        // for the L
    } else if (currentTet === theL) {
        currentTet = theLw;
    } else if (currentTet === theLw) {
        currentTet = theLs;
    } else if (currentTet === theLs) {
        currentTet = theLe;
    } else if (currentTet === theLe) {
        currentTet = theL;

        // for the S
    } else if (currentTet === theS) {
        currentTet = theS1;
    } else if (currentTet === theS1) {
        currentTet = theS;

        // for the Z
    } else if (currentTet === theZ) {
        currentTet = theZ1;
    } else if (currentTet === theZ1) {
        currentTet = theZ;
    }
}

//  func to draw/refresh canvas
function drawCanvas() {
    ctx.putImageData(canvasData, 0, 0);
}

// make a copy of the canvas and store it to refresh game screen after tet is dropped
function copyCanvas() {
    canvasData = ctx.getImageData(0, 0, 432, 528);
}

// func to create and place a new tet on the canvas
function drawTetromino(tetromino, xpos, ypos) {
    ctx.drawImage(tetromino, xpos, ypos);
}

var tetArray = [];
resetTet();

// function to detect collisions between borders and other tets
function detectCollision() {
    getHitInfo();
    endDetect();
    // console.log("tetromino.position.y + currentTet.image.height: ", tetromino.position.y + currentTet.image.height)


    // call getHitInfo() from line 215
    //////////////////////
    // "tetromino.position.y + currentTet.image.height === H" << if the distance from the bottom left corner of the canvas
    //  to the bottom left corner of the tetromino + the height of the tetromino == the total height of the canvas << this means the tet is at the top
    //////////////////////>> OR:
    // 
    // 
    /////////////////////
    // if the bottom of the current tet collides with another
    if (tetromino.position.y + currentTet.image.height === H || (currentTet.hit1.data[0] !== 0 || currentTet.hit2.data[1] !== 0 || currentTet.hit3.data[0] !== 0)) {

        if ((tetromino.position.y + currentTet.image.height) < 61) {
            overlapFlag = true;
            console.log("overlapFlag: ", overlapFlag)

        }

        else {
            console.log(
                console.log("collision detected!"
                    // , "the H: ", H,
                    // "\ntetromino.position.y + currentTet.image.height: ", tetromino.position.y + currentTet.image.height,
                    // "\ncurrentTet.hit1.data[0]: ", currentTet.hit1.data[0],
                    // "\ncurrentTet.hit2.data[1]: ", currentTet.hit2.data[1],
                    // "\ncurrentTet.hit3.data[0]: ", currentTet.hit3.data[0])
                )

            );

            // console.log("hit1 data0: ", currentTet.hit1.data[0])
            // console.log("hit1 data1: ", currentTet.hit1.data[1])
            // console.log("hit1 data2: ", currentTet.hit1.data[2])
            // console.log("hit1 data3: ", currentTet.hit1.data[3])
            // console.log("hit2 data0: ", currentTet.hit2.data[0])
            // console.log("hit2 data1: ", currentTet.hit2.data[1])
            // console.log("hit2 data2: ", currentTet.hit2.data[2])
            // console.log("hit2 data3: ", currentTet.hit2.data[3])
            // console.log("hit3 data0: ", currentTet.hit3.data[0])
            // console.log("hit3 data1: ", currentTet.hit3.data[1])
            // console.log("hit3 data2: ", currentTet.hit3.data[2])
            // console.log("hit3 data3: ", currentTet.hit3.data[3])
            // console.log("row checked: line 243");

        }

        rowCheck();
        copyCanvas();
        resetTet();
        ITER++;
    }

}


// when the tet collides before dropping below 108px end game
function endDetect() {
    // if the tet has dropped below 108px from top of gamebox make the engage safetyFlag
    if ((tetromino.position.y + currentTet.image.height) > 60) {
        safetyFlag = true;
        // console.log("safetyFlag: ", safetyFlag);
        // console.log("overlapFlag: ", overlapFlag);
    }
    // if the safety flag is true and the tet doesnt drop below 60px again
    else if ((safetyFlag == true) && (overlapFlag == true)) {
        // console.log("safetyFlag: ", safetyFlag);
        // console.log("overlapFlag: ", overlapFlag);
        endGame();
    }
}

function endGame() {
    paused = true;
    stopTimer();
    clearInterval(game);

    // widescreen score
    score[0].innerHTML = "GAME OVER \nSCORE: " + gameStatus.points;
    // medium screen score
    score[1].innerHTML = "GAME OVER \nSCORE: " + gameStatus.points;
    // mobile score
    score[2].innerHTML = "GAME OVER \nSCORE: " + gameStatus.points;
}


function rowCheck() {
    const imgDataArray = [[],
    [],
    [],
    [],
    [],
    [],
    []];

    const positionArray = [516, 492, 468, 444, 420, 396, 372];

    //  for each element in positionArray[] 
    for (let j = 0; j < positionArray.length; j++) {
        // 
        for (let x = 12; x < 420; x += 24) {
            let imgData = ctx.getImageData(x, positionArray[j], 1, 1);
            imgDataArray[j].push(imgData);
            // console.log("x: ", x, "positionArray[j]: ", positionArray[j]);
        }
    }

    for (let m = 0; m < imgDataArray.length; m++) {
        let rowChecked = checkRows(m, imgDataArray);
        if (rowChecked === true) {
            clearRow(m);
        }
    }
}

function checkRows(row, imgDataArray) {
    for (let i = 0; i < imgDataArray[row].length; i++) {
        if (imgDataArray[row][i].data[0] === 0 && imgDataArray[row][i].data[1] === 0 && imgDataArray[row][i].data[2] === 0) {
            return false;
        }
    }
    return true;
}

function clearRow(row) {
    const arrayRow = [504, 480, 456, 432, 408, 384, 360];
    const savedCanvas = ctx.getImageData(0, 0, W, arrayRow[row]);
    ctx.putImageData(savedCanvas, 0, 24);
    gameStatus.points += 1;
    // widescreen score
    score[0].innerHTML = "SCORE: " + gameStatus.points;
    // medium screen score
    score[1].innerHTML = "SCORE: " + gameStatus.points;
    // mobile score
    score[2].innerHTML = "SCORE: " + gameStatus.points;
}

function resetTet() {
    var tet = randomizeTetromino();

    minictx.clearRect(0, 0, canvas.width, canvas.height);


    if (tetArray.length < 2) {
        for (t = 0; t < 2; t++) {
            var tet = randomizeTetromino();
            tetArray.push(tet);
        }
        currentTet = tetArray[0];
        nextTet = tetArray[1].image;

        var imgWdth = nextTet.width;
        var imgHt = nextTet.height;
        var cnvsWdth = minicanvas.height;
        var cnvsHt = minicanvas.height;
        var paddingX = (cnvsWdth - imgWdth) / 2;
        var paddingY = (cnvsHt - imgHt) / 2;

        console.log("var imgWdth = ", nextTet.width,
            "var imgHt = ", nextTet.height,
            "var cnvsWdth = ", minicanvas.height,
            "var cnvsHt = ", minicanvas.height,
            "padding = ", (cnvsWdth - imgWdth) / 2
        );

        minictx.drawImage(nextTet, 0, 0, imgWdth, imgHt, paddingX, paddingY, imgWdth, imgHt);
        tetromino.position.y = 0;
        tetromino.position.x = (W - 48) / 2;
    }
    else {
        tetArray.push(tet);
        tetArray.shift();
        currentTet = tetArray[0];
        nextTet = tetArray[1].image;

        var imgWdth = nextTet.width;
        var imgHt = nextTet.height;
        var cnvsWdth = minicanvas.height;
        var cnvsHt = minicanvas.height;
        var paddingX = (cnvsWdth - imgWdth) / 2;
        var paddingY = (cnvsHt - imgHt) / 2;

        console.log("var imgWdth = ", nextTet.width,
            "var imgHt = ", nextTet.height,
            "var cnvsWdth = ", minicanvas.height,
            "var cnvsHt = ", minicanvas.height,
            "padding = ", (cnvsWdth - imgWdth) / 2
        );

        minictx.drawImage(nextTet, 0, 0, imgWdth, imgHt, paddingX, paddingY, imgWdth, imgHt);
        tetromino.position.y = 0;
        tetromino.position.x = (W - 48) / 2;
    }
}

// func to select a random tetromino to place on the canvas at the beginning of each turn
function randomizeTetromino() {
    const randomTetromino = Math.floor(Math.random() * 7);
    return storedTet[randomTetromino];
}

function updateGameState() {
    drawCanvas();
    copyCanvas();
    tetromino.position.y += 12;
    moveX();
    drawTetromino(currentTet.image, tetromino.position.x, tetromino.position.y);
    detectCollision();
}

function getHitInfo() {
    currentTet.hit1 = ctx.getImageData(tetromino.position.x + currentTet.collisionPt[0], tetromino.position.y + currentTet.collisionPt[1] + 1, 1, 1);
    currentTet.hit2 = ctx.getImageData(tetromino.position.x + currentTet.collisionPt[2], tetromino.position.y + currentTet.collisionPt[3] + 1, 1, 1);
    currentTet.hit3 = ctx.getImageData(tetromino.position.x + currentTet.collisionPt[4], tetromino.position.y + currentTet.collisionPt[5] + 1, 1, 1);
}

// move tet along x axis
function moveX(eraseArray) {
    tetromino.position.x += keyPresses[0];
    tetromino.position.x = Math.max(0, Math.min(tetromino.position.x, (W - currentTet.image.width)));
    keyPresses.unshift(0);
}

// func to drop tet on down keypress
function dropDownTetromino() {
    while (tetromino.position.y != 0) {
        tetromino.position.y += 12;
        getHitInfo();
        if (tetromino.position.y + currentTet.image.height === H || (currentTet.hit1.data[0] !== 0 || currentTet.hit2.data[1] !== 0 || currentTet.hit3.data[0] !== 0)) {
            drawCanvas();
            drawTetromino(currentTet.image, tetromino.position.x, tetromino.position.y);
            console.log("tet dropped")
            rowCheck();
            copyCanvas();
            resetTet();
            ITER++;
        }
    }
}

//  assign key functions
function storeKey(ev) {
    const arrows = ((ev.which)) || ((ev.keyCode));

    switch (arrows) {
        //  space bar
        case 32:
            if (!paused) {
                dropDownTetromino();
            }
            break;
        // ??
        case 37:
            if (!paused) {
                keyPresses.unshift(-24);
            }
            break;
        // up arrow
        case 38:
            if (!paused) {
                rotateTetromino();
            }
            break;
        // ??
        case 39:
            if (!paused) {
                keyPresses.unshift(24);
            }
            break;
        // move right
        case 40:
            if (!paused) {
                tetromino.position.y += 12;
            }
            break;
        // P key, pause/unpause
        case 80:
            if (paused) {
                paused = false;
                game = setInterval(updateGameState, 1000 / fps);
                startTimer();
            } else {
                paused = true;
                clearInterval(game);
                stopTimer();
            }
            break;
    }
}


let game = setInterval(updateGameState, 1000 / fps);



////////////////////////////////////
// TIMER FUNCTIONS
////////////////////////////////////

const timer = document.getElementsByClassName('timer');

var hr = 0;
var min = 0;
var sec = 0;
var stoptime = true;


function startTimer() {
    if (stoptime == true) {
        stoptime = false;
        timerCycle();
    }
}

function stopTimer() {
    if (stoptime == false) {
        stoptime = true;
    }
}

function timerCycle() {
    if (stoptime == false) {
        sec = parseInt(sec);
        min = parseInt(min);
        hr = parseInt(hr);

        sec = sec + 1;

        if (sec == 60) {
            min = min + 1;
            sec = 0;
        }
        if (min == 60) {
            hr = hr + 1;
            min = 0;
            sec = 0;
        }

        if (sec < 10 || sec == 0) {
            sec = '0' + sec;
        }
        if (min < 10 || min == 0) {
            min = '0' + min;
        }
        if (hr < 10 || hr == 0) {
            hr = '0' + hr;
        }

        // widescreen clock
        timer[0].innerHTML = hr + ':' + min + ':' + sec;
        // medium clock
        timer[1].innerHTML = hr + ':' + min + ':' + sec;
        // mobile clock
        timer[2].innerHTML = hr + ':' + min + ':' + sec;

        setTimeout("timerCycle()", 1000);
    }
}
