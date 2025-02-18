import Mob from "../characters/Mobs";
import { getRandomPosition } from "./math";


/**
 * scene의 (x, y) 위치에 texture 이미지 및 animKey 애니메이션을 실행하며
 * initHp의 HP, dropRate의 아이템 드랍율을 가진 Mob object를 추가합니다.
 * PlayingScene의 m_mobs, m_mobEvent에 각각 mob object, mob timer를 추가합니다.
 * 위치 (x, y)는 getRandomPosition 함수를 통해 정해집니다.
 * @param {Phaser.Scene} scene - mob을 등장시킬 scene
 * @param {Number} repeatGap - mob이 새로 등장하는 시간 간격 (ms단위)
 * @param {String} mobTexture - mob의 image texture
 * @param {String} mobAnim - mob의 animation key
 * @param {Number} mobHp - mob의 최대 HP
 * @param {Number} mobDropRate - mob의 아이템 드랍율
 */

export function addMobEvent(scene, repeatGap, mobTexture, mobAnim, mobHp, mobDropRate) {
    let timer = scene.time.addEvent({
        delay: repeatGap,
        callback: () => {
            let [x,y] = getRandomPosition(scene.m_player.x, scene.m_player.y);
            scene.m_mobs.add(new Mob(scene, x, y, mobTexture, mobAnim, mobHp, mobDropRate))
        },
        loop: true
    });

    // TimerEvent 객체를 푸쉬하는 거지
    scene.m_mobEvents.push(timer);
}
// 이런 식으로 저장 되는거야
/*this.m_events = [
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
];*/ 




// Phaser 이벤트도 제거하고, 배열에서도 삭제하여 데이터와 상태가 일치함.
export function removeOldestMobEvent(scene) {
    scene.m_mobEvents[0].remove();
    scene.m_mobEvents.shift();
}

/**
 * scene의 (x, y) 위치에 mobTexture 이미지, mobAnim 애니메이션, mobHp의 HP를 가진
 * Mob object 하나를 추가합니다.
 * 위치 (x, y)는 getRandomPosition 함수를 통해 정해집니다.
 */
export function addMob(scene, mobTexture, mobAnim, mobHp) {
    let[x,y] = getRandomPosition(scene.m_player.x, scene.m_player.y);
    scene.m_mobs.add(new Mob(scene, x, y, mobTexture, mobAnim, mobHp, 0));
}
    
