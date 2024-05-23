let roundCounter = 1; // counter for each round

let xScore = 0; // X Score
let oScore = 0; // O Score

let aud;
let audX;
let audO;
let audWin;
let audDraw;

const DIAMETER = 100; // For size of 'O'
const SCL = 0.8; // For size of 'X'  

let w, h, d; 
// the w calculates the cell 
// the h calculates the cell
// the d is the diagonal length of X


//3x3 matrix
//It is used to check the status of the cell (empty, X or O).
let cells = [
	[null, null, null],
	[null, null, null],
	[null, null, null]
];

let count = 9;
let player = 'X';
let nextPlayer = 'O';
let info;
let xScoreDisplay;
let oScoreDisplay;


function preload(){
  img = loadImage('assets/wall.jpg');
  aud = createAudio('assets/audio.mp3')
  audX = loadSound('assets/XVoice.mp3');
  audO = loadSound('assets/OVoice.mp3');
  audWin = loadSound('assets/WinVoice.mp3');
  audDraw = loadSound('assets/DrawVoice.mp3');
}

function setup() {
	createCanvas(500, 500);
    colorMode(HSB,360,100,100,100);
    img.loadPixels();
    c = img.get(img.width,img.height); //For the background of the game
    
    //for grids
	w = floor(width / 3); //width by dividing the canvas width by 3
	h = floor(height / 3); //height by dividing the canvas height by 3
	d = dist(0, 0, w, h) * SCL; //for the distance between grids

	info = document.getElementById("info");
    xScoreDisplay = document.getElementById("xScore");
    oScoreDisplay = document.getElementById("oScore");

// Settings...
	strokeWeight(3); //for the thickness of the grids
	noFill(); // To avoid coloring the inside of the 'O's'
  
// Audio...
aud.play();
//aud.pause();
aud.volume(1);
aud.speed(1);
aud.time(42);
//aud.showControls();
aud.hideControls();
aud.loop();

}
//For 'X' or 'O' to start randomly
function randomizePlayers() {
    let randomStart = floor(random(0,2));
    if (randomStart === 0) {
        player = 'X';
        nextPlayer = 'O';
    } else {
        player = 'O';
        nextPlayer = 'X';
    }
}

function draw() {
	background(c);
    image(img, 0, 0, 500, 500);
  
	drawLines();
	drawSymbols();
    rounds.innerHTML ="Round:"+ roundCounter;
	info.innerHTML = "Next turn: " + player;
	if(checkWinner()) {
		info.innerHTML = winner + " Wins!";
        updateScore();
		noLoop();//Stops the draw function when a winner is determined or the game ends in a draw.
	}
}

function mousePressed() {
//This line checks whether the mouse click is within the canvas (game board) area.
	if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
//This expression determines which cell the mouse click is in.
		let row = (mouseX - mouseX % w) / w;
		let col = (mouseY - mouseY % h) / h;


//The mousePressed function updates the cells matrix based on the player's click.

//If the clicked cell is "null", it continues.
//Places the current player's symbol in the clicked cell.
//Determines the next player (nextPlayer) by updating the current player.
		if (cells[col][row] == null) {
			cells[col][row] = player;
			player = nextPlayer;
			nextPlayer = cells[col][row];
			count--; //Decreases the number of remaining empty cells by one.
           if (player === 'X') {
                audX.play();
                audX.setVolume(0.5);
            } else {
                audO.play();
                audO.setVolume(0.5);
            }
		
		}
	}
}

function keyPressed() {
  //When you press ENTER the game restarts.
	if (keyCode === ENTER) {
		cells = [
			[null, null, null],
			[null, null, null],
			[null, null, null]
		];
		count = 9;
		player = 'X';
		nextPlayer = 'O';
        roundCounter++;
        randomizePlayers();
		loop();
	}
  if(key==='m' || keyCode==='M'){
     aud.pause(); // When I press m the aud stops
     }
  if(key=== 'n' || key ==='N'){
      aud.play(); // When I press n the aud plays again.
          }
}

//for drawing the grids
function drawLines() {
	glow(color(180, 100, 100, 100), 12);
    stroke(180, 100, 100, 100);
    
	for (let i = 1; i < 3; i++) {
		line(w * i, 0, w * i, height);
		line(0, h * i, width, h * i);
	}
}


