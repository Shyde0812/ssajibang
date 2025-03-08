import Phaser from "phaser";
import { mobConfig } from "../Config/mobConfig";

import Explosion from "../effects/Explosion";

// import BossHpBar from "../ui/BossHpBar";
// import { removeAttack } from '../utils/attackManager';


export default class Mob extends Phaser.Physics.Arcade.Sprite {
    
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
    }

    initPhysics() {
        if (this.config.bodySize) {
            this.setBodySize(this.config.bodySize[0] , this.config.bodySize[1]);
        }
    }

    initAnimation() {
        if (this.config.animation) {
            this.play(this.config.animation[0].key);
        }
    }

    initMovement() {
        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.scene.physics.moveToObject(this, this.scene.m_player, this.m_speed);
            },
            loop: true,
        });
    }

    update() {
        // ?
        if (!this.body) return;

        // 바라 보는 방향이다.
        if (this.x < this.scene.m_player.x) this.flipX = true;
        else this.flipX = false;

        // HP 가 0 이하 이고, 죽은 적이 없으면 죽습니다.
        if ( this.m_hp <= 0 && !this.m_isDead) {
            this.die();
        }
        
    }

    // mob이 static attack에 맞을 경우 실행되는 함수
    hitByStatic(damage, duration) {
        
        if (!this.m_canBeAttacked) return;

        this.scene.m_hitMobSound.play();

        this.m_hp -= damage;
        //this.m_BosshpBar.decrease(damage);

        // DEBUG
        //console.log("hit");
        //console.log(this.m_hp);
        //console.log(weapon);

        //weapon.destroy();
        //removeAttack(this.scene, weapon);

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

        // 추적 이벤트 제거
        this.scene.time.removeEvent(this.m_events);

    }


}