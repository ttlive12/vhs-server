import { Mode, Format, Rank } from './enums';

export const RANKLIST: Rank[] = [Rank.TOP_LEGEND, Rank.DIAMOND_4TO1, Rank.DIAMOND_TO_LEGEND, Rank.TOP_5K];

export const mode2Format = {
  [Mode.STANDARD]: Format.STANDARD,
  [Mode.WILD]: Format.WILD,
};
