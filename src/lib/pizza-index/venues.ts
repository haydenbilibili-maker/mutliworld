/**
 * 五角大楼周边真实披萨店坐标（Pentagon City / Crystal City / Arlington）
 * 与 pizzint.watch 追踪范围一致的开源情报 meme 地标。
 */

export interface PentagonPizzaVenueSeed {
  id: string;
  name: string;
  brand: string;
  lat: number;
  lng: number;
  /** 距离五角大楼权重（越近越高） */
  weight: number;
}

/** 五角大楼中心（用于 fly-to） */
export const PENTAGON_CENTER: [number, number] = [-77.0563, 38.863];

export const PENTAGON_FLY_ZOOM = 13.8;

export const PIZZA_VENUES: PentagonPizzaVenueSeed[] = [
  {
    id: 'dominos-pentagon-city',
    name: "Domino's Pizza — Pentagon City",
    brand: "Domino's",
    lat: 38.8631,
    lng: -77.0594,
    weight: 1.0,
  },
  {
    id: 'papa-johns-crystal-city',
    name: "Papa John's — Crystal City",
    brand: "Papa John's",
    lat: 38.8579,
    lng: -77.0512,
    weight: 0.92,
  },
  {
    id: 'andpizza-pentagon-row',
    name: '&pizza — Pentagon Row',
    brand: '&pizza',
    lat: 38.8625,
    lng: -77.0588,
    weight: 0.88,
  },
  {
    id: 'pizza-hut-arlington',
    name: 'Pizza Hut — Arlington',
    brand: 'Pizza Hut',
    lat: 38.8698,
    lng: -77.0865,
    weight: 0.75,
  },
  {
    id: 'ledo-pizza-crystal-city',
    name: 'Ledo Pizza — Crystal City',
    brand: 'Ledo Pizza',
    lat: 38.8562,
    lng: -77.0498,
    weight: 0.85,
  },
  {
    id: 'extreme-pizza-pentagon-row',
    name: 'Extreme Pizza — Pentagon Row',
    brand: 'Extreme Pizza',
    lat: 38.8635,
    lng: -77.061,
    weight: 0.9,
  },
];
