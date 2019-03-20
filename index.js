var engine_game = null;
var phaser_game = null;
var FlatSpace = {
  room_id: null,
  Width: 472,
  Height: 840
};

(function() {

  function setSize() {
    var screen_width = window.innerWidth;
    var screen_height = window.innerHeight;

    FlatSpace.Width = Math.min(FlatSpace.Width, screen_width);
    FlatSpace.Height = FlatSpace.Width * 16 / 9;
  }

  function connectToServers() {
    var hash_params = document.location.hash.split(",");
    var room_id = hash_params[0];
    var user_id = hash_params[1];
    var name = hash_params[2];

    FlatSpace.room_id = room_id.substr(1);

    game = new Einstein.Game({
      "EinsteinLobbyScene": "EinsteinLobbySceneRenderer",
      "EinsteinGameScene": "EinsteinGameSceneRenderer",
    }, "EinsteinLobbyScene");

    game.connect(room_id, user_id, { name: name });

    return game;
  };

  setSize();
  engine_game = connectToServers();

}());
