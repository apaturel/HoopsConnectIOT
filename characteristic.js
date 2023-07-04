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

  onWriteRequest(data, offset, withoutResponse, callback) {
    this._value = data;
    let jsonString = this._value.toString();
    let receivedData = JSON.parse(jsonString);
    console.log('Received data: ', receivedData);

    callback(this.RESULT_SUCCESS);
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    console.log('EchoCharacteristic - onSubscribe');
    this._updateValueCallback = updateValueCallback;
    
    // Send "Hello, Swift!" notification every 5 seconds
    this.intervalId = setInterval(() => {
      let game = {
        id: "1",
        score: 180,
        date: "27/06/2023",
        playerId : "1"
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
    },1000);
  }

  onUnsubscribe() {
    console.log('EchoCharacteristic - onUnsubscribe');
    this._updateValueCallback = null;
    
    // Stop sending notifications when client unsubscribes
    clearInterval(this.intervalId);
  }
}

module.exports = EchoCharacteristic;
