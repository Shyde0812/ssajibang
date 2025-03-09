const attackConfig = {
    AutoAttack : { 
        steps: [
            { effect: "Chop", damage: 50, scale: 2, anim: "pl_AA1", cooldown: 0.2 * 1000 },
            { effect: "Chop", damage: 6, scale: 2, anim: "pl_AA2", cooldown: 0.2 * 1000 },
            { effect: "Chop", damage: 8, scale: 2, anim: "pl_AA3", cooldown: 0.2 * 1000 }
        ],
        comboTimeout: 1 * 1000 // 콤보 입력 가능 시간
        }
    // Slash: { skill: "Slash", damage: 8, scale: 5, cooldown: 0.3 * 1000, anim: "player_AA_2" },
    // Fireball: { skill: "Fireball", damage: 12, scale: 3, cooldown: 1.5 * 1000, anim: "skill_fireball" }
};

export default attackConfig;
