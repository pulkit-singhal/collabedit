"use strict"

import RequestHelper from './requestHelper';

function listen(textChangeProcessor, remoteData, editor) {
  if(remoteData.action === "add") {
    textChangeProcessor.addRemoteCharacterWith(remoteData.position, remoteData.character, editor);
  } else {
    textChangeProcessor.deleteRemoteCharacterWith(remoteData.position, remoteData.character, editor);
  }
}

export default class RemoteUpdateListener {
  constructor(textChangeProcessor, ws) {
    this.textChangeProcessor = textChangeProcessor;
  	this.ws = ws;
  }

  startListeningForUpdates(localUpdatesTransformer, editor) {
    let textChangeProcessor = this.textChangeProcessor;
    this.ws.onmessage = function(event) {
      let eventData = JSON.parse(event.data);
      if(eventData.siteId !== window.siteId) {
        listen(textChangeProcessor, eventData, editor);
      }
    }
  }
}
