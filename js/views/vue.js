/// <reference path="../libs/jquery.js" />

class View {
    constructor(div_id, endGame, getGameStatus, setGameStatus, checkwin, getBoard, setBoard, getBestMove, getAI, setAI, getIsAnimated, setIsAnimated) {
      this.div_id = div_id;
      this.getGameStatus = getGameStatus;
      this.setGameStatus = (status)=>setGameStatus(status);
      this.getIsAnimated = getIsAnimated;
      this.setIsAnimated = (status)=>setIsAnimated(status);
      this.getBestMove = (board, depth)=>getBestMove(board, depth);
      this.getAI = getAI;
      this.setAI = (state)=>setAI(state);
      this.getBoard = getBoard;
      this.setBoard = setBoard;
      this.checkwin = (board)=>checkwin(board);
      this.board = this.getBoard();
      this.endGame = (winner)=>endGame(winner);
      this.initView();
      this.startGame();
      this.modal = document.querySelector(".modal");
      this.closeButton = document.querySelector(".close-button");
      this.closeButton.addEventListener("click", ()=>{
        let game_audio = document.getElementById("game_audio");
        game_audio.data = "";
        this.toggleModal();
      });
      window.addEventListener("click", this.windowOnClick);
      /*$('#connect4').on('mouseenter', '.col.empty', function(){
        const col = $(this).data('col');
        console.log("colonne :" +col + " ligne : "+ligne);
      })*/
      let self = this;
      $('#connect4').on('click', '.col.empty', function(){
        self.click(this);
      })
    }
    getPlayableRow(col){
      const cells = $(`.col[data-col='${col}']`);
      let cell;
      for (let i = 0 ; i < cells.length; i++) {
        if ($(cells[i]).hasClass('empty')){
          cell = cells[i];
        }
      }
      return cell;
    }
    createGrid() {
      const $board = $(this.div_id);
      for (let row = 0; row < 6; row++) {
        const $row = $('<div>')
          .addClass('row');
        for (let col = 0; col < 7; col++) {
          const $col = $('<div>')
            .addClass('col empty')
            .attr('data-col', col)
            .attr('data-row', row);
          $row.append($col);
        }
        $board.append($row);
      }
    }
    initView () {
      this.createGrid(); 
    }
    start(){
      if(this.getGameStatus() == false){  
        if (!$("input[name='choix']").is(':checked')) {
          alert('Aucun starting player choisi !!!');
       }
       else { 
        //Ajout musique
        let board = document.getElementById("board");
        let game_audio = document.createElement("object");
        game_audio.id = "game_audio";
        game_audio.type ="audio/mpeg";
        game_audio.width = "0";
        game_audio.height="0";

        var select = document.getElementById("difficulte-select");
				var option = select.options[select.selectedIndex];
        switch (option.value){
          case "1":
            game_audio.data = "./audio/op1.mp3";
            break;
          case "2":
            game_audio.data = "./audio/op2.mp3";
            break;
          case "3":
            game_audio.data = "./audio/op3.mp3";
            break;
          case "4":
            game_audio.data = "./audio/op4.mp3";
            break;
          case "5":
            game_audio.data = "./audio/giorno_theme.mp3";
            break;
          case "6":
            game_audio.data = "./audio/op6.mp3";
            break;
          case "7":
            game_audio.data = "./audio/toBeContinued.mp3";
            break;
          case "8":
            game_audio.data = "./audio/toBeContinued.mp3";
            break;
          default:
        }
        

        let param1 = document.createElement("param");
        param1.name = "filename";
        param1.value = "";
        
        let param2 = document.createElement("param");
        param2.name="autostart";
        param2.value = "true";
        
        let param3 = document.createElement("param");
        param3.name="loop";
        param3.value = "true";

        game_audio.appendChild(param1);
        game_audio.appendChild(param2);
        game_audio.appendChild(param3);

        board.appendChild(game_audio);

        this.currentPlayer = $("input[name='choix']:checked", '#form').val();
        /*document.getElementById("ai_check").disabled = true;
        document.getElementById("J1").disabled = true;
        document.getElementById("J2").disabled = true;*/
        this.setGameStatus(true);
        this.isIA();
        if(this.getAI() == true){
          if(document.getElementById("J2").checked){
            let board = this.getBoard();
            //audio
            let play = document.getElementById("play");
            play.data = "./audio/muda.mp3";
            let cell = document.querySelector(".col[data-col='3'][data-row='5']");
            this.animate(cell,3,"J2");
            board[5][3] = 2;
            this.setBoard(board);
            this.currentPlayer = 1;
          }
        }
       }
      }
    }
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    checkAnimate(){
      let checkbox = document.getElementById("no_animation");
      if (checkbox.checked){
        return false;
      }else{
        return true;
      }
    }
    async animate($cell, col,player) {
      this.setIsAnimated(true);
      let animate = true;
      
      animate = this.checkAnimate();
      if(animate == true){
        //descente du jeton
        for(let i =0; i<=$cell.getAttribute("data-row"); i++){
          if(animate == true){
            let tempcell = document.querySelector(".col[data-col='"+col+"'][data-row='"+i+"']");
            await this.sleep(50);
            tempcell.classList.add(player); 
            await this.sleep(50);
            tempcell.classList.remove(player);
            animate = this.checkAnimate();
          }
        }
        //rebond pour deux dernières lignes
        for(let i =$cell.getAttribute("data-row")-1; i<=$cell.getAttribute("data-row")-1; i++){
          if(animate == true){
            let tempcell = document.querySelector(".col[data-col='"+col+"'][data-row='"+i+"']");
            await this.sleep(50);
            tempcell.classList.add(player); 
            await this.sleep(50);
            tempcell.classList.remove(player);
            animate = this.checkAnimate();
          }
        }
        if($cell.getAttribute("data-row") >= 4){
          for(let i =$cell.getAttribute("data-row")-2; i<=$cell.getAttribute("data-row"); i++){
            if(animate == true){
              let tempcell = document.querySelector(".col[data-col='"+col+"'][data-row='"+i+"']");
              await this.sleep(100);
              tempcell.classList.add(player); 
              await this.sleep(100);
              tempcell.classList.remove(player);
              animate = this.checkAnimate();
            }
          }
            
          for(let i =$cell.getAttribute("data-row")-1; i<=$cell.getAttribute("data-row"); i++){
            if(animate == true){
              let tempcell = document.querySelector(".col[data-col='"+col+"'][data-row='"+i+"']");
              await this.sleep(50);
              tempcell.classList.add(player); 
              await this.sleep(50);
              tempcell.classList.remove(player);
              animate = this.checkAnimate();
            }
          }
        }
        //rebond pour deux lignes du milieu
        else if($cell.getAttribute("data-row")>=2){
          for(let i =$cell.getAttribute("data-row")-1; i<=$cell.getAttribute("data-row"); i++){
            if(animate == true){
              let tempcell = document.querySelector(".col[data-col='"+col+"'][data-row='"+i+"']");
              await this.sleep(50);
              tempcell.classList.add(player); 
              await this.sleep(50);
              tempcell.classList.remove(player);
              animate = this.checkAnimate();
            }
          }
        }
      }
      $cell.classList.add(player); 
      $cell.classList.remove("empty");
      this.setIsAnimated(false);
    }

