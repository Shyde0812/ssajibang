import vfxConfig from "../Config/vfxConfig";


class VFXManager {
    constructor(scene) {
        this.scene = scene;

    }

    playHitEffect(target , key, isflip) {
        if (!target) return;

        this.vfxConfig = vfxConfig[key];
        //console.log(this.vfxConfig);

        // 피격 효과 애니메이션 추가
        const offsetX = ( isflip ? -this.vfxConfig.offsetX : this.vfxConfig.offsetX) || 0;
        const offsetY = this.vfxConfig.offsetY || 0;
        const vfx = this.scene.add.sprite(target.x + offsetX, target.y + offsetY, this.vfxConfig.anim);
        //vfx.scale = this.vfxConfig.scale;
        vfx.setDepth(target.depth + 1); // 몬스터보다 위에 표시


        // 몬스터의 bodySize를 기준으로 VFX 크기 조절
        if(!this.vfxConfig.scale) {const baseSize = 25; // VFX 기본 크기
            const bodyWidth = target.body ? target.body.width : target.width;
            const bodyHeight = target.body ? target.body.height : target.height;
            const vfxScaleX = bodyWidth / baseSize;
            const vfxScaleY = bodyHeight / baseSize;
    
            const vfxScale = Math.min(vfxScaleX , vfxScaleY);
    
            vfx.setScale(vfxScale); // 크기 적용 (2차원도 가능)
        } else {
            vfx.setScale(this.vfxConfig.scale);
        }
        vfx.setFlipX(isflip);

        // 애니메이션 실행 후 자동 제거
        vfx.play(this.vfxConfig.anim);
        vfx.on('animationcomplete', () => {
            vfx.destroy();
        });
    }

    showDamageText(target, damage) {
        if (!target) return;

        let randomValue = Phaser.Math.Between(-5, 5); 
        const damageText = this.scene.add.text(target.x + randomValue, target.y - 20 + randomValue, damage, {
            font: '20px Arial',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 3 // 텍스트 테두리 추가
        });

        damageText.setDepth(target.depth + 2);

        // 위로 살짝 올라가는 애니메이션
        this.scene.tweens.add({
            targets: damageText,
            y: target.y - 25,
            alpha: 0,
            duration: 500,
            ease: 'Power1', // 애니메이션 속도 변화의 종류중 하나
            onComplete: () => damageText.destroy()
        });
    }
}

export default VFXManager;