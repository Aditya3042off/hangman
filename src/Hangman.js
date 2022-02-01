import React, { Component } from "react";
import "./Hangman.css";
import img0 from "./img/0.jpg";
import img1 from "./img/1.jpg";
import img2 from "./img/2.jpg";
import img3 from "./img/3.jpg";
import img4 from "./img/4.jpg";
import img5 from "./img/5.jpg";
import img6 from "./img/6.jpg";
import {randomWord} from './words.js';

class Hangman extends Component {
  /** by default, allow 6 guesses and use provided gallows images. */
  static defaultProps = {
    maxWrong: 6,
    images: [img0, img1, img2, img3, img4, img5, img6]
  };

  constructor(props) {
    super(props);
    this.state = { nWrong: 0, guessed: new Set(), answer: randomWord(), isLost: false, nCorrect: 0,isWon: false};
    this.handleGuess = this.handleGuess.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  /** guessedWord: show current-state of word:
    if guessed letters are {a,p,e}, show "app_e" for "apple"
  */
  guessedWord() {
    if(!this.state.isLost) {
      return this.state.answer
        .split("")
        .map(ltr => (this.state.guessed.has(ltr) ? ltr : "_"));
    }
    else{
      return this.state.answer.split("");
    }
  }

  /** handleReset: handle the Reset click:
    - reset the entire game
   */

  handleReset(evt) {
    this.setState(curState => ({
      nWrong: 0,
      guessed: new Set(),
      answer: randomWord(),
      isLost: false,
      nCorrect: 0,
      isWon: false
    })
    )
  }

  /** handleGuest: handle a guessed letter:
    - add to guessed letters
    - if not in answer, increase number-wrong guesses
    - if in answer increase number of right guesses
    - check if the no of guess reached the limit 
  */

  handleGuess(evt) {
    let lost = false;
    let won = false;
    let ltr = evt.target.value;
    let word = new Set();

    for(let i of this.state.answer) {
      word.add(i);
    }

    if( this.state.answer.includes(ltr) && word.size === this.state.nCorrect+1) {
      won = true;
    }

    if(!this.state.answer.includes(ltr) && this.state.nWrong+1 === this.props.maxWrong) {
      lost = true;
    }

    this.setState(st => ({
      guessed: st.guessed.add(ltr),
      nWrong: st.nWrong + (st.answer.includes(ltr) ? 0 : 1),
      nCorrect: st.nCorrect + (st.answer.includes(ltr) ? 1 : 0),
      isLost: lost,
      isWon: won
    }));
  }

  /** generateButtons: return array of letter buttons to render */
  generateButtons() {
    return "abcdefghijklmnopqrstuvwxyz".split("").map(ltr => (
      <button
        key={ltr}
        value={ltr}
        onClick={this.handleGuess}
        className={'Hangman-input-btn'}
        disabled={this.state.guessed.has(ltr)}
      >
        {ltr}
      </button>
    ));
  }

  /** render: render game */
  render() {
    return (
      <div className='Hangman'>
        <h1>Hangman</h1>
        <img src={this.props.images[this.state.nWrong] } 
             alt = {`${this.state.nWrong} wrong guesses used out of ${this.props.maxWrong} guesses`} />
        <p>Current number of Wrong gussess: {this.state.nWrong}</p>
        <p className='Hangman-msg' 
           style={{color : this.state.isLost ? 'red' : 'green'}}>{this.state.isLost ? 'Limit Exceeded' : ''}</p>
        <p className='Hangman-word'>{this.guessedWord()}</p>
        <p style={{display: (this.state.isLost || this.state.isWon) ? 'none' : 'inline-block'}} 
           className='Hangman-btns'>{this.generateButtons()}</p>
        <p className='Hangman-msg' 
           style={{color : this.state.isLost ? 'red' : 'green'}}> {this.state.isLost ? 'You Lost...' : ''} </p>
        <p className='Hangman-msg' 
           style={{color : this.state.isWon ? 'green' : 'red'}}> {this.state.isWon ? 'You Won...' : ''} </p>
        
        <button onClick={this.handleReset} className="Hangman-restart">RESTART</button>
      </div>
    );
  }
}

export default Hangman;
