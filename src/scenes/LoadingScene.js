import Phaser from "phaser";
// maps
import { mapConfig } from '../Config/mapConfig';
// font
import fontPng from "../assets/font/font.png";
import fontXml from "../assets/font/font.xml";

// maps
// import mapTileSet from "../assets/maps/Floor2.png";
// import mapJson from "../assets/maps/map.json";

// import bossmapTileSet from "../assets/maps/MainLev2.0.png";
// import bossmapJson from "../assets/maps/bossMap.json";

// images
import beamImg from "../assets/images/beam.png";

import bgImg from "../assets/images/background.png";

// spritesheets
// ..player
import player_idleImg from "../assets/spritesheets/player/player_idle.png";
import player_runImg from "../assets/spritesheets/player/player_run.png";
import player_attackImg from "../assets/spritesheets/player/player_attack.png";

import pl_AA1Img from "../assets/spritesheets/player/pl_AA1.png";
import pl_AA2Img from "../assets/spritesheets/player/pl_AA2.png";
import pl_AA3Img from "../assets/spritesheets/player/pl_AA3.png";

// ..boss
import boss_idleImg from "../assets/spritesheets/boss/boss_idle.png";

// ..effect
import EFF_AA1Img from "../assets/spritesheets/effect/EFF_AA1.png";
import EFF_AA2Img from "../assets/spritesheets/effect/EFF_AA2.png";
import EFF_AA3Img from "../assets/spritesheets/effect/EFF_AA3.png";


import explosionImg from "../assets/spritesheets/explosion.png";

// ui
import BossHpBarImg from "../assets/ui/BossHpBar.png";



// sound
import beamOgg from "../assets/sounds/beam.ogg";
import scratchOgg from "../assets/sounds/scratch.ogg";
import hitMobOgg from "../assets/sounds/hitMob.ogg";
import growlOgg from "../assets/sounds/growl.ogg";
import explosionOgg from "../assets/sounds/explosion.ogg";
import hurtOgg from "../assets/sounds/hurt.ogg";
import expUpOgg from "../assets/sounds/expUp.ogg";
import nextLevelOgg from "../assets/sounds/nextLevel.ogg"
import gameOverOgg from "../assets/sounds/gameover.ogg";
import gameClearOgg from "../assets/sounds/gameClear.ogg";
import pauseInOgg from "../assets/sounds/pauseIn.ogg";
import pauseOutOgg from "../assets/sounds/pauseOut.ogg";






export default class LoadingScene extends Phaser.Scene {
    constructor() {
        // super 에 파라미터로 넘겨주는 string이 해당 scene의 key(identifier)가 됩니다.
        super("bootGame");
    }

