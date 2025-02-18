import Phaser from 'phaser';

export default class Beam extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, startingPosition, damage, scale) {
        super(scene, startingPosition[0], startingPosition[1], "beam")

        this.SPEED = 100;
        this.DURATION = 1500;

        scene.add.existing(this); // 씬에 객체 추가
        scene.physics.world.enableBody(this); // 물리 엔진 활성화
        scene.m_weaponDynamic.add(this); // 발사체를 그룹에 추가
        scene.m_beamSound.play();

        this.m_damage = damage;
        this.scale = scale;
        this.setDepth(30);
        this.setVelocity();
        this.setAngle();

        scene.time.addEvent({
            delay: this.DURATION,
            callback: () => {
                this.destroy()
            },
            loop: false,
        });
    }

    setVelocity() {
        if(!this.scene.m_closest) {
            this.setVelocity(-250); // 목표가 없으면 발사체가 위로 이동
            return;
        }

        const _x = this.scene.m_closest.x - this.x;
        const _y = this.scene.m_closest.y - this.y;
        const _r = Math.sqrt(_x * _x + _y * _y) / 2;
        this.body.velocity.x = (_x / _r) * this.SPEED;
        this.body.velocity.y = (_y / _r) * this.SPEED;
    }

    setAngle() {
        const angleToMob = Phaser.Math.Angle.Between(
            this.x,
            this.y,
            this.scene.m_closest.x,
            this.scene.m_closest.y
        );
            
        // beam 이미지의 각도를 설정해주는 부분
        // 다음 문을 각각 주석해제 한뒤 beam 모습 확인 ㄱㄱ
        //this.rotation = angleToMob;
        //this.rotation = angleToMob + Math.PI;
        this.rotation = angleToMob + Math.PI / 2 + Math.PI / 4;

        this.body.setAngularVelocity(0); // 회전속도
    }

    setDamage(damage) {
        this.m_damage = damage;
    }
}