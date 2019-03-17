class PlanetGameObject extends Einstein.GameObject {
  awake(args) {
    args = args || {};
    this.entity_type = "PlanetGameObject";
    this.is_active = args.is_active || false;
    this.x = 100;
    this.y = 50;
    this.dx = -1;
    this.dy = 0;
    this.radius = 15;

    this.parent_planet = null;
    this.base_angle = 0;
    this.parent_distance = this.radius * 2;
    this.rotate_direction = Utils.random(0, 100) >= 50 ? -1 : 1;

    this.angle_speed = 1;
    this.init_color = 0x00FF00;
    this.color = 0x00FF00;
    this.setValues();
  }

  setValues() {
    var colors = [0x833471, 0x9980FA, 0x12CBC4, 0xC4E538, 0xFFC312];

    var rnd_angle_speed = Utils.random(1, 4);
    this.angle_speed = rnd_angle_speed / 10;

    var color = colors[rnd_angle_speed - 1];
    this.init_color = color;
    this.color = color;
  }

  spawn(x, y, radius, parent) {
    this.is_active = true;
    this.x = x;
    this.y = y;
    this.radius = radius;

    if (parent) {
      this.color = 0xFD7272;
      this.parent_planet = parent;
      var min_distance = this.parent_planet.radius + this.radius + 20;
      this.parent_distance = Utils.random(min_distance + 5, min_distance + 60);
    } else {
      this.setValues();
      this.parent_planet = null;
    }
  }

  release() {
    this.is_active = false;
    this.color = this.init_color;
    this.parent_planet = null;
  }

  update() {
    if (!this.is_active) return;
    if (!this.parent_planet) {
      this.x += this.dx;
    } else {
      var pos = Utils.getPosOnRadius(this.parent_planet, this.parent_distance, this.base_angle);
      this.base_angle += 0.1 * this.rotate_direction * this.angle_speed;
      this.x = pos.x;
      this.y = pos.y

      if (!this.parent_planet.is_active) {
        this.release();
      }
    }
  }

}
