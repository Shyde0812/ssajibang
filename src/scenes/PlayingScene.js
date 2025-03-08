import Phaser, { Tilemaps } from 'phaser';
import Config from '../Config';
import Player from "../characters/Player";
import Mob from "../characters/Mobs";
import HpBar from "../ui/HpBar";
import ExpBar from "../ui/ExpBar";
import attackConfig from "../Config/AttackConfig";

import { setBackground, setTilemapBackground } from '../utils/backgroundManager';
import { addMob, addMobEvent, removeOldestMobEvent } from "../utils/mobManager";
import { AttackEvent} from '../utils/attackManager';
import Explosion from '../effects/Explosion';

export default class PlayingScene extends Phaser.Scene
{
  constructor() {
    super("playGame");
  }

  preload() {
    
  }

  create() {  

    // 사용할 sound들을 추가해놓는 부분입니다.
    // load는 전역적으로 어떤 scene에서든 asset을 사용할 수 있도록 load 해주는 것이고,
    // add는 해당 scene에서 사용할 수 있도록 scene의 멤버 변수로 추가할 때 사용하는 것입니다.
    this.sound.pauseOnBlur = false;
    this.m_beamSound = this.sound.add("audio_beam");
    this.m_scratchSound = this.sound.add("audio_scratch");
    this.m_hitMobSound = this.sound.add("audio_hitMob");
    this.m_growlSound = this.sound.add("audio_growl");
    this.m_explosionSound = this.sound.add("audio_explosion");
    this.m_expUpSound = this.sound.add("audio_expUp");
    this.m_hurtSound = this.sound.add("audio_hurt");
    this.m_nextLevelSound = this.sound.add("audio_nextLevel");
    this.m_gameOverSound = this.sound.add("audio_gameOver");
    this.m_gameClearSound = this.sound.add("audio_gameClear");
    this.m_pauseInSound = this.sound.add("audio_pauseIn");
    this.m_pauseOutSound = this.sound.add("audio_pauseOut");


    // TILE_MAP
    const currentMap = 'bossmap'; // 또는 동적으로 결정된 맵 이름
  
    // PlayScene의 background를 설정합니다.
    setTilemapBackground(this, currentMap);
    //setBackground(this, "bg");

    this.m_player = new Player(this);

    // Phaser에서 카메라가 특정 게임 오브젝트를 따라가도록 설정하는 코드입니다.
    this.cameras.main.startFollow(this.m_player);

    // mouse
    this.input.mouse.disableContextMenu();

    this.input.on('pointerdown', (pointer) => {
      if(pointer.rightButtonDown()) {
        this.targetX = pointer.worldX; // 클릭 했을 시 월드 좌표
        this.targetY = pointer.worldY;
        //console.log(this.targetX , this.targetY);
        this.moveToTarget(this.targetX, this.targetY); // 목표 지점으로 이동
      }
    }, this); // this를 유지하도록 설정

    // keyboard
    this.m_cursorKeys = this.input.keyboard.createCursorKeys();

    

    // 공격 담당
    this.m_attackKeys = {
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      F: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
      Q: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
    };

    this.skillMapping = {
      D: "AutoAttack",  
      // F: "Slash", 
      // Q: "Fireball"
    };

    // Mob
    this.m_mobs = this.physics.add.group();
    this.m_mobs.add(new Mob(this, 980, 500, "boss", "boss_idle", 100))
    this.m_mobEvents = [];

    // scene, repeatGap, mobTexture, mobAnim, mobHp, mobDropRate
    //addMobEvent(this, 1000, "mob1", "mob1_anim", 100 , 0.9);

    // ATTACK
    this.m_weaponDynamic = this.add.group();
    this.m_weaponStatic = this.add.group();
    //this.m_attackEvents = {};


    // COLLISIONS

    // Player와 mob이 부딪혔을 경우 player에게 데미지 10을 줍니다? 이건 몬스터마다 다르게 만들어야할듯
    // ( player.js 에서 hitByMob 함수 확인 )
    // this.physics.add.overlap(
    //   this.m_player,
    //   this.m_mobs,
    //   () => this.m_player.hitByMob(10),
    //   null,
    //   this
    // );

    // mob이 static 공격에 부딪혓을 경우 mob에 해당 공격의 데미지만큼 데미지를 줍니다.
    // (Mob.js에서 hitByStatic 함수 확인)
    this.physics.add.overlap(
      this.m_weaponStatic,
      this.m_mobs,
      (weapon, mob) => {
          mob.hitByStatic(weapon.m_damage , weapon.duration);
      },
      null,
      this
    );

    // BARS
    this.m_expBar = new ExpBar(this, 50)

    
  }

