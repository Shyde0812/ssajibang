import Mob from "./Mob";

export default class Medusa extends Mob {
    constructor(scene, x, y , name) {
        super(scene, x, y, name);
    }


    update() {
        super.update();
        this.specialAttack();
    }

    specialAttack() {
        if (Phaser.Math.Between(1, 100) > 98) {
            console.log("Medusa uses petrify!");
        }
    }
}