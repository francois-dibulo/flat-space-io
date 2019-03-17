class PlayerGameObject extends Einstein.GameObject {
  awake(args) {
    args = args || {};
    this.entity_type = "PlayerGameObject";
    this.player_index = args.player_index || null;
    this.is_active = args.is_active || false;
    this.x = args.x || 400;
    this.y = args.y || 250;
    this.color = args.color || 0xFEA47F;
    this.color_hex = "#" + args.color.toString(16);
    this.radius = 8;
    this.distance_to_parent = 2;
    this.speed = 5;
    this.score = 0;

    this.parent_planet_id = null;
    this.base_angle = 0;
    console.log("A", this.is_active)
  }

  spawn(x, y, radius, parent) {
    this.is_active = true;
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  setParent(planet_id) {
    this.parent_planet_id = planet_id;
    if (planet_id) {
      this.base_angle = this.base_angle -= Math.PI;
    }
  }

  release() {
    this.parent_planet_id = null;
    this.is_active = false;
  }

  reset() {
    this.is_active = true;
    this.parent_planet_id = null;
    this.score = 0;
  }

  increaseScore() {
    this.score += 1;
  }

  update(parent) {
    if (!this.is_active) return;

    if (!parent) {
      this.x += Math.cos(this.base_angle) * this.speed;
      this.y += Math.sin(this.base_angle) * this.speed;
    } else {
      var radius = parent.radius + this.radius + this.distance_to_parent;
      var pos = Utils.getPosOnRadius(parent, radius, this.base_angle);
      this.base_angle += 0.1 * parent.rotate_direction * parent.angle_speed;
      this.x = pos.x;
      this.y = pos.y
    }
  }

}
