import Phaser from "phaser";

export default class BHP_Img extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "bossHpbar");

        
        this.setScale(3 , 2);

        this.setDepth(20);
        scene.add.existing(this);
    }   
}