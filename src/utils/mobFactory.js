import Medusa from "../characters/Medusa";
import skeleton from "../characters/skeleton";

export default class MobFactory {
    static createMob(scene, name, x, y) {
        switch (name) {
            case "medusa":
                
                return new Medusa(scene, x, y , name);
            // case "lion":
            //     return new Lion(scene, x, y);

            case "skeleton":
                return new skeleton(scene, x, y , name);

            default:
                console.warn("Unknown mob name:", name);
                return null;
        }
    }
}