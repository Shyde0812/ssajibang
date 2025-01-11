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

### 4. 게임 객체 생성 및 설정 (`create` 함수)
```
function create() {
    this.add.image(400, 300, 'background');  // 배경을 (400, 300) 위치에 추가
    this.player = this.physics.add.sprite(400, 500, 'player');  // (400, 500) 위치에 플레이어 스프라이트 추가
    this.cursors = this.input.keyboard.createCursorKeys();  // 키보드 입력 설정 (방향키)
}
```
- this.add.image(400, 300, 'background'): 배경 이미지를 (400, 300) 위치에 추가합니다. (게임 화면의 중심에 배치)
- this.player = this.physics.add.sprite(400, 500, 'player'): (400, 500) 위치에 플레이어 스프라이트를 추가하고, Phaser의 물리 엔진(physics)을 적용하여 스프라이트를 추가합니다.
- this.cursors = this.input.keyboard.createCursorKeys(): 방향키 입력을 감지하기 위해 createCursorKeys 메서드를 사용하여 this.cursors 객체를 만듭니다. 이 객체를 통해 플레이어의 이동을 제어합니다.

### 5. 게임 루프 및 플레이어 이동 (`update` 함수)
```
function update() {
    if (this.cursors.left.isDown) {      // 왼쪽 방향키가 눌렸을 때
        this.player.x -= 5;                // 플레이어를 왼쪽으로 5만큼 이동
    } else if (this.cursors.right.isDown) { // 오른쪽 방향키가 눌렸을 때
        this.player.x += 5;                // 플레이어를 오른쪽으로 5만큼 이동
    }
    if (this.cursors.up.isDown) {         // 위쪽 방향키가 눌렸을 때
        this.player.y -= 5;                // 플레이어를 위로 5만큼 이동
    } else if (this.cursors.down.isDown) { // 아래쪽 방향키가 눌렸을 때
        this.player.y += 5;                // 플레이어를 아래로 5만큼 이동
    }
}
```
- update 함수: Phaser 3는 update 함수를 사용하여 매 프레임마다 게임의 상태를 업데이트합니다. 여기에서는 플레이어가 방향키 입력에 따라 이동하는 로직을 처리합니다.

# 코드 설명
## `기본적인 객체지향 이해`
```
export default class MainScene extends Phaser.Scene {
    constructor() {
        super("mainScene");
    }
}
```
1. **`export defalt`**
- 이 구문은 해당 클래스를 기본 내보내기(default export)로 지정하여 다른 파일에서 쉽게 import 할 수 있게 합니다.<br>
예를 들어, 다른 파일에서 이 클래스를 가져오려면 다음과 같이 작성할 수 있습니다:
```
import MainScene from './MainScene';  // MainScene을 불러오기
```

2. **`class MainScene extends Phaser.Scene`**
- class MainScene: JavaScript 클래스 정의 구문입니다. 여기서 MainScene은 Phaser 3 게임에서 사용할 씬의 이름입니다.

- extends Phaser.Scene: 이 클래스는 Phaser 3의 Scene 클래스를 상속합니다. 즉, MainScene은 Phaser의 기본 Scene 클래스를 확장하여 Phaser의 씬 기능을 사용할 수 있습니다.

- Scene 클래스는 Phaser에서 게임을 구성하는 하나의 독립적인 화면을 의미합니다. 즉, 게임의 한 단계를 담당하는 객체입니다.

3. **`constructor`**
- **constructor()**는 클래스가 새로운 인스턴스로 생성될 때 호출되는 특수한 함수입니다.
- Phaser에서 Scene을 정의할 때, 각 씬을 구체적으로 설정할 수 있도록 **constructor**가 사용됩니다.<br>

- `super("mainScene"):`
    - super()는 상속받은 부모 클래스의 생성자를 호출하는 데 사용됩니다. 여기서는 Phaser.Scene 클래스의 생성자를 호출합니다.
    - "mainScene"은 이 씬에 대한 이름을 지정하는 문자열입니다. 이 이름은 Phaser 게임에서 해당 씬을 식별하는 데 사용됩니다.
    - 씬의 이름은 Phaser 게임에서 씬을 전환할 때 사용됩니다.

### 씬을 사용하는 예시
```
// 게임 설정
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MainScene]  // MainScene을 게임 씬으로 지정
};

const game = new Phaser.Game(config);
```

## `Phaser 타이머 이벤트` 중요한거 같은데
```
this.m_events = [];
this.m_events.push(
    this.scene.time.addEvent({
        delay: 100,
        callback: () => {
            scene.physics.moveToObject(this, scene.m_player, this.m_speed);
        },
        loop: true,
    })
)
```

1. **`this.scene.time.addEvent`**
- Phaser에서 제공하는 타이머 이벤트를 추가합니다.
- 이 이벤트는 일정 시간 마다 콜백 함수 (`callback`)을 실행하도록 설정

2. **`scene.physics.moveToObject(이동하려는 객체 , 목표 객체 , 이동속도 (pixel/sec)`** 
- 현재 객체 (this)를 플레이어 (scene.m_player) 방향으로 움직이도록 설정
- `loop: true` : 무한히 반복

