import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  //This can be a function rather than a class because it doesn't have it's own state and only returns what should be rendered
    return (
      <button 
        className="square" 
        //onClick uses the handleClick function passed down from the Board class in renderSquare
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
}

//onClick="{function(){alert('click')}}"
//is equivalent
//onClick="{() => alert('click')}"

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square 
        //renders each of the 9 squares with an inital state of null
        value={this.props.squares[i]}
        //runs handleClick onClick to change the state of the square value
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      //renders the html for the board and any current states
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
      //Creates an array with 9 items for each square on the board
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      //Boolean for if X or O is next
      xIsNext: true,
    }
  }

  handleClick(i) {
    //If we go back to a previous step this will ensure that the history is being kept from that point onwards and all "future" history created is discarded
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    //Creates a copy of the array by using slice()
    const squares = current.squares.slice();
    //if there is a winner or we are out of squares
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    //Alternating between X and O for each click
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      //Setting the state of the squares with the above determined X or O
      //Unlike push(), concat() doesn't mutate the original array
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      //Setting the state of the xIsNext to whatever it currently isn't - true or false
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      //set xIsNext to true if stepNumber is even
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
    });

    //Check if there is a winner with the calculateWinner function
    //or displays which player is next based on the xIsNext boolean
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      //renders the Game which calls the Board component which calls the Square component (later changed to a function)
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  //Outputs the Game component
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}