    preload() {
        
        // FONTS
        this.load.bitmapFont("pixelFont", fontPng, fontXml);

        // MAPS
        // this.load.image('map_tiles', mapTileSet);
        // this.load.tilemapTiledJSON('map', mapJson);

        // this.load.image('bossmap_tiles', mapTileSet);
        // this.load.tilemapTiledJSON('bossmap', mapJson);

        for (const mapKey in mapConfig) {
            this.load.image(`${mapKey}_tiles`, mapConfig[mapKey].tileset);
            this.load.tilemapTiledJSON(mapKey, mapConfig[mapKey].json);
        }

        // IMAGES
        this.load.image('beam', beamImg);

        this.load.image('bg', bgImg);

        // ui
        this.load.image('bossHpbar' , BossHpBarImg);



        // SPRITE_SHEETS
        // Player
        this.load.spritesheet('player_idle', 
            player_idleImg, {
              frameWidth: 70,
              frameHeight: 60
        });

        this.load.spritesheet('player_run', 
            player_runImg, {
              frameWidth: 70,
              frameHeight: 60
        });

        this.load.spritesheet('player_attack', 
            player_attackImg, {
              frameWidth: 100,
              frameHeight: 65
        });

        this.load.spritesheet('pl_AA1', // AutoAttack
            pl_AA1Img, {
              frameWidth: 80,
              frameHeight: 60
        });

        this.load.spritesheet('pl_AA2', // AutoAttack
            pl_AA2Img, {
              frameWidth: 80,
              frameHeight: 60
        });

        this.load.spritesheet('pl_AA3', // AutoAttack
            pl_AA3Img, {
              frameWidth: 80,
              frameHeight: 60
        });

        

        // EFFECT
        this.load.spritesheet("EFF_AA1" , EFF_AA1Img, {
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet("EFF_AA2" , EFF_AA2Img, {
            frameWidth: 100,
            frameHeight: 100,
        });

        this.load.spritesheet("EFF_AA3" , EFF_AA3Img, {
            frameWidth: 100,
            frameHeight: 100,
        });

        // MOB
        this.load.spritesheet("boss_idle", boss_idleImg, {
            frameWidth: 100,
            frameHeight: 150,
        });


        this.load.spritesheet("explosion", explosionImg, {
            frameWidth: 32,
            frameHeight: 32,
        });

        

        // AUDIOS
        this.load.audio("audio_beam", beamOgg);
        this.load.audio("audio_scratch", scratchOgg);
        this.load.audio("audio_hitMob", hitMobOgg);
        this.load.audio("audio_growl", growlOgg);
        this.load.audio("audio_explosion", explosionOgg);
        this.load.audio("audio_expUp", expUpOgg);
        this.load.audio("audio_hurt", hurtOgg);
        this.load.audio("audio_nextLevel", nextLevelOgg);
        this.load.audio("audio_gameOver", gameOverOgg);
        this.load.audio("audio_gameClear", gameClearOgg);
        this.load.audio("audio_pauseIn", pauseInOgg);
        this.load.audio("audio_pauseOut", pauseOutOgg);
    }

    create() { // 생각 해보니 배경을 여기서 create할 필요가 없음
        
        // FONTS
        this.add.text(20, 20, "Loading game...");



        // ANIMATIONS

        // ..PLAYER
        this.anims.create({
            key : "player_idle",
            frames: this.anims.generateFrameNumbers("player_idle"),
            frameRate: 3, // 1초에 3장면
            repeat: -1,
        });

        this.anims.create({
            key: "player_run",
            frames: this.anims.generateFrameNumbers("player_run"),
            frameRate: 4, 
            repeat: -1,
        });

        this.anims.create({
            key: "player_attack",
            frames: this.anims.generateFrameNumbers("player_attack"),
            frameRate: 3, // 3 = 1s
            repeat: 0,
        });

        this.anims.create({
            key: "pl_AA1",
            frames: this.anims.generateFrameNumbers("pl_AA1"),
            frameRate: 4, // 4 = 1s
            repeat: 0,
        });

        this.anims.create({
            key: "pl_AA2",
            frames: this.anims.generateFrameNumbers("pl_AA2"),
            frameRate: 4, // 4 = 1s
            repeat: 0,
        });

        this.anims.create({
            key: "pl_AA3",
            frames: this.anims.generateFrameNumbers("pl_AA3"),
            frameRate: 4, // 4 = 1s
            repeat: 0,
        });

        // ..EFFECT
        this.anims.create({
            key: "EFF_AA1",
            frames: this.anims.generateFrameNames("EFF_AA1"),
            frameRate: 40,
            end: 0,
        });

        this.anims.create({
            key: "EFF_AA2",
            frames: this.anims.generateFrameNames("EFF_AA2"),
            frameRate: 40,
            end: 0,
        });

        this.anims.create({
            key: "EFF_AA3",
            frames: this.anims.generateFrameNames("EFF_AA3"),
            frameRate: 40,
            end: 0,
        });

        // ..BOSS
        this.anims.create({
            key: "boss_idle",
            frames: this.anims.generateFrameNumbers("boss_idle"),
            frameRate: 2,
            repeat: -1,
        });


        // ..MOB

        // ..EFFECT
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true, // 애니메이션이 재생된뒤 스프라이트가 화면에서 사라짐
        });



        // ATTACKS
        
        
        // 메인씬 시작
        this.scene.start("mainScene");





    }
}