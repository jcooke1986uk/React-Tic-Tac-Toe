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
  constructor(props) {
    super(props);
    this.state = {
      //Creates an array with 9 items for each square on the board
      squares: Array(9).fill(null),
      //Boolean for if X or O is next
      xIsNext: true,
    };
  }

  handleClick(i) {
    //Creates a copy of the array by using slice()
    const squares = this.state.squares.slice();
    //if there is a winner or we are out of squares
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    //Alternating between X and O for each click
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      //Setting the state of the squares with the above determined X or O
      squares: squares,
      //Setting the state of the xIsNext to whatever it currently isn't - true or false
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square 
        //renders each of the 9 squares with an inital state of null
        value={this.state.squares[i]}
        //runs handleClick onClick to change the state of the square value
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    //Check if there is a winner with the calculateWinner function
    //or displays which player is next based on the xIsNext boolean
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      //renders the html for the board and any current states
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      //renders the Game which calls the Board component which calls the Square component (later changed to a function)
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
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