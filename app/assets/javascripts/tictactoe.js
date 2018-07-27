var turn = 0;

function player() {
  return ( turn%2 === 0 ) ? 'X' : 'O';
}

function getPositions() {
  return $("td");
}

function getState() {
  var state = Array.from(getPositions()).map(position => position.innerHTML);
  return state;
}

function updateState(position) {
  var playerChar = player();
  $(position).text(playerChar);
}

function setMessage(message) {
  $('#message').text(message);
}

// this function feels big. is there a smaller way of doing this or should it be broken down further?
// is there a cleaner way of putting the declarations and assignments? no nice multi assign like ruby
function checkWinner() {
  var win = false;
  const winning_combos = [ [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6] ];
  var state = getState();

  for(const combo of winning_combos) {
    var a = state[combo[0]];
    var b = state[combo[1]];
    var c = state[combo[2]];
    var empty = a === "" || b === "" || c === "";
    var match = a === b && a === c;

    if(!empty && match) {
      win = true;
      var winner = a;
      setMessage("Player " + winner + " Won!");
      break;
    }
  }
  return win;
}

function checkTie() {
  if(turn === 9) {
    setMessage("Tie game.");
    return true;
  }
}

function resetBoard() {
  turn = 0;
  for(const position of getPositions()) {
    $(position).text("");
  }
  setMessage("");
}

function doTurn(position) {
  if (position.innerHTML === "") {
    updateState(position);
    turn++;
  }
  if(checkWinner() || checkTie()) {
    saveGame();
    resetBoard();
  }
}

function attachListeners() {
  $('button#save').on('click', saveGame);
  $('button#previous').on('click', previousGames);
  $('button#clear').on('click', resetBoard);

  $('#games button').on('click', function() {
    loadGame(this);
  });

  $(getPositions()).on('click', function() {
    doTurn(this);
  })
}

$(document).ready(attachListeners);

//418  AJAX interactions with the Rails API Clicking the button#previous element when no previously-saved games exist in the database does not add any children to the div#games element in the DOM:
function previousGames() {
  var div = $('#games');
  div.innerHTML = "";
  $.get("/games", function(games) {
    //stringify?
    for(let game in games) {
      div.append("<button>" + game.id + "</button><br>");
    }
  });
}

// how to hold value of game id so that it updates instead of saves a game that already exists
function saveGame() {
  var id;
  if(id === undefined) {
    $.post("/games", function(game) {
      id = game.id;
    })
  } else {
    $.patch("/games/" + id)
  }
}

function loadGame(game) {
  $.get()
}
