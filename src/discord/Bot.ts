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
import { Kitsune, logger } from "../Kitsune";
import { MessageEmbed } from "discord.js";

@Discord("k!", {
  import: [path.join(__dirname, "commands", "*.ts")],
})
abstract class Bot {
  @CommandNotFound()
  async unknown(message: CommandMessage) {
    await message.reply(
      "this command doesn't exist. use `k!help` to get help!"
    );
  }

  @Command("help")
  async help(message: CommandMessage) {
    const embed = new MessageEmbed()
      .setTitle("Help")
      .setDescription("Hey there, I'm Kitsune and I'm here to pamper you!")
      .addFields(
        {
          name: "Image Commands",
          value:
            "**k!pat @mention** - Pat someone, everyone likes pats ^_^\n" +
            "**k!cuddle @mention** - Cuddle, how cute. uwu\n" +
            "**k!hug @mention** - Friendly hug from a friend. owo\n" +
            "**k!kiss @mention** - Just a cute kiss\n" +
            "**k!slap @mention** - Slap slap, how dare you!\n" +
            "**k!tickle @mention** - Tickle someone, and they can tickle you too\n",
        },
        {
          name: "Affiliate Commands",
          value:
            "**k!affiliate / k!affiliate info** - Check your affiliate status\n" +
            "**k!affiliate create** - Create an affiliate link\n" +
            "**k!affiliate delete** - Delete your affiliate link\n",
        },
        {
          name: "Other Commands",
          value: "**k!help** - Show help\n",
        }
      )
      .setFooter(`Kitsune v${Kitsune.getVersion()}`)
      .setColor("#ff9d5a");

    return message.channel.send(embed);
  }

  @On("message")
  logCommand([message]: ArgsOf<"message">) {
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
