import mob from "../mob";

import { mobConfig } from "../../Config/mobConfig";



export default class skeleton extends mob {
    constructor(scene, x, y , name) {
        super(scene, x, y, name);
        
        this.mob = mobConfig[name];

        // Hitbox 생성 (zone 객체로, 물리 시스템에 추가)
        const AutoAttackhiboxConfig = {
            offsetX: 50,  // 공격 범위의 X 오프셋
            offsetY: 0,   // 공격 범위의 Y 오프셋
            width: 100,    // Hitbox의 너비
            height: 150     // Hitbox의 높이
        };

        // zone 생성 후 물리 시스템에 추가
        this.hitbox = this.scene.add.zone(
            this.x + AutoAttackhiboxConfig.offsetX,
            this.y + AutoAttackhiboxConfig.offsetY,
            AutoAttackhiboxConfig.width,
            AutoAttackhiboxConfig.height
        );
        this.hitbox = this.scene.physics.add.existing(this.hitbox , false);

        // 히트박스가 이미 데미지를 주었는지 여부를 추적하는 속성
        this.hitbox.hasDealtDamage = false;
        // Hitbox에 속성 추가하여 출처 스켈레톤을 저장
        this.hitbox.owner = this;

        this.hitbox.setActive(false);
        this.hitbox.setVisible(false);

    }

    update() {
        if (this.m_isDead) return;
    
        super.update();
        
        //this.specialAttack();
    }

    idle() {
        this.play("skeleton_idle", false);
    }

    walk() {
        this.play("skeleton_walk", true);
    }

    stun() {
        this.m_isStun = true;
        this.m_canMove = false;
        this.play("skeleton_stun", true);

        this.scene.time.addEvent({
            delay: 3 * 1000,
            callback: () => {
                if(!this.m_isDead) {
                    this.idle();
                    this.m_isStun = false;
                    this.m_canMove = true;  
                }
            },
            callbackScope: this, // this를 skeleton 객체로 유지
        });
    

    }

    attack() {
        // 기존 이벤트 리스너 제거 (중복 방지)
        this.off('animationcomplete-skeleton_attack');
        
        // 애니메이션 재생
        this.play("skeleton_attack", true);
        
        // hitbox 생성 타이밍
        this.on("animationupdate", (animation, frame) => {

            if (animation.key === "skeleton_attack" && frame.index === 8) {
                    
                    this.setHitboxActive(true);
                }

        }, this);
        
        // 애니메이션 완료 이벤트 설정
        this.once('animationcomplete', function(animation) {
            if (animation.key === 'skeleton_attack') {
                this.setHitboxActive(false); // 히트박스 비활성화
                this.m_canMove = true;  // 이동 가능 상태로 변경
                this.m_canFlip = true; 

            }
        }, this);  // this 컨텍스트 바인딩 추가
    }

    revive() {
        this.play("skeleton_revive", true);
    }

    death() {
        // 히트박스가 활성화된 상태라면 비활성화
        this.setHitboxActive(false);

        if (this.body instanceof Phaser.Physics.Arcade.Body) {
            this.body.setVelocity(0); // 안전한 방식
        }
        this.play("skeleton_death", true);

        this.once('animationcomplete', function(animation) {
            if (animation.key === 'skeleton_death') {
                this.scene.m_mobs.remove(this);

            //console.log("m_mobs children entries:", this.scene.m_mobs.children.entries);
            
            this.destroy();
            }
        }, this);  // this 컨텍스트 바인딩 추가
    }
    // Override
    controlMovement(distance) {
        if(this.m_isStun) return;

        let dx = Math.abs(this.x - this.scene.m_player.x);
        let dy = Math.abs(this.y - this.scene.m_player.y);
        
        if (distance < this.mob.stopDistance[0] && dy < this.mob.stopDistance[2]) {
            this.attack();
            this.m_canMove = false;
        }
    }

    setHitboxActive(active) {
        if (active) {
            // Hitbox 크기 및 위치 설정
            const offsetX = this.flipX ? -80 : 80; // 캐릭터 방향에 따라 hitbox 이동
            this.hitbox.setSize(100, 50);
            this.hitbox.setPosition(this.x + offsetX, this.y);

            // 히트박스 데미지 플래그 초기화
            this.hitbox.hasDealtDamage = false;
            
            // 히트박스 활성화
            this.hitbox.setActive(true);
            this.hitbox.setVisible(true);
            
            // 충돌 그룹에 추가
            if (!this.scene.m_mobAttackStatic.contains(this.hitbox)) {
                this.scene.m_mobAttackStatic.add(this.hitbox);
            }

        } else {
            // 히트박스 비활성화
            this.hitbox.setActive(false);
            this.hitbox.setVisible(false);
            
            
            // 그룹에서 제거
            this.scene.m_mobAttackStatic.remove(this.hitbox);
            
            // 그룹에 히트박스가 있는지 확인
            //console.log("히트박스가 그룹에 여전히 있는지:", this.scene.m_mobAttackStatic.contains(this.hitbox));
        }
    }

}

