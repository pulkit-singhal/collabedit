package com.github.collabedit.utils;

import static java.time.Instant.now;

public class SequenceGenerator {

  private static int LOWER_ORDER_TEN_BITS = 0x3FF;
  private static int UNIQUE_ID_COUNTER_BITS = 10;
  private static int PER_MS_ID_COUNTER = 0;
  private static long CUR_EPOCH = 0;

  public static long nextID() {
    long currentMillis = now().toEpochMilli();
    long id = now().toEpochMilli() << UNIQUE_ID_COUNTER_BITS;
    id |= getNextCounter(currentMillis);
    return id;
  }

  private synchronized static long getNextCounter(long epoch) {
    if (epoch == CUR_EPOCH) {
      PER_MS_ID_COUNTER++;
    } else {
      PER_MS_ID_COUNTER = 0;
      CUR_EPOCH = epoch;
    }
    PER_MS_ID_COUNTER &= LOWER_ORDER_TEN_BITS;
    return PER_MS_ID_COUNTER;
  }
}