import Config from "../Config";

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

export function setTilemapBackground(scene, tilemapKey, tilesetName, tilesetKey, backgroundLayerName) {
    // Tiled에서 가져온 tilemap을 생성합니다.
    const map = scene.make.tilemap({ key: tilemapKey });

    // 타일셋을 추가합니다.
    const tileset = map.addTilesetImage(tilesetName , tilesetKey);

    // Tiled에서 배경 레이어를 생성합니다.
    const backgroundLayer = map.createLayer(backgroundLayerName, tileset, 0, 0);

    // 배경 레이어를 저장해 두어 필요할 때 관리할 수 있도록 합니다.
    scene.m_background = backgroundLayer;

    // 배경 레이어를 맨 뒤로 보냅니다.
    scene.children.sendToBack(backgroundLayer);

    // widthInPixels , heightInPixels = tilemap API 에서 제공하는 속성
    // 타일의 크기와 타일의 개수를 곱해서 자동으로 계산
    const mapWidth = map.widthInPixels;
    const mapHeight = map.heightInPixels;

    scene.cameras.main.setBounds(0, 0, mapWidth, mapHeight); // 카메라의 이동 범위 제한
}
