class EinsteinGameSceneRenderer extends Einstein.Renderer {

  constructor(args) {
    super(args);
    this.pixi_app = null;
    this.graphics = null;
  }

  getDownEvent() {
      return this.touch_enabled ? 'touchstart' : 'mousedown';
    }

  onShow() {
    this.initPixi();
    this.game_container_ele = document.getElementById("game");

    this.score_container_ele = document.getElementById("score-container");
    this.score_container_ele.innerHTML = "";
    this.setScoreContainerTop();

    this.pixi_app.view.addEventListener(this.getDownEvent(), function() {
      this.game.addInput("Jump");
    }.bind(this));

    window.onresize = this.onResize.bind(this);
  }

  onHide() {

  }

  onResize() {
    this.setScoreContainerTop();
  }

  setScoreContainerTop() {
    this.score_container_ele.style.top = this.game_container_ele.children[0].getBoundingClientRect().top + "px";
  }

  initPixi() {
    this.pixi_app = new PIXI.Application({
      width: 960,
      height: 540,
      antialias: true
    });
    document.getElementById("game").appendChild(this.pixi_app.view);
    this.graphics = new PIXI.Graphics();
  }

  renderScore() {
    var players = this.scene.players_map;
    var children = this.score_container_ele.children;
    for (var player_index in players) {
      var player = players[player_index];
      var score_ele = children[player_index];
      if (!player.is_active) {
        if (score_ele) {
          score_ele.classList.add("dead");
        }
        continue;
      } else {
        if (score_ele) {
          score_ele.classList.remove("dead");
        }
      }
      if (!score_ele) {
        score_ele = document.createElement("DIV");
        score_ele.classList.add("score-item");
        score_ele.classList.add("row-v");
        score_ele.style.color = player.color_hex;
        score_ele.style["border-color"] = player.color_hex;
        this.score_container_ele.appendChild(score_ele);
      }
      score_ele.innerHTML = player.score;
    }
  }

  render() {
    var graphics = this.graphics;
    graphics.clear();

    var objects = this.scene.objects;

    for (var i = 0; i < objects.length; i++) {
      var einstein_obj = objects[i];

      if (einstein_obj.is_active) {
        graphics.beginFill(einstein_obj.color);
        graphics.drawCircle(einstein_obj.x, einstein_obj.y, einstein_obj.radius);
        graphics.endFill();
      }

    }
    this.pixi_app.stage.addChild(graphics);
    this.renderScore();
  }

}
