package com.github.collabedit;

import com.github.collabedit.datastore.DataStore;
import com.github.collabedit.handlers.RequestConverter;
import com.github.collabedit.handlers.SocketHandler;
import com.github.collabedit.requests.BaseRequest;
import com.github.collabedit.requests.RegistrationRequest;
import com.github.collabedit.requests.TransactionRequest;
import com.github.collabedit.session.Session;
import com.github.collabedit.session.SessionStore;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.InetSocketAddress;

import static java.util.Objects.isNull;

public class WSServer extends WebSocketServer {

  private static final Logger logger = LoggerFactory.getLogger(WSServer.class);

  private SocketHandler socketHandler;
  private SessionStore sessionStore;
  private RequestConverter requestConverter;
  private DataStore dataStore;

  public WSServer(InetSocketAddress address, SocketHandler socketHandler, SessionStore sessionStore,
                  RequestConverter requestConverter, DataStore dataStore) {
    super(address);
    this.socketHandler = socketHandler;
    this.sessionStore = sessionStore;
    this.requestConverter = requestConverter;
    this.dataStore = dataStore;
  }

  @Override
  public void onStart() {
    logger.info("Starting server at address: {}", this.getAddress());
  }

  @Override
  public void onOpen(WebSocket webSocket, ClientHandshake clientHandshake) {
    Session session = sessionStore.getInstance(webSocket);
    logger.info("Opened the socket : {}", session.sessionId());
  }

  @Override
  public void onMessage(WebSocket webSocket, String message) {
    Session session = sessionStore.getInstance(webSocket);
    logger.info("Message received on socket : {}/{}", session.sessionId(), message);
    BaseRequest request = requestConverter.getRequest(message);
    if (request instanceof RegistrationRequest)
      socketHandler.registerSession(session, (RegistrationRequest) request);
    else {
      socketHandler.publishForDocument(session.documentId(), (TransactionRequest) request);
    }
  }

  @Override
  public void onClose(WebSocket webSocket, int code, String reason, boolean remote) {
    Session session = sessionStore.getInstance(webSocket);
    socketHandler.deregisterSession(session);
    logger.info("Closed the socket : {}", session.sessionId());
  }

  @Override
  public void onError(WebSocket webSocket, Exception e) {
    Session session = sessionStore.getInstance(webSocket);
    if (isNull(session))
      return;
    if (e instanceof JSONException) {
      logger.warn("Invalid JSON received on socket : {}", session.sessionId());
      return;
    }
    logger.info("Error on socket : {}/{}", session.sessionId(), ExceptionUtils.getStackTrace(e));
  }
}
