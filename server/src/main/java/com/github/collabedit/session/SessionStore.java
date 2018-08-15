package com.github.collabedit.session;

import com.google.common.collect.Maps;
import org.java_websocket.WebSocket;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.ConcurrentMap;

import static java.util.Objects.isNull;

@Service
public class SessionStore {

  private ConcurrentMap<WebSocket, Session> socketToSession;

  public SessionStore() {
    this.socketToSession = Maps.newConcurrentMap();
  }

  public Session getInstance(WebSocket webSocket) {
    if(isNull(webSocket))
      return null;
    socketToSession.putIfAbsent(webSocket, new Session()
      .sessionId(UUID.randomUUID().toString())
      .webSocket(webSocket)
    );
    return socketToSession.get(webSocket);
  }
}
