# 1. Tiled에서 맵 만들기
## 타일셋 준비
1. Tiled에서 타일셋을 추가합니다:
- File > New Tileset을 선택.
- 타일셋 이름과 이미지를 지정하고 저장하세요.
-  이미지 기반 타일셋을 사용하는 경우, 반드시 프로젝트 내의 파일 경로에 이미지를 저장하세요.
## 맵 만들기
2. New Map을 생성:
- File > New Map 선택.
- 타일 크기, 맵 크기, 레이어를 설정합니다.
- 만든 타일셋을 드래그하여 맵에 배치하세요.
## 타일셋 내장 (Embed Tileset) 📍(중요)
- 타일셋을 내장합니다:
- 타일셋 패널에서 타일셋을 오른쪽 클릭 > Embed Tileset을 선택.
- 내장이 완료되면 맵 JSON 파일에 타일셋 정보가 포함됩니다.
## 맵 저장
- 맵을 저장합니다:
- File > Export As를 선택하고, JSON 형식으로 저장하세요.
- 경로는 프로젝트의 /assets/maps/ 디렉토리 같은 적절한 위치를 선택합니다.


# 2. Phaser 프로젝트에서 사용
## 맵과 타일셋 이미지 로드
1. 맵과 타일셋 이미지를 프로젝트에 복사:
```
class Scene2 extends Phaser.Scene {
    constructor() {
        super('Scene2');
    }

    preload() {
        // 타일셋 이미지 로드
        this.load.image('tiles', 'assets/images/tiles.png');

        // JSON 맵 로드
        this.load.tilemapTiledJSON('`map`', 'assets/maps/map.json');
    }

    create() {
        // 맵 불러오기
        const map = this.make.tilemap({ key: '`map`' });

        // 타일셋 연결
        const tileset = map.addTilesetImage('tileset_name', 'tiles');
        // 여기서 tileset_name 은 tiled 프로그램에서 사용한 이름과 같게
        // 헷갈리면 json 파일에 나와있음

        // 레이어 생성
        const layer = map.createLayer('Tile Layer 1', tileset, 0, 0);
        // 여기서도 Tile Lyaer 1 이름은 tiled 프로그램에서 사용한 이름과 같게
        // 헷갈리면 json 파일에 나와있음
    }
}
const game = new Phaser.Game(config);
```
### JSON 파일에 타일셋 정보가 포함된 예시:
```
"tilesets": [
    {
        "firstgid": 1,
        "name": "tileset_name",
        "image": "assets/images/tiles.png",
        "imagewidth": 256,
        "imageheight": 256,
        "tilewidth": 32,
        "tileheight": 32,
        "tilecount": 64,
        "columns": 8
    }
]
```
