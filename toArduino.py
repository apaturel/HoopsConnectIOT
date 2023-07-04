import smbus2
import time

bus = smbus2.SMBus(1)
arduino_address = 0x04

def send_data(data):
    bus.write_byte(arduino_address, data)

def read_data():
    return bus.read_byte(arduino_address)

def mode_selection(mode):
    send_data(mode)

while True:
    mode = int(input("Enter the mode (1-4): "))
    mode_selection(mode)
    time.sleep(1)
