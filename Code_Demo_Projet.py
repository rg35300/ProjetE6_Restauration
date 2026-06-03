import paho.mqtt.client as mqtt
import json
import time
from datetime import datetime
import mysql.connector
import ssl

#   CONFIGURATION GLOBALE

BROKER = "10.160.120.14"
PORT = 8883

USERNAME = "bal_test"   
PASSWORD = "06Pz6CLLdUh"

CA_PATH = "/home/btsciel2a/Projet/Certificat/CA-Projet-Restauration-Scolaire.crt"

TYPE_DECHET = {
    1: "Organique",
    2: "Plastique",
}

ID_BALANCE = 1


# ============================================================
ACL = {
    "bal_test": {
        "write": [
            "balance/bal_test/data",
            "balance/bal_test/data-2"
        ],
        "read": [
            "balance/bal_test/#"
        ]
    },
    "bal_001": {
        "write": [
            "balance/bal_001/data",
            "balance/bal_001/data-2"
        ],
        "read": [
            "balance/bal_001/#"
        ]
    },
}


#   UTILITAIRES

def saisir_poids():
    while True:
        try:
            poids = float(input("Entrez le poids (en kg): "))
            if 0 <= poids <= 200:
                return poids
            print("Poids invalide (0–200).")
        except:
            print("Entrer un nombre valide.")

def create_json_donnee():
    print("Saisir les champs pour DonneeCollecte:")
    valeur = saisir_poids()
    date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    type_dechet_choix = int(input("Type de déchet (1: Organique / 2: Plastique): "))
    while type_dechet_choix not in TYPE_DECHET:
        type_dechet_choix = int(input("Choix invalide. Refaire (1/2): "))

    data = {
        "Valeur": valeur,
        "TypeDechet": TYPE_DECHET[type_dechet_choix],
        "Date": date
    }
    print("JSON envoyé :", data)
    return data

#   ENVOI MQTT

def mqtt_send():
    print("----- ENVOI MQTT -----")

    topic = f"balance/{USERNAME}/data"
    data = create_json_donnee()

    # Vérification ACL locale
    if topic not in ACL.get(USERNAME, {}).get("write", []):
        print("ERREUR : Vous n'avez pas le droit d'écrire sur ce topic :", topic)
        return

    def on_connect(client, userdata, flags, rc, props):
        if rc == 0:
            print("Connecté au broker TLS.")
            payload = json.dumps(data)
            client.publish(topic, payload)
            print("Données envoyées sur", topic, ":", payload)
        else:
            print("Erreur connexion :", rc)

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.username_pw_set(USERNAME, PASSWORD)

    client.tls_set(CA_PATH)
    client.tls_insecure_set(False)

    client.on_connect = on_connect

    print("Connexion au broker TLS…")
    client.connect(BROKER, PORT, 60)
    client.loop_start()
    time.sleep(1)
    client.loop_stop()

#   RÉCEPTION MQTT

def mqtt_receive():
    try:
        BDD = mysql.connector.connect(
            host="10.160.120.14",
            user="admin",
            password="#XCHygTdB9j",
            database="Restauration"
        )
        print("Connexion BDD OK")
    except Exception as e:
        print("Erreur BDD :", e)
        return

    curseur = BDD.cursor()

    def on_message(client, userdata, msg):
        print("\n--- Message reçu ---")
        print("Topic  :", msg.topic)
        print("Payload:", msg.payload.decode())

        try:
            data = json.loads(msg.payload.decode())
        except:
            print("JSON non valide.")
            return

        parts = msg.topic.split("/")
        if len(parts) < 3:
            print("Topic invalide.")
            return

        mqtt_username = parts[1]
        action = parts[2]

        # Vérification ACL locale
        allowed_topics = ACL.get(mqtt_username, {}).get("write", [])
        if msg.topic not in allowed_topics:
            print("TOPIC NON AUTORISÉ pour", mqtt_username, ":", msg.topic)
            return


        # balance script-
        idBalance = ID_BALANCE
        etat = 1  # Balance active

        if etat == 0:
            print("Balance inactive :", idBalance)
            return


        # Insertion SQL
        if action == "data":
            try:
                curseur.execute(
                    """
                    INSERT INTO DonneeCollecte (Valeur, TypeDechet, DateDeCollecte, idBalance)
                    VALUES (%s, %s, %s, %s)
                    """,
                    (data["Valeur"], data["TypeDechet"], datetime.now(), idBalance)
                )
                BDD.commit()
                print("Donnée insérée pour la balance", idBalance)
            except Exception as e:
                print("Erreur insertion DonneeCollecte :", e)
        else:
            print("Action non gérée :", action)

    def on_connect(client, userdata, flags, rc, props):
        if rc == 0:
            print("Connecté au broker TLS.")
            client.subscribe("balance/+/data")
            print("Abonné à : balance/+/data")
        else:
            print("Erreur connexion :", rc)

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.username_pw_set(USERNAME, PASSWORD)

    client.tls_set(CA_PATH)
    client.tls_insecure_set(False)

    client.on_connect = on_connect
    client.on_message = on_message

    print("Connexion au broker TLS…")
    client.connect(BROKER, PORT, 60)
    client.loop_forever()



if __name__ == "__main__":
    print("----- MENU PRINCIPAL -----")
    print("1 : Envoyer des données MQTT ")
    print("2 : Recevoir et insérer en BDD ")

    try:
        mode = int(input("Choix : "))
    except:
        print("Choix invalide.")
        exit(1)

    if mode == 1:
        mqtt_send()
    elif mode == 2:
        mqtt_receive()
    else:
        print("Choix invalide.")
