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
```<!DOCTYPE html>
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
</html>```
