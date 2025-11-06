import fs from "fs";
export const logError = (errObj) => {
  const logPath = "server/logs/error_log.txt";
  const line = `[${new Date().toISOString()}] ${JSON.stringify(errObj)}\n`;
  fs.appendFileSync(logPath, line);
};
