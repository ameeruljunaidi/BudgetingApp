import pino from "pino";

const logCondition = (): boolean => {
    const NODE_ENV = process.env.NODE_ENV;
    const PINO_LOG = process.env.PINO_LOG;

    return !(NODE_ENV && NODE_ENV === "test" && PINO_LOG && PINO_LOG === "false");
};

const pinoLogger = (filename: string) =>
    pino({
        name: `${filename}`,
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "SYS:yy/mm/dd hh:mm:ss",
                ignore: "pid.hostname",
                singleLine: true,
            },
        },
        enabled: logCondition(),
    });

export default pinoLogger;
