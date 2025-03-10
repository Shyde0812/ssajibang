import mob from "./mob";



export default class skeleton extends mob {
    constructor(scene, x, y , name) {
        super(scene, x, y, name);

        // Hitbox 생성 (zone 객체로, 물리 시스템에 추가)
        const AutoAttackhiboxConfig = {
            offsetX: 50,  // 공격 범위의 X 오프셋
            offsetY: 0,   // 공격 범위의 Y 오프셋
            width: 100,    // Hitbox의 너비
            height: 50     // Hitbox의 높이
        };

        // zone 생성 후 물리 시스템에 추가
        this.hitbox = this.scene.add.zone(
            this.x + AutoAttackhiboxConfig.offsetX,
            this.y + AutoAttackhiboxConfig.offsetY,
            AutoAttackhiboxConfig.width,
            AutoAttackhiboxConfig.height
        );

        this.hitbox = this.scene.physics.add.existing(this.hitbox , false);

        this.hitbox.setActive(false);
        this.hitbox.setVisible(false);

    }

    update() {
        if (this.m_isDead) return;
    
        super.update();
        
        //this.specialAttack();
    }

    idle() {
        this.play("skeleton_idle", true);
    }

    walk() {
        this.play("skeleton_walk", true);
    }

    attack() {
        // 기존 이벤트 리스너 제거 (중복 방지)
        this.off('animationcomplete-skeleton_attack');
        
        // 애니메이션 시작 전에 히트박스 활성화
        this.setHitboxActive(true);
        
        // 애니메이션 재생
        this.play("skeleton_attack", true);
        
        // 애니메이션 완료 이벤트 설정
        this.once('animationcomplete', function(animation) {
            if (animation.key === 'skeleton_attack') {
                this.setHitboxActive(false); // 히트박스 비활성화
                this.m_canMove = true;  // 이동 가능 상태로 변경
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
        
        if (distance < this.m_stopDistance) {
            this.m_canMove = false;
            this.m_canFlip = false;
            this.attack();
        }
    }

    setHitboxActive(active) {
        if (active) {
            // Hitbox 크기 및 위치 설정
            this.hitbox.setSize(100, 50);
            if(this.flipX) {
                this.hitbox.setPosition(this.x - 50, this.y);
            }
            else {
                this.hitbox.setPosition(this.x + 50, this.y);
            }
            
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

