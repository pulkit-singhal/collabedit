package com.github.collabedit.requests;

import com.google.common.base.Preconditions;

import java.io.Serializable;

public class RegistrationRequest extends BaseRequest implements Serializable {

  private String documentId;
  private Long transactionId;

  public String documentId() {
    return this.documentId;
  }

  public Long transactionId() {
    return this.transactionId;
  }

  public RegistrationRequest documentId(final String documentId) {
    this.documentId = documentId;
    return this;
  }

  public RegistrationRequest transactionId(final Long transactionId) {
    this.transactionId = transactionId;
    return this;
  }

  public void validate() {
    Preconditions.checkNotNull(documentId);
    Preconditions.checkNotNull(transactionId);
  }

}
