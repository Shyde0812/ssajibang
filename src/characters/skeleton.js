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
        this.hitbox = this.scene.physics.add.existing(
            this.scene.add.zone(
                this.x + AutoAttackhiboxConfig.offsetX,
                this.y + AutoAttackhiboxConfig.offsetY,
                AutoAttackhiboxConfig.width,
                AutoAttackhiboxConfig.height
            ),
            false
        );
        this.hitbox.setVisible(false);  // 기본적으로 Hitbox는 보이지 않도록 설정

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
        this.play("skeleton_attack", true);
        this.setHitboxActive(true);  // 공격 시 Hitbox 활성화

        this.once('animationcomplete-skeleton_attack', () => {
            this.setHitboxActive(false); // 애니메이션이 끝나면 Hitbox 비활성화
            this.m_canMove = true;  // 애니메이션이 끝난 후 이동 가능
        });
    }

    revive() {
        this.play("skeleton_revive", true);
    }

    death() {
        this.play("skeleton_death", true);
    }
    // Override
    controlMovement(distance) {
        
        if (distance < this.m_stopDistance) {
            this.m_canMove = false;
            this.attack();
        }
    }

    setHitboxActive(active) {
        if (active) {
            this.scene.m_mobAttackStatic.add(this.hitbox);
            console.log(this.scene.m_mobAttackStatic.children.entries);
            // Hitbox 크기 및 위치 설정
            this.hitbox.setSize(100, 50);
            if(this.flipX) {
                this.hitbox.setPosition(this.x + 50, this.y); // 예시: 공격 위치에 맞게 설정
            }
            else {
                this.hitbox.setPosition(this.x - 50, this.y); // 예시: 공격 위치에 맞게 설정
            }

            this.hitbox.setActive(true);
            this.hitbox.setVisible(true);
        } else {
            this.hitbox.setActive(false);
            this.hitbox.setVisible(false);
        }
    }

}

