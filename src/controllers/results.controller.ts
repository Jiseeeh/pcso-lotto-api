import { Request, Response, NextFunction } from "express";
import * as cheerio from "cheerio";

import { CORPORATIONS, GAME_IDS, RESULTS_URL, TARGET_KEYS } from "../constants";
import { GameID } from "../enum/game-id.enum";
import { ResultTime } from "../enum/time.enum";
import { Keys } from "../enum/keys.enum";
import { Corporation } from "../enum/corporation.enum";
import { ResponseBody } from "../interfaces/response-body.interface";
import { TableData } from "../interfaces/table-data.interface";

export const getResultsToday = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const document = await cheerio.fromURL(RESULTS_URL);
  const responseData: ResponseBody[] = [];

  document(".post_content")
    .find("figure")
    .each((_, figure) => {
      let gameId = document(figure)
        .find("table thead tr th:first strong")
        .text();
      let corporation: string | null = document(figure)
        .find("table thead tr th:last")
        .text();

      if (!gameId) {
        // ? retry to get the heading since some are not wrapped in strong.
        gameId = document(figure).find("table thead tr th:first").text();
      }

      if (!CORPORATIONS.includes(corporation as Corporation)) {
        corporation = null;
      }

      let key = "";
      let value = "";
      const out = new Map<String, TableData[]>();

      if (GAME_IDS.includes(gameId as GameID)) {
        document(figure)
          .find("table tbody tr")
          .each((_, tr) => {
            document(tr)
              .find("td")
              .each((idx, td) => {
                if (idx === 0) key = document(td).text();
                else value = document(td).text();
              });

            if (out.has(gameId)) {
              let arr = out.get(gameId)!;

              const newArr = [...arr, { time: key, winningNumbers: value }];

              out.set(gameId, newArr);
            } else {
              out.set(gameId, [{ time: key, winningNumbers: value }]);
            }
          });

        // ? cleanse map and retain only target keys ()
        out.forEach((tData, key) => {
          const newArr: TableData[] = [];
          for (let data of tData) {
            const dataKey = data.time as Keys | ResultTime;

            if (TARGET_KEYS.includes(dataKey)) {
              newArr.push({
                ...data,
                // ? Replacing the 6/XX key to be at 9 since it only draws every 21:00
                // ? to make the key (time) more meaningful
                time:
                  Keys.WINNING_COMBINATION === dataKey
                    ? ResultTime.EVENING_9_00
                    : data.time,
              });
            }

            out.set(key, newArr);
          }
        });

        responseData.push({
          data: out.get(gameId)!,
          corporation,
          gameId,
        });
      }
    });

  res.status(200).send(responseData);
};
