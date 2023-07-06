import serial
import time
import random
import json

ser = serial.Serial('/dev/ttyS0', 9600)
time.sleep(2)
dataMotor = {
    'moveMotorX': {
        'speed': None,
        'direction': None,
        'distance': None
    },
    'moveMotorY': {
        'speed': None,
        'direction': None,
        'distance': None
    }
}

class Game:
    def __init__(self, duration):
        self.duration = duration
        self.start_time = time.time()
        self.score = 0
        self.positions = [0,0]


    def is_game_over(self):
        return time.time() - self.start_time >= self.duration

    def update_score(self, points):
        self.score += points

    def move_basket(self, action, level):
        old_positions = self.positions.copy()
        dataToArduino = dataMotor
        new_positionX = None
        new_positionY = None

        if action == 'initialisation':
            new_positionX = 37.5
            new_positionY = 20
        elif action == 'move': 
            new_positionX = random.randint(0, 75)
            new_positionY = random.randint(0, 40)

        self.positions = [new_positionX, new_positionY]
        speedX = None
        directionX = None
        distanceX = None
        speedY = None
        directionY = None
        distanceY = None

        if level == 0:
            speedX = None
            speedY = None
        elif level == 1:
            speedX = None
            speedY = None
        elif level == 2:
            speedX = None
            speedY = None
        elif level == 3:
            speedX = None
            speedY = None
        elif level == 4:
            speedX = None
            speedY = None
        elif level == 5:
            speedX = None
            speedY = None

        if old_positions[0] < self.positions[0]:
            directionX = 'right'
            distanceX = self.positions[0] - old_positions[0]
        else:
            directionX = 'left'
            distanceX = old_positions[0] - self.positions[0]

        if old_positions[1] < self.positions[1]:
            directionY = 'down'
            distanceY = self.positions[1] - old_positions[1]
        else:
            directionY = 'up'
            distanceY = old_positions[1] - self.positions[1]
            
        dataToArduino['moveMotorX']['speed'] = speedX
        dataToArduino['moveMotorX']['direction'] = directionX
        dataToArduino['moveMotorX']['distance'] = distanceX
        dataToArduino['moveMotorX']['speed'] = speedY
        dataToArduino['moveMotorX']['direction'] = directionY
        dataToArduino['moveMotorX']['distance'] = distanceY
        json_data = json.dumps(dataToArduino)
        ser.write(json_data.encode())

    def play(self):
        self.move_basket('initialisation', 0)
        while not self.is_game_over():
            time.sleep(10)
            self.move_basket('move', 1)
            self.move_basket('move', 2)
            self.move_basket('move', 3)
            self.move_basket('move', 4)
            self.move_basket('move', 5)

        return self.score


game = Game(60)  # Crée un nouveau jeu qui dure 60 secondes
score = game.play()
print(json.dumps({"score": score}))
