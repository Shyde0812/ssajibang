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
        moveDelay : 1000,
        hpBar : "boss",

    }
}