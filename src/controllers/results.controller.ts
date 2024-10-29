import * as cheerio from "cheerio";
import {NextFunction, Request, Response} from "express";
import createHttpError from "http-errors";

import {
    CORPORATIONS,
    DESCRIPTION_KEYS,
    GAME_IDS,
    MONTHS,
    RESULTS_BY_DATE_URL,
    RESULTS_TIME,
    RESULTS_TODAY_URL,
} from "../constants";
import {GameID} from "../enum/game-id.enum";
import {ResultTime} from "../enum/time.enum";
import {Keys} from "../enum/keys.enum";
import {Corporation} from "../enum/corporation.enum";
import {Month} from "../enum/month.enum";
import {Game} from "../interfaces/game.interface";
import {getDays} from "../helper/getDays";

const parseResults = async (options: { url: string }) => {
    try {
        const document = await cheerio.fromURL(options.url);

        let gameId = "",
            gameId2 = "",
            gameId3 = "",
            description = "",
            corporation = "",
            time = "",
            result = "",
            result2 = "",
            result3 = "";
        const data: Game[] = [];

        function resetValues() {
            gameId = "";
            gameId2 = "";
            gameId3 = "";
            result = "";
            result2 = "";
            result3 = "";
        }

        // ? look to the respective table in the site while tracking the code (easy way)
        document(".post_content")
            .find("figure")
            .each((_, figure) => {
                const tableHeaderRowChildren = document(figure)
                    .find("table thead tr")
                    .children();
                const tableBodyRowChildren = document(figure)
                    .find("table tbody")
                    .children();

                // ? loops over the table head rows to get all current games
                // ? + the current corporation (if existing)
                // ? + the current description (if existing)
                for (const c of tableHeaderRowChildren) {
                    const key = document(c).text();

                    if (GAME_IDS.includes(key as GameID)) {
                        if (!gameId) gameId = key;
                        else if (!gameId2) gameId2 = key;
                        else gameId3 = key;
                    }

                    if (CORPORATIONS.includes(key as Corporation)) {
                        corporation = key;
                    }

                    if (DESCRIPTION_KEYS.includes(key as Keys)) {
                        description = key;
                    }

                }

                for (let i = 0; i < tableBodyRowChildren.length; i++) {
                    const rowChildren = document(tableBodyRowChildren[i]).children();

                    for (let j = 0; j < rowChildren.length; j++) {
                        const key = document(rowChildren[j]).text();

                        if (DESCRIPTION_KEYS.includes(key as Keys)) {
                            description = key;

                            if (gameId && gameId2) resetValues();
                        }

                        if (RESULTS_TIME.includes(key as ResultTime)) time = key;

                        if (key.includes("-")) {
                            if (!result) result = key;
                            else if (!result2) result2 = key;
                            else result3 = key;
                        }

                    }

                    // ? we only found 1 game in the current table with a description (more likely a 6D or 6/X lotto)
                    // ? so we reset gameId, description, and result to get the next game
                    if (gameId && description && result && !gameId2) {
                        data.push(<Game>{
                            gameId,
                            description,
                            time: time ? time : RESULTS_TIME[RESULTS_TIME.length - 1],
                            corporation,
                            result,
                        });

                        if (gameId && !gameId2) {
                            gameId = "";
                            description = "";
                            result = "";
                        }
                    }

                    // ? for gameId, we reset result if we don't have a second game
                    // ? for the server to set [result] to its respective gameId on table body loop
                    if (gameId && time && result) {
                        data.push({
                            gameId,
                            description,
                            time,
                            corporation,
                            result,
                        });

                        if (!gameId2) result = "";

                    }

                    // ? for gameId2, we reset result if we don't have a third game
                    // ? for the same reason as above.
                    if (gameId2 && time && result2) {
                        data.push({
                            gameId: gameId2,
                            description,
                            time,
                            corporation,
                            result: result2,
                        });


                        if (!gameId3) {
                            result = "";
                            result2 = "";
                        }
                    }

                    // ? for gameId3, we reset all results since this will be the last game
                    if (gameId3 && time && result3) {
                        data.push({
                            gameId: gameId3,
                            description,
                            time,
                            corporation,
                            result: result3,
                        });

                        result = "";
                        result2 = "";
                        result3 = "";
                    }

                }
                // ? reset all values every table
                resetValues();
                corporation = "";
            });

        console.table(data);

        return data;

    } catch (error) {
        throw new createHttpError.InternalServerError(
            "The server encountered an error while parsing the results."
        );
    }
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
    const {date} = req.params;

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
                `Days of ${month.charAt(0).toUpperCase()}${month
                    .slice(1, month.length)
                    .toLowerCase()} are only ${monthDays}.`
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
