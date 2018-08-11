"use strict";

export default class TextChangeProcessor {
  constructor() {
    this.CRDT = [[]];
    this.allocator = new Allocator();
  }

  addCharacterAt(row, column, character) {
    let leftAdjacentId = this.getLeftAdjacentId(row, column);
    let rightAdjacentId = this.getRightAdjacentId(row, column);
    let allocatedIdentifier = this.allocator.allocate(leftAdjacentId, rightAdjacentId);
    if(character == '\n') {
      this.handleNewLineCharacter(row, column, allocatedIdentifier, character);
    } else {
      this.handleNormalCharacter(row, column, allocatedIdentifier, character);
    }
  }

  deleteCharacterAt(row, column) {
    if(this.CRDT[row][column].ch != '\n') {
      this.CRDT[row].splice(column, 1);
    } else {
      let nextLine = this.CRDT[row + 1];
      this.CRDT[row].splice(column, 1, ...nextLine);
      this.CRDT.splice(row + 1, 1);
      // Add check for last line
    }
  }

  addRemoteCharacterWith(id, character) {
    this.validateCurrentState();
    let row = 0, column = -1;
    // Use binary search for this
    for(let i = 0; i < this.CRDT.length; ++i) {
      for(let j = 0; j < this.CRDT[i].length; ++j) {
        if(this.allocator.compare(this.CRDT[i][j], id) === -1) {
          row = i;
          column = j;
        } else {
          break;
        }
      }
    }
    this.addCharacterAt(row, column + 1, character);
    this.validateCurrentState();
  }

  addRemoteCharacterWith(id, character) {
    this.validateCurrentState();
    for(let i = 0; i < this.CRDT.length; ++i) {
      for(let j = 0; j < this.CRDT[i].length; ++j) {
        if(this.allocator.compare(this.CRDT[i][j], id) === 0) {
          this.deleteCharacterAt(i, j);
          console.log("Removed remote character");
        } else {
          break;
        }
      }
    }
    this.validateCurrentState();
  }

  handleNormalCharacter(row, column, id, character) {
    this.CRDT[row].splice(column, 0, {"id": id, "ch": character});
  }

  handleNewLineCharacter(row, column, id, character) {
    let remainingLine = this.CRDT[row].slice(column);
    this.CRDT[row].splice(column, remainingLine.length, {"id": id, "ch": character});
    this.CRDT.splice(row + 1, remainingLine);
  }

  getLeftAdjacentId(row, column) {
    let leftAdjacentId;
    if(row == 0 && column == 0)
      leftAdjacentId = [0];
    else if(column != 0)
      leftAdjacentId = this.CRDT[row][column - 1].id;
    else
      leftAdjacentId = this.CRDT[row - 1].slice(-1)[0].id;
    return leftAdjacentId;
  }

  getRightAdjacentId(row, column) {
    let rightAdjacentId;
    if(row == this.CRDT.length - 1 && column == this.CRDT.slice(-1)[0].length)
      rightAdjacentId = [31];
    else if(this.CRDT[row][column] !== undefined)
      rightAdjacentId = this.CRDT[row][column].id;
    else
      rightAdjacentId = this.CRDT[row + 1][0].id;
    return rightAdjacentId;
  }

  validateCurrentState() {
    id = [0];
    for(let i = 0; i < this.CRDT.length; ++i) {
      for(let j = 0; j < this.CRDT[i].length; ++j) {
        if(this.allocator.compare(id, this.CRDT[i][j]) === -1) {
          id = this.CRDT[i][j];
        } else {
          console.log("Invalid state");
        }
      }
    }
  }
}
