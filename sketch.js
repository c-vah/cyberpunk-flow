/*
=========================================================
CYBERPUNK FLOW FIELD INSTALLATION
=========================================================

Concepto:
Instalación artística generativa inspirada en ciudades
cyberpunk, hologramas flotantes y corrientes de energía.

Características:
✓ Miles de partículas
✓ Flow Field con Perlin Noise
✓ Trails luminosos
✓ Glow Neon
✓ Interacción con ratón
✓ Arquitectura holográfica
✓ Colores dinámicos
✓ Optimizado para 60 FPS

=========================================================
*/


// ------------------------------------------------------
// CONFIGURACIÓN GENERAL
// ------------------------------------------------------

const NUM_PARTICLES = 5000;
const SCALE = 20;

let particles = [];
let flowField = [];

let cols, rows;
let zoff = 0;


// ------------------------------------------------------
// SETUP
// ------------------------------------------------------

function setup() {

  createCanvas(windowWidth, windowHeight);

  pixelDensity(1);

  cols = floor(width / SCALE) + 1;
  rows = floor(height / SCALE) + 1;

  blendMode(ADD);

  background(0);

  // crear partículas

  for (let i = 0; i < NUM_PARTICLES; i++) {

    particles.push(new Particle());

  }

}


// ------------------------------------------------------
// DRAW
// ------------------------------------------------------

function draw() {

  /*
   Fondo semitransparente.

   NO limpiamos completamente el canvas.
   Esto genera las estelas persistentes.
  */

  blendMode(BLEND);

  fill(2, 4, 10, 15);
  noStroke();
  rect(0, 0, width, height);

  blendMode(ADD);

  generateFlowField();

  drawHolograms();

  for (let p of particles) {

    p.follow(flowField);
    p.update();
    p.edges();
    p.show();

  }

}


// ------------------------------------------------------
// FLOW FIELD
// ------------------------------------------------------

function generateFlowField() {

  let yoff = 0;

  for (let y = 0; y < rows; y++) {

    let xoff = 0;

    for (let x = 0; x < cols; x++) {

      let index = x + y * cols;

      /*
      Perlin Noise produce cambios suaves.

      noise() devuelve valores 0..1

      Convertimos ese valor
      a un ángulo.
      */

      let angle =
        noise(xoff, yoff, zoff) * TWO_PI * 4;

      let v = p5.Vector.fromAngle(angle);

      v.setMag(1);

      flowField[index] = v;

      xoff += 0.08;
    }

    yoff += 0.08;
  }

  zoff += 0.002;
}


// ------------------------------------------------------
// PARTICLE CLASS
// ------------------------------------------------------

class Particle {

  constructor() {

    this.pos = createVector(
      random(width),
      random(height)
    );

    this.vel = createVector();
    this.acc = createVector();

    this.maxSpeed = 2;

    this.prevPos = this.pos.copy();

    this.hueOffset = random(360);

  }

  applyForce(force) {

    this.acc.add(force);

  }

  follow(vectors) {

    let x = floor(this.pos.x / SCALE);
    let y = floor(this.pos.y / SCALE);

    let index = x + y * cols;

    if (vectors[index]) {
      this.applyForce(vectors[index]);
    }

    this.mouseField();

  }

  mouseField() {

    let mouse = createVector(mouseX, mouseY);

    let dir =
      p5.Vector.sub(mouse, this.pos);

    let d = dir.mag();

    if (d < 200) {

      dir.normalize();

      let power =
        map(d, 0, 200, 2, 0);

      // Atracción con botón izquierdo
      if (mouseIsPressed) {

        dir.mult(-power);

      } else {

        dir.mult(power);

      }

      this.applyForce(dir);

    }

  }

  update() {

    this.vel.add(this.acc);

    this.vel.limit(this.maxSpeed);

    this.pos.add(this.vel);

    this.acc.mult(0);

  }

  edges() {

    if (this.pos.x > width) {
      this.pos.x = 0;
      this.prevPos = this.pos.copy();
    }

    if (this.pos.x < 0) {
      this.pos.x = width;
      this.prevPos = this.pos.copy();
    }

    if (this.pos.y > height) {
      this.pos.y = 0;
      this.prevPos = this.pos.copy();
    }

    if (this.pos.y < 0) {
      this.pos.y = height;
      this.prevPos = this.pos.copy();
    }

  }

  show() {

    /*
      Variación cromática dinámica
    */

    let t = frameCount * 0.4;

    let r =
      150 +
      105 *
      sin(radians(t + this.hueOffset));

    let g =
      120 +
      135 *
      sin(radians(t + this.hueOffset + 120));

    let b =
      180 +
      75 *
      sin(radians(t + this.hueOffset + 240));



    /*
      Glow exterior
    */

    stroke(r, g, b, 8);
    strokeWeight(8);

    line(
      this.prevPos.x,
      this.prevPos.y,
      this.pos.x,
      this.pos.y
    );

    /*
      Núcleo brillante
    */

    stroke(r, g, b, 120);
    strokeWeight(1);

    line(
      this.prevPos.x,
      this.prevPos.y,
      this.pos.x,
      this.pos.y
    );

    this.prevPos = this.pos.copy();

  }

}



// ------------------------------------------------------
// HOLOGRAMAS CYBERPUNK
// ------------------------------------------------------

function drawHolograms() {

  push();

  translate(width / 2, height / 2);

  let t = frameCount * 0.003;

  noFill();

  for (let i = 0; i < 8; i++) {

    push();

    rotate(t + i);

    let size =
      120 +
      sin(frameCount * 0.01 + i) * 50 +
      i * 60;

    let alpha =
      20 +
      20 * sin(frameCount * 0.02 + i);

    stroke(
      100 + i * 15,
      180,
      255,
      alpha
    );

    strokeWeight(1);

    polygon(
      0,
      0,
      size,
      6
    );

    pop();
  }

  pop();

}


// ------------------------------------------------------
// POLYGON
// ------------------------------------------------------

function polygon(x, y, radius, npoints) {

  beginShape();

  for (
    let a = 0;
    a < TWO_PI;
    a += TWO_PI / npoints
  ) {

    let sx =
      x + cos(a) * radius;

    let sy =
      y + sin(a) * radius;

    vertex(sx, sy);

  }

  endShape(CLOSE);

}


// ------------------------------------------------------
// RESIZE
// ------------------------------------------------------

function windowResized() {

  resizeCanvas(
    windowWidth,
    windowHeight
  );

  background(0);

}
