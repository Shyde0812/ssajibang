import Phaser, { Tilemaps } from 'phaser';
import Config from '../Config';
import Player from "../characters/Player";
import attackConfig from "../Config/AttackConfig";

// utils
import MobFactory from '../utils/mobFactory';
import vfxManager from "../utils/vfxManager";
import { setBackground, setTilemapBackground } from '../utils/backgroundManager';
import { AttackEvent , removeAttack} from '../utils/attackManager';


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
    this.map = setTilemapBackground(this, currentMap);
    //setBackground(this, "bg");

    this.m_player = new Player(this);
    this.vfxManager = new vfxManager(this);

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

    

    // 스킬 담당
    this.m_attackKeys = {
      D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),

      F: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
      Q: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
    };

    this.skillMapping = {
      D: "AutoAttack",  
      S: "Perry",
      // F: "Slash", 
      // Q: "Fireball"
    };

    // Mob
    
    this.m_mobs = this.physics.add.group();
    this.m_mobAttackStatic = this.add.group();
    this.m_mobAttackDynamic = this.add.group();

    MobFactory.createMob(this, "medusa", this.map.Width / 2, 512);
    this.m_mobEvents = [];

    // ATTACK
    this.m_weaponDynamic = this.add.group();
    this.m_weaponStatic = this.add.group();
    this.m_weaponPerry = this.add.group();
    //this.m_attackEvents = {};


    // COLLISIONS

    this.physics.add.overlap(
      this.m_mobAttackStatic,
      this.m_weaponPerry,
      (hitbox , perry) => {

        hitbox.owner.stun();
        // 히트박스 비활성화 (제거하지 않고)
        hitbox.setActive(false);
        hitbox.setVisible(false);
        
        // 그룹에서 일시적으로 제거 (완전히 제거하지 않음)
        this.m_mobAttackStatic.remove(hitbox, true);
        
        
        this.vfxManager.playHitEffect(hitbox, "perry" , this.m_player.m_flip);

        console.log("Parrying sucess");

        // 히트박스 비활성화 (제거하지 않고)
        hitbox.setActive(false);
        hitbox.setVisible(false);
        
        // 그룹에서 일시적으로 제거 (완전히 제거하지 않음)
        this.m_mobAttackStatic.remove(hitbox, true);
        //perry.destroy();
        
      },
      null,
      this
    );

    // mob -> player
    this.physics.add.overlap(
      this.m_mobAttackStatic,
      this.m_player,
      (hitbox , player) => {

        player.hitByStatic(10); 
        
        // 히트박스 비활성화 (제거하지 않고)
        hitbox.setActive(false);
        hitbox.setVisible(false);
        
        // 그룹에서 일시적으로 제거 (완전히 제거하지 않음)
        this.m_mobAttackStatic.remove(hitbox, true);
        
      },
      null,
      this
    );

    // player -> mob
    this.physics.add.overlap(
      this.m_weaponStatic,
      this.m_mobs,
      (weapon, mob) => {
        if (!mob.hitboxes) {
          mob.hitByStatic(weapon.m_damage , weapon.duration);

          //..vfx
          // this.vfxManager.playHitEffect(mob, "hit" , this.m_player.m_flip);
          // this.vfxManager.showDamageText(mob, weapon.m_damage);
  
        }
      },
      null,
      this
    );

    // Group 객체에서 getChildren()을 사용해 모든 몹을 배열로 가져오기
    const mobs = this.m_mobs.getChildren();

    // 복합 히트박스를 가진 보스에 대한 충돌 처리
    mobs.forEach(mob => {
      if (mob.hitboxes) {
        mob.hitboxes.forEach(hitbox => {
          this.physics.add.overlap(
            this.m_weaponStatic,
            hitbox,
            (weapon, _) => {
              // 히트박스 소유자(보스)에게 데미지 적용
              mob.hitByStatic(weapon.m_damage, weapon.duration);
            },
            null,
            this
          );
        });
      }
    });
    
  }

  update() {
    
    this.attackPlayerManager();


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

    this.m_player.setVelocity(0, 0); // 기존 이동 멈추기

    let dx = targetX - this.m_player.x;
    let dy = targetY - this.m_player.y;
    let distance = Phaser.Math.Distance.Between(this.m_player.x, this.m_player.y, targetX, targetY);
    

    // 이동 방향에 따라 캐릭터 좌우 반전
    if (dx < 0) {
      this.m_player.setFlipX(true); // 왼쪽 이동
      this.m_player.m_flip = true;
    } else {
        this.m_player.setFlipX(false); // 오른쪽 이동
        this.m_player.m_flip = false;
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