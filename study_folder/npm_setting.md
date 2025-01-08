# 1. Node.js 설치 확인
GitHub Codespace 환경은 기본적으로 Node.js가 설치되어 있음
```
node -v
```


# 2. 새 프로젝트 생성
```
mkdir phaser-game
cd phaser-game
npm init -y // package.json 파일 만들어줌 ( -y는 기본값? 같은거임 )
```
`package.json`파일이 생성됨

# 3. Phaser 설치
```
npm install phaser
```
설치가 완료되면 `node_modules`폴더와 함께 `package-lock.json`이 생성됨
- `node_modules` : 실제로 가져온 모듈이 설치되는곳
- `package-lock.json` : 의존성 트리에대한 정보를 가지고 있음

# 4. 간단한 Phaser 프로젝트 구성
## 4.1 HTML 파일 작성 (`index.html`);
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Phaser Game</title>
</head>
<body>
  <script type="module" src="./src/main.js"></script>
</body>
</html>
```
- script 안에 `type="module"` 은 HTML 파일에서 `import`문을 사용하는 JS 파일을 로드할때 추가해줘야함
- CommonJS 모듈 방식임

## 4.2 Phaser 코드 작성 (`src/main.js`)
```
import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload,
    create,
    update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.setBaseURL('https://labs.phaser.io');

  this.load.image('sky', 'assets/skies/space3.png');
}

function create() {
  this.add.image(400, 300, 'sky');
}

function update() {
  // 게임 업데이트 로직
}
```

# 5. Webpack or Vite로 실행 준비 
Phaser는 브라우저에서 동작하기 때문에 빌드도구가 필요하고 가장 간단한 Vite로 설명
```
npm install vite --save-dev
```
```
"scripts": {
  "start": "vite" //npm start (사실 내가 명령어 만드는 거임)
}
```
`package.json`에 스크립트 꼭추가 해줘야함

# 6. 서버 실행
```
npm start
```
