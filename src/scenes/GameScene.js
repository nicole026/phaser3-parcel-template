import Phaser from 'phaser';
import ScoreLabel from '../ui/ScoreLabel';

let DUDE_KEY = 'dude';
let STAR_KEY = 'star';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
    this.player = undefined;
    this.cursors = undefined;
  }

  preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image(STAR_KEY, 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('vu', 'assets/strip1.png');

    this.load.spritesheet(DUDE_KEY, 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.add.image(400, 300, 'sky');

    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    const stars = this.createStars();

    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(this.player, stars, this.collectStar, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.scoreLabel = this.createScoreLabel(16, 16, 0);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  createPlatforms() {
    let platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'vu').setScale(2).refreshBody();
    platforms.create(600, 400, 'vu');
    platforms.create(50, 250, 'vu');
    return platforms;
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 450, DUDE_KEY);
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: DUDE_KEY, frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(DUDE_KEY, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }

  createStars() {
    const stars = this.physics.add.group({
      key: STAR_KEY,
      repeat: 11,
      setXY: {
        x: 12,
        y: 0,
        stepX: 70,
      },
    });

    stars.children.iterate((child) => {
      //this is fine, eslint is just being a jerk
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.5));
    });

    return stars;
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.scoreLabel.add(10);
  }

  createScoreLabel(x, y, score) {
    const style = { fonstSize: '32px', fill: '#000' };
    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);

    return label;
  }
}
