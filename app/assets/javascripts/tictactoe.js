var ID;
var turn = 0;
var state;

function player() {
  return ( turn%2 === 0 ) ? 'X' : 'O';
}

function getPositions() {
  return $("td");
}

function getState() {
  return Array.from(getPositions()).map(position => position.innerHTML);
}

function updateState(position) {
  $(position).text(player());
  state = getState();
}

function setMessage(message) {
  $('#message').text(message);
}

// this function feels big. is there a smaller way of doing this or should it be broken down further?
// have to manually declare set state in here, bc the tests just call on the checkwinner function only
function checkWinner() {
  var win = false,
      state = getState();
  const winning_combos = [ [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6] ];

  for(const combo of winning_combos) {
    var a = state[combo[0]],  b = state[combo[1]], c = state[combo[2]];
    var empty = a === "" || b === "" || c === "";
    var match = a === b && a === c;

    if(!empty && match) {
      win = true;
      setMessage("Player " + a + " Won!");
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
  ID = undefined; // this feels so wrong...
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
    // 325 Gameplay Users cannot play any turns once a game is won or tied:
    //stop propagation too
    updateState();
    saveGame();
    resetBoard();
  }
}

$(document).ready(attachListeners);

function attachListeners() {
  $('button#save').on('click', saveGame);
  $('button#previous').on('click', previousGames);
  $('button#clear').on('click', resetBoard);

  $(getPositions()).on('click', function() { doTurn(this); });
}

function previousGames() {
  var div = $('#games');
  div.empty();

  var appending = $.getJSON("/games", function(games) {
    $.each(games["data"], function(key, val) {
      div.append("<button>" + val.id + "</button><br>");
    })
  })
  appending.done(function() {
    $('#games button').on('click', function() {
      loadGame(this);
    })
  })
}

function saveGame() {
  if(typeof ID === "undefined") {
    var posting = $.post("/games", state);
    posting.done(function(game) {
      ID = Number(game["data"]["id"]);
    });
  } else {
    $.ajax({
      url: "/games/" + ID,
      data: state,
      type: 'PATCH'
    })
  }
}

function loadGame(button) {
  $.getJSON("/games/" + button.innerHTML, function(game) {
    ID = Number(game["data"]["id"]);
    turn = 0;
    loaded.forEach(function(position) {
      if(position === 'X' || position === 'O') {
        turn++;
      }
    })

    var loaded = game["data"]["attributes"]["state"];
    var i = 0;

    var positions = getPositions();
    for(const position of positions) {
      $(position).text(loaded[i]);
      i++;
    }
  })
}
