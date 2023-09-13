class Model {
  constructor(div_id, setGameStatus, showDialog) {
    this.currentPlayer = 1;
    this.board;
    this.initialize_board();
    this.setGameStatus = (isFinish) => setGameStatus(isFinish);
    this.showDialog = showDialog;
  }
  checkwin(board) {
    var isFull = true;
    let winner = 0;
    for (var i = 0; i < 7; i++) {
      if (board[0][i] === 0) {
        isFull = false;
      }
    }
    if (isFull) {
      winner = 3;
    }
    // check horizontal
    for (var i = 0; i < 6; i++) { // row
      for (var j = 0; j < 4; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2] && board[i][j] === board[i][j + 3]) {
          winner = board[i][j];
        }
      }
    }
    // check vertical
    for (var i = 0; i < 3; i++) { // row
      for (var j = 0; j < 7; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j] && board[i][j] === board[i + 3][j]) {
          winner = board[i][j];
        }
      }
    }
    // check diagonal
    for (var i = 0; i < 3; i++) { // row
      for (var j = 0; j < 4; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i + 1][j + 1] && board[i][j] === board[i + 2][j + 2] && board[i][j] === board[i + 3][j + 3]) {
          winner = board[i][j];
        }
      }
    }
    // check anti-diagonal
    for (var i = 3; i < 6; i++) { // row
      for (var j = 0; j < 4; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i - 1][j + 1] && board[i][j] === board[i - 2][j + 2] && board[i][j] === board[i - 3][j + 3]) {
          winner = board[i][j];
        }
      }
    }
    return winner;
  }
  getBoard() {
    return this.board;
  }
  setBoard(board) {
    this.board = board;
  }
  initialize_board() {
    this.board = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];
  }
  
  endGame(winner) {
    if (winner) {
      /*let game_audio = document.getElementById("game_audio");
      game_audio.src = "";*/
      let endDiv = document.getElementById("end");
      let p = document.createElement("p");
        if (winner == 3) {
          let text = document.createTextNode("Match nul !");
          p.appendChild(text);
          endDiv.appendChild(p);
          var elem = document.createElement("img");
          elem.setAttribute("src", "././img/match_nul.gif");
          elem.style.width = "100%";
          endDiv.style.color = "black";
          endDiv.appendChild(elem);
          let game_audio = document.getElementById("game_audio");
          game_audio.data = "./audio/match_nul.mp3";

      } else {
        let text = document.createTextNode("Le joueur " + winner + " a gagné !");
        if(winner == 1){
          var elem = document.createElement("img");
          elem.setAttribute("src", "././img/jotaro-jojo.gif");
          elem.style.width = "100%";
          endDiv.style.color = "purple";
          endDiv.appendChild(elem);
          let game_audio = document.getElementById("game_audio");
          game_audio.data = "./audio/J1Win.mp3";
        }else if (winner == 2){
          var elem = document.createElement("img");
          elem.setAttribute("src", "././img/dio.gif");
          elem.style.width = "100%";
          endDiv.style.color = "#FFC000";
          endDiv.appendChild(elem);
          let game_audio = document.getElementById("game_audio");
          game_audio.data = "./audio/J2Win.mp3";
        }
        p.style.textAlign = "center";
        p.appendChild(text);
        endDiv.appendChild(p);
      }
      this.setGameStatus(false);
      $('#connect4').off();
      $('#btnStart').off();
      this.showDialog();
    }
  }
  GetBoardByMove(board, column, player) {
    let nextBoard = JSON.parse(JSON.stringify(board));
    for (var i = 0; i < 6; i++) {
      if (nextBoard[i][column] != 0 && nextBoard[i - 1] != undefined) {
        nextBoard[i - 1][column] = player;
        break;
      }
      if (i == 5) {
        nextBoard[i][column] = player;
      }
    }
    return nextBoard;
  }
  getBestMove(board, depth) {
    let tempBoard = JSON.parse(JSON.stringify(board));
    var maxEval = -Infinity;
    var bestMove = 0;
    for (var i = 0; i < 7; i++) {
      if(!this.isPlayableRow(tempBoard, i)) continue;
      var score = this.minMax(this.GetBoardByMove(tempBoard, i, 2), depth, -Infinity, +Infinity, false, 2);
      if (score >= maxEval) {
        maxEval = score;
        bestMove = i;
      }
    }
    return bestMove;
  }
  minMax(board, depth, alpha, beta, maximizingPlayer, player) {
    board = JSON.parse(JSON.stringify(board));
    let maxEval;
    let minEval;
    let evaluate;
    if (depth == 0 || this.checkwin(board)) {
      return this.evaluation(board, 2);
    }
    if (maximizingPlayer) {
      maxEval = -Infinity;
      for (let i = 0; i < 7; i++) {
        if(!this.isPlayableRow(board, i)) continue;
        evaluate = this.minMax(this.GetBoardByMove(board, i, 2), depth - 1, alpha, beta, false);
        maxEval = Math.max(maxEval, evaluate);
        alpha = Math.max(alpha, evaluate);
        if (beta <= alpha) {
          break;
        }
      };
      return maxEval;
    } else {
      minEval = +Infinity;
      for (let i = 0; i < 7; i++) {
        if(!this.isPlayableRow(board, i)) continue;
        evaluate = this.minMax(this.GetBoardByMove(board, i, 1), depth - 1, alpha, beta, true);
        minEval = Math.min(minEval, evaluate);
        beta = Math.min(beta, evaluate);
        if (beta <= alpha) {
          break;
        }
      };
      return minEval;
    }
  }
  isPlayableRow(board, column){
    return board[0][column] == 0;
  }
  evaluation(board, player) {
    let score = 0;
    //Rangée de 4
    // check horizontal
    for (var i = 0; i < 6; i++) { // row
      for (var j = 0; j < 4; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2] && board[i][j] === board[i][j + 3]) {
          score = board[i][j] == player ? score + 120 : score - 200;
        }
      }
    }
    // check vertical
    for (var i = 0; i < 3; i++) { // row
      for (var j = 0; j < 7; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j] && board[i][j] === board[i + 3][j]) {
          score = board[i][j] == player ? score + 120 : score - 200;
        }
      }
    }
    // check diagonal
    for (var i = 0; i < 3; i++) { // row
      for (var j = 0; j < 4; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i + 1][j + 1] && board[i][j] === board[i + 2][j + 2] && board[i][j] === board[i + 3][j + 3]) {
          score = board[i][j] == player ? score + 120 : score - 200;
        }
      }
    }
    // check anti-diagonal
    for (var i = 3; i < 6; i++) { // row
      for (var j = 0; j < 4; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i - 1][j + 1] && board[i][j] === board[i - 2][j + 2] && board[i][j] === board[i - 3][j + 3]) {
          score = board[i][j] == player ? score + 120 : score - 200;
        }
      }
    }

    //rangée de 3
    // check horizontal
    for (var i = 0; i < 6; i++) { // row
      for (var j = 0; j < 5; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i][j + 1] && board[i][j] === board[i][j + 2]) {
          score = board[i][j] == player ? score + 30 : score - 30;
        }
      }
    }
    // check vertical
    for (var i = 0; i < 4; i++) { // row
      for (var j = 0; j < 7; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i + 1][j] && board[i][j] === board[i + 2][j]) {
          score = board[i][j] == player ? score + 30 : score - 30;
        }
      }
    }
    // check diagonal
    for (var i = 0; i < 4; i++) { // row
      for (var j = 0; j < 5; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i + 1][j + 1] && board[i][j] === board[i + 2][j + 2]) {
          score = board[i][j] == player ? score + 30 : score - 30;
        }
      }
    }
    // check anti-diagonal
    for (var i = 2; i < 6; i++) { // row
      for (var j = 0; j < 5; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i - 1][j + 1] && board[i][j] === board[i - 2][j + 2]) {
          score = board[i][j] == player ? score + 30 : score - 30;
        }
      }
    }

    //rangée de 2
    // check horizontal
    for (var i = 0; i < 6; i++) { // row
      for (var j = 0; j < 6; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i][j + 1]) {
          score = board[i][j] == player ? score + 10 : score - 10;
        }
      }
    }
    // check vertical
    for (var i = 0; i < 5; i++) { // row
      for (var j = 0; j < 7; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i + 1][j]) {
          score = board[i][j] == player ? score + 10 : score - 10;
        }
      }
    }
    // check diagonal
    for (var i = 0; i < 5; i++) { // row
      for (var j = 0; j < 6; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i + 1][j + 1]) {
          score = board[i][j] == player ? score + 10 : score - 10;
        }
      }
    }
    // check anti-diagonal
    for (var i = 1; i < 6; i++) { // row
      for (var j = 0; j < 6; j++) { // column
        if (board[i][j] !== 0 && board[i][j] === board[i - 1][j + 1]) {
          score = board[i][j] == player ? score + 10 : score - 10;
        }
      }
    }
    return score;
  }
}
export { Model };