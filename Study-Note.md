# ssajibang

# .md
~~.md 는 Markdown의 약자<br>
.md는 Markdown 파일을 의미하며, 간단한 문법으로 텍스트를 서식화하여 읽기 좋은 형태로 작성하는 데 사용됩니다.<br>

# npm install phaser
node_modules/: 프로젝트에서 사용하는 패키지들이 설치되는 폴더입니다.<br>
package.json: 프로젝트에 필요한 의존성과 설정 정보를 담고 있는 파일입니다.<br>
package-lock.json: 의존성 버전과 의존 관계를 정확히 기록하여 일관된 설치 환경을 보장하는 파일입니다.<br>

이 파일들이 없으면, 프로젝트에서 필요한 패키지를 제대로 관리하고, 다른 환경에서 동일한 설정으로 작업을 진행하기 어려워집니다.

# develop start

## 1. 프로젝트 폴더 구조 만들기
프로젝트 디렉토리 구조는 보통 다음과 같은 형태로 설정합니다: <br>
```
/my-phaser-game
├── /assets       # 이미지, 스프라이트 시트, 사운드 등 게임 리소스
├── index.html    # 게임을 실행할 HTML 파일
├── main.js       # 게임의 로직을 담은 JavaScript 파일
├── package.json  # 프로젝트의 설정 및 의존성 파일
└── /node_modules # npm으로 설치된 의존성
```

## 2. `index.html`파일 생성
Phaser 게임을 실행할 HTML 파일을 생성합니다. index.html 파일을 만들어서 Phaser 3를 로드하고, 게임을 실행할 수 있도록 설정합니다.<br>
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Phaser Game</title>
</head>
<body>
    <script src="node_modules/phaser/dist/phaser.min.js"></script>
    <script src="main.js"></script> <!-- 여기에 게임의 JavaScript 파일을 연결 -->
</body>
</html>
```

- **phaser.min.js**는 node_modules/phaser/dist 폴더에 설치된 Phaser 3의 라이브러리입니다.
- main.js는 게임의 로직을 작성할 파일입니다.

## 3. `main.js` 파일 생성
### 1. 게임 설정 (`config 객체`)
```
const config = {
    type: Phaser.AUTO,  // Phaser가 자동으로 사용할 렌더러 선택 (WebGL 또는 Canvas)
    width: 800,         // 게임 화면의 가로 크기 (픽셀 단위)
    height: 600,        // 게임 화면의 세로 크기 (픽셀 단위)
    scene: {            // 게임 씬 설정
        preload: preload,  // 'preload' 단계에서 사용할 함수 (리소스를 미리 로드)
        create: create,    // 'create' 단계에서 사용할 함수 (게임 객체 초기화)
        update: update     // 'update' 단계에서 사용할 함수 (매 프레임마다 호출되는 함수)
    }
};
```
- preload: 게임에서 사용할 리소스를 미리 로드합니다.
- create: 게임 객체를 생성하고, 물리 엔진을 설정합니다.
- update: 매 프레임마다 실행되어 플레이어의 이동과 같은 동작을 처리합니다.

### 2. 게임 객체 생성(`Phaser.Game`)
```
const game = new Phaser.Game(config); // Phaser.Game 객체 생성 및 설정
```
- `new Phaser.Game(config)`: `config` 객체를 이용하여 새로운 Phaser 게임 인스턴스를 생성합니다. 이때 앞서 정의한 씬이 실행됩니다.
- 찾아보니까 :
맞습니다! const game = new Phaser.Game(config); 이 구문은 Phaser 3로 게임을 개발할 때 필수적으로 포함되는 코드입니다.

### 3. 리소스 로드 (`preload`함수)
```
function preload() {
    this.load.image('background', 'assets/background.png');  // 배경 이미지 로드
    this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 });  // 플레이어 스프라이트 로드
}
```
- this.load.image('background', 'assets/background.png'): assets/background.png 경로에 있는 배경 이미지를 로드합니다. 이 이미지는 background라는 키로 접근할 수 있습니다.
- this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 32 }): 플레이어의 스프라이트 시트를 로드합니다. frameWidth와 frameHeight는 스프라이트 시트에서 각 프레임의 크기를 정의합니다. 예시에서는 32x32 크기로 설정되어 있습니다.

#### `this`가 필요한 이유 : <br>
- Phaser 3에서 씬(예: preload, create, update) 함수들은 모두 씬 객체의 메서드입니다. 이들 함수 내에서 this를 사용해 현재 씬의 속성과 메서드에 접근할 수 있습니다
- this 없이 접근하면 오류가 발생할 수 있기 때문에 꼭 this를 붙여야 합니다.
