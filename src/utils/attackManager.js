import attackConfig from "../Config/AttackConfig";

import AutoAttack from "../attacks/AutoAttack";

import EFF_perry from "../vfx/EFF_perry";

export function AttackEvent(scene, skill) {
    if (!attackConfig[skill]) return;

    // anim = player_attack_motion
    // not attack_effect
    let { effect, damage, scale, anim , cooldown} = attackConfig[skill];

    switch(skill) {
        case "AutoAttack" :


            let autoAttack = new AutoAttack(scene);

            //autoAttack.performAttack();
            autoAttack.nextCombo();

            break;

        case "Perry" :

            let mouseX = scene.input.activePointer.worldX;
            let mouseY = scene.input.activePointer.worldY;

            // ✅ 플레이어를 마우스 방향으로 바라보게 설정
            scene.m_player.flipX = mouseX < scene.m_player.x;

            scene.m_player.off("animationupdate"); // 기존 리스너 제거

            new EFF_perry(scene,
                [scene.m_player.x, scene.m_player.y],
                [mouseX, mouseY], 
                scale, 
                cooldown,
            );

            scene.m_player.play(anim);
            scene.m_player.m_parrying = true;
            scene.m_player.m_canBeAttacked = false;

            //this.scene.m_player.play("player_parrying", true);

            // 0.3초 후 패링 해제
            scene.time.delayedCall(300, () => {
                scene.m_player.m_canBeAttacked = true;
                scene.m_player.m_parrying = false;
                scene.m_player.m_attacking = false;
                scene.m_player.play("player_idle" , true)
            });


            console.log("Parrying");
            break;
    }
}

export function removeAttack(scene, attackType) {
    //console.log("run");

    //console.log(attackType);
    attackType.destroy();
}



// export function debug_attak(scene , attackType) {
//     scene.attack_graphics.lineStyle(2, 0xff0000, 1); // 빨간색 외곽선
//     scene.attack_graphics.strokeRect(
//         attackType.x,        // 충돌 박스의 X 좌표
//         attackType.y,        // 충돌 박스의 Y 좌표
//         attackType.width,    // 충돌 박스의 너비
//         attackType.height    // 충돌 박스의 높이
//     );
// }