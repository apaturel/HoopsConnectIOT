import serial
import time

ser = serial.Serial('/dev/ttyS0', 9600)  # Remplacez '/dev/ttyS0' par le bon port serie pour votre Raspberry Pi
time.sleep(2)

while True:
    ser.write(b'A')  # Envoie le caractere 'A' a l'arduino
    time.sleep(1)  # Attendez une seconde avant de renvoyer
