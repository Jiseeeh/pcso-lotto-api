import { Corporation } from "./enum/corporation.enum";
import { Keys } from "./enum/keys.enum";
import { GameID } from "./enum/game-id.enum";
import { ResultTime } from "./enum/time.enum";

export const RESULTS_URL =
  "https://www.lottopcso.com/lotto-result-today-summary/";

export const GAME_IDS = [
  GameID.UltraLotto_6_58,
  GameID.GrandLotto_6_55,
  GameID.MegaLotto_6_45,
  GameID.Lotto_6_42,
  GameID.Lotto_6D,
  GameID.Lotto_4D,
  GameID.Lotto_2D,
  GameID.STL_Swer3,
];

export const TARGET_KEYS = [
  ResultTime.MORNING_10_00,
  ResultTime.AFTERNOON_2_00,
  ResultTime.AFTERNOON_3_00,
  ResultTime.AFTERNOON_5_00,
  ResultTime.EVENING_7_00,
  ResultTime.EVENING_9_00,
  // Keys.FIRST_PRIZE,
  // Keys.JACKPOT_PRIZE,
  // Keys.NUMBER_OF_WINNERS,
  Keys.WINNING_COMBINATION,
];

export const CORPORATIONS = [
  Corporation.LAPU_LAPU_CITY,
  Corporation.MANDAUE_CITY,
];
