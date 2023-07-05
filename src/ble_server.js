const bleno = require('@abandonware/bleno');
const EchoCharacteristic = require('./characteristic');

bleno.on('stateChange', function(state) {
  console.log('Initialisation : ' + state);
  if (state === 'poweredOn') {
    bleno.startAdvertising('Echo', ['ec00']);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function(error) {
  console.log('Start : ' + (error ? 'error ' + error : 'success'));
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