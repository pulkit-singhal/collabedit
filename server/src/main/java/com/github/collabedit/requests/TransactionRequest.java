package com.github.collabedit.requests;

import java.util.List;

public class TransactionRequest extends BaseRequest {

  private Long siteId;
  private List<Long> position;
  private Action action;
  private Character character;
  private Long transactionId;

  public Long transactionId() {
    return transactionId;
  }

  public void setTransactionId(Long transactionId) {
    this.transactionId = transactionId;
  }

  public enum Action {
    add,
    delete
  }
}
