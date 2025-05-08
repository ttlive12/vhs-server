export enum Rarity {
  FREE = 'FREE',
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
}

export enum Class {
  DRUID = 'DRUID',
  HUNTER = 'HUNTER',
  MAGE = 'MAGE',
  PALADIN = 'PALADIN',
  PRIEST = 'PRIEST',
  ROGUE = 'ROGUE',
  SHAMAN = 'SHAMAN',
  WARLOCK = 'WARLOCK',
  WARRIOR = 'WARRIOR',
  DEMONHUNTER = 'DEMONHUNTER',
  DEATHKNIGHT = 'DEATHKNIGHT',
  NEUTRAL = 'NEUTRAL',
  WHIZBANG = 'WHIZBANG',
  DREAM = 'DREAM',
}

export enum Mode {
  STANDARD = 'standard',
  WILD = 'wild',
}

export enum Format {
  STANDARD = '2',
  WILD = '1',
}

export enum Rank {
  TOP_LEGEND = 'top_legend',
  DIAMOND_4TO1 = 'diamond_4to1',
  DIAMOND_TO_LEGEND = 'diamond_to_legend',
  TOP_5K = 'top_5k',
}

export enum MinGames {
  // 卡组类型
  MIN_NULL = '',
  MIN_1000 = '1000',
  MIN_500 = '500',
  MIN_250 = '250',
  MIN_100 = '100',

  // 卡组
  MIN_6400 = '6400',
  MIN_3200 = '3200',
  MIN_1600 = '1600',
  MIN_800 = '800',
  MIN_400 = '400',
  MIN_200 = '200',
  MIN_50 = '50',
}
