# 질문 : this.player에 내 맘대로 변수를 추가해도 되는가?

Phaser에서 this.player는 기본적으로 스프라이트 객체입니다. <br>
Phaser 스프라이트는 사용자가 원하는 속성을 자유롭게 추가할 수 있게 되어 있습니다. <br>
즉, **this.player.moving**처럼 추가적인 속성을 선언하여 게임 로직을 구현하는 것이 가능합니다. <br>

# 질문 : 애니메이션 재생을 어떻게 해주는지?

- this.load.spritesheet를 사용하여 스프라이트 시트를 로드하고, <br>
- 이후 **this.anims.generateFrameNumbers**를 통해 각 애니메이션의 프레임을 지정하면 <br>
- Phaser가 스프라이트 이미지를 자동으로 분할하고 애니메이션을 실행해줍니다. <br>

- **generateFrameNumbers**는 'player'라는 스프라이트 시트에서 지정한 범위 내에서 프레임 번호를 생성하는 함수입니다.
- 예를 들어, start: 0, end: 5로 설정하면, 'player' 스프라이트 시트의 첫 번째부터 여섯 번째까지의 프레임을 애니메이션에 사용하게 됩니다.
