import Medusa from "../characters/Medusa";
import skeleton from "../characters/skeleton";

export default class MobFactory {
    static createMob(scene, name, x, y , addToGroup = true) {
        let mob = null;

        switch (name) {
            case "medusa":
                mob = new Medusa(scene, x, y, name);
                break;
            case "skeleton":
                mob = new skeleton(scene, x, y, name);
                break;
            default:
                console.warn("Unknown mob name:", name);
                return null;
        }

        // 생성된 몹을 scene의 m_mobs 그룹에 자동으로 추가
        if (addToGroup && mob && scene.m_mobs) {
            scene.m_mobs.add(mob);
        }

        //console.log("m_mobs children entries:", scene.m_mobs.children.entries);

        return mob;
    }
}