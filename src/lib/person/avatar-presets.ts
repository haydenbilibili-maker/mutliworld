/**
 * 知名公众人物 Wikipedia Commons 缩略图（稳定 thumb URL）
 * 按 person id 索引；其余人物由 Dicebear 自动生成
 */

export const WIKIPEDIA_AVATAR_PRESETS: Record<string, string> = {
  // 全球
  'per-g-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Ant%C3%B3nio_Guterres_%282024%29.jpg/220px-Ant%C3%B3nio_Guterres_%282024%29.jpg',
  'per-g-2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Ursula_von_der_Leyen_%282024%29.jpg/220px-Ursula_von_der_Leyen_%282024%29.jpg',
  'per-g-4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Jerome_H._Powell.jpg/220px-Jerome_H._Powell.jpg',
  'per-g-11': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png/220px-Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png',
  'per-g-14': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Vladimir_Putin_%282020-02-20%29.jpg/220px-Vladimir_Putin_%282020-02-20%29.jpg',
  'per-g-15': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Xi_Jinping_2019.jpg/220px-Xi_Jinping_2019.jpg',
  'per-g-16': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/220px-Donald_Trump_official_portrait.jpg',
  'per-g-17': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg',
  'per-g-21': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Benjamin_Netanyahu%2C_February_2023.jpg/220px-Benjamin_Netanyahu%2C_February_2023.jpg',
  // 中国
  'per-cn-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Xi_Jinping_2019.jpg/220px-Xi_Jinping_2019.jpg',
  'per-cn-2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Li_Qiang_20230312.jpg/220px-Li_Qiang_20230312.jpg',
  'per-cn-8': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/William_Lai_Ching-te_2024.jpg/220px-William_Lai_Ching-te_2024.jpg',
  'per-cn-10': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Shigeru_Ishiba_20241001.jpg/220px-Shigeru_Ishiba_20241001.jpg',
  'per-cn-13': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Kim_Jong_Un_2019_%28cropped%29.jpg/220px-Kim_Jong_Un_2019_%28cropped%29.jpg',
  'per-cn-19': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Ren_Zhengfei_2019.jpg/220px-Ren_Zhengfei_2019.jpg',
  // 中东（种子中部分人物已有 avatar，此处补充其余要员）
  'per-ir-4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Hossein_Salami_2019.jpg/220px-Hossein_Salami_2019.jpg',
  'per-me-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Mohammed_bin_Salman_%28cropped%29.jpg/220px-Mohammed_bin_Salman_%28cropped%29.jpg',
  // 北美
  'per-na-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Donald_Trump_official_portrait.jpg/220px-Donald_Trump_official_portrait.jpg',
  'per-na-7': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Jerome_H._Powell.jpg/220px-Jerome_H._Powell.jpg',
  'per-na-10': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/220px-Elon_Musk_Royal_Society_%28crop2%29.jpg',
  'per-na-11': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Tim_Cook_2009_cropped.jpg/220px-Tim_Cook_2009_cropped.jpg',
  'per-na-22': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Warren_Buffett_KU_Visit.jpg/220px-Warren_Buffett_KU_Visit.jpg',
  // 西欧
  'per-we-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Ursula_von_der_Leyen_%282024%29.jpg/220px-Ursula_von_der_Leyen_%282024%29.jpg',
  'per-we-3': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Emmanuel_Macron_%28cropped%29.jpg/220px-Emmanuel_Macron_%28cropped%29.jpg',
  'per-we-4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Olaf_Scholz_2023.jpg/220px-Olaf_Scholz_2023.jpg',
  'per-we-5': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Keir_Starmer_Official_Portrait.jpg/220px-Keir_Starmer_Official_Portrait.jpg',
  'per-we-6': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Giorgia_Meloni_Official_2022.jpg/220px-Giorgia_Meloni_Official_2022.jpg',
  // 东欧
  'per-ee-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Vladimir_Putin_%282020-02-20%29.jpg/220px-Vladimir_Putin_%282020-02-20%29.jpg',
  'per-ee-2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Volodymyr_Zelensky_Official_portrait.jpg/220px-Volodymyr_Zelensky_Official_portrait.jpg',
  'per-ee-3': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Alexander_Lukashenko_%282021%29.jpg/220px-Alexander_Lukashenko_%282021%29.jpg',
  'per-ee-4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Viktor_Orban_2022.jpg/220px-Viktor_Orban_2022.jpg',
  // 亚太
  'per-ap-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Shigeru_Ishiba_20241001.jpg/220px-Shigeru_Ishiba_20241001.jpg',
  'per-ap-3': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png/220px-Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png',
  'per-ap-4': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Anthony_Albanese_2022.jpg/220px-Anthony_Albanese_2022.jpg',
  // 东南亚
  'per-sea-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Prabowo_Subianto_2024.jpg/220px-Prabowo_Subianto_2024.jpg',
  'per-sea-2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Ferdinand_Marcos_Jr._2022.jpg/220px-Ferdinand_Marcos_Jr._2022.jpg',
  // 拉美
  'per-la-1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Lula_-_foto_oficial_-_05-01-2023.jpg/220px-Lula_-_foto_oficial_-_05-01-2023.jpg',
  'per-la-2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Javier_Milei_2023.jpg/220px-Javier_Milei_2023.jpg',
  'per-la-3': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Gustavo_Petro_2022.jpg/220px-Gustavo_Petro_2022.jpg',
};
