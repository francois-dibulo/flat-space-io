class EinsteinLobbySceneRenderer extends Einstein.Renderer {

  constructor(args) {
    super(args);
  }

  getDownEvent() {
    var touch_enabled = "ontouchstart" in document.createElement("div");
    return touch_enabled ? 'touchstart' : 'mousedown';
  }

  onShow() {
    var self = this;
    $("#lobby-container").fadeIn(1000);

    $(".room-name-value").html(FlatSpace.room_id);

    $(".radio-container").on(this.getDownEvent(), function (ele) {
      var $ele = $(this);
      if (self.scene.current_seconds < 5) {
        return;
      }
      $ele.toggleClass("false").toggleClass("true");
      self.game.addInput("OnReady", $ele.hasClass(true));
    });

    $(".btn-exit").on(this.getDownEvent(), function() {
      window.parent.postMessage({
        action: "exit"
      }, "*");
    });
  }

  onHide() {
    $("#lobby-container").hide();
    $("#countdown-container").hide();
  }

  renderPlayers() {
    var players = this.scene.players_map;

    var players_container_ele = $("#players-container");
    players_container_ele.empty();

    for (var id in players) {
      var item = $(".players-item-tmpl").clone();
      var player = players[id];
      if (!player.is_active) continue;
      item.removeClass("hidden").removeClass("players-item-tmpl");

      item.find(".players-item-name").html(player.name);
      var ready_ele = item.find(".players-item-state")
      ready_ele.html(player.is_ready ? "READY" : "NOT READY");
      if (player.is_ready) {
        item.addClass("ready");
      }

      item.find(".player-item-ball").css({
        'background-color': player.color_hex
      });

      item.appendTo(players_container_ele);
    }
  }

  renderCountdown() {
    if (this.scene.current_seconds === 4) {
      $("#countdown-container").fadeIn(500);
    }
    if (this.scene.current_seconds < 5) {
      $(".countdown-seconds").html(this.scene.current_seconds);
    }
  }

  render() {
    this.renderCountdown();
    this.renderPlayers();
  }

}
