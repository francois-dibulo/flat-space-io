class BaseScene extends Einstein.Scene {

  awake(args) {
    this.players_map = {};
  }

  getPlayers() {
    return this.engine.getPlayers();
  }

  getPlayerIndex() {
    return this.engine.player;
  }

  // Resets the players map, but keeps the 'global' property
  resetPlayersMap() {
    if (this.players_map) {
      var map = Object.assign({}, this.players_map);
      this.players_map = {};
      for (let player_index in map) {
        let old_player = map[player_index];
        let data = this.getPlayerMapObject(player_index, true);
        data.global = old_player.global;
        this.players_map[player_index] = data;
      }
    }
  }

  getPlayerMapObject(index, is_active) {
    is_active = is_active === undefined ? true : is_active;
    index = parseInt(index, 10);
    var color = [0x25CCF7, 0xFEA47F, 0xEAB543, 0x55E6C1, 0xD6A2E8, 0x3B3B98][index];
    var player_data = this.engine.getPlayerData(index);
    return {
      name: player_data.name,
      index: index,
      score: 0,
      color: color,
      color_hex: "#" + color.toString(16),
      is_ready: false,
      is_active: is_active,
      // Global won't be resettet after each round
      global: {
        has_crown: false,
        stats: {}
      }
    };
  }

  getPlayer(player_index) {
    return this.players_map[player_index];
  }

  addPlayer(player_index, is_active) {
    var player = this.getPlayer(player_index);
    if (!player) {
      this.players_map[player_index] = this.getPlayerMapObject(player_index, is_active);
    } else {
      player.is_active = true;
    }
  }

  removePlayer(player_index) {
    var player = this.getPlayer(player_index);
    if (player) {
      player.is_active = false;
    }
  }

  onJoin(player_index) {
    this.addPlayer(player_index, true);
  }

  onLeave(player_index) {
    this.removePlayer(player_index);
  }

  // =====================================================================================
   // COUNTDOWN
   // =====================================================================================

   tickCountdown() {
     this.current_seconds -= 1;
     if (this.current_seconds > 0) {
       this.schedule(1000, "tickCountdown");
     } else {
       this.onCountdownCompleted();
     }
   }

   onCountdownCompleted() {}
}
