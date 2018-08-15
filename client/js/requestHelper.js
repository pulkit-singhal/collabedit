"use strict";

class RequestHelper {
  
  constructor() {}

  registrationRequest(documentId, transactionId) {
    return JSON.stringify({
      "type": "register",
      "body": {
        "documentId": documentId,
        "transactionId": transactionId
      }
    });
  }

  transactionRequest(type, localUpdate) {
    return JSON.stringify({
      "type": "transaction",
      "body": {
        "action": type,
        "position": localUpdate.id,
        "character": localUpdate.ch,
        "siteId": window.siteId
      }
    });
  }
}

export default new RequestHelper();
