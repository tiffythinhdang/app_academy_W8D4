let Piece = require("./piece");


/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let grid = [];
  for (let i = 0; i < 8; i++) {
    subArr = [];
    for (let j = 0; j < 8; j++) {
      subArr.push(" ");
    }
    grid.push(subArr);
  }
  grid[3][4] = new Piece("black");
  grid[4][3] = new Piece("black");
  grid[3][3] = new Piece("white");
  grid[4][4] = new Piece("white");
  return grid;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  let row = pos[0];
  let col = pos[1];
  let piece = this.grid[row][col];
  if (piece === undefined) {
    throw "Invalid position";
  } 
  if (piece instanceof Piece) {
    return piece;
  } else {
    return "Empty";
  }
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length !== 0;
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let piece = this.getPiece(pos);
  return piece.color === color;
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  return this.getPiece(pos) !== "Empty";
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return (!(this.hasMove("white")) && !(this.hasMove("black")));
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let arr = [0, 1, 2, 3, 4, 5, 6, 7];
  if (!(arr.includes(pos[0])) || !(arr.includes(pos[1]))) {
    return false;
  } else {
    return true;
  }
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip = []) {
  let row = pos[0];
  let col = pos[1];
  let dy = dir[0];
  let dx = dir[1];
  let new_row = row + dy;
  let new_col = col + dx;
  let newPos = [new_row, new_col];

  if (board.isValidPos(newPos) === false) {
    return null;
  }

  let piece = board.getPiece(newPos);
  if ((piecesToFlip.length === 0) && (piece === "Empty")) {
    return null;
  }

  if ((piecesToFlip.length !== 0) && (piece.color === color)) {
    return piecesToFlip;
  }
  if (piece.color !== color ) {
    piecesToFlip.push(newPos);
  }

  return _positionsToFlip(board, newPos, color, dir, piecesToFlip);
}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  let result = this.validMove(pos, color);
  if (result) {
    let piece = new Piece(color);
    let row = pos[0];
    let col = pos[1];
    this.grid[row][col] = piece;
    result.forEach( el => {
      let currPiece = this.getPiece(el);
      currPiece.flip();
    });
  } else {
    throw "Invalid Move";
  }
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  console.log([" ",0,1,2,3,4,5,6,7].join(" | ") + " |")
  this.grid.forEach ( (row, i) => {
    let newRow = [i];
     row.forEach ( el => {
      if (el === " ") {
         newRow.push(el);
      } else {
         newRow.push(el.toString());
      }
    }
    );
    console.log(newRow.join(" | ") + " |");
  });
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (this.isOccupied(pos)) { return false; }

  for (let i = 0; i < Board.DIRS.length; i++) {
    let dir = Board.DIRS[i];
    let res = _positionsToFlip(this, pos, color, dir);
    if (res !== null) {
      return res;
    }
  }
  return false;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let validMove = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let currentPos = [row, col];
      if (this.validMove(currentPos, color)) {
        validMove.push(currentPos);
      }
    }
  }
  return validMove;
};

module.exports = Board;
