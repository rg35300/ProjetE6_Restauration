#include <WiFi.h>
#include <HTTPClient.h>
#include <FastLED.h>
#include <ArduinoJson.h>

// ----------------------
// CONFIG MATRICE LED
// ----------------------
#define LED_PIN     5
#define WIDTH       32
#define HEIGHT      8
#define NUM_LEDS    (WIDTH * HEIGHT)
#define BRIGHTNESS  40
#define LED_TYPE    WS2812B
#define COLOR_ORDER GRB

CRGB leds[NUM_LEDS];

uint16_t XY(uint8_t x, uint8_t y) {
  return y * WIDTH + x;
}

// ----------------------
// CONFIG WIFI + API
// ----------------------
const char* ssid = "BTS-CIEL";
const char* MDP  = "Azerty.1";

String urlAPI = "http://10.160.120.14/getData.php";

String dernierMessage = "";

void setup() {
  Serial.begin(115200);
  Serial.println("Démarrage...");

  // Connexion WiFi
  WiFi.begin(ssid, MDP);
  Serial.print("Connexion WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connecté !");

  // LED
  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS);
  FastLED.setBrightness(BRIGHTNESS);
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(urlAPI);

    int httpCode = http.GET();

    if (httpCode == 200) {
      String payload = http.getString();
      Serial.println("Réponse API : " + payload);

      // Parse JSON
      DynamicJsonDocument doc(256);
      deserializeJson(doc, payload);

      String message = doc["message"].as<String>();

      if (message != dernierMessage) {
        dernierMessage = message;
        afficherData(message);
      }
    } else {
      Serial.println("Erreur HTTP : " + String(httpCode));
    }

    http.end();
  }

  delay(2000); // Vérifie la BDD toutes les 2 secondes
}

// ----------------------
// AFFICHAGE LED
// ----------------------
void afficherData(String Data) {
  fill_solid(leds, NUM_LEDS, CRGB::Black);

  for (int i = 0; i < Data.length() && i < WIDTH; i++) {
    leds[XY(i, 0)] = CRGB::Green;
  }

  FastLED.show();
}
