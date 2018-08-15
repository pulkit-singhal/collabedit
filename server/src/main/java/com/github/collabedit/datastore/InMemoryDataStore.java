package com.github.collabedit.datastore;

import com.github.collabedit.requests.TransactionRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import static com.github.collabedit.utils.SequenceGenerator.nextID;
import static com.google.common.collect.Lists.newCopyOnWriteArrayList;
import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;

@Service
public class InMemoryDataStore implements DataStore {

  private ConcurrentHashMap<String, List<TransactionRequest>> dataStore;

  public InMemoryDataStore() {
    this.dataStore = new ConcurrentHashMap<>();
  }

  public List<TransactionRequest> getPendingTransactions(String documentId, long transactionId) {
    return dataStore.getOrDefault(documentId, emptyList())
      .stream()
      .filter(transactionRequest -> transactionRequest.transactionId() > transactionId)
      .collect(toList());
  }

  public TransactionRequest addTransaction(String documentId, TransactionRequest transactionRequest) {
    transactionRequest.setTransactionId(nextID());
    dataStore.computeIfAbsent(documentId, __ -> newCopyOnWriteArrayList())
      .add(transactionRequest);
    return transactionRequest;
  }
}
