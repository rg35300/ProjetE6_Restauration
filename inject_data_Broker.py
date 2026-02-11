from xmlrpc import client
import paho.mqtt.client as mqtt
import json
import time
from datetime import datetime
import random

BROKER = "10.160.120.14"
PORT = 1883
TOPIC = {1:"D/Balance",2:"D/Donnee",3:"D/Utilisateur"}
TYPE_DECHET = {1:"Dechet organique",2:"Dechets non organiques",3:"Dechets menagers non recyclables"}

# Définition des fonctions de remplissage du fichier JSON
def Create_Fichier_JSON_Balance(data):
    print ("Saisir les champs à compléter pour la table Balance:")
    date_mise_service = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    date_fin_service = input("Date de fin de service (YYYY-MM-DD ou  vide): ")
    data = {"date_mise_service": date_mise_service, "date_fin_service": date_fin_service if date_fin_service else None, "Topic choisi": topic_choix}
    print (data)
    return data

def Create_Fichier_JSON_DonneeCollecte(data):
    print ("Saisir les champs à compléter pour la table DonneeCollecte:")
    Valeur = saisir_poids()
    Date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    type_dechet_choix = int(input("Choisir le type de déchet (1: Déchet organique, 2: Déchets non organiques, 3: Déchets ménagers non recyclables): "))
    while type_dechet_choix not in TYPE_DECHET:
        print("Choix invalide. Veuillez réessayer.")
        type_dechet_choix = int(input("Choisir le type de déchet (1: Déchet organique, 2: Déchets non organiques, 3: Déchets ménagers non recyclables): "))
    type_dechet = TYPE_DECHET[type_dechet_choix]
    data = {"Valeur": Valeur, "TypeDechet": type_dechet, "Date": Date, "Topic choisi": topic_choix}
    print (data)
    return data

# Fonction de saisi du poids avec sécurisation
def saisir_poids():
    while True:
        try:
            poids = float(input("Entrez le poids (en kg): "))
            if poids < 0:
                print("Le poids ne peut pas être négatif. Veuillez réessayer.")
                continue
            if poids > 200:
                print("Le poids est trop élevé. Veuillez réessayer.")
                continue 
            
            return poids
        except ValueError:
            print("Veuillez entrer un nombre valide.")
            
            
print("-----Menu MQTT-----")
print("Choisir la table ou il faut injecter des données:")
choix = int(input("1: Balance\n2: DonneeCollecte "))

if choix not in TOPIC:
    print("Choix invalide. Fin du programme.")
    exit()

topic_choix = TOPIC[choix]
print(f"Topic choisi : {topic_choix}")

if choix == 1:
    data = Create_Fichier_JSON_Balance({})


elif choix == 2:
    data = Create_Fichier_JSON_DonneeCollecte({})


    
def on_connect(client, userdata, flags, reasonCode, properties):
    if reasonCode == 0:
        print("Connexion au broker réussie")
        payload = json.dumps(data)
        client.publish(topic_choix, payload)
        print("Publication sur le topic :", topic_choix)
        print("\nDonnées envoyées au broker")
        print(payload)
    else:
        print("Échec de connexion :", reasonCode)
        
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)

client.username_pw_set("admin", "Va#j5jNcM!P")
client.on_connect = on_connect


print("Connexion au broker MQTT...")
client.connect(BROKER, PORT, 60)

client.loop_start()

# --- Envoie du message ------

time.sleep(1)
client.loop_stop()