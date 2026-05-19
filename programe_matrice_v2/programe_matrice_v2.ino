#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>

#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>

// ----------------------
// CONFIG MATRICE LED
// ----------------------
#define PIN 12

Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(
  32, 8, PIN,
  NEO_MATRIX_TOP + NEO_MATRIX_LEFT +
  NEO_MATRIX_COLUMNS + NEO_MATRIX_ZIGZAG,
  NEO_GRB + NEO_KHZ800
);

uint16_t couleur = matrix.Color(25, 215, 225);

// ----------------------
// WIFI + MQTT
// ----------------------
const char* ssid = "BTS-CIEL";
const char* MDP ="Azerty.1";

const char* mqtt_broker = "10.160.120.14";
const char* topic_princ = "data";
const char* mqtt_username = "bal_001";
const char* mqtt_MDP = "WeY7Pwi6x";
const int mqtt_port = 8883;

// Certificat CA
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

WiFiClientSecure espClient;
PubSubClient client(espClient);

// Texte à défiler
String texte = "En attente...";
int x = 32; // position de départ


// SETUP

void setup()
{
  Serial.begin(115200);

  WiFi.begin(ssid, MDP);
  while (WiFi.status() != WL_CONNECTED) 
  {
  Serial.print("co wifi en cour\n");
  delay(500);
  }
  espClient.setCACert(ca_cert);
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);

  reconnect();

  matrix.begin();
  matrix.setTextWrap(false);
  matrix.setBrightness(40);
  matrix.setTextColor(couleur);
}

// LOOP

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  defilement();
}



// CALLBACK MQTT

void callback(char* topic, byte* payload, unsigned int length)
{
  texte = "";
  for (int i = 0; i < length; i++) 
  {
    texte += (char)payload[i];
  }

  Serial.print("Message reçu : ");
  Serial.println(texte);

  x = matrix.width(); // redémarre le défilement
}

// TEXTE DÉFILANT

void defilement() 
{
  matrix.fillScreen(0);
  matrix.setCursor(x, 0);
  matrix.print(texte);

  matrix.show();
  delay(40);

  x--;

  int largeurTexte = texte.length() * 6; // largeur estimée
  if (x < -largeurTexte) 
  {
    x = matrix.width();
  }
}

// RECONNEXION MQTT

void reconnect() 
{
  while (!client.connected()) 
  {
    Serial.print("attente broker\n");
    if (client.connect("client-restoration", mqtt_username, mqtt_MDP)) 
    {
      Serial.print("connecté broker\n");
      client.subscribe(topic_princ);
    } 
    else 
    {
      Serial.print("Échec MQTT, code : ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}
