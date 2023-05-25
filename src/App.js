import React, { Component } from "react";
import "./index.css";

class App extends Component {
  state = {
    text: "",
    inputValue: "",
    lastLetter: "",
    words: [],
    completedWords: [],
    completed: false,
    startTime: undefined,
    timeElapsed: 0,
    wpm: 0,
    accuracy: 0,
    started: false,
    progress: 0
  };

  setText = () => {
    const texts = [
      `asdfjkl;`,
    ];
    const text = texts[Math.floor(Math.random() * texts.length)];
    const words = text.split(" ");

    this.setState({
      text: text,
      words: words,
      completedWords: []
    });
  };

  startGame = () => {
    this.setText();

    this.setState({
      started: true,
      startTime: Date.now(),
      completed: false,
      progress: 0
    });
  };

  handleChange = e => {
    const { words, completedWords } = this.state;
    const inputValue = e.target.value;
    const lastLetter = inputValue[inputValue.length - 1];

    const currentWord = words[0];

    if (lastLetter === " " || lastLetter === ".") {
    
      if (inputValue.trim() === currentWord) {
        
        const newWords = [...words.slice(1)];
        const newCompletedWords = [...completedWords, currentWord];

        const progress =
          (newCompletedWords.length /
            (newWords.length + newCompletedWords.length)) *
          100;

        this.setState({
          words: newWords,
          completedWords: newCompletedWords,
          inputValue: "",
          completed: newWords.length === 0,
          progress: progress
        });
      }
    } else {
      this.setState({
        inputValue: inputValue,
        lastLetter: lastLetter
      });
    }

    this.calculateWPM();
  };

  calculateWPM = () => {
    const { startTime, completedWords, inputValue } = this.state;
    const now = Date.now();
    const diff = (now - startTime) / 1000 / 60; 

  
    const wordsTyped = Math.ceil(
      completedWords.reduce((acc, word) => (acc += word.length), 0) / 5
    );

    
    const wpm = Math.ceil(wordsTyped / diff);

    
    const totalLetters = completedWords.reduce((acc, word) => (acc += word.length), 0);
    const correctlyTypedLetters = inputValue.length;
    const accuracy = (correctlyTypedLetters / totalLetters) * 100 || 0;

    this.setState({
      wpm: wpm,
      timeElapsed: diff,
      accuracy: accuracy.toFixed(2)
    });
  };

  render() {
    const {
      text,
      inputValue,
      completedWords,
      wpm,
      timeElapsed,
      accuracy,
      started,
      completed,
      progress
    } = this.state;

    if (!started)
      return (
        <div className="container">
          <h2> Typing text</h2>
          <p>
            <strong>Rules:</strong> <br />
            Type in the input field the highlighted word. <br />
            The correct words will turn <span className="green">green</span>.
            <br />
            Incorrect letters will turn <span className="red">red</span>.
            <br />
            <br />
            Have fun!
          </p>
          <button className="start-btn" onClick={this.startGame}>
            Start game
          </button>
        </div>
      );

    if (!text) return <p>Loading...</p>;

    if (completed) {
      return (
        <div className="container">
          <h2>
            Your WPM is <strong>{wpm}</strong>
          </h2>
          <h2>
            Your Accuracy is <strong>{accuracy}%</strong>
          </h2>
          <button className="start-btn" onClick={this.startGame}>
            Play again
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="wpm">
          <strong>WPM: </strong>
          {wpm}
          <br />
          <strong>Accuracy: </strong>
          {accuracy}%
          <br />
          <strong>Time: </strong>
          {Math.floor(timeElapsed * 60)}s
        </div>
        <div className="container">
          <h4>Type the text below</h4>
          <progress value={progress} max="100" />
          <p className="text">
            {text.split(" ").map((word, w_idx) => {
              let highlight = false;
              let currentWord = false;

              if (completedWords.length > w_idx) {
                highlight = true;
              }

              if (completedWords.length === w_idx) {
                currentWord = true;
              }

              return (
                <span
                  className={`word 
                                ${highlight && "green"} 
                                ${currentWord && "underline"}`}
                  key={w_idx}
                >
                  {word.split("").map((letter, l_idx) => {
                    const isCurrentWord = w_idx === completedWords.length;
                    const isWronglyTyped = letter !== inputValue[l_idx];
                    const shouldBeHighlighted = l_idx < inputValue.length;

                    return (
                      <span
                        className={`letter ${
                          isCurrentWord && shouldBeHighlighted
                            ? isWronglyTyped
                              ? "red"
                              : "green"
                            : ""
                        }`}
                        key={l_idx}
                      >
                        {letter}
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </p>
          <input
            type="text"
            onChange={this.handleChange}
            value={inputValue}
            autoFocus={true}
          />
        </div>
      </div>
    );
  }
}

export default App;
