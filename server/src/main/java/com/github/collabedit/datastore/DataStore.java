package com.github.collabedit.datastore;

import com.github.collabedit.requests.TransactionRequest;

import java.util.List;

public interface DataStore {

  List<TransactionRequest> getPendingTransactions(String documentId, long lastTransactionId);

  TransactionRequest addTransaction(String documentId, TransactionRequest transactionRequest);

}
