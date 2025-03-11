import { clamp } from "../utils/math";

export default class HpBar {
    constructor(scene, mob) {

        this.mob = mob; // 체력바가 따라갈 몬스터

        this.barWidth = this.mob.m_width * 2;
        this.barHeight = 5;
        this.offsetX = -this.mob.m_width / 2;
        this.offsetY = this.mob.m_height / 2;

        // 배경 바
        this.healthBarBg = scene.add.graphics();
        this.healthBarBg.fillStyle(0x200a01); // dark red
        this.healthBarBg.fillRect(
            this.offsetX, 
            this.offsetY, 
            this.barWidth, 
            this.barHeight
        );

        // 초록색 체력 바
        this.healthBarFill = scene.add.graphics();
        this.updateHealth(mob.m_hp);


    }

    // HP를 감소시키고 HP bar를 다시 그리는 메소드입니다.
    decrease(amount) {
        this.mob.m_hp = clamp(this.mob.m_hp - amount, 0, this.mob.m_maxHp);
        this.updateHealth(this.mob.m_hp);
    }
    
    
    updateHealth(currentHp) {
        let healthWidth = (currentHp / this.mob.m_maxHp) * this.barWidth;

        this.healthBarFill.clear();
        this.healthBarFill.fillStyle(0xa53b28); // red
        this.healthBarFill.fillRect(
            this.offsetX, 
            this.offsetY, 
            healthWidth, 
            this.barHeight
        );
    }

    updatePosition() {
        this.healthBarBg.setPosition(this.mob.x + this.offsetX, this.mob.y + this.offsetY);
        this.healthBarFill.setPosition(this.mob.x + this.offsetX, this.mob.y + this.offsetY);
    }

    setVisible(isVisible) {
        this.healthBarBg.setVisible(isVisible);
        this.healthBarFill.setVisible(isVisible);
    }

    destroy() {
        this.healthBarBg.destroy();
        this.healthBarFill.destroy();
    }
}