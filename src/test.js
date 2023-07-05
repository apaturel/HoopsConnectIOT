var bleno = require('@abandonware/bleno');

var name = 'MyDevice';
var serviceUuids = ['fffffffffffffffffffffffffffffff0'];

bleno.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    bleno.startAdvertising(name, serviceUuids);
  } else {
    bleno.stopAdvertising();
  }
});

bleno.on('advertisingStart', function() {
  console.log('Advertising started');
});
