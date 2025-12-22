import chalk from "chalk";

export function requestLogger(req, res, next) {
  const time = new Date().toLocaleTimeString();
  console.log(
    chalk.cyan(`🕒 [${time}] `) +
      chalk.green(`${req.method}`) +
      " " +
      chalk.yellow(`${req.originalUrl}`)
  );
  next();
}
