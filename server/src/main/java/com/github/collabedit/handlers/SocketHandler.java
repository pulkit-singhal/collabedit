package com.github.collabedit.handlers;

import com.github.collabedit.datastore.DataStore;
import com.github.collabedit.requests.RegistrationRequest;
import com.github.collabedit.requests.TransactionRequest;
import com.github.collabedit.session.Session;
import com.google.common.collect.Sets;
import org.java_websocket.WebSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Predicate;

import static com.github.collabedit.utils.Helper.GSON;
import static java.util.Collections.emptySet;

@Service
public class SocketHandler {

  @Autowired
  private DataStore dataStore;

  private ConcurrentHashMap<String, Set<Session>> sockets = new ConcurrentHashMap<>();

  public void registerSession(Session session, RegistrationRequest req) {
    session.documentId(req.documentId());
    sockets.computeIfAbsent(req.documentId(), __ -> Sets.newConcurrentHashSet())
      .add(session);
    dataStore.getPendingTransactions(req.documentId(), req.transactionId())
      .forEach(transaction -> session.webSocket().send(GSON.toJson(transaction)));
  }

  public void deregisterSession(Session session) {
    sockets.getOrDefault(session.documentId(), emptySet())
      .remove(session);
  }

  public void publishForDocument(String documentId, TransactionRequest transaction) {
    dataStore.addTransaction(documentId, transaction);
    sockets.get(documentId)
      .stream()
      .map(Session::webSocket)
      .filter(((Predicate<WebSocket>) ws -> ws.isClosing() || ws.isClosed()).negate())
      .forEach(ws -> ws.send(GSON.toJson(transaction)));
  }
}
