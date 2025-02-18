import Phaser from "phaser";

export default class EFF_AA extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, startingPosition, targetPosition, damge , scale, duration, comboStack) {

        // ✅ comboStack을 기반으로 다른 스프라이트 선택
        const effectKey = `EFF_AA${comboStack + 1}`; // EFF_AA1, EFF_AA2, EFF_AA3...

        super(scene, startingPosition[0] , startingPosition[1], effectKey);

        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        scene.m_weaponStatic.add(this);
        //scene.m_scratchSound.play({ volum: 0.5 })

        this.setBodySize(50, 50);
        this.setDepth(30);

        this.duration = duration
        this.m_damage = damge;
        this.scale = scale;

        this.play(effectKey);

        const angle = Phaser.Math.Angle.Between(
            startingPosition[0], startingPosition[1], 
            targetPosition[0], targetPosition[1]
        );

        this.setRotation(angle); // 라디안 단위 적용
        this.setAngle(angle * (180 / Math.PI)); // degree 변환 후 적용 (시각적 요소)

        // 공속에 맞게 사라지게
        scene.time.delayedCall(duration, () => {
            this.destroy();
        });

        

    }

}
