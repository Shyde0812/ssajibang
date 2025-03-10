import Phaser from "phaser";
import Config from "../Config";
//import hpBar from "../ui/hpBar";

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

        // ✅ 애니메이션 이벤트 리스너를 여기서 등록
        // ..update에서만 set~~ 해주면 start와 complete때 hitbox 흔들리는 현상 ---> start , complete 추가해서 수정
        this.on("animationupdate", (anim) => {
            //console.log("애니메이션 업데이트 실행됨:", anim.key);
    
            let config = this.animationHitboxConfig[anim.key];
            if (config) {
                this.setBodySize(config.width, config.height);
                this.setOffset(config.offsetX, config.offsetY);
                //console.log(config.width, config.height);
            }
        });
    
        this.on("animationstart", (anim) => {
            //console.log("애니메이션 시작 실행됨:", anim.key);
    
            let config = this.animationHitboxConfig[anim.key];
            if (config) {
                this.setBodySize(config.width, config.height);
                this.setOffset(config.offsetX, config.offsetY);
                //console.log(config.width, config.height);
            }
        });
    
        this.on("animationcomplete", (anim) => {
            //console.log("애니메이션 끝 실행됨:", anim.key);
    
            let config = this.animationHitboxConfig[anim.key];
            if (config) {
                this.setBodySize(config.width, config.height);
                this.setOffset(config.offsetX, config.offsetY);
                //console.log(config.width, config.height);
            }
        });

        this.scale=1.75;
        this.setBodySize(18,50);
        
        // [ State ]
        // ..move
        this.m_moving = false;

        // ..attack
        this.m_attacking = false;

        // ..Damaged
        this.m_canBeAttacked = true;

        // ..all action
        this.m_action = false;
        if(this.m_moving || this.m_attacking){
            this.m_action = true;
        }
        else {
            this.m_action = false;
        }

        // [ Stat ]
        this.attackSpeed = 5;
        
        
        // scene , player , maxhp
        //this.m_hpBar = new hpBar(scene , 100);


    }

    hitByStatic(damage) {
        if (!this.m_canBeAttacked) return;

        //this.scene.m_hurtSound.play();

        // 쿨타임을 갖습니다. (Mob에도 똑같이 있음)
        this.getCooldown();

        //this.m_hpBar.decrease(damage);

        // if(this.m_hpBar.currentHp <= 0) {
        //     console.log("die");
        //     //loseGame(this.scene);
        // }


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