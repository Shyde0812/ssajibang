import boss from "./boss";



export default class Medusa extends boss {
    constructor(scene, x, y , name) {
        super(scene, x, y, name);

        this.stopDistance = 300;
        this.detectRange = 1000; // 보스바가 사라지는 거리

    }

    update() {
        if (this.m_isDead) return;

        super.update();

        const distance = Phaser.Math.Distance.Between(
            this.x, 
            this.y, 
            this.scene.m_player.x,
            this.scene.m_player.y
        );

        this.controlMovement(distance);
        this.controlhpBarVisible(distance);
        //this.specialAttack();
    }

    controlMovement(distance) {
        
        if (distance < this.stopDistance) {
            this.canMove = false;
        } else {
            this.canMove = true;
        }
    }

    controlhpBarVisible(distance) {
        // 일정 거리 이상이면 보스바 숨김
        if (this.m_hpBarVisible && distance > this.detectRange) {
            this.m_hpBarVisible = false;
        }
        // 일정 거리 이하면 보스바 다시 표시
        else if (!this.m_hpBarVisible && distance <= this.detectRange) {
            this.m_hpBarVisible = true;
        }

    }



    specialAttack() {
        if (Phaser.Math.Between(1, 100) > 98) {
            console.log("Medusa uses petrify!");
        }
    }
}