// button save - find_or_create and then update

// button previous - list all games and create link to show that game's state

// button clear - clear board and start a new game

var turn = 0;
var state = new Array(9);
var positions = [];

function player() {
  return turn%2 === 0 ? 'X' : 'O';
}

function getPositions() {
  positions = $("td");
}

function getState() {
  getPositions();
  for (const [i, el] of state.entries()) {
    state[i] = positions[i].innerHTML;
  }
}

function updateState(position) {
  var playerChar = player();
  $(position).text(playerChar);
}

function setMessage(message) {
  $('#message').text(message);
}

function checkWinner() {
  getState();
  var win = false;
  var winner; 
  const winning_combos = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ]; 

  for(let combo of winning_combos) {
    // is there a cleaner way of putting the declarations and assignments? no nice multi assign like ruby
    var a = state[combo[0]];
    var b = state[combo[1]];
    var c = state[combo[2]];
    var empty = a === "" || b === "" || c === "";
    var match = a == b && a == c;
    
    if(!empty && match) {
      win = true;
      winner = a;
      break;
    }
  }
    
  if(win) {
    setMessage("Player " + winner + " Won!");
  }
  return win;
}

function checkTie() {
  if(turn === 8) {
    setMessage("Tie game.");
    return true;
  }
}

function resetBoard() {
  turn = 0;
  for(let position of positions) {
    position.innerHTML = "";
  }
}

function doTurn() {
  updateState();
  if(checkWinner() || checkTie()) {
    resetBoard();
  } else {
    turn++;
  }
}

// this one needs to wait for doc.done. it's 12am. sleep timez
function attachListeners() {
  
}