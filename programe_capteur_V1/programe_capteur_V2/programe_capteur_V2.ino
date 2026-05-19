#include <HX711.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <time.h>

const int DOUT_PIN = 16;
const int SCK_PIN = 4;

// Wifi
const char* ssid = "BTS-CIEL";
const char* MDP ="Azerty.1";

// MQTT Broker sécurisé
const char* mqtt_broker = "10.160.120.14";
const char* topic_princ = "balance/bal_001/data";
const char* mqtt_username = "bal_001";
const char* mqtt_MDP = "WeY7Pwi6x"; 
const int mqtt_port = 8883;   // TLS

// Certificat CA du broker MQTT
const char* ca_cert = 
"-----BEGIN CERTIFICATE-----\n"
"MIIGEzCCA/ugAwIBAgIUVqFb6koymCVvEq4pEeee0tjoWaIwDQYJKoZIhvcNAQEL\n"
"BQAwgZgxCzAJBgNVBAYTAkZSMREwDwYDVQQIDAhCcmV0YWduZTEOMAwGA1UEBwwF\n"
"QnJlc3QxJTAjBgNVBAoMHFByb2pldC1SZXN0YXVyYXRpb24tU2NvbGFpcmUxFTAT\n"
"BgNVBAsMDENBLU1vc3F1aXR0bzEoMCYGA1UEAwwfQ0EtUHJvamV0LVJlc3RhdXJh\n"
"dGlvbi1TY29sYWlyZTAeFw0yNjA0MDgwODQ2MjJaFw0zNjA0MDUwODQ2MjJaMIGY\n"
"MQswCQYDVQQGEwJGUjERMA8GA1UECAwIQnJldGFnbmUxDjAMBgNVBAcMBUJyZXN0\n"
"MSUwIwYDVQQKDBxQcm9qZXQtUmVzdGF1cmF0aW9uLVNjb2xhaXJlMRUwEwYDVQQL\n"
"DAxDQS1Nb3NxdWl0dG8xKDAmBgNVBAMMH0NBLVByb2pldC1SZXN0YXVyYXRpb24t\n"
"U2NvbGFpcmUwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQCkVnAKl6Kd\n"
"V7zrB4Tvu/vZYbDE8maNm+zF9eZSQv9DnatwVb1sxcZqK5DdyzDgsJpix/0CShsJ\n"
"yPrC1wjcQQuvJ6sQykmQzHek1z3uHXXu0W80hVnc1+bBMqiMUS600lmPAo37HXJ4\n"
"KPprsZarnvTRDNiCjzaCJBbgYal9jG2Vt3KNSNaZJZ1gy2DLH4VVnsB9bOEBq5Th\n"
"NPL/y0uzz4iMVqxcYX9H20kcTmJOT2Ys811mC5h15XHROzKFjwFsGoAXwDszaroO\n"
"uApwmx7eAHYnSg+MMyBZLF5y2X+4GqDQmlSFxbJyShn7DLnr3u/Td0vwAs/cChYA\n"
"3bW6+mZbuwEkNIoXxaiUE83uY4f+FxohbD2a5DWxBzg6yNJdG6Lw6wKEhENjnCd+\n"
"4PQHH2GE0E6IpUaqkuiS15k82tY8KfuhEfNcZwQFN+5v7E2ANO5zmtxXhI6zCMud\n"
"TBoXKMlWHNp2ukK9aY2nprdY+pZExBI+iVEZa/FHNfGx2m/1ayYdo5MtPyqcjx07\n"
"wsW3lLniiX0p110zSNcq6bw56Mf24r4EGbxpocvEHHl1pwoIGqubbRD59Hbo9r5Y\n"
"emkcvLCct5i9BeXMDJquLF/5OBhirvLaC47ZJoTr1DzJXcZE4UQ0tLAQst5lWDW4\n"
"ggk7pWqiZT8ebBSUjWUManiIFrsIi9SttwIDAQABo1MwUTAdBgNVHQ4EFgQUxaX0\n"
"htewD2eGFN/HiuIfIGht9EowHwYDVR0jBBgwFoAUxaX0htewD2eGFN/HiuIfIGht\n"
"9EowDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAgEAY46wkBPxKrRB\n"
"VFbZdjHbuM6YnfbipCWqDYjHxr24qnxL1o5EvV3xJdwz/kQ37xy3wGgCU/xMNsZM\n"
"W1dz/DkyDZm0GMm1imHVji75eOlngFuJrxt1plGmYkopwnaNRcmMIm6e2bdOuhRC\n"
"vzQ46ONIhh4+MzuBn8iGqkTmq1+wX2n9+6rvR/tbnHWrQI389zI8DkSgoahPw0Ls\n"
"leNwDcNUsn4XU6TYqoB6R0p8/g6JQ2MygOTz5S6dvBK2BH2sjSmY/VubLICguUqI\n"
"EgKumUyC5CydsZkgjul85RJGnXSIMJYlsy2myhwdrDD+BEQnTFxJL/t6UqBi52YR\n"
"xkl51fskz6RHNbyoNiV6BC0AwZx9upst/1W/BM7xq4O2ChnssCEeb7fSCv1R4GVx\n"
"qz18aRY/2KX8Q1+idlTMhzyTFMZbOIq6lHm/TtrIk0y1cfgmmQs+jj0Cic/4k/DQ\n"
"j/LD70DFjKyg3StOjMF6AGOFxzTeMEAe+7eJTcRQmmza2t+pQiowwI2NEyz1TguO\n"
"cXRh9Ca75gvH1HX2KJ4ju8Jo3tKWDnHWCtKQ13RAyx1aoJdHuK+VtYaaPJk/L/VE\n"
"NqsWAPQi/HdhmXxEKJe9RuQjiFCW2t4XH4nbibojjohMYF86D/ZoUmE+uzJjaHhZ\n"
"KOZzbYBvNtRLqkHVspQ/FIfQCsT2X48=\n"
"-----END CERTIFICATE-----\n";

