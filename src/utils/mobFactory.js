import Medusa from "../characters/Medusa";

export default class MobFactory {
    static createMob(scene, name, x, y) {
        switch (name) {
            case "medusa":
                return new Medusa(scene, x, y , name);
            // case "lion":
            //     return new Lion(scene, x, y);
            default:
                console.warn("Unknown mob name:", name);
                return null;
        }
    }
}