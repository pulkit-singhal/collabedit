"use strict"

import RequestHelper from './requestHelper';

export default class LocalUpdatesTransformer {
  constructor(textChangeProcessor, queuer) {
  	this.textChangeProcessor = textChangeProcessor;
  	this.queuer = queuer;
  }

  sendUpdate(update) {
  	let row = update.from.line;
  	let column = update.from.ch;

  	let removed = update.removed;
  	for(let i = 0; i < removed.length; ++i) {
  		if (i !== 0) {
  			let localUpdate = this.textChangeProcessor.deleteCharacterAt(row, column);
  			this.queuer.sendPacket(RequestHelper.transactionRequest("delete", localUpdate));
  		}
  		for(let j = 0; j < removed[i].length; ++j) {
  			let localUpdate = this.textChangeProcessor.deleteCharacterAt(row, column);
  			this.queuer.sendPacket(RequestHelper.transactionRequest("delete", localUpdate));
  		}
  	}
  	this.textChangeProcessor.validateCurrentState();
  	
  	let text = update.text;
  	for(let i = text.length - 1; i >= 0; --i) {
  		for(let j = text[i].length - 1; j >= 0; --j) {
  			let localUpdate = this.textChangeProcessor.addCharacterAt(row, column, text[i][j]);
  			this.queuer.sendPacket(RequestHelper.transactionRequest("add", localUpdate));
  		}
  		if(i !== text.length - 1) {
  			let localUpdate = this.textChangeProcessor.addCharacterAt(row, column, '\n');
  			this.queuer.sendPacket(RequestHelper.transactionRequest("add", localUpdate));
  		}
  	}
  	this.textChangeProcessor.validateCurrentState();
  }
}
