import * as cheerio from "cheerio";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

import {
  CORPORATIONS,
  GAME_IDS,
  MONTHS,
  RESULTS_BY_DATE_URL,
  RESULTS_TODAY_URL,
  TARGET_KEYS,
} from "../constants";
import { GameID } from "../enum/game-id.enum";
import { ResultTime } from "../enum/time.enum";
import { Keys } from "../enum/keys.enum";
import { Corporation } from "../enum/corporation.enum";
import { ResponseBody } from "../interfaces/response-body.interface";
import { TableData } from "../interfaces/table-data.interface";
import { Month } from "../enum/month.enum";
import { getDays } from "../helper/getDays";

const parseResults = async (options: { url: string }) => {
  const responseData: ResponseBody[] = [];
  try {
    const document = await cheerio.fromURL(options.url);

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
  } catch (error) {
    console.error(error);
    throw new createHttpError.NotFound(
      "The page could not be found or the server encountered an error while parsing."
    );
  }

  return responseData;
};

export const getResultsToday = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const responseData = await parseResults({
    url: RESULTS_TODAY_URL,
  });

  res.status(200).send(responseData);
};

export const getResultsByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // ? 3-9 letters month
  // ? 1-2 digits days
  // ? 4 digits year
  const dateRegex = /\w{3,9}-\d{1,2}-\d{4}/g;
  const { date } = req.params;

  if (!date.match(dateRegex)) {
    next(
      new createHttpError.BadRequest(
        "Please adhere to the proper format, see at <link>"
      )
    );
    return;
  }

  // ? double check date
  // ? start of records from site =  aug 26, 2020 - present
  // ? start date that can be scraped with current impl = june 3 2024
  const [month, day, year] = date.split("-");

  if (!MONTHS.includes(month.toLowerCase() as Month)) {
    next(new createHttpError.BadRequest("Please send a valid month."));
    return;
  }

  const monthDays = getDays(parseInt(year), MONTHS.indexOf(month as Month));
  const validYear = 2020;

  if (parseInt(day) > monthDays || parseInt(day) <= 0) {
    next(
      new createHttpError.BadRequest(
        `Days of ${`${month.charAt(0).toUpperCase()}${month
          .slice(1, month.length)
          .toLowerCase()}`} are only ${monthDays}.`
      )
    );
    return;
  }

  if (parseInt(year) < validYear) {
    next(
      new createHttpError.BadRequest(
        `Years earlier than ${validYear} is not supported.`
      )
    );
    return;
  }

  const url = RESULTS_BY_DATE_URL + date;

  const responseData = await parseResults({
    url,
  });

  res.status(200).send(responseData);
};
