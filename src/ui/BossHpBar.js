import Phaser from "phaser";
import Config from "../Config";
import BHP from "./BHP_Img";
import { clamp } from "../utils/math";

export default class BossHpBar extends Phaser.GameObjects.Container {

    // HP bar를 추가할 scene, 위치를 위한 camera, 최대 HP 값인 maxHp를 파라미터로 전달받습니다.
    constructor(scene, maxHp, bossName) {
        super(scene ,Config.width / 2, Config.height / 8);

        // // HP Bar의 width, height, border를 설정해줍니다.
        // this.WIDTH = Config.width / 2;
        // this.HEIGHT = 18
        // // (m_x, m_y)로 HP bar의 맨 왼쪽 위 지점을 지정합니다.
        // this.m_x = Config.width / 4;
        // this.m_y = Config.height / 8

        // 최대 HP, 현재 HP 값을 저장할 멤버 변수를 만들어줍니다.
        // 처음에는 HP가 최대입니다.
        this.m_maxHp = maxHp;
        this.m_currentHp = maxHp;
        this.m_bossName = bossName;

        // 체력바 PNG 스프라이트 추가 (BHP_Img 사용) ( 900 , 60 )
        this.hpBarSprite = new BHP(scene, 0, 0); // Container의 (0, 0) 위치에 스프라이트 추가
        this.add(this.hpBarSprite); // Container에 스프라이트 추가

        // 체력바 내부의 HP 표시를 위한 Graphics 추가
        this.hpFill = scene.add.graphics();
        this.add(this.hpFill);

        // 텍스트
        const barHeight = this.hpBarSprite.height * this.hpBarSprite.scaleY;
        const barWidth = this.hpBarSprite.width * this.hpBarSprite.scaleX;

        // 보스 이름과 체력 텍스트
        this.bossNameText = scene.add.text(
            0, 
            -barHeight / 2,
            this.m_bossName, 
            { fontSize: '25px', fill: '#fff', fontFamily: "pixelFont" })
            .setOrigin(0.5, 0)
            .setScrollFactor(0)
            .setDepth(22);
        
        this.hpText = scene.add.text(
            0, 
            -barHeight / 4,
            `${this.m_currentHp} / ${this.m_maxHp}`, 
            { fontSize: '12px', fill: '#fff', fontFamily: "pixelFont" })
            .setOrigin(0.5, 0)
            .setScrollFactor(0)
            .setDepth(22);

        // 체력바 배율 텍스트 (예: x2)
        let scaleFactor = Math.ceil(this.m_currentHp / 100);
        this.scaleText = scene.add.text(
            barWidth - 20, 
            0, 
            `x${scaleFactor}`, 
            { fontSize: '12px', fill: '#fff', fontFamily: "pixelFont" })
            .setScrollFactor(0)
            .setDepth(22);  

        // 모든 자식을 Container에 추가
        this.add([this.bossNameText, this.hpText, this.scaleText]);

        // setScrollFactor는 화면이 이동해도 오브젝트의 위치가 고정되어 보이게 하는 함수입니다.
        this.setScrollFactor(0); // 화면에 고정
        this.setDepth(21);
        //this.setOrigin(0.5, 0); // Container 자체를 중앙 정렬

        scene.add.existing(this);
            
        this.draw();

    }

    // HP를 증가시키고 HP bar를 다시 그리는 메소드입니다.
    increase(amount) {
        this.m_currentHp = clamp(this.m_currentHp + amount, 0, this.m_maxHp);
        this.draw();
    }

    // HP를 감소시키고 HP bar를 다시 그리는 메소드입니다.
    decrease(amount) {
        this.m_currentHp = clamp(this.m_currentHp - amount, 0, this.m_maxHp);
        this.draw();
    }

    // HP bar를 실제로 화면에 그려주는 메소드입니다.
    draw() {
        // 이전에 그렸던 HP bar는 지워줍니다.
        this.hpFill.clear();

        const barWidth = this.hpBarSprite.width * this.hpBarSprite.scaleX;
        const barHeight = this.hpBarSprite.height * this.hpBarSprite.scaleY;

        // this.hpFill.fillStyle(0x21050c); // dark_red
        // this.hpFill.fillRect(
        //     -barWidth / 2, 
        //     0, 
        //     barWidth, // 스케일 고려
        //     barHeight //* this.hpBarSprite.scaleY
        // );

        // 총 HP가 100, 남은 HP가 n이라면 흰 HP 배경에서
        // 왼쪽에서부터 n%만 빨간색 또는 초록색 사각형을 그려줍니다.
        let hpWidth = Math.floor(
            (this.m_currentHp / this.m_maxHp) * (barWidth * (7 / 8))
        );
        //console.log(d);
        this.hpFill.fillStyle(0xcc0e3b); // red
        this.hpFill.fillRect(
            -barWidth / 2 + 60,
            -barHeight / 4,
            hpWidth,
            barHeight / 4 //* this.hpBarSprite.scaleY
        );

        this.hpText.setText(`${this.m_currentHp} / ${this.m_maxHp}`);

        // 체력바 배율 텍스트 업데이트
        let scaleFactor = Math.ceil(this.m_currentHp / 100);
        this.scaleText.setText(`x${scaleFactor}`);
    }   
}