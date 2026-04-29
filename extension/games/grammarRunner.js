const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 300;
const GROUND_Y = 252;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const BASE_SPEED = 5;
const MAX_SPEED = 13;

const GAME_STATE = Object.freeze({
  RUNNING: 'RUNNING',
  FAIL: 'FAIL',
  RESULT: 'RESULT',
});

class Player {
  constructor() {
    this.width = 40;
    this.height = 52;
    this.x = 80;
    this.y = GROUND_Y - this.height;
    this.vy = 0;
    this.onGround = true;
  }

  jump() {
    if (!this.onGround) return;
    this.vy = JUMP_FORCE;
    this.onGround = false;
  }

  update(dt) {
    const scale = dt * 60;
    this.vy += GRAVITY * scale;
    this.y += this.vy * scale;
    if (this.y >= GROUND_Y - this.height) {
      this.y = GROUND_Y - this.height;
      this.vy = 0;
      this.onGround = true;
    }
  }

  draw(ctx) {
    // body
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    // eye
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(this.x + 26, this.y + 14, 8, 8);
    // legs (animated by y position)
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(this.x + 4, this.y + this.height, 10, 6);
    ctx.fillRect(this.x + 22, this.y + this.height, 10, 6);
  }
}

class Obstacle {
  constructor(x, wrongWord) {
    this.wrongWord = wrongWord;
    this.width = Math.max(wrongWord.length * 11 + 24, 64);
    this.height = 44;
    this.x = x;
    this.y = GROUND_Y - this.height;
    this.passed = false;
  }

  update(dt, speed) {
    this.x -= speed * dt * 60;
  }

  draw(ctx) {
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 5);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(this.wrongWord, this.x + this.width / 2, this.y + 28);
    ctx.textAlign = 'left';
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }
}

class GrammarRunner {
  constructor(canvas, data) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = data;
    this.state = null;
    this.score = 0;
    this.speed = BASE_SPEED;
    this.player = new Player();
    this.obstacles = [];
    this.animFrameId = null;
    this.spawnCooldown = 1.2;
    this.shuffled = this._shuffle([...data]);
    this.dataIndex = 0;

    this._bindInput();
    this.setState(GAME_STATE.RUNNING);
  }

  setState(newState) {
    this.state = newState;
    if (newState === GAME_STATE.RUNNING) this._startLoop();
    if (newState === GAME_STATE.FAIL)    this._onFail();
    if (newState === GAME_STATE.RESULT)  this._showResult();
  }

  _startLoop() {
    let last = performance.now();
    const loop = (now) => {
      if (this.state !== GAME_STATE.RUNNING) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      this.update(dt);
      this.draw(this.ctx);
      this.animFrameId = requestAnimationFrame(loop);
    };
    this.animFrameId = requestAnimationFrame(loop);
  }

  _onFail() {
    cancelAnimationFrame(this.animFrameId);
    this.draw(this.ctx); // freeze frame
    setTimeout(() => this.setState(GAME_STATE.RESULT), 300);
  }

  _showResult() {
    const best = Math.max(this.score, parseInt(localStorage.getItem('grammarBest') || '0'));
    localStorage.setItem('grammarBest', best);

    const TIPS = [
      'Tip: TextBoi fixes this with Ctrl+C+C',
      'Tip: TextBoi works in any text field',
      'Tip: TextBoi supports 30+ languages',
    ];

    document.querySelector('.score-msg').textContent = `You fixed ${this.score} sentences manually`;
    document.querySelector('.best-score').textContent = `Best: ${best}`;
    document.querySelector('.tip').textContent = TIPS[Math.floor(Math.random() * TIPS.length)];
    document.getElementById('hud-best').textContent = `Best: ${best}`;
    document.getElementById('result').classList.add('visible');
  }

  _restart() {
    document.getElementById('result').classList.remove('visible');
    this.score = 0;
    this.speed = BASE_SPEED;
    this.obstacles = [];
    this.spawnCooldown = 1.2;
    this.player = new Player();
    this.shuffled = this._shuffle([...this.data]);
    this.dataIndex = 0;
    document.getElementById('hud-score').textContent = 'Score: 0';
    this.setState(GAME_STATE.RUNNING);
  }

  _bindInput() {
    this._onKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (this.state === GAME_STATE.RUNNING) this.player.jump();
        if (this.state === GAME_STATE.RESULT)  this._restart();
      }
    };
    this._onClick = () => {
      if (this.state === GAME_STATE.RUNNING) this.player.jump();
    };
    document.addEventListener('keydown', this._onKey);
    this.canvas.addEventListener('click', this._onClick);
    document.getElementById('btn-replay').addEventListener('click', () => this._restart());
  }

  _nextObstacle() {
    const item = this.shuffled[this.dataIndex % this.shuffled.length];
    this.dataIndex++;
    if (this.dataIndex % this.shuffled.length === 0) {
      this.shuffled = this._shuffle([...this.data]);
    }
    return item.sentence.split(' ')[item.wrongIndex];
  }

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  _collides(p, o) {
    const m = 6;
    return (
      p.x + m < o.x + o.width  &&
      p.x + p.width - m > o.x  &&
      p.y + m < o.y + o.height &&
      p.y + p.height - m > o.y
    );
  }

  _spawnIfReady(dt) {
    this.spawnCooldown -= dt;
    if (this.spawnCooldown > 0) return;
    this.obstacles.push(new Obstacle(CANVAS_WIDTH + 50, this._nextObstacle()));
    this.spawnCooldown = Math.max(1.5 - this.score * 0.03, 0.8);
  }

  _updateObstacles(dt) {
    for (const o of this.obstacles) {
      o.update(dt, this.speed);
      if (!o.passed && o.x + o.width < this.player.x) {
        o.passed = true;
        this.score++;
        this.speed = Math.min(BASE_SPEED + this.score * 0.25, MAX_SPEED);
        document.getElementById('hud-score').textContent = `Score: ${this.score}`;
      }
      if (this._collides(this.player, o)) {
        this.setState(GAME_STATE.FAIL);
        return true; // collision
      }
    }
    return false;
  }

  update(dt) {
    this.player.update(dt);
    this._spawnIfReady(dt);
    if (this._updateObstacles(dt)) return;
    this.obstacles = this.obstacles.filter(o => !o.isOffScreen());
  }

  draw(ctx) {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // ground line
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
    ctx.stroke();

    this.player.draw(ctx);
    this.obstacles.forEach(o => o.draw(ctx));
  }

  destroy() {
    cancelAnimationFrame(this.animFrameId);
    document.removeEventListener('keydown', this._onKey);
    this.canvas.removeEventListener('click', this._onClick);
  }
}
