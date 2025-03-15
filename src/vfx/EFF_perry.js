import Phaser from "phaser";

export default class EFF_perry extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, startingPosition, targetPosition, scale, duration) {

        // ✅ comboStack을 기반으로 다른 스프라이트 선택
        const effectKey = 'pl_perry'; // EFF_AA1, EFF_AA2, EFF_AA3...

        super(scene, startingPosition[0] , startingPosition[1], effectKey);
        console.log('pl_perry');

        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        scene.m_weaponPerry.add(this);
        //scene.m_scratchSound.play({ volum: 0.5 })

        // 히트박스 크기 조절 (원하는 대로 조정 가능)
        const hitboxWidth = 5 *scale;
        const hitboxHeight = 5 *scale;
        this.setBodySize(hitboxWidth, hitboxHeight);

        //this.setBodySize(50, 50);
        this.setDepth(30);

        this.duration = duration
        this.scale = scale;

        this.play(effectKey);

        const angle = Phaser.Math.Angle.Between(
            startingPosition[0], startingPosition[1], 
            targetPosition[0], targetPosition[1]
        );

        this.setRotation(angle); // 라디안 단위 적용
        this.setAngle(angle * (180 / Math.PI)); // degree 변환 후 적용 (시각적 요소)

        // 히트박스 오프셋 거리 계산 (플레이어로부터 얼마나 떨어질지)
        const offsetDistance = 50; // 필요에 따라 이 값 조정

        // 히트박스가 위치해야 할 지점 계산
        const offsetX = Math.cos(angle) * offsetDistance;
        const offsetY = Math.sin(angle) * offsetDistance;
        
        // 스프라이트 위치 설정 (캐릭터 중심에서 마우스 방향으로 이동)
        this.setPosition(startingPosition[0] + offsetX, startingPosition[1] + offsetY);


        // 공속에 맞게 사라지게
        scene.time.delayedCall(duration, () => {
            this.destroy();
        });

        

    }

}
