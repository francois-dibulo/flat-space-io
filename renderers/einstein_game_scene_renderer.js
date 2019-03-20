class EinsteinGameSceneRenderer extends Einstein.Renderer {

  constructor(args) {
    super(args);
    this.pixi_app = null;
    this.graphics = null;
    this.stars = [];
  }

  getDownEvent() {
    var touch_enabled = "ontouchstart" in document.createElement("div");
    return touch_enabled ? 'touchstart' : 'mousedown';
  }

  onShow() {
    this.initPixi();
    this.game_container_ele = document.getElementById("game");

    this.score_container_ele = document.getElementById("score-container");
    this.score_container_ele.innerHTML = "";
    this.setScoreContainerTop();

    this.pixi_app.view.addEventListener(this.getDownEvent(), function() {
      console.log("jump");
      this.game.addInput("Jump");
    }.bind(this));

    window.onresize = this.onResize.bind(this);
    $("#game-container").fadeIn(2000);
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
      width: FlatSpace.Width,
      height: FlatSpace.Height,
      antialias: true,
      backgroundColor: 0x02023a
    });
    document.getElementById("game").appendChild(this.pixi_app.view);
    this.graphics = new PIXI.Graphics();
    this.createBackgroundStars();
  }

  createBackgroundStars() {
    var bbox = {
      left: 10,
      top: 10,
      right: FlatSpace.Width,
      bottom: FlatSpace.Height
    };
    var graphics = new PIXI.Graphics();
    for (var i = 0; i < 40; i++) {
      var x = Utils.random(bbox.left, bbox.right);
      var y = Utils.random(bbox.top, bbox.bottom);
      var radius = Utils.random(1, 5);
      graphics.beginFill(0x2a3a83);
      graphics.drawCircle(x, y, radius);
      graphics.endFill();
    }
    this.pixi_app.stage.addChild(graphics);

    // Create moving background stars
    for (var i = 0; i < 10; i++) {
      var graphics = new PIXI.Graphics();
      var x = Utils.random(bbox.left, bbox.right);
      var y = Utils.random(bbox.top, bbox.bottom);
      var radius = Utils.random(1, 5);
      graphics.beginFill(0x2a3a83);
      graphics.drawCircle(0, 0, radius);
      graphics.endFill();
      graphics.position.x = x;
      graphics.position.y = y;
      graphics.speed_y = Utils.random(1, 10) / 10;
      this.stars.push(graphics);
      this.pixi_app.stage.addChild(graphics);
    }

  }

  renderScore() {
    var players = this.scene.player_objects;
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

    // Render background stars
    for (var i = 0; i < this.stars.length; i++) {
      var star = this.stars[i];
      star.position.y += star.speed_y;
      if (star.position.y - 10 > FlatSpace.Height) {
        star.position.y = -10;
        star.position.x = Utils.random(10, FlatSpace.Width - 10);
      }
    }

    // Render Game Objects
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
