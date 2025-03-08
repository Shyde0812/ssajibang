import mapTileSet from "../assets/maps/Floor2.png";
import mapJson from "../assets/maps/map.json";

import bossmapTileSet from "../assets/maps/MainLev2.0.png";
import bossmapJson from "../assets/maps/bossMap.json";

export const mapConfig = {
    map: {
      tileset: mapTileSet,
      json: mapJson,
      layers: [
        { name: 'ground', tilesetKey: 'map_tiles' , tilesetName: 'Floor2'},
        // 추가 레이어를 여기에 추가
      ],
    },
    bossmap: {
      tileset: bossmapTileSet,
      json: bossmapJson,
      layers: [
        { name: 'Wall', tilesetKey: 'bossmap_tiles' , tilesetName: 'MainLev2.0'},
        { name: 'Ground', tilesetKey: 'bossmap_tiles' , tilesetName: 'MainLev2.0'},
        // 추가 레이어를 여기에 추가
      ],
      collisionLayer: 'Wall' // 충돌 레이어로 사용할 레이어 이름
    },
  };