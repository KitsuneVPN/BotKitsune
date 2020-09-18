import winston, { format, transports } from "winston";
import { createConnection, Connection } from "typeorm";

import fs from "fs";
import path from "path";
import { botToken, expressPort, mongoDbUri } from "../config";
import fastify, { FastifyInstance } from "fastify";
import fastifyStatic from "fastify-static";
import fastifyCors from "fastify-cors";
import morganBody from "morgan-body";
import { Client } from "@typeit/discord";
import MainController from "./http/controllers/MainController";
import { IncomingMessage, Server, ServerResponse } from "http";

const loggerFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} | ${level}: ${message}`;
});

type EnvironmentType = "development" | "production";

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        loggerFormat
      ),
      handleExceptions: true,
    }),
    new winston.transports.File({
      format: format.combine(format.timestamp(), loggerFormat),
      filename: path.join(__dirname, "../", "logs", "combined.log"),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, "../", "logs", "exceptions.log"),
    }),
  ],
});

export class Kitsune {
  connection: Connection;
  server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify();
  discord: Client;

  constructor() {
    this.init();
  }

  async init() {
    process.title = `Kitsune v${Kitsune.getVersion()}`;

    logger.info(process.title);
    logger.info(
      "This bot is provided as is, without any support or warranty whatsoever. May you encounter issues with this bot, we are not liable."
    );

    if (Kitsune.isDevelopment()) {
      logger.warn(
        "Kitsune is running in development mode. Please consider switching to production mode."
      );
    }

    await this.initDatabase();
    await this.initDiscord();
    await this.initExpress();
  }

  async initDiscord() {
    try {
      this.discord = new Client({
        classes: [
          `${__dirname}/discord/*Bot.ts`,
          `${__dirname}/discord/*Bot.js`,
        ],
        silent: false,
        variablesChar: ":",
      });
      await this.discord.login(botToken);
      logger.info(
        `Discord bot started. Logged in successfully as ${this.discord.user.username}#${this.discord.user.discriminator}`
      );
    } catch (e) {
      logger.error(
        "Unable to authenticate the bot. Please, check your botToken."
      );
      logger.error(e);
      process.exit(1);
    }
  }

  async initExpress() {
    this.server.register(fastifyCors);

    morganBody(this.server, {
      logIP: true,
      prettify: true,
      logResponseBody: false,
      theme: "dracula",
    });

    const log = fs.createWriteStream(
      path.join(__dirname, "../", "logs", "requests.log"),
      { flags: "a" }
    );

    morganBody(this.server, {
      logIP: true,
      prettify: true,
      noColors: true,
      logResponseBody: false,
      stream: log,
    });

    // passing connection is a bit of a cheating, since node.js does weird stuff
    // this.server.register(MainController, { db: this.connection });

    const staticRoute = path.join(__dirname, "../", "static");
    if (fs.existsSync(staticRoute)) {
      logger.info("Registering static route for folder static/");
      this.server.register(fastifyStatic, {
        root: staticRoute,
        wildcard: "/**",
      });
    } else {
      logger.warn(
        "Static route doesn't exist. Make sure you created the 'static' folder."
      );
    }

    this.server.register(MainController, { db: this.connection });

    try {
      await this.server.listen(expressPort, "127.0.0.1");
      logger.info(`Server is started. Listening on port ${expressPort}`);
    } catch (e) {
      logger.error(`Unable to start server on port ${expressPort}`);
      logger.error(e.message);
      process.exit(1);
    }
  }

  async initDatabase() {
    try {
      console.log();
      this.connection = await createConnection({
        type: "mongodb",
        url: mongoDbUri,
        database: "kitsune",
        useNewUrlParser: true,
        useUnifiedTopology: true,
        logging: true,
        entities: [path.join(__dirname, "db", "entity", "*.ts")],
      });
      logger.info("Successfully connected to the MongoDB database.");
    } catch (e) {
      logger.error("Unable to connect to the MongoDB database.");
      logger.error(e.message);
      process.exit(1);
    }
  }

  static isDevelopment() {
    const env: EnvironmentType =
      (process.env.NODE_ENV as EnvironmentType) ?? "development";
    return env === "development";
  }

  static getVersion() {
    try {
      return (
        JSON.parse(
          fs.readFileSync(path.join(__dirname, "/../package.json"), "utf-8")
        ).version || "1"
      );
    } catch (error) {
      return "1";
    }
  }
}

const bot = new Kitsune();
export default bot;
