/*
messageID : Random UUID for each message messagePacket
serverID : Random UUID generated when websocket is connected for the first time. Remains fixed there after
position : Position vector where the action has taken place
action : "ADD" / "REMOVE"
text : Text to be added or removed
*/

var messagePacket = function(messageID, serverID, position, action, text) {
  this.messageID = messageID;
  this.serverID = serverID;
  this.position = position;
  this.action = action;
  this.text = text;
};

messagePacket.prototype = {
  getMessageID: function() {
    return this.messageID;
  },
  getServerID: function() {
    return this.serverID;
  },
  getPosition: function() {
    return this.position;
  },
  getAction: function() {
    return this.action;
  },
  getText: function() {
    return this.text;
  },
  setMessageID: function(messageID) {
    this.messageID = messageID;
  },
  setServerID: function(serverID) {
    this.serverID = serverID;
  },
  setPosition: function(position) {
    this.position = position;
  },
  setAction: function(action) {
    this.action = action;
  },
  setText: function(text) {
    this.text = text;
  }
}
