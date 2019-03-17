var engine_game = null;
var phaser_game = null;

function initPhaserGame() {

  var config = {
    type: Phaser.AUTO,
    width: 540,
    height: 900,
    parent: 'game',
    backgroundColor: '#2d3436',
    physics: {
      default: 'arcade',
      arcade: { debug: false }
    },
    scene: [
      PhaserGameScene
    ]
  };

  return new Phaser.Game(config);
}

function connectToServers() {
    var hash_params = document.location.hash.split(",");
    var room_id = hash_params[0];
    var user_id = hash_params[1];
    var name = hash_params[2];

    game = new Einstein.Game({
      "EinsteinLobbyScene": "EinsteinLobbySceneRenderer",
      "EinsteinGameScene": "EinsteinGameSceneRenderer",
    }, "EinsteinLobbyScene");

    game.connect(room_id, user_id, { name: name });

    return game;
};

engine_game = connectToServers();
setTimeout(function() {
  // phaser_game = initGame();
  // phaser_game.scene.start('PhaserGameScene', { einstein: engine_game });
}, 1000);
