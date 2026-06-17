/**
 * 天体地貌要素 — 多天体探索信息增密（第 2 轮）
 * 月海/撞击坑/盆地、火山/峡谷/平原/极冠等，真实选源坐标（东经正，-180..180）。
 */

import type { BodyFeature } from '@/types/body';

export const MOON_FEATURES: BodyFeature[] = [
  { id: 'f-procellarum', body: 'moon', layer: 'moon_features', name: '风暴洋', nameEn: 'Oceanus Procellarum', type: '月海', lng: -57.4, lat: 18.4, desc: '月球最大月海，覆盖近月正面西部大片区域。' },
  { id: 'f-tranquillitatis', body: 'moon', layer: 'moon_features', name: '静海', nameEn: 'Mare Tranquillitatis', type: '月海', lng: 31.4, lat: 8.5, desc: '阿波罗 11 号着陆于其西南缘。' },
  { id: 'f-imbrium', body: 'moon', layer: 'moon_features', name: '雨海', nameEn: 'Mare Imbrium', type: '撞击盆地', lng: -15.6, lat: 32.8, desc: '巨大撞击盆地，月面最显著的圆形月海之一。' },
  { id: 'f-crisium', body: 'moon', layer: 'moon_features', name: '危海', nameEn: 'Mare Crisium', type: '月海', lng: 59.1, lat: 17.0, desc: '近月东缘孤立的椭圆月海。' },
  { id: 'f-serenitatis', body: 'moon', layer: 'moon_features', name: '澄海', nameEn: 'Mare Serenitatis', type: '月海', lng: 17.5, lat: 28.0, desc: '阿波罗 17 号着陆于其东南缘陶拉斯-利特罗谷。' },
  { id: 'f-tycho', body: 'moon', layer: 'moon_features', name: '第谷坑', nameEn: 'Tycho', type: '撞击坑', lng: -11.4, lat: -43.3, desc: '年轻显著的撞击坑，辐射纹遍布近月面。' },
  { id: 'f-copernicus', body: 'moon', layer: 'moon_features', name: '哥白尼坑', nameEn: 'Copernicus', type: '撞击坑', lng: -20.1, lat: 9.6, desc: '典型中央峰复杂撞击坑，月面地标。' },
  { id: 'f-spa', body: 'moon', layer: 'moon_features', name: '南极-艾特肯盆地', nameEn: 'South Pole–Aitken', type: '撞击盆地', lng: 180, lat: -56, desc: '太阳系已知最大最古老撞击盆地之一，位于月背南部。' },
  { id: 'f-nectaris', body: 'moon', layer: 'moon_features', name: '酒海', nameEn: 'Mare Nectaris', type: '月海', lng: 34.6, lat: -15.2, desc: '近月东南的小型月海，周边多撞击坑。' },
  { id: 'f-humorum', body: 'moon', layer: 'moon_features', name: '湿海', nameEn: 'Mare Humorum', type: '月海', lng: -38.6, lat: -24.4, desc: '近月西南圆形月海，地质构造典型。' },
  { id: 'f-aristarchus', body: 'moon', layer: 'moon_features', name: '阿里斯塔克斯高原', nameEn: 'Aristarchus', type: '撞击坑/高原', lng: -47.4, lat: 23.7, desc: '月面最亮区域之一，火山地貌与月谷富集。' },
];

export const MARS_FEATURES: BodyFeature[] = [
  { id: 'f-olympus', body: 'mars', layer: 'mars_features', name: '奥林匹斯山', nameEn: 'Olympus Mons', type: '盾状火山', lng: -133.8, lat: 18.65, desc: '太阳系已知最高火山，高约 22 km。' },
  { id: 'f-marineris', body: 'mars', layer: 'mars_features', name: '水手谷', nameEn: 'Valles Marineris', type: '峡谷系', lng: -59, lat: -14, desc: '太阳系最大峡谷系，长约 4,000 km。' },
  { id: 'f-tharsis', body: 'mars', layer: 'mars_features', name: '塔尔西斯火山群', nameEn: 'Tharsis Montes', type: '火山高原', lng: -113, lat: 0, desc: '巨型火山隆起区，含三座排列的盾状火山。' },
  { id: 'f-hellas', body: 'mars', layer: 'mars_features', name: '希腊平原', nameEn: 'Hellas Planitia', type: '撞击盆地', lng: 70.5, lat: -42.4, desc: '火星最大撞击盆地之一，最低洼区域。' },
  { id: 'f-elysium', body: 'mars', layer: 'mars_features', name: '埃律西昂山', nameEn: 'Elysium Mons', type: '盾状火山', lng: 147.2, lat: 25.0, desc: '火星第二大火山高原的主峰。' },
  { id: 'f-argyre', body: 'mars', layer: 'mars_features', name: '阿尔吉里平原', nameEn: 'Argyre Planitia', type: '撞击盆地', lng: -43, lat: -49, desc: '南半球大型古撞击盆地。' },
  { id: 'f-northpole', body: 'mars', layer: 'mars_features', name: '北极冠', nameEn: 'Planum Boreum', type: '极地冰盖', lng: 0, lat: 85, desc: '由水冰与季节性干冰组成的北极冰盖。' },
  { id: 'f-acidalia', body: 'mars', layer: 'mars_features', name: '阿西达利亚平原', nameEn: 'Acidalia Planitia', type: '平原', lng: -22, lat: 50, desc: '北半球暗色大平原（《火星救援》设定地）。' },
  { id: 'f-arsia', body: 'mars', layer: 'mars_features', name: '阿尔西亚山', nameEn: 'Arsia Mons', type: '盾状火山', lng: -120.5, lat: -8.4, desc: '塔尔西斯三火山最南者，常见晨间云幡。' },
  { id: 'f-isidis', body: 'mars', layer: 'mars_features', name: '伊希斯平原', nameEn: 'Isidis Planitia', type: '撞击平原', lng: 88, lat: 13, desc: '大型古撞击盆地，毅力号杰泽罗坑即位于其西缘。' },
  { id: 'f-southpole', body: 'mars', layer: 'mars_features', name: '南极冠', nameEn: 'Planum Australe', type: '极地冰盖', lng: 0, lat: -85, desc: '南极永久冰盖，含厚层水冰与干冰。' },
];

export const ALL_BODY_FEATURES: BodyFeature[] = [...MOON_FEATURES, ...MARS_FEATURES];
