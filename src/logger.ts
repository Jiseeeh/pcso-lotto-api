import pino from "pino";

export const logger = pino({
    transport: {
        targets: [
            {
                target: "pino-http-print",
                options: {
                    all: true,
                    translateTime: true,
                },
                level: "debug",
            },
            {
                target: "pino/file",
                options: {destination: "./src/logs/debug.log"},
                level: "debug",
            },
        ],
    },
});
