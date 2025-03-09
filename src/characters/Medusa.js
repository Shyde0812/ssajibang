import mob from "./mob";

import mobFactory from '../utils/mobFactory';

export default class Medusa extends mob {
    constructor(scene, x, y , name) {
        super(scene, x, y, name);

        this.specialAttackTimer = scene.time.addEvent({
            delay: 10 * 1000, // 10초마다 실행
            callback: this.specialAttack,
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (this.m_isDead) return;

        super.update();

        //this.specialAttack();
    }


    useRandomSkill() {
        const skills = [this.summonSkeletons]; // 앞으로 추가할 다른 스킬도 여기에 넣으면 됨
        const randomSkill = Phaser.Math.RND.pick(skills);
        randomSkill.call(this);
    }

    summonSkeletons() {
        console.log("Medusa summons two Skeletons!");
        
        const leftX = this.x - 50;
        const rightX = this.x + 50;
        const y = this.y;

        mobFactory.createMob(this.scene, "skeleton", leftX, y);
        mobFactory.createMob(this.scene, "skeleton", rightX, y);
    }
}