var bleno = require('@abandonware/bleno');

var BlenoCharacteristic = bleno.Characteristic;

class EchoCharacteristic extends BlenoCharacteristic {
  constructor() {
    super({
      uuid: 'ec0e',
      properties: ['read', 'write', 'notify'],
      value: null
    });

    this._value = Buffer.alloc(0);
    this._updateValueCallback = null;
  }

  onWriteRequest(data, callback) {
    this._value = data;
    let jsonString = this._value.toString();
    let receivedData = JSON.parse(jsonString);
    console.log('Received data: ', receivedData);

    if (receivedData.type == 'START_GAME') {
      console.log('data: ', JSON.parse(receivedData.data.toString()));
    }
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    console.log('Appareil Mobile Connecté');
    this._updateValueCallback = updateValueCallback;
    
    // Send "Hello, Swift!" notification every 5 seconds
    this.intervalId = setInterval(() => {
      let game = {
        id: "1",
        date: "27/06/2023",
        score: 180,
        playerId: "1"
      };
        let data = {
          type: "GAME",
          data: JSON.stringify(game)
      };
        let jsonString = JSON.stringify(data);
        let buffer = Buffer.from(jsonString);
        if(this._updateValueCallback) {
          this._updateValueCallback(buffer);
      }
    }, 5000);
  }

  onUnsubscribe() {
    console.log('Appareil Mobile Déconnecté');
    this._updateValueCallback = null;
    
    // Stop sending notifications when client unsubscribes
    clearInterval(this.intervalId);
  }
}

module.exports = EchoCharacteristic;