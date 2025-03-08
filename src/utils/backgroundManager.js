import Config from "../Config";

import { mapConfig } from '../Config/mapConfig';
/**
 * scene의 배경화면을 설정하는 함수
 * @param {Phaser.Scene} scene
 * @param {string} backgroundTexture
 */
export function setBackground(scene, backgroundTexture) {
    // tileSprite : 게임 화면이 background image보다 클 시 타일처럼 다닥다닥 붙여서 보여주는 이미지
    // (CSS의 background-repeat: repeat; 같은 느낌)
    // setOrigin : 원점(0, 0)의 위치를 설정해주는 함수
    scene.m_background = scene.add.tileSprite(
        0,
        0,
        Config.width,
        Config.height,
        backgroundTexture
    ).setOrigin(0, 0);
}

export function setTilemapBackground(scene, tilemapKey) {
    // Tiled에서 가져온 tilemap을 생성합니다.
    const map = scene.make.tilemap({ key: tilemapKey });

    // mapConfig에서 현재 맵의 레이어 정보를 가져옵니다.
    const mapData = mapConfig[tilemapKey];

    
    // widthInPixels , heightInPixels = tilemap API 에서 제공하는 속성
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;


    // 레이어들을 동적으로 생성
    mapData.layers.forEach(layer => {

        // 레이어별로 타일셋을 추가
        const tileset = map.addTilesetImage(layer.tilesetName, layer.tilesetKey);
        // 레이어를 생성하고 배경으로 설정
        const backgroundLayer = map.createLayer(layer.name, tileset, 0, 0);

        if (layer.name === mapData.collisionLayer) {
            // 해당 레이어의 모든 타일에 충돌 설정
            backgroundLayer.setCollisionByExclusion([-1]); // -1은 빈 타일
            scene.collisionLayer = backgroundLayer; // 씬에 충돌 레이어 참조 저장
        }

        // 각 레이어를 scene에 저장하여 관리할 수 있게 설정
        scene[layer.name] = backgroundLayer;

        // 배경 레이어를 맨 뒤로 보냅니다.
        scene.children.sendToBack(backgroundLayer);

        // const offsetX = (Config.width - mapWidth) / 2; // ex) (1920 - 1600) / 2 = 160px
        // const offsetY = (Config.height - mapHeight) / 2;

        // backgroundLayer.setPosition(offsetX, offsetY); // 배경 레이어를 중앙으로 이동
    });

    scene.cameras.main.setBounds(0, 0, mapWidth, mapHeight); // 카메라의 이동 범위 제한
    scene.map = map;
}
