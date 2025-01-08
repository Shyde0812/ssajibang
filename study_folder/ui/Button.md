# Create Button (ex)
```
import Phaser from "phaser";

export default class Button extends Phaser.GameObjects.Text {
    constructor(x, y, label, scene, callback) {
        super(scene, x, y, label);

        // setOrigin(0.5) -> 추가하는 위치(x, y)의 가운데에 버튼이 위치하도록 합니다.
        this.setOrigin(0.5)

            // 글자와 테두리 사이의 여백을 설정합니다.
            .setPadding(10)

            // 버튼의 색과 글씨 크기를 설정합니다.
            .setStyle({ backgroundColor: "#8aacc8", fontSize: 20 })

            // 버튼이 커서와 상호작용하도록 만들어줍니다.
            .setInteractive({ useHandCursor: true })

            // 누르면 callback으로 전달받은 함수를 실행합니다.
            .on("pointerdown", () => callback())

            // 커서가 올라가있을 때 글씨를 검은색으로 설정합니다.
            .on("pointerover", () => this.setStyle({ fill: "#000" }))

            // 커서가 올라가있지 않을 때 글씨를 흰색으로 설정합니다.
            .on("pointerout", () => this.setStyle({ fill: "#fff" }));

        // 화면에 버튼을 추가합니다.
        scene.add.existing(this);
    }
}
```
- `Phaser.GameObjects.Text`는 Phaser에서 텍스트를 표시하는 객체입니다. 이 객체를 확장해서 버튼으로 변형한 것입니다.

- `super(scene, x, y, label)`로 부모 클래스의 생성자를 호출해 텍스트 객체를 초기화합니다.\
  -  super(scene, x, y, label)는 JavaScript의 클래스 상속 개념을 활용하여 부모 클래스의 생성자(constructor)를 호출하는 코드입니다.
  -  `super`는 부모 클래스의 생성자(constructor)를 호출하거나 부모 클래스의 메서드를 호출할 때 사용됩니다.


- `setInteractive({ useHandCursor: true })`: 상호작용 가능하도록 설정하고, 마우스 커서를 버튼 모양(손가락)으로 변경합니다.

- scene.add.existing(this)를 호출해 버튼을 화면에 추가합니다.
  - `scene.add.existing(this)`는 Phaser 3에서 현재 객체(this)를 장면(scene)에 추가하는 역할을 합니다. Phaser의 GameObject는 생성되기만 하면 화면에 자동으로 표시되지 않고, 장면의 렌더링 시스템에 등록해야만 화면에 나타납니다.