    isIA(){
      let checkbox = document.getElementById("ai_check");
      if (checkbox.checked){
        this.setAI(true);
      }else{
        this.setAI(false);
      }
    }
    startGame(){
      let self=this;
      $("#btnStart").on("click", function () {
        self.start();
    });
    }
    
    async click(element){
      if(this.getGameStatus()){
        if(this.getIsAnimated()==false){
          let column;
          //J1
          if(this.currentPlayer == 1){
            //son
            let play = document.getElementById("play");
            play.data = "./audio/ora.mp3";
            var col = element.getAttribute("data-col"); 
            let $cell = this.getPlayableRow(col);
            this.animate($cell,col,"J1");
            this.currentPlayer = 2;
            this.board[$cell.getAttribute("data-row")][col] = 1;
            this.setBoard(board);
            
            //difficulté
            var select = document.getElementById("difficulte-select");
				    var option = select.options[select.selectedIndex];
            let profondeur = option.value;
            column = this.getBestMove(this.getBoard(), profondeur);
            let winner = this.checkwin(this.board);

            //IA
            if (this.getAI() && winner != "1" && winner != "3"){
                this.endGame(winner);
                if(this.getGameStatus){
                  if(this.getIsAnimated()==true){
                    await this.sleep(1750);
                  }else{
                    await this.sleep(1000);
                  }
                //audio
                let play = document.getElementById("play");
                play.data = "./audio/muda.mp3";
                $('#connect4').off();
                this.setIsAnimated(true);
                let $cell = this.getPlayableRow(column);
                this.animate($cell, column, "J2");
                let self = this;
                if(this.getIsAnimated()==true){
                  await this.sleep(1800);
                }
                $('#connect4').on('click', '.col.empty', function(){
                  self.click(this);
                })
                this.board[$cell.getAttribute("data-row")][column] = 2;
                this.setBoard(board);
                this.currentPlayer = 1;
                }
              }
            }else{
                //j2
                if(!this.getAI()){
                  let winner = this.checkwin(this.board);
                this.endGame(winner);
                //audio
                let play = document.getElementById("play");
                play.data = "./audio/muda.mp3";

                var col = element.getAttribute("data-col"); 
                let $cell = this.getPlayableRow(col);
                this.animate($cell,col,"J2");
                this.board[$cell.getAttribute("data-row")][col] = 2;
                this.setBoard(board);
                this.currentPlayer = 1;  
                }
                
          }
            let winner = this.checkwin(this.board);
            this.endGame(winner);
          }
        }
      }
    toggleModal() {
      this.modal = document.querySelector(".modal");
      this.modal.classList.toggle("show-modal");
    }
  
  windowOnClick(event) {
    this.modal = document.querySelector(".modal");
      if (event.target === this.modal) {
          this.modal = document.querySelector(".modal");
          this.modal.classList.toggle("show-modal");
          let game_audio = document.getElementById("game_audio");
          game_audio.data = "";
      }
  }
  }
 export {View};