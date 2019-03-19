class EinsteinLobbyScene extends BaseScene {

  awake(args) {
    args = args || {};
    this.players_map = args.players_map || {};
    this.current_seconds = 5;
    this.addInputListener("OnReady", "onPlayerReady");
    this.addInputListener("StartGame", "startGame");
  }

  update() {
    this.engine.freeze();
  }

  onLeave(player_index) {
    this.removePlayer(player_index);
    this.checkAllReady();
  }

  onPlayerReady(player_index, state) {
    var player = this.getPlayer(player_index);
    if (player) {
      player.is_ready = state;
    }
    if (state) {
      this.checkAllReady();
    }
  }

  checkAllReady() {
    var total_players = this.getPlayers().length;
    var count = 0;
    for (var index in this.players_map) {
      var player = this.players_map[index];
      if (player.is_ready) {
        count++;
      }
    }
    if (count >= total_players) {
      this.startGameCountDown();
    }
  }

  startGameCountDown() {
    this.tickCountdown();
  }

  onCountdownCompleted() {
    this.startGame();
  }

  startGame() {
    this.engine.changeScene("EinsteinGameScene", {
      players_map: this.players_map
    });
  }

}
