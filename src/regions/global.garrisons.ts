/**
 * 全球主要海外军事基地 / 驻军档案 — 对标 World Monitor 的海外军事存在图层
 *
 * ⚠ 均为公开资料中广为人知的常设设施，坐标为公开近似/示意位置，非精确军事坐标。
 *   仅含名称、所属国、概要角色，不含兵力部署等敏感运行细节。整理日：2026-06-16
 */

import type { ImpactLevel } from '@/types/geo';
import { DENSIFY_GARRISONS } from './global.layers-densify-r2';

export interface GarrisonBase {
  id: string;
  name: string;
  /** 所属国（用于旗标图标） */
  country: 'us' | 'china' | 'russia' | 'france' | 'uk';
  lng: number;
  lat: number;
  role: string;
  impact: ImpactLevel;
}

export const GLOBAL_GARRISONS: GarrisonBase[] = [
  // 美国
  { id: 'gar-ramstein', name: '拉姆施泰因空军基地', country: 'us', lng: 7.6, lat: 49.44, role: '美军欧洲空运与指挥枢纽（德国）', impact: 'high' },
  { id: 'gar-lemonnier', name: '莱蒙尼耶军营', country: 'us', lng: 43.15, lat: 11.55, role: '美军非洲之角唯一常设基地（吉布提）', impact: 'high' },
  { id: 'gar-diego', name: '迪戈加西亚', country: 'us', lng: 72.41, lat: -7.31, role: '印度洋战略前沿基地（英美共用）', impact: 'critical' },
  { id: 'gar-yokosuka', name: '横须贺海军基地', country: 'us', lng: 139.67, lat: 35.29, role: '美第七舰队母港（日本）', impact: 'critical' },
  { id: 'gar-guam', name: '安德森空军基地 · 关岛', country: 'us', lng: 144.93, lat: 13.58, role: '西太平洋战略投送支点', impact: 'critical' },
  { id: 'gar-humphreys', name: '汉弗莱斯军营', country: 'us', lng: 127.02, lat: 36.97, role: '美军海外最大陆军基地（韩国）', impact: 'high' },
  { id: 'gar-aludeid', name: '乌代德空军基地', country: 'us', lng: 51.32, lat: 25.12, role: '美中央司令部前沿空军枢纽（卡塔尔）', impact: 'high' },
  { id: 'gar-rota', name: '罗塔海军基地', country: 'us', lng: -6.35, lat: 36.62, role: '驱逐舰前沿部署港（西班牙）', impact: 'medium' },
  { id: 'gar-guantanamo', name: '关塔那摩湾基地', country: 'us', lng: -75.16, lat: 19.9, role: '加勒比海军基地（古巴）', impact: 'medium' },
  // 中国
  { id: 'gar-cn-djibouti', name: '中国吉布提保障基地', country: 'china', lng: 43.07, lat: 11.59, role: '中国首个海外保障基地', impact: 'high' },
  // 俄罗斯
  { id: 'gar-tartus', name: '塔尔图斯海军基地', country: 'russia', lng: 35.87, lat: 34.9, role: '俄海军地中海唯一补给点（叙利亚）', impact: 'high' },
  { id: 'gar-hmeimim', name: '赫梅明空军基地', country: 'russia', lng: 35.95, lat: 35.41, role: '俄叙利亚空中力量枢纽', impact: 'high' },
  { id: 'gar-kaliningrad', name: '加里宁格勒驻军', country: 'russia', lng: 20.5, lat: 54.7, role: '波罗的海飞地军事集群', impact: 'high' },
  // 法国
  { id: 'gar-fr-djibouti', name: '法军吉布提基地', country: 'france', lng: 43.16, lat: 11.6, role: '法国在非最大驻军', impact: 'medium' },
  { id: 'gar-fr-abudhabi', name: '法军阿布扎比基地', country: 'france', lng: 54.5, lat: 24.4, role: '海湾地区法军前沿（阿联酋）', impact: 'medium' },
  // 英国
  { id: 'gar-akrotiri', name: '阿克罗蒂里基地', country: 'uk', lng: 32.96, lat: 34.59, role: '英军东地中海主权基地（塞浦路斯）', impact: 'medium' },
  { id: 'gar-kadena', name: '嘉手纳空军基地', country: 'us', lng: 127.77, lat: 26.35, role: '冲绳前沿空中力量（日本）', impact: 'high' },
  { id: 'gar-yokota', name: '横田空军基地', country: 'us', lng: 139.35, lat: 35.75, role: '驻日美军司令部（东京西侧）', impact: 'high' },
  { id: 'gar-osan', name: '乌山空军基地', country: 'us', lng: 127.03, lat: 37.09, role: '驻韩美军第七航空队（韩国）', impact: 'high' },
  { id: 'gar-sasebo', name: '佐世保海军基地', country: 'us', lng: 129.72, lat: 33.16, role: '美海军西太平洋前沿港口', impact: 'medium' },
  { id: 'gar-camp-humphreys', name: '平泽/汉弗莱斯', country: 'us', lng: 126.83, lat: 36.96, role: '驻韩美军司令部所在地', impact: 'high' },
  { id: 'gar-bahrain', name: '巴林第五舰队总部', country: 'us', lng: 50.58, lat: 26.23, role: '美海军中央司令部前沿', impact: 'high' },
  { id: 'gar-kuwait', name: '阿里萨卡姆军营', country: 'us', lng: 47.92, lat: 29.35, role: '海湾地区陆军前沿部署', impact: 'medium' },
  { id: 'gar-italy-vicenza', name: '维琴察军营', country: 'us', lng: 11.55, lat: 45.55, role: '南欧陆军司令部', impact: 'medium' },
  { id: 'gar-uk-cyprus', name: '戴凯利亚基地', country: 'uk', lng: 33.73, lat: 35.0, role: '英军塞浦路斯主权基地', impact: 'low' },
  { id: 'gar-cn-ream', name: '柬埔寨云壤海军基地', country: 'china', lng: 103.52, lat: 10.62, role: '中柬海军合作保障设施（公开报道）', impact: 'medium' },
  { id: 'gar-ru-vietnam', name: '金兰湾（俄使用权）', country: 'russia', lng: 109.2, lat: 11.9, role: '俄海军太平洋补给节点（公开报道）', impact: 'medium' },
  { id: 'gar-fr-cotedivoire', name: '阿比让法军基地', country: 'france', lng: -4.01, lat: 5.32, role: '法军在科特迪瓦驻军', impact: 'low' },
  { id: 'gar-uk-falklands', name: '蒙特维德军营', country: 'uk', lng: -58.45, lat: -51.7, role: '英军福克兰群岛驻军', impact: 'low' },
  ...DENSIFY_GARRISONS,
];
