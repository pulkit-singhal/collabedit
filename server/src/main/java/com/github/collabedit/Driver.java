package com.github.collabedit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class Driver {
  public static void main(String[] args) {
    ConfigurableApplicationContext applicationContext = SpringApplication.run(Driver.class, args);
    applicationContext.getBean(WSServer.class).run();
  }
}
