class EinsteinGameScene extends Einstein.Scene {

  awake(args) {
    args = args || {};
    this.config = {
      width: FlatSpace.Width,
      height: FlatSpace.Height,
      //
      planets_pool_num: 20,
      planets_initial_num: 8,
      player_radius: 8,
      planet_radius: [40, 80],
      MAX_PLANET_SPEED: 3,
      child_radius: 20,
      child_probability: 20
    };
    this.is_running = true;
    this.start_planet = null;

    this.players_map = args.players_map || {};
    this.player_objects = {};
    this.planets_map = {};
    this.createPlanetsPool(this.config.planets_pool_num);
    this.createPlanets();
    this.addInputListener("Jump", "playerJump");
  }

  getBBox() {
    return {
      top: 0,
      bottom: this.config.height,
      left: 0,
      right: this.config.width,
      center_x: this.config.width / 2,
      center_y: this.config.height / 2
    };
  }

  onJoin(player_index) {
    this.createPlayer(player_index);
  }

  createPlayer(player_index) {
    var player_obj = this.players_map[player_index];
    var player = this.createObject("PlayerGameObject", {
      id: Utils.randomId(),
      is_active: true,
      color: player_obj.color,
      player_index: player_index
    });

    player.base_angle = (30 * (Math.PI / 180)) * player_index;
    player.setParent(this.start_planet.id);
    this.player_objects[player_index] = player;
  }

  resetPlayers(start_planet) {
    for (var player_index in this.player_objects) {
      var player = this.player_objects[player_index];
      player.reset();
      player.base_angle = (30 * (Math.PI / 180)) * player_index;
      player.setParent(start_planet.id);
      player.spawn(start_planet.x, start_planet.y);
      this.parent_planet = start_planet;
    }
  }

  playerJump(player_index) {
    this.player_objects[player_index].setParent(null);
  }

  onLeave(player_index) {

  }

  createPlanetsPool(num) {
    for (var i = 0; i < num; i++) {
      var planet = this.createObject("PlanetGameObject", {
        id: Utils.randomId(),
        is_active: false
      });
      this.planets_map[planet.id] = planet;
    }
  }

  getFreeObject(type, x, y) {
    var obj = null;
    for (var i = 0; i < this.objects.length; i++) {
      var candidate = this.objects[i];
      if (!(candidate instanceof type)) continue;
      if (!candidate.is_active) {
        obj = candidate;
        break;
      }
    }

    if (obj && x !== undefined && y !== undefined) {
      obj.x = x;
      obj.y = y;
    }

    return obj;
  }

  createPlanets() {
    var self = this;
    var bbox = this.getBBox();
    var avail_radius = this.config.planet_radius;
    var base_radius = Utils.random(avail_radius[0], avail_radius[1]);
    var start_x = bbox.center_x;
    var start_y = bbox.center_y;

    this.start_planet = this.getFreeObject(PlanetGameObject, start_x, start_y);
    if (this.start_planet) {
      this.start_planet.spawn(start_x, start_y, base_radius);
      this.start_planet.angle_speed = 0.4;
    }

    var last_circle = this.start_planet;
    for (var i = 0; i < this.config.planets_initial_num; i++) {
      (function() {
        last_circle = self.appendCircle(last_circle);
      })(last_circle);
    }

  }

  appendCircle(last_circle) {
    last_circle = last_circle || this.getLastPlanet();
    if (!last_circle) {
      console.warn("We run out of free planets oO");
      return;
    }
    var avail_radius = this.config.planet_radius;
    var bbox = this.getBBox();
    var gap_y_max = Math.round(bbox.bottom / 3);
    var gap_x = this.config.player_radius * 3;
    var radius = Utils.random(avail_radius[0], avail_radius[1]);
    var x = Utils.random(radius + gap_x, bbox.right - radius - gap_x);
    var y = last_circle.y - (radius * 2) - Utils.random(100, gap_y_max);
    var circle = this.getFreeObject(PlanetGameObject, x, y);
    if (circle) {
      circle.spawn(x, y, radius);

      // Has child planet?
      if (Utils.random(0, 100) >= 100 - this.config.child_probability) {
        var child_circle = this.getFreeObject(PlanetGameObject);
        if (child_circle) {
          child_circle.spawn(x, y, this.config.child_radius, circle);
        } else {
          console.warn("We run out of child planets");
        }
      }
    }

    return circle;
  }

