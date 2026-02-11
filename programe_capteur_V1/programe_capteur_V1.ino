#include <HX711.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include  <Wire.h>

#define DOUT 4
#define CLK 5

//Wifi
const char *ssid = "";
const char *MDP ="";

//MQTT Broker
const char *mqtt_broker = "10.160.120.14"; //adresse du broker
const char *topic_princ = "data";
const char *topic_secon = "datas_secon";
const char *mqtt_username = "admin";
const char *mqtt_MDP = "Va#j5jNcM!P";
const int *mqtt_port = 1883;

//initialisation des fonction
WiFiClient espClient; 
PubSubClient client(espClient); 
HX711 scale;

// Facteurs de calibration pour chaque jauge
const float calibrationFactors[4] = {0.005, 0.005, 0.005, 0.005};

void setup() 
{
  Serial.begin(115200);
  // connexction au wi-fi
  WiFi.begin(ssid, MDP);
  while (WiFi.status() != WL_CONNECTED) 
  { 
    delay(500);
    Serial.println("connextion au WiFi.."); 
  }
  Serial.println("Connecter au Wi-Fi");
  
  //connexion au broker MQTT  
 client.setServer(mqtt_broker, mqtt_port);
 while (!client.connected())
 {
   String client_id = "client-restoration";  
   Serial.print("conextion au broker "); 
   if (client.connect(client_id.c_str(), mqtt_username, mqtt_MDP)) 
  { 
   Serial.println("connecter au Broker");
   client.publish(topic_princ, "test");
  } 
  else 
  { 
   Serial.print("echec:  "); 
   Serial.print(client.state()); 
   delay(2000); 
  }
 }
 scale.begin(DOUT, CLK);
}

void loop() 
{
  float somMasse = 0.0;
  int nbMesur = 5;
  

  // Mesurer les masses pour chaque jauge et calculer la somme
  for (int i = 0; i < nbMesur; i++) 
  {
    for (int j = 0; j < 4; j++)
    {
      float masseMesur = measureScale(j);
      somMasse += masseMesur;
      Serial.print("Jauge ");
      Serial.print(j + 1);
      Serial.print(": ");
      Serial.print(masseMesur);
      Serial.println(" g");
      delay(100);
    }
    client.publish(topic_princ, char(somMasse)); 
  }
 delay(1000);
}

float measureScale(int index) 
{
  // Appliquer le facteur de calibration à la lecture brute
  float lectureCalibrer = scale.read() * calibrationFactors[index];
  return lectureCalibrer;
}
