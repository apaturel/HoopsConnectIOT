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
    console.log(receivedData);

    switch (receivedData.type) {
      case 'CONNECTED':
        let dataDevice = JSON.parse(receivedData.data);
        console.log("Nom de l'appareil : " + dataDevice["deviceName"]);
        break;
      case 'START_GAME':
        let dataGame = JSON.parse(receivedData.data);  // Pas besoin de parser à nouveau
        switch (dataGame["mode"]) {
          case "CHRONO":
            exec(`python3 ../python/gameModeChrono.py`, (error, stdout, stderr) => {
              console.log('Lancement de la partie...');
              if (error) {
                console.log(`Error: ${error.message}`);
                return;
              }
      
              if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
              }
              let score = JSON.parse(stdout).score;
      
              let now = new Date();
              let formattedDate = now.toLocaleString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
      
              let game = {
                id: "1",
                date: formattedDate,
                score: score,
                playerId: dataGame["playerId"]
              };
      
              let finalData = {
                type: "GAME",
                data: JSON.stringify(game)
              };
              console.log('Fin de la partie...')
              this._updateValueCallback(Buffer.from(JSON.stringify(finalData)));
            });
            break;
        }
      break;

    }

    callback(this.RESULT_SUCCESS);
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
