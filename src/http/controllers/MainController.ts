import fastifyPlugin from "fastify-plugin";
import { Connection } from "typeorm";
import { discordInvite } from "../../../config";
import { AffiliateLink } from "../../db/entity/AffiliateLink";

export type MainControllerOptions = {
  db: Connection;
};

export default fastifyPlugin((server, { db }: MainControllerOptions, next) => {
  server.get("/kitsune", (_, res) => {
    res.header("Location", discordInvite);
    res.status(307).send("Redirecting to Discord.");
  });

  server.get("/:slug", async (req, res) => {
    if (!req.params || !req.params.slug) {
      res.header("Location", "/");
      res.status(307).send("Redirecting to index.");
      return;
    }

    const link = await db.mongoManager
      .getMongoRepository(AffiliateLink)
      .findOne({ slug: req.params.slug });
    if (!link) {
      // res.setHeader("Location", "/");
      res.header("Location", "/");
      res.status(307).send("Redirecting to index.");
      return;
    }

    if (!link.hitIPs.includes(req.ip)) {
      link.hitIPs = [...link.hitIPs, req.ip];
      link.linkHits = link.linkHits + 1;
    }

    db.mongoManager.save(link);

    res.header("Location", discordInvite);
    res.status(307).send("Redirecting to Discord.");
  });

  next();
});
