const bleno = require('@abandonware/bleno');
const BlenoCharacteristic = bleno.Characteristic;
const { exec } = require('child_process');

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

    if (receivedData.type == 'GAME') {

      exec('python3 ../python/gameModeChrono.py', (error, stdout, stderr) => {
        if (error) {
          console.log(`Error: ${error.message}`);
          return;
        }

        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }

        let score = JSON.parse(stdout).score;

        let game = {
          id: "1",
          date: "27/06/2023",
          score: score,
          playerId: "1"
        };

        let finalData = {
          type: "GAME",
          data: JSON.stringify(game)
        };
        console.log(finalData);

        this._updateValueCallback(Buffer.from(JSON.stringify(finalData)));
      });
    }

    callback(this.RESULT_SUCCESS);
  }

  onReadRequest(offset, callback) {
    console.log('EchoCharacteristic - onReadRequest: value = ', this._value.toString('utf8'));

    callback(this.RESULT_SUCCESS, this._value);
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    console.log('Appareil Mobile Connecté');

    this._updateValueCallback = updateValueCallback;
  }

  onUnsubscribe() {
    console.log('Appareil Mobile Déconnecté');

    this._updateValueCallback = null;
  }
}

module.exports = EchoCharacteristic;
