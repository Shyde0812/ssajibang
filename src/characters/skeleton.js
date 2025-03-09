import mob from "./mob";



export default class skeleton extends mob {
    constructor(scene, x, y , name) {
        super(scene, x, y, name);

    }

    update() {
        if (this.m_isDead) return;
    
        super.update();
    
        
        //this.specialAttack();
    }

    walk() {
        this.play("skeleton_walk", true);
    }

    attack() {
        this.play("skeleton_attack", true);
    }

    revive() {
        this.play("skeleton_revive", true);
    }
}

