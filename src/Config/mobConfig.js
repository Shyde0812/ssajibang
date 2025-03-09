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
        bodySize: [150 , 150],
        scale: 3,
        speed: 50,
        animation : [
            {key: 'skeleton_idle' }
        ],
        Hp : 100,

        stopDistance : 300,
    }
}