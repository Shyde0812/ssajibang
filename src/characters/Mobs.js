import Phaser from "phaser";
import Explosion from "../effects/Explosion";
import BossHpBar from "../ui/BossHpBar";
import { removeAttack } from '../utils/attackManager';


export default class Mob extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, animKey, initHp, dropRate) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.play(animKey);
        this.setDepth(10);
        this.scale = 2.5;

        this.m_speed = 50;
        this.m_hp = initHp;
        this.m_dropRate = dropRate;
        this.m_isDead = false;

        this.m_BosshpBar = new BossHpBar(scene , this.m_hp, "AshBrown");


        if (texture === "mob1") {
            this.setBodySize(24,14, false); // 충돌 영역 크기를 설정
            this.setOffset(0,14); // 충돌 영역이 스프라이트 아래쪽으로 14픽셀 이동
        }

        if (texture === "mob2") {
            this.setBodySize(24, 32);
        } 
        if (texture === "mob3") {
            this.setBodySize(24, 32);
        } 
        if (texture === "mob4") {
            this.setBodySize(24, 32);
        } 
        if (texture === "lion") {
            this.m_speed = 60;
            this.setBodySize(40, 64);
        }

        if (texture === "boss") {
            this.setBodySize(100, 150);
        }
        
        
        this.m_events = [];
        this.m_events.push(
            this.scene.time.addEvent({
                delay: 100,
                callback: () => {
                    scene.physics.moveToObject(this, scene.m_player, this.m_speed);
                    

                },
                loop: true,
            })
        )

        // phaser.Scene에는 update 함수가 있지만
        // Mob은 phaser.Physics.Arcade.Sprite를 상속한 클래스로 update 함수가 없다
        // scene의 update가 실행될 때마다 mob도 update 함수가 실행되게 구현해준 부분
        scene.events.on("update" , (time, delta) => {
            this.update(time, delta);
        });
        
        // 공격 받을 수 있는지 여부를 뜻하는 멤버 변수
        this.m_canBeAttacked = true;
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
        this.m_BosshpBar.decrease(damage);

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
        // 보스몬스터는 투명도 조절x 
        if (this.texture.key === "lion") return;

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

        if ( this.debugGraphics ) {
            this.debugGraphics.destroy();
            this.debugGraphics = null;
        }

        
        if (this.texture.key === "lion") {
            this.destroy();
        }

        else {
            this.destroy();
        }
    }


}