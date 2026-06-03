import paho.mqtt.client as mqtt
import json
from datetime import datetime
import mysql.connector
import ssl


#   CONFIGURATION
BROKER = "10.160.120.14"
PORT = 8883

USERNAME = "bal_test"
PASSWORD = "06Pz6CLLdUh"

CA_PATH = "/home/btsciel2a/Projet/Certificat/CA-Projet-Restauration-Scolaire.crt"

# ID de la balance dans la BDD
ID_BALANCE = 1

# Topics utilisés
TOPIC_PRINCIPAL = "balance/bal_test/data"
TOPIC_SECOURS   = "balance/bal_test/data-2"

# ACL locales
ACL = {
    "bal_test": {
        "write": [
            "balance/bal_test/data",
            "balance/bal_test/data-2"
        ]
    },
    "Screen-001": {
        "read": [
            "balance/bal_test/#",
            "balance/bal_001/#"
        ]
    }
}


def mqtt_receive():
    # Connexion à la base de données
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

    # Fonction appelée à chaque message reçu
    def on_message(client, userdata, msg):
        print("\n--- Message reçu ---")
        print("Topic  :", msg.topic)
        print("Payload:", msg.payload.decode())

        # Décodage JSON
        try:
            data = json.loads(msg.payload.decode())
        except:
            print("JSON non valide.")
            return

        # Analyse du topic
        parts = msg.topic.split("/")
        if len(parts) < 3:
            print("Topic invalide.")
            return

        mqtt_username = parts[1]
        action = parts[2]

        # Vérification ACL locale
        allowed_topics = ACL.get(mqtt_username, {}).get("write", [])
        if msg.topic not in allowed_topics:
            print("Topic non autorisé pour", mqtt_username, ":", msg.topic)
            return

        # Balance définie dans le script
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

    # Fonction appelée lors de la connexion au broker
    def on_connect(client, userdata, flags, rc, props):
        if rc == 0:
            print("Connecté au broker TLS.")

            # Abonnement au topic principal
            result, mid = client.subscribe(TOPIC_PRINCIPAL)
            if result == mqtt.MQTT_ERR_SUCCESS:
                print("Abonné au topic principal :", TOPIC_PRINCIPAL)
            else:
                print("Erreur abonnement au topic principal. Bascule vers le topic de secours.")
                client.subscribe(TOPIC_SECOURS)
                print("Abonné au topic de secours :", TOPIC_SECOURS)

        else:
            print("Erreur connexion :", rc)

    # Client MQTT
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
    mqtt_receive()
