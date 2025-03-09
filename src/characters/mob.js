import Phaser from "phaser";
import { mobConfig } from "../Config/mobConfig";

import Explosion from "../effects/Explosion";

 import BossHpBar from "../ui/BossHpBar";
// import { removeAttack } from '../utils/attackManager';


export default class mob extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y, name) {

        // mobConfig에서 해당 몹의 설정 가져오기
        const config = mobConfig[name] || {};
        
        // 스프라이트 키를 config에서 가져오거나, 없으면 기본값으로 name 사용
        const spriteKey = config.sprite || name;

        super(scene, x, y, spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // 모든 이벤트를 관리하는 배열
        this.events = [];

        this.config = config
        this.initProperties();
        this.initPhysics();
        this.initAnimation();
        this.initMovement();
        this.initHpBar(scene);

        scene.events.on("update", (time, delta) => 
            this.update(time, delta)
        );
    }

    // 다른 이벤트가 있을 경우 이곳에 추가하면 됩니다.
    addEvent(event) {
        this.events.push(event);
    }

    initProperties() {
        // Option
        this.scale = this.config.scale || 1;
        this.m_type = this.config.type || "mob";
        this.m_speed = this.config.speed || 50;
        this.m_hp = this.config.hp || 100;

        // Set
        this.m_isDead = false;
        this.m_canBeAttacked = true;
        this.m_canMove = this.config.canMove;

        // Move
        this.m_moveDelay = this.config.moveDelay || 100;
        this.m_stopDistance = this.config.stopDistance || 100;

        // HpBar
        this.m_hpBarVisible = false;
        this.m_hpBarRange = this.config.hpBarRange || 500;
    }

    initPhysics() {

        if(this.config.complexHitbox) {
            this.body.setSize(1, 1);  // 완전히 0으로 하면 문제가 생길 수 있어서 최소값으로 설정
            this.body.setOffset(0, 0);  // 오프셋도 초기화

            this.hitboxes = [];

            for( const hiboxConfig of this.config.complexHitbox) {
                // 각 히트박스를 몹에 상대적인 위치에 생성
                const hitbox = this.scene.physics.add.existing(
                    this.scene.add.zone(
                        this.x + hiboxConfig.offsetX,
                        this.y + hiboxConfig.offsetY,
                        hiboxConfig.width,
                        hiboxConfig.height
                    ), false
                );

                // 히트박스를 활성화
                hitbox.body.setAllowGravity(false);
                
                this.hitboxes.push(hitbox);
            }

        } else {
            this.setBodySize(this.config.bodySize[0] , this.config.bodySize[1]);
        }
    }

    initAnimation() {
        if (this.config.animation) {
            this.play(this.config.animation[0].key); // skeleton_revive 애니메이션 실행
            

            this.once("animationcomplete", () => { // 보스가 부활모션 없어서 지금은 못쓸듯
                //this.m_canMove = true;
                //this.initMovement();
            });
        }
    }

    initMovement() {
        this.moveTimer = this.scene.time.addEvent({
            delay: this.m_moveDelay,
            callback: () => {
                if (this.m_canMove && this.body) { // m_canMove가 true일 때만 이동
                    this.scene.physics.moveToObject(this, this.scene.m_player, this.m_speed);
                    this.walk();
                } else {
                    if (this.body instanceof Phaser.Physics.Arcade.Body) {
                        this.body.setVelocity(0); // 안전한 방식
                    }
                }
            },
            loop: true,
        });

        // 이벤트 배열에 추가
        this.events.push(this.moveTimer);
    }

    initHpBar(scene) {
        if (this.m_type === "boss") {
            this.m_hpBar = new BossHpBar(scene , this.m_hp, "AshBrown");
        }
    }

