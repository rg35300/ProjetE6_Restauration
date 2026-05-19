#include <WiFi.h>
#include <PubSubClient.h>
#include <FastLED.h>

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

// Convertit (x,y) en index
uint16_t XY(uint8_t x, uint8_t y) {
  return y * WIDTH + x;
}

// ----------------------
// CONFIG WIFI + MQTT
// ----------------------

//Wifi
const char *ssid = "";
const char *MDP ="";


//MQTT Broker
const char *mqtt_broker = "10.160.120.14"; //adresse du broker
const char *topic = "data";
const char *mqtt_username = "admin";
const char *mqtt_MDP = "Va#j5jNcM!P";
const int *mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

String messageRecu = ""; 

// ----------------------
// AFFICHAGE
// ----------------------
void afficherData(String Data) {
  fill_solid(leds, NUM_LEDS, CRGB::Black);

  for (int i = 0; i < Data.length() && i < WIDTH; i++) {
    char c = Data[i];
    // Affiche un caractère simplifié (1 pixel = démonstration)
    leds[XY(i, 0)] = CRGB::Green;
  }

  FastLED.show();
}

// ----------------------
// CALLBACK MQTT
// ----------------------
void callback(char* topic, byte* payload, unsigned int length) {
  messageRecu = "";
  for (int i = 0; i < length; i++) {
    messageRecu += (char)payload[i];
  }
  afficherData(messageRecu);
}

// ----------------------
// CONNEXION MQTT
// ----------------------
void reconnect() {
 client.setServer(mqtt_broker, mqtt_port);
 while (!client.connected())
 {
   String client_id = "client-restoration";  
   Serial.print("connextion au broker "); 
   if (client.connect(client_id.c_str(), mqtt_username, mqtt_MDP)) 
  { 
   Serial.println("connecter au Broker");
  } 
  else 
  { 
   Serial.print("echec:  "); 
   Serial.print(client.state()); 
   delay(2000); 
  }
 }
}



void setup() 
{
  Serial.begin(115200);

  // connection au Broker
  reconnect();
  
  // connexction au wi-fi
  WiFi.begin(ssid, MDP);
  while (WiFi.status() != WL_CONNECTED) 
  { 
    delay(500);
    Serial.println("connextion au WiFi.."); 
  }
  Serial.println("Connecter au Wi-Fi");

}



void loop() {
  if (!client.connected()) reconnect();
  client.loop();
}
