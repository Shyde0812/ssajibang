import attackConfig from "../Config/AttackConfig";
import EFF_AA from "../vfx/EFF_AA"; // 공격 효과 (EFF_AA1.js)


export default class AutoAttack {
    

    constructor(scene) {
        if (AutoAttack.instance) {
            return AutoAttack.instance; // 이미 존재하는 인스턴스를 반환
        }

        this.scene = scene;
        this.comboStack = 0;  // 첫 번째 공격부터 시작
        this.canCombo = false;

        this.config = attackConfig["AutoAttack"]; // 해당 스킬의 설정 가져오기

        if (!this.config) {
            console.error(`Skill ${skillName} not found in attackConfig`);
            return;
        }

        this.steps = this.config.steps;
        this.comboTimeout = this.config.comboTimeout;

        // 최초 생성된 인스턴스 저장
        AutoAttack.instance = this;
    }

    performAttack() {

        if (!this.steps || this.comboStack > this.steps.length) {
            this.comboStack = 0;
        }

        const { effect, damage, scale, anim, cooldown } = this.steps[this.comboStack];

        let attackAnim = this.scene.anims.get(anim);
        if (attackAnim) {
            attackAnim.frameRate = this.scene.m_player.attackSpeed * attackAnim.frames.length;
        }

        this.scene.m_player.play(anim);


        let mouseX = this.scene.input.activePointer.worldX;
        let mouseY = this.scene.input.activePointer.worldY;

        // ✅ 플레이어를 마우스 방향으로 바라보게 설정
        this.scene.m_player.flipX = mouseX < this.scene.m_player.x;


        this.scene.m_player.off("animationupdate"); // 기존 리스너 제거
        
        this.scene.m_player.on("animationupdate", (animation, frame) => {
            if (animation.key === anim && frame.index === 3) {

                //console.log(mouseX, mouseY);

                new EFF_AA(this.scene,
                    [this.scene.m_player.x, this.scene.m_player.y],
                    [mouseX, mouseY], 
                    damage, 
                    scale, 
                    cooldown,
                    this.comboStack
                );

                this.canCombo = true;

                if(this.comboStack == 2) {
                    this.comboStack = 0;
                    this.canCombo = false;
                }
            }
        });

        this.scene.m_player.once("animationcomplete", (animation) => {
            if (animation.key === anim) {
                this.scene.time.delayedCall(100, () => {
                    this.scene.m_player.m_attacking = false;
                    this.scene.m_player.play("player_idle");
                });
                // this.scene.m_player.m_attacking = false;
                // this.scene.m_player.play("player_idle");
            }
        });

        if (this.comboTimer) {
            this.scene.time.removeEvent(this.comboTimer);
        }

        this.comboTimer = this.scene.time.delayedCall(this.comboTimeout, () => {
            this.canCombo = false;
            this.comboStack = 0; // 시간 지나면 콤보 리셋
            //console.log(this.canCombo, this.comboStack);
        });
    }

    nextCombo() {
        if (this.canCombo) {
            this.comboStack++;
            this.performAttack();
        }
        else {
            this.performAttack();
        }
    }


    // 이런식으로 class가 호출 가능하더라 대박 신기
    // const effects = [EFF_AA1, EFF_AA2, EFF_AA3];

    // new effects[~~](~~~~)
}