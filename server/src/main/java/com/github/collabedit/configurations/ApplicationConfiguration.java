package com.github.collabedit.configurations;

import com.github.collabedit.datastore.DataStore;
import com.github.collabedit.session.SessionStore;
import com.github.collabedit.WSServer;
import com.github.collabedit.handlers.RequestConverter;
import com.github.collabedit.handlers.SocketHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.InetSocketAddress;

@Configuration
public class ApplicationConfiguration {

  @Autowired
  private SocketHandler socketHandler;

  @Autowired
  private SessionStore sessionStore;

  @Autowired
  private RequestConverter requestConverter;

  @Autowired
  private DataStore dataStore;

  @Bean
  public WSServer webSocketServer() {
    return new WSServer(new InetSocketAddress(8080), socketHandler, sessionStore, requestConverter, dataStore);
  }
}
