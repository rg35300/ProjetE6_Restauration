#include <HX711.h>
#include <WiFi.h>
#include <PubSubClient.h>

#define DOUT 4
#define CLK 5

//Wifi
const char *ssid = "";
const char *password ="";

//MQTT Broker
const char *mqtt_broker = "10.160.120.14";
const char *topic = "data";
const char *mqtt_username = "";
const char *mqtt_password = "";
const int mqtt_port = 1883;

WiFiClient espClient; 
PubSubClient client(espClient); 
HX711 scale;

// Facteurs de calibration pour chaque jauge
// Remplacez les valeurs par les facteurs de calibration que vous souhaitez utiliser
const float calibrationFactors[4] = {0.005, 0.005, 0.005, 0.005};

void setup() {
  Serial.begin(115200);
  // conexction au wi-fi
  WiFi.begin(ssid, password);
  scale.begin(DOUT, CLK);
}

void loop() {
  float sumMass = 0.0;
  int numMeasurements = 5;

  // Mesurer les masses pour chaque jauge et calculer la somme
  for (int i = 0; i < numMeasurements; i++) {
    for (int j = 0; j < 4; j++) {
      float measuredMass = measureScale(j);
      sumMass += measuredMass;
      Serial.print("Jauge ");
      Serial.print(j + 1);
      Serial.print(": ");
      Serial.print(measuredMass);
      Serial.println(" g");
      delay(100);
    }
  }

  // Calculer la moyenne des masses mesurées
  float averageMass = sumMass / (numMeasurements * 4);

  Serial.print("Moyenne des masses mesurées: ");
  Serial.print(averageMass);
  Serial.println(" g");

  delay(1000);
}

float measureScale(int index) {
  // Appliquer le facteur de calibration à la lecture brute
  float calibratedReading = scale.read() * calibrationFactors[index];
  return calibratedReading;
}
