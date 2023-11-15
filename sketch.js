let particles = [];
let blackhole;
let gravityConst;
let noClear = false;
let g;
let particle_count = 2000;
let velocity_limit = 0.5;
let slider = document.getElementById("gravRange");

function setup() {
  createCanvas(windowWidth, windowHeight);
  fullscreen();
  background(10);
  frameRate(60);
  blackhole = new Blackhole();

  for (let i = 0; i < particle_count; i++) {
    let p = new Particle(random(0, windowWidth), random(0, windowHeight));
    // pushin p
    particles.push(p);
  }
}

function draw() {
  g = document.getElementById("gravRange").value;

  if (!noClear) {
    background(10);
  }
  noStroke();
  blackhole.show();
  applyGravity();

  for (let i = 0; i < particles.length; i++) {
    particles[i].show();
    particles[i].update();
  }

  // add particle if mouse pressed
  if (mouseIsPressed) {
    particles.push(new Particle(mouseX, mouseY));
  }

   //cap particle velocity, edit: nvm
  for (let k = 0; k < particles.length; k++) {
    if (particles[k].velocity.mag() > 5) {
      particles[k].velocity.x = particles[k].velocity.x * velocity_limit;
    }
  }

  // remove dead particles
  for (let n = 0; n < particles.length; n++) {
    if (particles[n].position.x > windowWidth 
      || particles[n].position.y > windowHeight) {
        particles.splice(n, 1);
    }
  }

  colorParticles();
}

function windowResized() {
  blackhole = new Blackhole();
  resizeCanvas(windowWidth, windowHeight);
}

function colorParticles() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].r = 255;
    particles[i].g = 255 * (1 / particles[i].velocity.mag());
    particles[i].b = 255 * (1 / particles[i].velocity.mag() - 50);
  }
}

function applyGravity() {
  // deletes particles that collide with blockhole radius 
  for (let n = 0; n < particles.length; n++) {
    let dist = p5.Vector.sub(createVector(blackhole.x, blackhole.y), particles[n].position);
    if (Math.abs(dist.x) < 5 && Math.abs(dist.y) < 5) {
      particles.splice(n, 1);
    }
  }

  // calculates and applys force to each particle
  for (let i = 0; i < particles.length; i++) {
    let force = p5.Vector.sub(createVector(blackhole.x, blackhole.y), particles[i].position);
    let dq = force.magSq();
    let strength = g * (blackhole.mass * particles[i].mass) / dq;
    force.setMag(strength);
    particles[i].applyForce(force);
  }

  //TODO gravity between particles
  // // for (let i = 0; i < particles.length; i++) {
  // //   for (let n = i + 1; n < particles.length; n++) {
  // //     particles[i].attractTo(particles[n]);
  // //     particles[n].attractTo(particles[i]);
  // //   }
  // }
}

class Blackhole {
  constructor() {
    this.mass = 5000;
    this.x = windowWidth / 2;
    this.y = windowHeight / 2;
  }

  show() {
    fill(0, 0, 0);
    ellipse(this.x, this.y, 4);
  }
}

class Particle {
  constructor(x, y) {
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.mass = 2;
    this.position = createVector(x, y);
    this.velocity = createVector(0.33, 0.66);
    this.acceleration = p5.Vector.fromAngle(radians(random(360)));
  }

  show() {
    noStroke();
    fill(this.r, this.g, this.b);
    ellipse(this.position.x, this.position.y, 2);
    //console.log("Heading: " + this.vector);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.set(0, 0);
  }

  applyForce(force) {
    this.acceleration.add(p5.Vector.div(force, this.mass));
  }

  attractTo(other) {
    let force = p5.Vector.sub(other.position, this.position);
      let dq = force.magSq()
      let strength = 1 * (other.mass * this.mass) / dq;
      force.setMag(strength);
      let op = createVector(-1, -1, -1);
      this.applyForce(force);
  }
}
