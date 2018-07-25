
"use strict";

export default class Message {
  constructor(messageID, siteID, position, action, text) {
    this.messageID = messageID;
    this.siteID = siteID;
    this.position = position;
    this.action = action;
    this.text = text;
  }

  getMessageID() {
    return this.messageID;
  }

  getSiteID() {
    return this.siteID;
  }

  getPosition() {
    return this.position;
  }

  getAction() {
    return this.action;
  }

  getText() {
    return this.text;
  }
}
