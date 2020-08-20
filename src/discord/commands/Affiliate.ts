import { Command, CommandMessage, Discord } from "@typeit/discord";
import { AffiliateLink } from "../../db/entity/AffiliateLink";
import EntityManager from "../../db/EntityManager";
import { logger } from "../../Kitsune";
import slugify from "slugify";

export abstract class Affiliate {
  @Command("affiliate :action")
  async affiliate(message: CommandMessage) {
    const link = await EntityManager.getMongoRepository(AffiliateLink).findOne({
      discordId: message.author.id,
    });

    const { action } = message.args;
    logger.info(`Executed affiliate command - action ${action ?? "info"}`);

    switch (action) {
      case "create":
        if (link) {
          return await message.reply(
            `you already have an affiliate link. https://affiliate.kitsune.su/${link.slug}`
          );
        }
        const slug = slugify(
          `${message.author.username}${message.author.discriminator}`,
          { lower: true, replacement: "-" }
        );
        const newLink = new AffiliateLink();
        newLink.discordId = message.author.id;
        newLink.linkHits = 0;
        newLink.slug = slug;
        newLink.hitIPs = [];
        await EntityManager.save(newLink);
        return await message.reply(
          `you have successfully created your affiliate link https://affiliate.kitsune.su/${slug}`
        );
      case "delete":
        if (!link) {
          return await message.reply(
            "you are not an affiliate, therefore you cannot use this command."
          );
        }
        await EntityManager.delete(AffiliateLink, {
          discordId: message.author.id,
        });
        return await message.reply(
          `you have deleted your affiliate link. If you want to change your mind, you can create it again at any time!`
        );
      case undefined:
      case null:
      case "info":
      default:
        if (!link) {
          return await message.reply(
            "you are not an affiliate. If you want to become one, use command `k!affiliate create`"
          );
        }

        return await message.reply(
          `you have invited ${link.linkHits} people over your affiliate link https://affiliate.kitsune.su/${link.slug}`
        );
    }
  }
}
