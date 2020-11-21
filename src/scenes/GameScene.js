import Phaser from 'phaser';
import ScoreLabel from '../ui/ScoreLabel';

let DUDE_KEY = 'dude';
let STAR_KEY = 'star';
let BLUE_KEY = 'blue';
let YELLOW_KEY = 'yellow';
let PLATFORM = 'platform';
let PURPLE_PLAT = 'purpleplat';
let GRAYPLAT = 'grayplat';
// let GRAY_BAR = 'gray-bar';
// let RED_KEY = 'red';
let PURPLE_KEY = 'purple';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
    this.player = undefined;
    this.cursors = undefined;
  }

  preload() {
    // this.load.image('ground', 'assets/platform.png');
    this.load.image(STAR_KEY, 'assets/star.png');
    this.load.image(BLUE_KEY, '/assets/aqua_ball.png');
    this.load.image(YELLOW_KEY, '/assets/yellow_ball.png');
    this.load.image(PLATFORM, 'assets/strip1.png');
    this.load.image(PURPLE_PLAT, 'assets/purpleplatform.png');
    this.load.image(GRAYPLAT, 'assets/grayplat.png');
    // this.load.image(GRAY_BAR, 'assets/graybar.png');
    // this.load.image(RED_KEY, 'assets/red_ball.png');
    this.load.image(PURPLE_KEY, 'assets/purple_ball.png');

    this.load.spritesheet(DUDE_KEY, 'assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    // this.add.image(400, 300, this.sky);
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(
      '#E1EAEC'
      //   '#7851CC'
    );

    const platforms = this.createPlatforms();
    this.player = this.createPlayer();
    // const stars = this.createStars();
    const blue = this.physics.add.image(150, 200, BLUE_KEY);
    const yellow = this.physics.add.staticGroup().create(10, 310, YELLOW_KEY);
    // const graybar = this.physics.add.staticGroup().create(740, 480, GRAY_BAR);
    // const yellow = this.physics.add.image(590, 400, YELLOW_KEY);
    // const red = this.physics.add.image(770, 400, RED_KEY);
    const purple = this.physics.add.image(500, 400, PURPLE_KEY);

    this.physics.add.collider(this.player, platforms);
    // this.physics.add.collider(stars, platforms);
    this.physics.add.collider(blue, platforms);
    this.physics.add.collider(yellow, platforms);
    this.physics.add.collider(purple, platforms);
    // this.physics.add.collider(red, platforms);
    // this.physics.add.collider(this.player, graybar);

    console.log('this.physics -->', this.physics.add);

    // this.physics.add.overlap(this.player, stars, this.collectStar, null, this);
    // blue
    this.physics.add.overlap(this.player, blue, this.collectBlue, null, this);
    //prettier-ignore
    this.physics.add.overlap(this.player, yellow, this.collectYellow, null, this);
    //prettier-ignore
    this.physics.add.overlap(this.player, purple, this.collectPurple, null, this);

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
      this.player.setVelocityY(-320);
    }
  }

  createPlatforms() {
    let platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, PLATFORM).setScale(2).refreshBody();
    // platforms.create(600, 400, PLATFORM);
    platforms.create(50, 250, PLATFORM);
    // platforms.create(0, 380, PURPLE_PLAT);

    // this.physics.add.image(0, 300, PURPLE_PLAT);

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

  //   createStars() {
  //     const stars = this.physics.add.group({
  //       key: STAR_KEY,
  //       repeat: 11,
  //       setXY: {
  //         x: 12,
  //         y: 0,
  //         stepX: 70,
  //       },
  //     });

  //     stars.children.iterate((child) => {
  //       //this is fine, eslint is just being a jerk
  //       child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.5));
  //     });

  //     return stars;
  //   }

  //   collectStar(player, star) {
  //     star.disableBody(true, true);
  //     this.scoreLabel.add(10);
  //   }

  collectBlue(player, blue) {
    blue.disableBody(true, true);
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(
      '#39B2C8'
    );
    let purpleplat = this.physics.add.staticGroup().create(0, 380, PURPLE_PLAT);
    this.physics.add.collider(this.player, purpleplat);
  }

  collectYellow(player, yellow) {
    yellow.disableBody(true, true);
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(
      '#F4C11D'
    );
  }

  collectPurple(player, purple) {
    purple.disableBody(true, true);
    this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor(
      '#7851CC'
    );
    let grayplat = this.physics.add.staticGroup().create(600, 400, GRAYPLAT);
    this.physics.add.collider(this.player, grayplat);
  }

  createScoreLabel(x, y, score) {
    const style = { fonstSize: '32px', fill: '#000' };
    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);

    return label;
  }
}