3. 이벤트 배열에 저장
- `m_events` 배열 안에는 **Phaser.Time.TimerEvent** 객체들이 저장됨
- `scene.time.addEvent()`가 반환하는 것이 TimerEvent 객체
### `실제예시`
```
this.m_events = [
    {
        delay: 100,                       // 0.1초 딜레이
        callback: [Function],             // moveToObject 호출 함수
        callbackScope: <MonsterObject>,   // this (타이머를 소유한 객체)
        loop: true,                       // 반복 여부
        elapsed: 0,                       // 경과 시간 (밀리초)
        repeatCount: Infinity,            // 반복 횟수 (무한 반복)
        timeScale: 1,                     // 타임스케일
        startAt: <timestamp>,             // 타이머 시작 시간
        paused: false                     // 일시정지 상태
    },
    {
        delay: repeatGap,                 // 두 번째 타이머의 딜레이
        callback: [Function],             // Mob 생성 함수
        callbackScope: <SceneObject>,     // 이 타이머를 소유한 씬
        loop: true,                       // 반복 여부
        elapsed: 0,                       // 경과 시간 (밀리초)
        repeatCount: Infinity,            // 반복 횟수 (무한 반복)
        timeScale: 1,                     // 타이머의 타임스케일
        startAt: <timestamp>,             // 타이머 시작 시간
        paused: false                     // 일시정지 상태
    }
];

```
- 이런 식으로 TimerEvent 객체로 구성됨
- 배열의 형태로 저장하면, 여러 타이머를 하나의 배열에서 관리

#### 관리방법
1. 배열 순회
```
this.m_events.forEach(event => {
    event.destroy();  // 각 TimerEvent 객체 삭제
});
this.m_events = []; // 배열 초기화
```
2. 개별 접근
```
this.m_events[0].paused = true;  // 첫 번째 TimerEvent 일시 정지
this.m_events[1].destroy();     // 두 번째 TimerEvent 삭제
```
3.조건부 제어
```
this.m_events.forEach(event => {
    if (event.delay === 100) {  // 딜레이가 100ms인 이벤트만
        event.paused = true;    // 일시 정지
    }
});
```

## `update 호출`
```
scene.events.on("update" , (time, delta) => {
            this.update(time, delta);
        });
```
1. **`scene.events`**
- Phaser의 EventEmitter 객체입니다.
- 씬(Scene)에서 발생하는 특정 이벤트를 처리할 수 있는 시스템입니다.

2. **`.on("update", callback)`**
- "update" 이벤트가 발생할 때마다 지정된 콜백 함수(callback)을 실행합니다.
- "update" 이벤트는 매 프레임마다 발생하며, 게임 루프의 일부입니다.
- Phaser 씬의 기본적인 update() 메서드 호출과 비슷한 시점에 동작합니다.

3. **`(time, delta): 콜백 함수의 매개변수`**
이 이벤트는 두 가지 인수를 전달합니다:
- time: 게임이 시작된 후 경과한 시간(밀리초).
- delta: 이전 프레임과 현재 프레임 사이의 시간 차이(밀리초).
이 두 값을 사용하여 게임의 프레임 간 상태를 동기화하거나, 시간 기반 애니메이션 및 동작을 구현할 수 있습니다.
걍 유니티 time.deltatime임

- 자바스크립트에서는 같은 이름의 함수(update)를 여러 번 정의할 수 없습니다. 함수 이름이 동일하다면 가장 마지막에 정의된 함수가 덮어쓰게 됩니다. 따라서 update()와 update(time, delta)를 동시에 정의하려 하면 항상 마지막에 정의된 함수만 유효합니다.

## `this.body`
- this.body는 Phaser의 Physics Body 객체를 참조합니다. Phaser에서 Arcade Physics를 사용하는 경우, 모든 물리 객체에는 body라는 속성이 자동으로 생성되며, 이는 해당 객체의 물리적 속성을 관리하는 데 사용됩니다.

## `@param` 주석
```
/**
 * 특정 좌표에서 이동하는 함수
 * @param {Number} x - 이동할 x 좌표
 * @param {Number} y - 이동할 y 좌표
 */
```
@param 형태는 함수나 메서드의 매개변수에 대한 설명을 달 때 사용됩니다.
- `@param`: 해당 함수 또는 메서드의 매개변수를 설명하는 데 사용
- `{Number}`: 매개변수 `y`의 자료형을 지정
- `y`: 매개변수의 이름 <br>
@param {Type} name 형태로, 매개변수의 자료형(Type)과 이름(name)을 설명하며, 추가적으로 설명을 덧붙일 수 있습니다.
함수에 마우스가져다 대면 설명뜨는데 그거 수정하는 거인듯

## **`Group vs 배열`**
- `this.m_mobs = this.physics.add.group();` 로 선언된 `m_mobs`는 단순한 배열 아님
- Phaser의 `Group` 객체로, 배열처럼 동작 하지만, 더 많은 기능 제공

### Physics Group 예제
그룹에 포함된 모든 객체가 물리 엔진의 영향을 받을 수 있음
```
this.m_mobs = this.physics.add.group();

// 몹 추가
this.m_mobs.add(new Mob(this, x, y, texture));

// 그룹 내 객체에 접근
this.m_mobs.children.iterate((mob) => {
    mob.setVelocity(100, 0); // 모든 몹을 오른쪽으로 이동
});

// 그룹에서 특정 객체 제거
let firstMob = this.m_mobs.getFirstAlive();
this.m_mobs.remove(firstMob, true, true);

// 그룹 내 객체 확인
console.log(this.m_mobs.getChildren()); // [Mob, Mob, Mob...]
```
