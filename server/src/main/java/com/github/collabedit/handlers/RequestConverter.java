package com.github.collabedit.handlers;

import com.github.collabedit.requests.BaseRequest;
import com.github.collabedit.requests.RegistrationRequest;
import com.github.collabedit.requests.TransactionRequest;
import com.google.gson.JsonObject;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import static com.github.collabedit.utils.Helper.GSON;

@Service
public class RequestConverter {

  public BaseRequest getRequest(String payload) {
    JSONObject json = new JSONObject(payload);
    switch (json.getString("type")) {
      case "register":
        return GSON.fromJson(json.getJSONObject("body").toString(), RegistrationRequest.class);
      case "transaction":
        return GSON.fromJson(json.getJSONObject("body").toString(), TransactionRequest.class);
      default:
        throw new IllegalArgumentException("Message of unknown type received");
    }
  }
}