// Boutons
int pinBoutonOrga = 15;
int pinBoutonEmbal = 14;

bool dernierEtatOrga = HIGH;
bool dernierEtatEmbal = HIGH;

unsigned long lastDebounceTimeOrga = 0;
unsigned long lastDebounceTimeEmbal = 0;
unsigned long debounceDelay = 50;

const int CALIBRATION_FACTOR = 22;
WiFiClientSecure espClient;
PubSubClient client(espClient);
HX711 scale;



void setup() 
{
  Serial.begin(115200);
  Serial.println("Démarrage du système...");

  // Connexion WiFi
  WiFi.begin(ssid, MDP);
  Serial.println("Connexion au WiFi...");
  while (WiFi.status() != WL_CONNECTED) 
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnecté au WiFi !");

  // 🔥 SYNCHRONISATION NTP
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");

  Serial.println("Synchronisation NTP...");
  struct tm timeinfo;
  while (!getLocalTime(&timeinfo)) 
  {
    Serial.println("Attente de l'heure NTP...");
    delay(500);
  }
  Serial.println("Heure synchronisée !");
  Serial.printf("Date/Heure : %02d/%02d/%04d %02d:%02d:%02d\n",
                timeinfo.tm_mday, timeinfo.tm_mon + 1, timeinfo.tm_year + 1900,
                timeinfo.tm_hour, timeinfo.tm_min, timeinfo.tm_sec);

  // Charger le certificat CA
  espClient.setCACert(ca_cert);
  Serial.println("Certificat CA chargé.");

  // MQTT sécurisé
  client.setServer(mqtt_broker, mqtt_port);

  Serial.println("Connexion au broker MQTT sécurisé...");
  while (!client.connected()) 
  {
    if (client.connect("client-restoration", mqtt_username, mqtt_MDP)) 
    {
        Serial.println("Connecté en MQTT TLS !");
    } 
    else 
    {
        Serial.print("Échec MQTT TLS, code : ");
        Serial.println(client.state());
        delay(2000);
    }
}


  pinMode(pinBoutonOrga, INPUT_PULLUP);
  pinMode(pinBoutonEmbal, INPUT_PULLUP);

  scale.begin(DOUT_PIN, SCK_PIN);
  scale.set_scale(CALIBRATION_FACTOR);
  scale.tare();
}

void loop() 
{
    if (!client.connected())
    reconnectMQTT();

  client.loop();
  
  if (gestionBouton(pinBoutonOrga, &dernierEtatOrga, &lastDebounceTimeOrga)) { //si le bouton rouge est presser envoi des données en temps qu'organique
    envoyerDonnees("organique");
  }

  if (gestionBouton(pinBoutonEmbal, &dernierEtatEmbal, &lastDebounceTimeEmbal)) { //si le bouton bleu est presser envoi des données en temps qu'non organique
    envoyerDonnees("non organique");
  }

  if (!client.connected()) //si la balance est deconnecté du MQTT reconnexion automatique
  { 
    reconnectMQTT();
  }

  client.loop();
  envoyerDonnees("organique");
  delay(1000);
}

void envoyerDonnees(const char* typeDechet) // fonction pemetent de faire le formatage JSON ainsi que l'envoi de la donné
{
  float somMasse = 0;

    somMasse += scale.get_units(10);
    somMasse /= 1000;
    delay(50);

  char bufferMasse[12];
  dtostrf(somMasse, 1, 3, bufferMasse); // permet de convertir somMasse (float) en une chaine de character (char)

  char data[150];
  snprintf(data, sizeof(data),
           "{ \"Valeur\": %s, \"TypeDechet\": \"%s\", \"id\": 1 }",
           bufferMasse, typeDechet);

  client.publish(topic_princ, data); // envoi en MQTT

  Serial.print("Envoi MQTT : ");
  Serial.println(data);
}

void reconnectMQTT() // permet une reconnexion au MQTT
{
  Serial.println("Reconnexion MQTT...");
  while (!client.connected()) 
  {
    if (client.connect("client-restoration", mqtt_username, mqtt_MDP)) 
    {
      Serial.println("Reconnecté !");
    } 
    else 
    {
      Serial.print("Échec MQTT, code : ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

bool gestionBouton(int pin, bool* dernierEtat, unsigned long* lastDebounceTime)  // renvoi true si le bouton associer au pin est presser si non false
{
  int lecture = digitalRead(pin);
  bool retour = false;

  if (lecture != *dernierEtat) {
    *lastDebounceTime = millis();
  }

  if ((millis() - *lastDebounceTime) > debounceDelay) {
    if (lecture == LOW && *dernierEtat == HIGH) {
      retour = true;
    }
  }

  *dernierEtat = lecture;
  return retour;
}
