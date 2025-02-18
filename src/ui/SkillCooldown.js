import Phaser from "phaser";
import Config from "../Config";
import { clamp } from "../utils/math";

export default class SkillCooldown extends Phaser.GameObjects.Graphics {

    startCooldown(key, duration) {
        if(this.cooldowns[key]) return;
    }




}
