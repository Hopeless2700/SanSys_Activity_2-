// ============================================================
//  Smart Farm IoT Node - Arduino UNO R4 WiFi
//  Cities: Paranaque | Makati | Pasay | Taguig
//  Sensors: DHT11 (temp/humidity) + LDR (daytime gate)
//  Indicator: Red LED (ON = nighttime suppressed, OFF = transmitting)
// ============================================================

#include <DHT.h>
#include <WiFiS3.h>
#include <WiFiClient.h>

// --- CHANGE THESE TWO LINES PER DEVICE ---------------------
const char* SENSOR_ID = "NODE_03";
const char* LOCATION  = "Pasay_Station";

// --- WiFi credentials --------------------------------------
const char* WIFI_SSID = "Converge_2.4GHz_gZ2H";
const char* WIFI_PASS = "qu4pFbHE";

// --- Server config -----------------------------------------
const char* SERVER_HOST = "192.168.100.8";
const int   SERVER_PORT = 80;
const char* SERVER_PATH = "/sansys-backend/api/sensor";

// --- Pin definitions ---------------------------------------
#define DHT_PIN  2
#define DHT_TYPE DHT11
#define LDR_PIN  A0
#define LED_RED  7

// --- Thresholds & timing -----------------------------------
const int           LDR_THRESHOLD = 300;  // CHANGED from 500 to 300
const unsigned long SEND_INTERVAL = 5000;

// --- Globals -----------------------------------------------
DHT dht(DHT_PIN, DHT_TYPE);
WiFiClient client;
unsigned long lastSendTime = 0;

// ===========================================================
void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(LED_RED, OUTPUT);

  for (int i = 0; i < 3; i++) {
    digitalWrite(LED_RED, HIGH); delay(150);
    digitalWrite(LED_RED, LOW);  delay(150);
  }

  Serial.println("==============================");
  Serial.println("  Smart Farm Sensor Node");
  Serial.print("  ID: "); Serial.println(SENSOR_ID);
  Serial.print("  Location: "); Serial.println(LOCATION);
  Serial.println("==============================");

  connectWiFi();
}

// ===========================================================
void loop() {
  if (millis() - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = millis();
    runSensorCycle();
  }
}

// ===========================================================
void runSensorCycle() {
  int  ldrValue  = analogRead(LDR_PIN);
  bool isDaytime = (ldrValue > LDR_THRESHOLD);

  Serial.println("------------------------------");
  Serial.print("[LDR]  Raw value : "); Serial.println(ldrValue);
  Serial.print("[LDR]  Threshold : "); Serial.println(LDR_THRESHOLD); // ADDED
  Serial.print("[Edge] Daytime   : "); Serial.println(isDaytime ? "YES - transmitting" : "NO - suppressed");

  if (!isDaytime) {
    digitalWrite(LED_RED, HIGH);
    Serial.println("[LED]  Red ON - nighttime suppression active.");
    Serial.println("[Edge] No transmission.");
    return;
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Lost connection. Reconnecting...");
    for (int i = 0; i < 6; i++) {
      digitalWrite(LED_RED, HIGH); delay(100);
      digitalWrite(LED_RED, LOW);  delay(100);
    }
    connectWiFi();
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("[WiFi] Reconnect failed. Aborting cycle.");
      return;
    }
  }

  digitalWrite(LED_RED, LOW);
  Serial.println("[LED]  Red OFF - daytime, transmitting.");

  delay(2000);

  float humidity    = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("[DHT11] Read failed. Check wiring.");
    for (int i = 0; i < 4; i++) {
      digitalWrite(LED_RED, HIGH); delay(400);
      digitalWrite(LED_RED, LOW);  delay(400);
    }
    return;
  }

  Serial.print("[DHT11] Temp     : "); Serial.print(temperature); Serial.println(" C");
  Serial.print("[DHT11] Humidity : "); Serial.print(humidity);    Serial.println(" %");

  sendToServer(temperature, humidity, ldrValue);
}

// ===========================================================
void sendToServer(float temp, float hum, int ldr) {
  if (!client.connect(SERVER_HOST, SERVER_PORT)) {
    Serial.println("[WiFi] Cannot reach server.");
    for (int i = 0; i < 2; i++) {
      digitalWrite(LED_RED, HIGH); delay(200);
      digitalWrite(LED_RED, LOW);  delay(200);
    }
    return;
  }

  String payload = "{";
  payload += "\"sensor_id\":\"";  payload += SENSOR_ID; payload += "\",";
  payload += "\"location\":\"";   payload += LOCATION;  payload += "\",";
  payload += "\"temperature\":";  payload += temp;      payload += ",";
  payload += "\"humidity\":";     payload += hum;       payload += ",";
  payload += "\"ldr_raw\":";      payload += ldr;       payload += ",";
  payload += "\"daytime\":true";
  payload += "}";

  Serial.print("[HTTP] POST http://");
  Serial.print(SERVER_HOST);
  Serial.print(SERVER_PATH);
  Serial.println();

  client.print("POST "); client.print(SERVER_PATH); client.println(" HTTP/1.1");
  client.print("Host: ");           client.println(SERVER_HOST);
  client.println("Content-Type: application/json");
  client.println("Connection: close");
  client.print("Content-Length: "); client.println(payload.length());
  client.println();
  client.println(payload);

  unsigned long timeout = millis();
  while (client.connected() && millis() - timeout < 5000) {
    if (client.available()) {
      String line = client.readStringUntil('\n');
      line.trim();
      if (line.startsWith("HTTP/1.1")) {
        Serial.print("[Server] "); Serial.println(line);
      }
    }
  }

  client.stop();
  Serial.println("[WiFi] Transmission done.");
}

// ===========================================================
void connectWiFi() {
  Serial.print("[WiFi] Connecting to "); Serial.println(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASS);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    delay(2000);
    Serial.println("\n[WiFi] Connected!");
    Serial.print("[WiFi] IP: "); Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[WiFi] Failed. Will retry next cycle.");
  }
}