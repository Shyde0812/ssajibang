import Phaser from "phaser";
import { mobConfig } from "../Config/mobConfig";

import Explosion from "../effects/Explosion";

 import BossHpBar from "../ui/BossHpBar";
// import { removeAttack } from '../utils/attackManager';


export default class boss extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y, name) {

        // mobConfig에서 해당 몹의 설정 가져오기
        const config = mobConfig[name] || {};
        
        // 스프라이트 키를 config에서 가져오거나, 없으면 기본값으로 name 사용
        const spriteKey = config.sprite || name;

        super(scene, x, y, spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

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

    initProperties() {
        this.scale = this.config.scale || 1;
        this.m_speed = this.config.speed || 50;
        this.m_hp = this.config.hp || 100;
        this.m_isDead = false;
        this.m_canBeAttacked = true;

        this.m_moveDelay = this.config.moveDelay || 100;

        this.m_hpBarVisible = false;
        this.m_hpBar = this.config.hpBar || "normal";
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
            this.play(this.config.animation[0].key);
        }
    }

    initMovement() {
        this.canMove = true;

        this.scene.time.addEvent({
            delay: this.m_moveDelay,
            callback: () => {
                if (this.canMove) { // canMove가 true일 때만 이동
                    this.scene.physics.moveToObject(this, this.scene.m_player, this.m_speed);
                } else {
                    if (this.body instanceof Phaser.Physics.Arcade.Body) {
                        this.body.setVelocity(0); // 안전한 방식
                    }
                }
            },
            loop: true,
        });
    }

    initHpBar(scene) {
        if (this.m_hpBar === "boss") {
            this.m_BosshpBar = new BossHpBar(scene , this.m_hp, "AshBrown");

        }
    }

    update() {
        // ?
        if (this.m_isDead) return;

        // 히트박스들의 위치 업데이트
        if (this.hitboxes) {
            for (let i = 0; i < this.hitboxes.length; i++) {
                const hitboxConfig = this.config.complexHitbox[i];
                this.hitboxes[i].x = this.x + hitboxConfig.offsetX;
                this.hitboxes[i].y = this.y + hitboxConfig.offsetY;
            }
        }

        // 바라 보는 방향이다.
        if (this.x < this.scene.m_player.x) this.flipX = true;
        else this.flipX = false;

        // HP 가 0 이하 이고, 죽은 적이 없으면 죽습니다.
        if ( this.m_hp <= 0 && !this.m_isDead) {
            this.die();
        }

        // 보스 체력바
        if(this.m_hpBarVisible) {
            this.m_BosshpBar.setVisible(true);
        } else {
            this.m_BosshpBar.setVisible(false);
        }

        
    }

    // mob이 static attack에 맞을 경우 실행되는 함수
    hitByStatic(damage, duration) {
        if (!this.m_canBeAttacked) return;

        this.m_hpBarVisible = true;
        this.scene.m_hitMobSound.play();

        this.m_hp -= damage;

        this.m_BosshpBar.decrease(damage);
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

        this.m_hpBarVisible = false;
        this.m_BosshpBar.setVisible(false);

        new Explosion(this.scene, this.x, this.y);
        this.scene.m_explosionSound.play();

        this.scene.time.delayedCall(100, () => {
            this.destroy();
        });

        // 추적 이벤트 제거
        // 💥 모든 타이머 이벤트를 삭제하여 더 이상 this.scene을 참조하지 않게 함
        this.scene.time.removeAllEvents();


    }


}