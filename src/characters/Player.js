import Phaser from "phaser";
import Config from "../Config";
import hpBar from "../ui/hpBar";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene) {

        // 화면의 가운데에 player를 추가합니다.
        // scene.add.existing : scene에 오브젝트를 추가
        // scene.phsyics.add.existing : scene의 물리엔진에 오브젝트를 추가 
        super(scene, scene.map.Width / 2 , scene.map.Height / 2 , "player_idle");
        scene.add.existing(this);
        scene.physics.add.existing(this);



        // ANIMATION CONFIGURATION
        this.animationHitboxConfig = {
            player_idle: { width: 25, height: 40, offsetX: (80 / 2) - 15, offsetY: 10 },
            player_run: { width: 18, height: 50, offsetX: (60 / 2) - 10, offsetY: 2 },
            //player_attack: { width: 18, height: 50, offsetX: ( 100 / 2 ) - 10 , offsetY: 10 },
            pl_AA1: { width: 18, height: 50, offsetX: ( 80 / 2 ) - 10 , offsetY: 10 },
            pl_AA2: { width: 18, height: 50, offsetX: ( 80 / 2 ) - 10 , offsetY: 10 },
        };

        // ✅ 애니메이션 이벤트 리스너 추가
        this.on("animationstart", this.updateHitbox, this);
        this.on("animationupdate", this.updateHitbox, this);
        this.on("animationcomplete", this.updateHitbox, this);

        this.scale=1.75;
        this.setBodySize(18,50);
        
        // [ State ]
        // ..move
        this.m_moving = false;

        // ..anim
        this.m_anim = "null";

        // ..attack
        this.m_attacking = false;

        // ..parrying
        this.m_parrying = false;

        // ..Damaged
        this.m_canBeAttacked = true;

        // ..all action
        this.m_action = this.m_moving || this.m_attacking || this.m_parrying;

        // [ Stat ]
        this.attackSpeed = 5;
        this.m_maxHp = 100;
        this.m_hp = this.m_maxHp;

        // ✅ 초기 크기 설정
        let defaultAnim = this.animationHitboxConfig["player_idle"];
        this.m_width = defaultAnim.width;
        this.m_height = defaultAnim.height;

        this.m_hpBar = new hpBar(scene , this);

        scene.events.on("update", (time, delta) => 
            this.update(time, delta),
        );

    }
    update() {
        this.m_hpBar.updatePosition();
    }

    updateHitbox(anim) {
        let config = this.animationHitboxConfig[anim.key];
        if (config) {
            this.setBodySize(config.width, config.height);
            this.setOffset(config.offsetX, config.offsetY);

            // ✅ 애니메이션 변경 시 크기 업데이트
            this.m_width = config.width;
            this.m_height = config.height;

            // ✅ 체력바 위치 업데이트
            this.m_hpBar.updatePosition();
        }
    }


    hitByStatic(damage) {
        if (!this.m_canBeAttacked) return;

        //this.scene.m_hurtSound.play();

        // 쿨타임을 갖습니다. (Mob에도 똑같이 있음)
        this.getCooldown();

        this.m_hpBar.decrease(damage);

        if(this.m_hp <= 0) {
            console.log("die");
        //     //loseGame(this.scene);
        }


    }

    // 공격바은 후 1초 쿨타임
    // 공격 받을 수 있는 여부 or 투명도 조절
    getCooldown() {
        this.m_canBeAttacked = false;
        this.alpha = 0.5;
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.alpha = 1;
                this.m_canBeAttacked = true;
            },
            callbackScope: this,
            loop: false,
        });
    }

}