"use strict";

export default class TextChangeProcessor {
  constructor(allocator) {
    this.CRDT = [[]];
    this.allocator = allocator;
  }

  addCharacterAt(row, column, character, id) {
    let leftAdjacentId = this.getLeftAdjacentId(row, column);
    let rightAdjacentId = this.getRightAdjacentId(row, column);
    let allocatedIdentifier = this.allocator.allocate(leftAdjacentId, rightAdjacentId);
    this.handleCharacterAddition(row, column, allocatedIdentifier, character);
    return {
      "id": allocatedIdentifier,
      "ch": character
    };
  }

  deleteCharacterAt(row, column, editor) {
    let identifier = this.CRDT[row][column].id;
    let character = this.CRDT[row][column].ch;
    if(this.CRDT[row][column].ch != '\n') {
      if(editor !== undefined) {
        editor.getDoc().replaceRange("", {line: row, ch: column}, {line: row, ch: column + 1}, "remoteEdit");
      }
      this.CRDT[row].splice(column, 1);
    } else {
      if(editor !== undefined) {
        editor.getDoc().replaceRange("", {line: row, ch: column}, {line: row + 1, ch: 0}, "remoteEdit");
      }
      let nextLine = this.CRDT[row + 1];
      this.CRDT[row].splice(column, 1, ...nextLine);
      this.CRDT.splice(row + 1, 1);
    }
    return {
      "id": identifier,
      "ch": character
    };
  }

  addRemoteCharacterWith(id, character, editor) {
    this.validateCurrentState();
    let row = 0, column = -1;
    // Use binary search for this
    for(let i = 0; i < this.CRDT.length; ++i) {
      for(let j = 0; j < this.CRDT[i].length; ++j) {
        if(this.allocator.compare(this.CRDT[i][j].id, id) === -1) {
          row = i;
          column = j;
        } else {
          break;
        }
      }
    }
    let finalRow, finalColumn;
    if(this._identifier(row, column) !== undefined && this.CRDT[row][column].ch == '\n') {
      this.handleCharacterAddition(row + 1, 0, id, character);
      finalRow = row + 1;
      finalColumn = 0;
    } else {
      this.handleCharacterAddition(row, column + 1, id, character);
      finalRow = row;
      finalColumn = column + 1;
    }
    editor.getDoc().replaceRange(character, {line: finalRow, ch: finalColumn}, {line: finalRow, ch: finalColumn}, "remoteEdit");
    this.validateCurrentState();
  }

  deleteRemoteCharacterWith(id, character, editor) {
    console.log("Remote edit invoked at " + id + " : " + character);
    this.validateCurrentState();
    for(let i = 0; i < this.CRDT.length; ++i) {
      for(let j = 0; j < this.CRDT[i].length; ++j) {
        if(this.allocator.compare(this.CRDT[i][j].id, id) === 0) {
          this.deleteCharacterAt(i, j, editor);
          console.log("Removed remote character");
        }
      }
    }
    this.validateCurrentState();
  }
  
  handleCharacterAddition(row, column, id, character) {
    this.CRDT[row].splice(column, 0, {"id": id, "ch": character});
    if(character == '\n') {
      let remainingLine = this.CRDT[row].splice(column + 1);
      this.CRDT.splice(row + 1, 0, remainingLine);
    }
    for(let col = column - 1; col >= 0; --col) {
      if(this.CRDT[row][col].ch == '\n') {
        let remainingLine = this.CRDT[row].splice(col + 1);
        if(remainingLine.length !== 0) {
          this.CRDT.splice(row + 1, 0, remainingLine);
        }
      }
    }
  }

  getLeftAdjacentId(row, column) {
    return this._firstDefinedIdentifier([
        this._identifier(row, column - 1),
        this._lastIdentifierInRow(row - 1),
        [0]
      ]);
  }

  getRightAdjacentId(row, column) {
    return this._firstDefinedIdentifier([
        this._identifier(row, column),
        this._identifier(row + 1, 0),
        [31]
      ]);
  }

  _firstDefinedIdentifier(identifiers) {
    for(let i = 0; i < identifiers.length; ++i) {
      if(identifiers[i] !== undefined) {
        return identifiers[i];
      }
    }
  }

  _lastIdentifierInRow(row) {
    if(this.CRDT[row] === undefined) {
      return undefined;
    } else if(this.CRDT[row].slice(-1)[0] === undefined) {
      return undefined;
    } else {
      return this.CRDT[row].slice(-1)[0].id;
    }
  }

  _identifier(row, column) {
    if(this.CRDT[row] === undefined) {
      return undefined;
    } else if(this.CRDT[row][column] === undefined) {
      return undefined;
    } else {
      return this.CRDT[row][column].id;
    }
  }

  validateCurrentState() {
    let id = [0];
    for(let i = 0; i < this.CRDT.length; ++i) {
      for(let j = 0; j < this.CRDT[i].length; ++j) {
        if(this.allocator.compare(id, this.CRDT[i][j].id) === -1) {
          id = this.CRDT[i][j].id;
        } else {
          console.log("Invalid state");
        }
      }
    }
  }
}
