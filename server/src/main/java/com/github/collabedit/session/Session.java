package com.github.collabedit.session;

import org.java_websocket.WebSocket;

public class Session {

  private String sessionId;
  private String documentId;
  private WebSocket webSocket;

  public String sessionId() {
    return this.sessionId;
  }

  public String documentId() {
    return this.documentId;
  }

  public WebSocket webSocket() {
    return this.webSocket;
  }

  public Session sessionId(final String sessionId) {
    this.sessionId = sessionId;
    return this;
  }

  public Session documentId(final String documentId) {
    this.documentId = documentId;
    return this;
  }

  public Session webSocket(final WebSocket webSocket) {
    this.webSocket = webSocket;
    return this;
  }
}
