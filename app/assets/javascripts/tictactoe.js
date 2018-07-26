// button save - find_or_create and then update

// button previous - list all games and create link to show that game's state

// button clear - clear board and start a new game

var turn = 0;
var winning_combos = []; //can be like rails or based on x matching, y matching and diagonals

function player() {
  return turn%2 === 0 ? 'X' : 'O';
}

// position passed as square[0], view is labled as data-x="0" and data-y="0" create a definition array to match
function updateState(position) {
  var playerChar = player();
  $(position).text(playerChar);
}

function setMessage(message) {
  $('#message').text(message);
}

//create a winning_combo definition
function checkWinner() {
  var win = false;  //match current tokens to winning_combos
  if(win) {
    setMessage("Player " + player() + " Won!");
  }
  return win ? "true" : "false"
}

//how is position passed onclick?
function doTurn() {
  turn++;
  updateState();
  checkWinner();
}
