const bleno = require('@abandonware/bleno');
const BlenoCharacteristic = bleno.Characteristic;
const dictionary = require('./dictionary');

class EchoCharacteristic extends BlenoCharacteristic {
  constructor() {
    super({
      uuid: 'ec0e',
      properties: ['read', 'write', 'notify'],
      value: null
    });

    this._value = Buffer.alloc(0);
    this._updateValueCallback = null;
    this._deviceId = null; // Ajoutez cette ligne pour déclarer la variable globale
  }

  onWriteRequest(data, offset, withoutResponse, callback) {
    try {
      this._value = data;
      let jsonString = this._value.toString();
      let receivedData = JSON.parse(jsonString);
      console.log(receivedData);

      if(dictionary.has(receivedData.type)) {
        dictionary.get(receivedData.type)(receivedData, this);
      } else {
        console.log(`No handler for type ${receivedData.type}`);
      }

      callback(this.RESULT_SUCCESS);
    } catch (error) {
      console.error("Failed to handle data: ", error);
    }
  }

  onReadRequest(offset, callback) {
    console.log('EchoCharacteristic - onReadRequest: value = ', this._value.toString('utf8'));
    callback(this.RESULT_SUCCESS, this._value);
  }

  onSubscribe(maxValueSize, updateValueCallback) {
    console.log('Connexion...');
    this._updateValueCallback = updateValueCallback;
  }

  onUnsubscribe() {
    console.log('...Déconnexion');
    this._updateValueCallback = null;
  }
}

module.exports = EchoCharacteristic;
