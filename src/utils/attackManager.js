import attackConfig from "../Config/AttackConfig";

import AutoAttack from "../attacks/AutoAttack";

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