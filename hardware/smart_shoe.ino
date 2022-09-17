// Use ESP32 chip to process data and send through internet

#include <Arduino.h>
#include <WiFi.h>
#include <WiFiMulti.h>
#include <HTTPClient.h>

#include "secrets.h"

WiFiMulti wifiMulti;

void setup() {
    Serial.begin(115200);
    wifiMulti.addAP(WIFI_NAME, WIFI_PASSWORD);
    Serial.println("Wifi Connected");
}

void loop() {
    if((wifiMulti.run() == WL_CONNECTED)) {
        http.begin("https://httpbin.org/post");

        int httpCode = http.POST("Hello world");

        if(httpCode > 0) {
            Serial.printf("HTTP POST\nCode: %d\n", httpCode);

            if(httpCode == HTTP_CODE_OK) {
                String payload = http.getString();
                Serial.println(payload);
            }
        } else {
            Serial.printf("Error: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();
        delay(10000);
      }
    }
}