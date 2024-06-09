import { pino } from "pino";
// import prettyPrint from "pino-pretty";

const isDevelopment = process.env.NODE_ENV !== "production";

const transport = {
  target: "pino-pretty",
  options: {
    customLevels: "request_info:35", // split by ','
    customColors: "request_info:magenta", // split by ','
    useOnlyCustomProps: false,
  },
};

export const logger = pino({
  customLevels: {
    // color: 'indigo',
    request_info: 35,
  },
  // color my custom level
  // useOnlyCustomLevels: true,

  // ...(false ? transport : undefined),
  transport: isDevelopment ? transport : undefined,
});
