/*
messageID : Random UUID for each message messagePacket
siteID : Random UUID generated when websocket is connected for the first time. Remains fixed there after
position : Position vector where the action has taken place
action : "ADD" / "REMOVE"
text : Text to be added or removed
*/

var messagePacket = function(messageID, siteID, position, action, text) {
  this.messageID = messageID;
  this.siteID = siteID;
  this.position = position;
  this.action = action;
  this.text = text;
};

messagePacket.prototype = {
  getMessageID: function() {
    return this.messageID;
  },
  getSiteID: function() {
    return this.siteID;
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
  setSiteID: function(siteID) {
    this.siteID = siteID;
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
