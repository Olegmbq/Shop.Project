import chalk from "chalk";

export function errorHandler(err, req, res, next) {
  const time = new Date().toLocaleTimeString();

  console.error(
    chalk.red.bold("❌ ERROR!") +
      " " +
      chalk.magenta(`[${time}]`) +
      " " +
      chalk.yellow(`${req.method} ${req.originalUrl}`) +
      "\n" +
      chalk.white(err.message)
  );

  res.status(500).json({ message: "Internal Server Error" });
}
