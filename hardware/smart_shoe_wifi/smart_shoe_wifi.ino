// Use ESP32 chip to process data and send through internet

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <HTTPClient.h>

#include "secrets.h"

WiFiMulti wifiMulti;

#define RXp2 16
#define TXp2 17

void setup() {
    Serial.begin(115200);
    Serial2.begin(115200, SERIAL_8N1, RXp2, TXp2);
    
    wifiMulti.addAP(WIFI_NAME, WIFI_PASSWORD);
    delay(500);
    Serial.println("Wifi Connected");
}

void loop() {
    if((wifiMulti.run() == WL_CONNECTED)) {
      String data = Serial2.readString();
      if (data.length() > 0) {        
        HTTPClient http;
        http.begin("https://hackthenorth2022.uc.r.appspot.com/api/velocities");
        http.addHeader("Content-Type", "application/json");
        
        int httpCode = http.POST("{\"data\": " + data + "}");

        if(httpCode > 0) {
            Serial.printf("HTTP POST\nCode: %d\n", httpCode);

            if(httpCode == HTTP_CODE_OK) {
                Serial.println("Ok");
            }
        } else {
            Serial.printf("Error: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();
      }
    }
    else {
      Serial.print(".");
    }
}