const { exec } = require('child_process');
const path = require('path');

const gameModes = new Map();

gameModes.set('CHRONO', (dataGame, characteristicInstance) => {
    exec(`python3 ${path.join(__dirname, '../python/gameModeChrono.py')}`, (error, stdout, stderr) => {
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
        id: dataGame["gameId"],
        date: formattedDate,
        score: score,
        playerId: dataGame["playerId"],
        deviceId: characteristicInstance._deviceId,
        difficulty: dataGame["difficulty"],
        mode: dataGame["mode"],
        duration: dataGame["duration"]
      };

      let finalData = {
        type: "GAME_FINISHED",
        data: JSON.stringify(game)
      };

      console.log(finalData);

      console.log('Fin de la partie...')
      characteristicInstance._updateValueCallback(Buffer.from(JSON.stringify(finalData)));
    });
});

const commands = new Map();

commands.set('CONNECTED', (receivedData, characteristicInstance) => {
    let dataDevice = JSON.parse(receivedData.data);
    console.log("Nom de l'appareil : " + dataDevice["deviceName"]);
    characteristicInstance._deviceId = dataDevice["deviceId"]; // Mise à jour de la variable globale avec le deviceId reçu
});

commands.set('GAME_START', (receivedData, characteristicInstance) => {
    let dataGame = JSON.parse(receivedData.data);
    if(gameModes.has(dataGame["mode"])) {
      gameModes.get(dataGame["mode"])(dataGame, characteristicInstance);
    } else {
      console.log(`No handler for game mode ${dataGame["mode"]}`);
    }
});

module.exports = commands;
