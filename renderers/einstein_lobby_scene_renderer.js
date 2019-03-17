class EinsteinLobbySceneRenderer extends Einstein.Renderer {

  constructor(args) {
    super(args);
  }

  getDownEvent() {
    var touch_enabled = "ontouchstart" in document.createElement("div");
    return touch_enabled ? 'touchstart' : 'mousedown';
  }

  onShow() {
    $("#lobby-container").show();

    $(".radio-container").on(this.getDownEvent(), function (ele) {
      var $ele = $(this);
      $ele.toggleClass("false").toggleClass("true");
    });
  }

  onHide() {
    $("#lobby-container").hide();
  }

  render() {

  }

}