  update() {
    
    this.attackPlayerManager();

    // if(this.m_player.m_attacking) {
    //   this.stopPlayer();
    // }

    if (this.m_player.m_moving) {
      let distanceToTarget = Phaser.Math.Distance.Between(
          this.m_player.x,
          this.m_player.y,
          this.targetX,
          this.targetY
      );

      if (distanceToTarget < 5) { // 목표 지점 근처에 도착하면 멈춤
          this.stopPlayer();
      }
  }

    const closest = this.physics.closest(
      this.m_player,
      this.m_mobs.getChildren()
    );
    this.m_closest = closest;
  }


  moveToTarget(targetX, targetY) {
    if(this.m_player.m_attacking) {
      return;
    }


    // // Phaser 3의 tweens는 오브젝트의 속성을 일정한 속도로 변경해주는 애니메이션 시스템이야.
    // // 크기, 투명도, 위치 등 여러가지 조절 가능
    // this.tweens.add({
    //   targets: this.m_player,
    //   x: targetX,
    //   y: targetY,
    //   duration: distance / speed * 1000, // 시간 = 거리 / 속력
    //   ease: "Linear",
    //   onComplete: () => {
    //       this.m_player.play("player_idle", true); // 이동이 끝나면 대기 애니메이션 실행
    //       this.m_player.m_moving = false;
    //   }
    // });

    this.m_player.setVelocity(0, 0); // 기존 이동 멈추기

    let dx = targetX - this.m_player.x;
    let dy = targetY - this.m_player.y;
    let distance = Phaser.Math.Distance.Between(this.m_player.x, this.m_player.y, targetX, targetY);

    // 이동 방향에 따라 캐릭터 좌우 반전
    if (dx < 0) {
      this.m_player.setFlipX(true); // 왼쪽 이동
    } else {
        this.m_player.setFlipX(false); // 오른쪽 이동
    } 

    const speed = 200;
    let angle = Math.atan2(dy, dx);

    this.m_player.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
    
    this.m_player.play("player_run", true);
    this.m_player.m_moving = true;

    // 충돌 감지 후 멈추기
    this.physics.add.collider(this.m_player, this.collisionLayer, () => {
        this.m_player.setVelocity(0, 0);
        this.m_player.play("player_idle", true);
        this.m_player.m_moving = false;
    });

  }

  stopPlayer() {
    this.m_player.setVelocity(0, 0);
    this.m_player.play("player_idle", true);
    this.m_player.m_moving = false;
  }

  attackPlayerManager() {
    // Object.keys(객체) = 객체의 키들을 배열 형태로 반환
    // console.log(Object.keys(this.m_attackKeys)); 
    // ["D", "F", "Q"]  
    Object.keys(this.m_attackKeys).forEach(key => {
      if(Phaser.Input.Keyboard.JustDown(this.m_attackKeys[key]) && !this.m_player.m_attacking) {
        this.stopPlayer();
        this.m_player.m_attacking = true;
        this.m_player.m_moving = false;

        // 현재 키에 매핑된 스킬 가져오기
        const skillName = this.skillMapping[key];
        if(!skillName) return;

        // 해당 스킬의 공격 정보 가져오기
        const skillData = attackConfig[skillName];
        if (!skillData) return;

        // 공격 실행
        AttackEvent(this, skillName);

      }
    })
  }
}


 //시초 루트 : https://github.com/weniv/game-with-phaser 