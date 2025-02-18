import Phaser from "phaser";
import Config from "../Config";
import Button from "../ui/Button";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");
        /*super("mainScene")는 다음을 수행합니다:

        부모 클래스 Phaser.Scene의 생성자를 호출합니다.
        "mainScene"이라는 키를 Phaser의 씬 매니저에 등록합니다.
        이 키를 통해 해당 씬을 참조하고 전환할 수 있습니다.*/
    }

    create() {
        // 배경색 채우기
        this.add.graphics()
            .fillStyle(0x493f2f)
            .fillRect(0, 0, Config.width, Config.height)
            .setScrollFactor(0);

        // 게임 제목 상단 추가
        this.add
            .bitmapText(Config.width / 2, Config.height / 4, "pixelFont", "ASH BROWN!", 60)
            .setOrigin(0.5);

        // 움직이는 캐릭터 가운데 추가
        this.add
            .sprite(Config.width / 2, Config.height / 2, "player_idle")
            .setScale(4)
            .play("player_idle");

        // 게임 시작 버튼 하단에 추가
        // 버튼 누르면 PlayingScene으로 이동하도록 callback을 전달
        new Button(
            Config.width / 2,
            Config.height / 2 + 150,
            "Start Game",
            this,
            () => this.scene.start("playGame")
        );
    }
}