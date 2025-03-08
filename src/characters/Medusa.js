import Mob from "./Mob";



export default class Medusa extends Mob {
    constructor(scene, x, y , name) {
        super(scene, x, y, name);
        this.stopDistance = 300;

    }

    update() {
        if (this.m_isDead) return;

        super.update();

        this.controlMovement();
        //this.specialAttack();
    }

    controlMovement() {
        const distance = Phaser.Math.Distance.Between(
            this.x, 
            this.y, 
            this.scene.m_player.x, 
            this.scene.m_player.y
        );
        
        if (distance < this.stopDistance) {
            this.canMove = false;
        } else {
            this.canMove = true;
        }
    }

    specialAttack() {
        if (Phaser.Math.Between(1, 100) > 98) {
            console.log("Medusa uses petrify!");
        }
    }
}