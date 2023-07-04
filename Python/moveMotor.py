import serial
import time
import random
import json

ser = serial.Serial('/dev/ttyS0', 9600)
stepsPerRevolution = 50
railStep = 83
railLength = 12.5
time.sleep(2)  # Attendez que la connexion serie soit etablie

def handle_hoop():
    print("Capteur infrarouge : LOW")

message_handlers = {
    "hoop": handle_hoop
}

def send_action():
    action = {
        "action": "moveMotor",
        "rotation_time": random.uniform(0.5, 2.5),
        "directionX": random.choice(["left", "right"]),
        "directionY": random.choice(["up", "down"]),
        "speed": random.uniform(1, 5)
    }

    message = json.dumps(action) + "\n"
    ser.write(message.encode())

send_action()

while True:
    if ser.in_waiting > 0:
        incoming_message = ser.readline().decode().strip()

        if incoming_message in message_handlers:
            message_handlers[incoming_message]()
        else:
            print(f"Message non reconnu : {incoming_message}")