  getLastPlanet() {
    var last_y = null;
    var last_planet = null;
    for (var planet_id in this.planets_map) {
      var planet = this.planets_map[planet_id];
      if (planet.is_active && last_y == null || (planet.y < last_y)) {
        last_y = planet.y + planet.radius;
        last_planet = planet;
      }
    }
    return last_planet;
  }

  hitTest(circle1, circle2) {
    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    return (distance < circle1.radius + circle2.radius);
  }

  isCircleOutOfWorld(circle) {
    var bbox = this.getBBox();
    var r = circle.radius;
    return circle.x - r < bbox.left ||
      circle.x + r > bbox.right ||
      circle.y + r < bbox.top ||
      circle.y - r > bbox.bottom;
  }

  onAllDied() {
    console.log("All dead");
    this.is_running = false;
    var bbox = this.getBBox();
    var avail_radius = this.config.planet_radius;
    var base_radius = Utils.random(avail_radius[0], avail_radius[1]);
    this.start_planet = this.getLastPlanet();
    this.start_planet.spawn(bbox.center_x, this.start_planet.y, base_radius);
    this.start_planet.color = 0x00ff00;
    this.setPlanetsSpeed(20);
  }

  updateReset() {
    var self = this;
    var bbox = this.getBBox();

    // Deactivate all planets, which are out of the viewport
    for (var planet_id in this.planets_map) {
      var planet = this.planets_map[planet_id];
      if (!planet.is_active) continue;
      if (planet.id === this.start_planet.id) continue;
      if (planet.y + planet.radius < 0 ||
        planet.y - planet.radius > this.config.height) {
        planet.release();
      }
    }

    if (this.start_planet) {
      if (this.start_planet.y + this.start_planet.radius >= bbox.center_y) {
        this.setPlanetsSpeed(1);
        this.resetPlayers(this.start_planet);
        var last_planet = this.start_planet;
        for (var i = 0; i < 8; i++) {
          (function() {
            last_planet = self.appendCircle(last_planet);
          })(last_planet);
        }
        this.is_running = true;
      }
    }
  }

  setPlanetsSpeed(speed) {
    for (var planet_id in this.planets_map) {
      var planet = this.planets_map[planet_id];
      var speed_val = speed;
      planet.dy = speed_val;
    }
  }

  update() {

    if (!this.is_running) {
      this.updateReset();
      return;
    }

    // Update planets
    for (var planet_id in this.planets_map) {
      var planet = this.planets_map[planet_id];
      if (!planet.is_active) continue;
      if (planet.y - planet.radius > this.config.height) {
        if (!planet.parent) {
          planet.release();
          if (this.is_running) {
            this.appendCircle();
          }
        }
      }
    }

    // Update Players
    var count_dead = 0;
    for (var player_index in this.player_objects) {
      var player = this.player_objects[player_index];

      if (this.isCircleOutOfWorld(player)) {
        player.release();
      }

      if (!player.is_active) {
        count_dead++;
        continue;
      }

      player.update(this.planets_map[player.parent_planet_id]);

      // Player NOT on a planet
      if (!player.parent_planet_id) {
        player.increaseScore();

        // Player-Planet-Collision
        for (var planet_id in this.planets_map) {
          var planet = this.planets_map[planet_id];
          if (!planet.is_active) continue;
          if (this.hitTest(player, planet)) {
            player.setParent(planet_id);
            break;
          }
        }
      }
    }

    var num_players = this.engine.getPlayers().length;
    if (num_players && count_dead >= num_players) {
      this.onAllDied();
    }

  }

}
