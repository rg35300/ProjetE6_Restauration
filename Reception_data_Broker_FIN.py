import paho.mqtt.client as mqtt
import json
import mysql.connector
from datetime import datetime

BROKER = "10.160.120.14"
PORT = 1883
USERNAME = "admin"
PASSWORD = "Va#j5jNcM!P"

# ------- Connexion au broker Mosquitto -------
def on_connect(client, userdata, flags, reasonCode, properties):
    if reasonCode == 0:
        print("Connexion au broker réussie")
        client.subscribe("D/#")
        print("Abonné au topic : D/#")
    else:
        print("Échec de connexion :", reasonCode)

# ------- Connexion MySQL -------
try:
    BDD = mysql.connector.connect(
        host="10.160.120.14",
        user="admin",
        password="#XCHygTdB9j",
        database="Restauration"
    )
    print("Connexion à la base de données réussie")
except mysql.connector.Error as err:
    print(f"Erreur de connexion à la base de données: {err}")
    exit()

curseur = BDD.cursor()

# ------- Réception des messages MQTT -------
def on_message(client, userdata, msg):
    print(f"Message reçu sur le topic {msg.topic} : {msg.payload.decode()}")

    try:
        data = json.loads(msg.payload.decode())
    except json.JSONDecodeError:
        print("Erreur de décodage JSON.")
        return

    if msg.topic == "D/Balance":
        #insert_donnee_collecte_Balance(data)
        exit()

    elif msg.topic == "D/Donnee":
        insert_donnee_collecte_DonneeCollecte(data)

    else:
        print("Topic inconnu. Aucune action effectuée.")

# ------- Insertion SQL -------
#def insert_donnee_collecte_Balance(data):
    #sql = "INSERT INTO Balance (date_mise_service, date_fin_service) VALUES (%s, %s)"
    #values = (data['date_mise_service'], data['date_fin_service'])
    #try:
        #curseur.execute(sql, values)
        #BDD.commit()
        #print("✔ Balance insérée avec succès.")
    #except mysql.connector.Error as err:
        #print(f"Erreur lors de l'insertion Balance: {err}")

def insert_donnee_collecte_DonneeCollecte(data):
    sql = "INSERT INTO DonneeCollecte (Valeur, TypeDechet, DateDeCollecte) VALUES (%s, %s, %s)"
    values = (data['Valeur'], data['TypeDechet'], datetime.now())
    try:
        curseur.execute(sql, values)
        BDD.commit()
        print("✔ DonneeCollecte insérée avec succès.")
    except mysql.connector.Error as err:
        print(f"Erreur lors de l'insertion DonneeCollecte: {err}")

# ------- Initialisation du client MQTT -------
client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.username_pw_set(USERNAME, PASSWORD)

client.on_connect = on_connect
client.on_message = on_message

print("Connexion au broker MQTT…")
client.connect(BROKER, PORT, 60)

# ------- Boucle MQTT (obligatoire) -------
client.loop_forever()
