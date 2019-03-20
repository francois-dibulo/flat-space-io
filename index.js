/*
  Music:
    https://audiojungle.net/search/deep%20space?utf8=%E2%9C%93
    https://audiojungle.net/item/urban-hunt-movie-sequence/222746?s_rank=10
*/

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
  PIXI.Loader.shared.add('planet', 'assets/1.png').load((loader, resources) => {
    console.log(resources);
    engine_game = connectToServers();
  });

}());
