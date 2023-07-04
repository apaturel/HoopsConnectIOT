const bleno = require('@abandonware/bleno');
const EchoCharacteristic = require('./characteristic');

bleno.on('Initialisation', function(state) {
  console.log('Start' + state);
  if (state === 'poweredOn') {
    bleno.startAdvertising('Echo', ['ec00']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('Erreur : ' + (error ? 'error ' + error : 'success'));
  if (!error) {
    bleno.setServices([
      new bleno.PrimaryService({
        uuid: 'ec00',
        characteristics: [
          new EchoCharacteristic()
        ]
      })
    ]);
  }
});
