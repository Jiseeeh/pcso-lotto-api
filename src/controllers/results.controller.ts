import * as cheerio from "cheerio";
import {Request, Response} from "express";
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
import {formatDate, formatGameId, getDays, groupBy} from "../helper";
import {redisClient} from "../lib/redisClient";

const cacheData = async ({data, expireTimeInSeconds}: { data: any, expireTimeInSeconds: number }) => {
    await redisClient.set('resultsCache', JSON.stringify(data), {
        EX: expireTimeInSeconds
    });
}

const parseResults = async (options: { url: string }) => {
    const now = new Date();
    const locale = "en-PH";
    const cachedResults = await redisClient.get('resultsCache');
    const resetHours = [10, 14, 15, 17, 19, 20, 21];

    if (cachedResults != null) {
        console.log(`Cache hit: ${now.toLocaleString(locale, {hour12: false})}`);

        return JSON.parse(cachedResults);
    }

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

                        if (key.includes("-") || key === "Stand by…" || key === "Updating…") {
                            if (!result) result = key;
                            else if (!result2) result2 = key;
                            else result3 = key;
                        }
                    }

                    // ? we only found 1 game in the current table with a description (more likely a 6D or 6/X lotto)
                    // ? so we reset gameId, description, and result to get the next game
                    if (gameId && description && result && !gameId2) {
                        data.push(<Game>{
                            gameId: formatGameId(gameId),
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
                            gameId: formatGameId(gameId),
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
                            gameId: formatGameId(gameId2),
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
                            gameId: formatGameId(gameId3),
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

        const grouped = groupBy(data, "gameId");
        const groupedData = {date: now.toLocaleString(locale, {hour12: false}).split(",")[0], ...grouped};

        // console.table(data);

        const hourNow = now.getHours();
        const msInASecond = 1000;
        const msInAnHour = 3_600_000;

        let expireHour = resetHours.find((hour) => hourNow < hour);
        let expireDate = now.getDate();
        let expireMinutes = 0;

        if (hourNow >= 21) {
            expireHour = resetHours[0];
            // ? next day
            expireDate++;
            expireMinutes = 30;
        }

        const expiryDate = new Date(now.getFullYear(), now.getMonth(), expireDate, expireHour, expireMinutes);
        const expireSeconds = Math.abs(now.valueOf() - expiryDate.valueOf());
        const expireTimeInSeconds = Math.round(expireSeconds / msInASecond);

        // ? earliest draw time is 10:30, reflect time is about 5 minutes
        // ? I made it 10 to make it safe as the same for the next if statement
        // ! IF THIS DID NOT WORK, THERE IS AN INSTANCE WHERE THE RESULTS
        // ! REFLECTS VERY LATE (20+MINUTES)
        if (now.getHours() === 10 && now.getMinutes() >= 40) {
            await cacheData({
                data: groupedData,
                expireTimeInSeconds
            });
            console.log(`Results cached for ${Math.round(expireSeconds / msInAnHour)} hour(s), will expire on ${expiryDate.toLocaleString('en-PH')}`);

        }

            // ? for exact minutes, e.g. 14:00
        // ? results reflect in about 5 minutes after draw time, I made it 10 minutes to make it safe.
        else if (now.getHours() !== 10 && now.getMinutes() >= 10) {
            await cacheData({
                data: groupedData,
                expireTimeInSeconds
            });
            console.log(`Results cached for ${Math.round(expireSeconds / msInAnHour)} hour(s), will expire on ${expiryDate.toLocaleString('en-PH')}`);

        } else {
            console.log(`Full fetch, minutes now: ${now.getMinutes()}`);
        }


        return groupedData;

    } catch (error) {
        console.error(error);
        throw new createHttpError.InternalServerError(
            "The server encountered an error while parsing the results."
        );
    }
};

export const getResultsTodayByGameId = async (req: Request, res: Response) => {
    const responseData: Record<string, Game> = await parseResults({
        url: RESULTS_TODAY_URL,
    });

    const gameId = req.params.gameId as string;

    const game = responseData[gameId];

    if (!game) {
        res.status(404).send({
            message: `The game with ID ${gameId} could not be found. This may be because there was no draw for it today, or the game ID was misspelled.`
        });
    }

    res.status(200).send({
        gameId,
        results:
            responseData[gameId]
    });
}

export const getResultsByDateAndByGameId = async (req: Request, res: Response) => {
    const date = req.params.date;
    checkDate(date);

    const url = RESULTS_BY_DATE_URL + date;

    const responseData: Record<string, Game> = await parseResults({
        url,
    });

    const gameId = req.params.gameId as string;
    const game = responseData[gameId];

    if (!game) {
        res.status(404).send({
            message: `The game with ID ${gameId} could not be found. This may be because there was no draw for it today, or the game ID was misspelled.`
        });
    }

    res.status(200).send({
        gameId,
        results:
            responseData[gameId]
    });
}

const checkDate = (date: string) => {
    // ? 3-9 letters month
    // ? 1-2 digits days
    // ? 4 digits year
    const dateRegex = /\w{3,9}-\d{1,2}-\d{4}/g;
    const earliestMonthIndex = 7;
    const earliestDay = 26;
    const earliestYear = 2020;
    const earliestDate = new Date(earliestYear, earliestMonthIndex, earliestDay);
    const now = new Date();

    if (!date.match(dateRegex)) {
        throw new createHttpError.BadRequest(
            "Please adhere to the proper format, see at <link>"
        );
    }

    const [month, day, year] = date.split("-");
    const givenMonth = month.toLowerCase() as Month;
    const givenMonthIndex = MONTHS.indexOf(givenMonth);

    // ? double check date
    // ? start of records from site =  aug 26, 2020 - present
    if (!MONTHS.includes(givenMonth)) {
        throw new createHttpError.BadRequest("Please send a valid month.");
    }

    const monthDays = getDays(parseInt(year), givenMonthIndex);

    if (parseInt(day) > monthDays || parseInt(day) <= 0) {
        throw new createHttpError.BadRequest(
            `Days of ${month.charAt(0).toUpperCase()}${month
                .slice(1, month.length)
                .toLowerCase()} are only ${monthDays}.`
        )
    }

    const givenDate = new Date(parseInt(year), givenMonthIndex, parseInt(day));

    if (givenDate < earliestDate) {
        throw new createHttpError.BadRequest(
            `Dates earlier than ${Month.AUGUST}, ${earliestDay} ${earliestYear} is not supported.`
        );
    }

    if (givenDate > now) {
        throw new createHttpError.BadRequest("Whoa there, time traveler! We don’t have results from the future yet. Try a date that’s not ahead of today.");
    }
}

export const getResultsToday = async (
    _: Request,
    res: Response,
) => {
    const now = new Date();
    const date = formatDate(now);

    const responseData = await parseResults({
        url: RESULTS_BY_DATE_URL + date,
    });

    res.status(200).send(responseData);
};

export const getResultsByDate = async (
    req: Request,
    res: Response,
) => {
    const {date} = req.params;

    checkDate(date);

    const url = RESULTS_BY_DATE_URL + date;

    const responseData = await parseResults({
        url,
    });

    res.status(200).send(responseData);
};