//The drawSymbols function checks the status of each cell using the cells matrix and draws the appropriate symbol.
function drawSymbols() {
	let x, y, t;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (cells[i][j] == 'X') {
                
				glow(color(385, 385, 385, 385),42);
                stroke(385, 385, 385, 385); // Set stroke color for X

//To draw the symbol 'X' .
                strokeWeight(8);
				x = j * w; //Calculates the x coordinate
				y = i * h; //Calculates the y coordinate
//It determines the required offset distance for the starting and ending points of the diagonals where the 'X' symbol will be drawn.
				t = floor(d / sqrt(2));
				
              
				line(x + t, y + t, x + w - t, y + h - t);
				line(x + w - t, y + t, x + t, y + h - t);
			} 
			else if (cells[i][j] == 'O') {
				glow(color(180, 100, 100, 100),22);
                stroke(180, 100, 100, 100); // Set stroke color for O

//To draw the symbol 'O' .
                strokeWeight(8);
				x = j * w + w / 2;
				y = i * h + h / 2;
				ellipse(x, y, DIAMETER, DIAMETER);
              
			} else {
				continue;
			}
		}
	}
}


//checkWinner function checks the winner of the game using the cells matrix.
function checkWinner() {
	//let x, y;
	// Diagonal check
	if (equals3(cells[0][0], cells[1][1], cells[2][2])) {
		winner = cells[0][0];
      if (winner === 'X') {
         glow(color(385, 385, 385, 385),42);
				stroke(385, 385, 385, 385); // Set color for winning line if X wins
			} else {
              glow(color(180, 100, 100, 100),22);
				stroke(180, 100, 100, 100); // Set color for winning line if O wins
			}
		line(w / 2, h / 2, w * 2.5, h * 2.5);
                audX.stop();
                audO.stop();
                audWin.play();
                audWin.setVolume(0.5);
		return true;
	}

	if (equals3(cells[0][2], cells[1][1], cells[2][0])) {
		winner = cells[0][2];
      if (winner === 'X') {
        glow(color(385, 385, 385, 385),42);
				stroke(385, 385, 385, 385); 
			} else {
              glow(color(180, 100, 100, 100),22);
				stroke(180, 100, 100, 100); 
			}
        audX.stop();
        audO.stop();
        audWin.play();
        audWin.setVolume(0.5);
      // Draw winning line
		line(w * 2.5, h / 2, w / 2, h * 2.5);
		return true;
	}

	for (let i = 0; i < 3; i++) {	
		// Horizontal check
		if (equals3(cells[i][0], cells[i][1], cells[i][2])) {
			winner = cells[i][0];
			if (winner === 'X') {
              glow(color(385, 385, 385, 385),42);
				stroke(385, 385, 385, 385);
			} else {
              glow(color(180, 100, 100, 100),22);
				stroke(180, 100, 100, 100);
			}
          audX.stop();
          audO.stop();
          audWin.play();
          audWin.setVolume(0.5);
			line(w / 2, h * (i + 0.5), w * 2.5, h * (i + 0.5)); 
			return true;
		}
		// Vertical check
		if (equals3(cells[0][i], cells[1][i], cells[2][i])) {
			winner = cells[0][i];
			if (winner === 'X') {
              glow(color(385, 385, 385, 385),42);
				stroke(385, 385, 385, 385); 
			} else {
              glow(color(180, 100, 100, 100),22);
			  stroke(180, 100, 100, 100);
			}
                audX.stop();
                audO.stop();
                audWin.play();
                audWin.setVolume(0.5);
			line(w * (i + 0.5), h / 2, w * (i + 0.5), h * 2.5); 
			return true;
		}
	}
  
// Draw State
	if (count == 0) {
		winner = 'Nobody';
        audX.stop();
        audO.stop();
        audDraw.play();
        audDraw.setVolume(0.5);
		return true;
	}
	return false;
}

//This function checks the outcome of the game by determining whether three cells in a given row, column, or diagonal have the same symbol.
function equals3(a, b, c){
	if (a == b && b == c && c != null) return true;
	else 
      return false;
}

function updateScore() {
    // if win X
    if (winner === 'X') {
        xScore=xScore + 3;
        xScoreDisplay.innerHTML = "Score: " + xScore;
    } 
  
    // if win O
  else if (winner === 'O') {
        oScore=oScore + 3;
        oScoreDisplay.innerHTML = "Score: " + oScore;
    } 
    // if nobody win
  else {   
        xScore++;
        oScore++;
        xScoreDisplay.innerHTML = "Score: " + xScore;
        oScoreDisplay.innerHTML = "Score: " + oScore;
    }
}

//Glow Effect
function glow(glowColor, blurriness) {
  drawingContext.shadowColor = glowColor;
  drawingContext.shadowBlur = blurriness;
}

