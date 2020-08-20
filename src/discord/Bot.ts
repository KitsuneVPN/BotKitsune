import {
  ArgsOf,
  Client,
  Command,
  CommandMessage,
  CommandNotFound,
  Discord,
  On,
} from "@typeit/discord";
import { botPrefix } from "../../config";
import path from "path";
import { logger } from "../Kitsune";

@Discord("k!", {
  import: [path.join(__dirname, "commands", "*.ts")],
})
abstract class Bot {
  @CommandNotFound()
  private async unknown(message: CommandMessage) {
    await message.reply("this command doesn't exist.");
  }

  @On("message")
  private logCommand([message]: ArgsOf<"message">) {
    if (message.content.startsWith(botPrefix)) {
      const { username, discriminator } = message.author;
      logger.info(
        `${username}#${discriminator} has executed ${
          message.cleanContent.split(" ")[0]
        }`
      );
    }
  }
}
