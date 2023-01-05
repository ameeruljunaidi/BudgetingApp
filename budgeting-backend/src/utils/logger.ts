import * as console from "console";

// const logCondition = (): boolean => {
//     const NODE_ENV = process.env.NODE_ENV;
//     const PINO_LOG = process.env.PINO_LOG;
//
//     return !(NODE_ENV && NODE_ENV === "test" && PINO_LOG && PINO_LOG === "false");
// };
//
// const pinoLogger = (filename: string) =>
//     pino({
//         name: `${filename}`,
//         transport: {
//             target: "pino-pretty",
//             options: {
//                 translateTime: "SYS:yy/mm/dd hh:mm:ss",
//                 ignore: "pid.hostname",
//             },
//         },
//         enabled: logCondition(),
//     });

const myLogger = (filename: string) => {
    const prefix = (level: string) => `[${level}] (${filename}):`

    return {
        info: (obj: any, msg?: string) => typeof obj === "string" ? console.info(prefix("INFO"), obj) : console.info(prefix("INFO"), msg, obj),
        fatal: (obj: any, msg?: string) => typeof obj === "string" ? console.error(prefix("ERROR"), obj) : console.error(prefix("ERROR"), msg, obj),
        warn: (obj: any, msg?: string) => typeof obj === "string" ? console.error(prefix("WARN"), obj) : console.error(prefix("WARN"), msg, obj),
    }
}

export default myLogger;
