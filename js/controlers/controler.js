import { Model } from "../models/model.js";
import { View } from "../views/vue.js";

class Controller {
    constructor() {
      this.started = false;
      this.isAI = false;
      this.isAnimated = false;
      this.model = new Model("#connect4", (isfinish)=>this.setGameStatus(isfinish), ()=>this.showDialog());
      this.view = new View("#connect4", (winner)=>this.endGame(winner), ()=>this.getGameStatus(), (status)=>this.setGameStatus(status), (board)=>this.checkwin(board), ()=>this.getBoard(), (board)=>this.setBoard(board), (board, depth)=>this.getBestMove(board, depth), ()=>this.getAI(), (state)=>this.setAI(state), ()=>this.getIsAnimated(), (status)=>this.SetIsAnimated(status));
    }
    getIsAnimated(){
      return this.isAnimated;
    }
    SetIsAnimated(status){
      this.isAnimated = status;
    }
    setAI(state){
      this.isAI = state;
    }
    getAI(){
      return this.isAI;
    }
    getGameStatus(){
      return this.started;
    }
    setGameStatus(status){
      this.started = status;
    }
    checkwin(board){
      return this.model.checkwin(board);
    }
    getBoard(){
      return this.model.getBoard();
    }
    setBoard(){
      this.model.setBoard(this.getBoard());
    }
    endGame(winner){
      return this.model.endGame(winner);
    }
    getBestMove(board, depth){
      return this.model.getBestMove(board, depth);
    }
    showDialog(){
      this.view.toggleModal();
    }
  }
  export {Controller};