    update() {
        // 최후의 보루임 die 실행되면 이거 실행안됨
        if (this.m_isDead || !this.body) {
            return;
        }


        // 바라 보는 방향이다.
        if (this.x < this.scene.m_player.x) this.flipX = true;
        else this.flipX = false;

        this.distance = Phaser.Math.Distance.Between(
            this.x, 
            this.y, 
            this.scene.m_player.x,
            this.scene.m_player.y
        );

        this.controlMovement(this.distance);
        this.controlhpBarVisible(this.distance);


        // ..Boss
        // 다중 히트박스들의 위치 업데이트
        if (this.hitboxes) {
            for (let i = 0; i < this.hitboxes.length; i++) {
                const hitboxConfig = this.config.complexHitbox[i];
                this.hitboxes[i].x = this.x + hitboxConfig.offsetX;
                this.hitboxes[i].y = this.y + hitboxConfig.offsetY;
            }
        }

        // BossHpBar
        if(this.m_hpBarVisible && this.m_hpBar) {
            this.m_hpBar.setVisible(true);
            //console.log("visible run");
        }
        else if(!this.m_hpBarVisible && this.m_hpBar) {
            this.m_hpBar.setVisible(false);
        }

        // HP 가 0 이하 이고, 죽은 적이 없으면 죽습니다.
        if ( this.m_hp <= 0 && !this.m_isDead) {
            //this.m_hpBar.setVisible(false);
            this.die();
        }

        
    }

    controlMovement(distance) {
        
        if (distance < this.m_stopDistance) {
            this.m_canMove = false;
            this.attack();
        } else {
            this.m_canMove = true;
        }
    }

    controlAutoattack() {
        
    }

    controlhpBarVisible(distance) {
        // 일정 거리 이상이면 보스바 숨김
        if (this.m_hpBarVisible && distance > this.m_hpBarRange) {
            this.m_hpBarVisible = false;
        }
        // 일정 거리 이하면 보스바 다시 표시
        else if (!this.m_hpBarVisible && distance <= this.m_hpBarRange) {
            this.m_hpBarVisible = true;
        }

    }

    // mob이 static attack에 맞을 경우 실행되는 함수
    hitByStatic(damage, duration) {
        if (!this.m_canBeAttacked || this.m_isDead) return;

        this.m_hpBarVisible = true;
        this.scene.m_hitMobSound.play();

        this.m_hp -= damage;

        if(this.m_hpBar) {
            this.m_hpBar.decrease(damage);
        }
        this.displayHit(duration);
        this.getCoolDown(duration);

    }

    displayHit(duration) {

        this.alpha = 0.5;
        this.scene.time.addEvent({
            delay: duration,
            callback: () => {
                this.alpha = 1;
            },
            loop: false,
        })
    }

    // 피격 가능 쿨타임을 갖는 함수
    getCoolDown(duration) {
        this.m_canBeAttacked = false;
        this.scene.time.addEvent({
            delay: duration,
            callback: () => {
                this.m_canBeAttacked = true;
            },
            loop: false,
        })
    }

    die() {
        this.m_isDead = true;


        new Explosion(this.scene, this.x, this.y);
        this.scene.m_explosionSound.play();

        // 모든 타이머와 이벤트를 제거
        if (this.events.length > 0) {
            this.events.forEach(event => {
                event.remove();  // 이벤트 제거
                console.log("Event removed!");
            });
            this.events = [];  // 배열 비우기
        }

        // hitboxes 삭제
        if (this.hitboxes) {
            this.hitboxes.forEach(hitbox => {
                hitbox.destroy(); // hitbox를 삭제
            });
        }
        
        this.scene.time.delayedCall(100, () => {
            this.scene.m_mobs.remove(this);

            //console.log("m_mobs children entries:", this.scene.m_mobs.children.entries);

            this.destroy();
        });


        // 💡 update 이벤트 제거
        this.scene.events.off("update", this.update, this);

        // 추적 이벤트 제거
        // 💥 모든 타이머 이벤트를 삭제하여 더 이상 this.scene을 참조하지 않게 함
        //this.scene.time.removeAllEvents();

    }


}