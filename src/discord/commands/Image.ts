import { Command, CommandMessage } from "@typeit/discord";
import uwu from "axios";
import { MessageEmbed, User } from "discord.js";
import { Kitsune } from "../../Kitsune";

type RRAImageObject = {
  id: string;
  path: string;
  type: string;
  nsfw: boolean;
};

export abstract class Image {
  @Command("pat")
  async pat(message: CommandMessage) {
    const mention = message.mentions.users.first();

    if (!mention) {
      return message.reply("you can't pat air, silly.");
    }

    if (mention.id === message.author.id) {
      return message.reply("how do you pat yourself? ^_^");
    }

    const response = await uwu.request<RRAImageObject>({
      method: "GET",
      url: "https://rra.ram.moe/i/r?type=pat",
    });

    const { path } = response.data;

    return message.channel.send(
      this.embed(
        `There there, ${this.name(mention)}`,
        `${this.name(message.author)} pats ${this.name(mention)}`,
        this.link(path)
      )
    );
  }

  @Command("cuddle")
  async cuddle(message: CommandMessage) {
    const mention = message.mentions.users.first();

    if (!mention) {
      return message.reply("tell me, how does it feel to cuddle air?");
    }

    if (mention.id === message.author.id) {
      return message.reply(
        "just asking for a friend, how can you cuddle yourself? ^_^"
      );
    }

    const response = await uwu.request<RRAImageObject>({
      method: "GET",
      url: "https://rra.ram.moe/i/r?type=cuddle",
    });

    const { path } = response.data;

    return message.channel.send(
      this.embed(
        `Don't be sad, I'm here to cuddle you, ${this.name(mention)}`,
        `${this.name(message.author)} cuddles with ${this.name(mention)}`,
        this.link(path)
      )
    );
  }

  @Command("kiss")
  async kiss(message: CommandMessage) {
    const mention = message.mentions.users.first();

    if (!mention) {
      return message.reply("kissing nothing huh? How is it? owo");
    }

    if (mention.id === message.author.id) {
      return message.reply(
        "I believe it is not possible to kiss yourself, or is it? uwu"
      );
    }

    const response = await uwu.request<RRAImageObject>({
      method: "GET",
      url: "https://rra.ram.moe/i/r?type=kiss",
    });

    const { path } = response.data;

    return message.channel.send(
      this.embed(
        `Just a kiss, don't be embarrassed, ${this.name(mention)}`,
        `${this.name(message.author)} gave a kiss to ${this.name(mention)}`,
        this.link(path)
      )
    );
  }

  @Command("slap")
  async slap(message: CommandMessage) {
    const mention = message.mentions.users.first();

    if (!mention) {
      return message.reply("why would you slap air? What did it do to you?");
    }

    if (mention.id === message.author.id) {
      return message.reply("don't slap yourself, it's fine.");
    }

    const response = await uwu.request<RRAImageObject>({
      method: "GET",
      url: "https://rra.ram.moe/i/r?type=slap",
    });

    const { path } = response.data;

    return message.channel.send(
      this.embed(
        `How dare you, ${this.name(mention)}`,
        `${this.name(message.author)} slapped ${this.name(mention)}`,
        this.link(path)
      )
    );
  }

  @Command("hug")
  async hug(message: CommandMessage) {
    const mention = message.mentions.users.first();

    if (!mention) {
      return message.reply(
        "everyone wants to hug someone, but air? :thinking:"
      );
    }

    if (mention.id === message.author.id) {
      return message.reply(
        "don't hug yourself, ask someone for a hug instead! owo"
      );
    }

    const response = await uwu.request<RRAImageObject>({
      method: "GET",
      url: "https://rra.ram.moe/i/r?type=hug",
    });

    const { path } = response.data;

    return message.channel.send(
      this.embed(
        `I'm here to huggle you, ${this.name(mention)}`,
        `${this.name(message.author)} hugs ${this.name(mention)}`,
        this.link(path)
      )
    );
  }

  @Command("tickle")
  async tickle(message: CommandMessage) {
    const mention = message.mentions.users.first();

    if (!mention) {
      return message.reply("you can't tickle air, at least I think so.");
    }

    if (mention.id === message.author.id) {
      return message.reply(
        "it's not the same as if someone else were to tickle ya."
      );
    }

    const response = await uwu.request<RRAImageObject>({
      method: "GET",
      url: "https://rra.ram.moe/i/r?type=tickle",
    });

    const { path } = response.data;

    return message.channel.send(
      this.embed(
        `I'm gonna tickle you, ${this.name(mention)}`,
        `${this.name(message.author)} tickles ${this.name(mention)}`,
        this.link(path)
      )
    );
  }

  name(user: User) {
    return user.username;
  }

  embed(title: string, subtitle: string, image: string) {
    const embed = new MessageEmbed()
      .setColor("#ff9d5a")
      .setTitle(title)
      .setImage(image)
      .setFooter(`Kitsune v${Kitsune.getVersion()}`)
      .setAuthor(subtitle);

    return embed;
  }

  link(path: string) {
    return `https://cdn.ram.moe/${path.replace("/i/", "")}`;
  }
}
