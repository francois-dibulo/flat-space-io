class EinsteinLobbySceneRenderer extends Einstein.Renderer {

  constructor(args) {
    super(args);
  }

  getDownEvent() {
    var touch_enabled = "ontouchstart" in document.createElement("div");
    return touch_enabled ? 'touchstart' : 'mousedown';
  }

  update() {
    this.engine.freeze();
  }

  onShow() {
    var self = this;
    $("#lobby-container").fadeIn(1000);

    $(".radio-container").on(this.getDownEvent(), function (ele) {
      var $ele = $(this);
      if (self.scene.current_seconds < 4) {
        return;
      }
      $ele.toggleClass("false").toggleClass("true");
      self.game.addInput("OnReady", $ele.hasClass(true));
    });
  }

  onHide() {
    $("#lobby-container").hide();
  }

  render() {
    if (this.scene.current_seconds < 5) {
      $(".countdown-seconds").html(this.scene.current_seconds);
    }
  }

}
