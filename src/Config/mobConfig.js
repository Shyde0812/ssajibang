export const mobConfig = {
    medusa : {
        sprite : "boss_idle",
        type : "boss",
        bodySize: [10 , 10],
        complexHitbox: [
            // 가로
            { offsetX: 0, offsetY: -15, width: 280, height: 60},
            // 세로
            { offsetX: 5, offsetY: -25, width: 80, height: 280 }
        ],
        scale: 3,
        speed: 50,
        animation : [
            {key: 'boss_idle' }
        ],
        Hp : 100,
        hpBarRange : 1000, // 보스바가 사라지는 거리

        moveDelay : 1000,
        stopDistance : 500,

    },

    skeleton : {
        sprite : "skeleton_idle",
        type : "mob",
        bodySize: [40 , 70],
        scale: 2.3,
        speed: 100,
        animation : [
            {key: 'skeleton_revive' }, // 초기 애니메이션
            {key: 'skeleton_idle' },
            {key: 'skeleton_attack' },
            {key: 'skeleton_walk' },
            {key: 'skeleton_death'},
        ],
        Hp : 100,

        canMove: false, // 부활모션 있는 경우
        stopDistance : 100,
    }
}