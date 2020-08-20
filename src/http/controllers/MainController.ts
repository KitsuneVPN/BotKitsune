import { Router } from "express";
import { Connection } from "typeorm";
import { discordInvite } from "../../../config";
import { AffiliateLink } from "../../db/entity/AffiliateLink";
import EntityManager from "../../db/EntityManager";

export class MainController {
  router: Router = Router();
  db: Connection;

  constructor(database: Connection) {
    this.db = database;
    this.get();
  }

  get() {
    this.router.get("/kitsune", (_, res) => {
      res.setHeader("Location", discordInvite);
      res.status(307).send("Redirecting to Discord.");
    });

    this.router.get("/:slug", async (req, res) => {
      if (!req.params || !req.params.slug) {
        res.setHeader("Location", "/");
        res.status(307).send("Redirecting to index.");
        return;
      }

      const link = await this.db.mongoManager
        .getMongoRepository(AffiliateLink)
        .findOne({ slug: req.params.slug });
      if (!link) {
        res.setHeader("Location", "/");
        res.status(307).send("Redirecting to index.");
        return;
      }

      if (!link.hitIPs.includes(req.ip)) {
        link.hitIPs = [...link.hitIPs, req.ip];
        link.linkHits = link.linkHits + 1;
      }

      this.db.mongoManager.save(link);

      res.setHeader("Location", discordInvite);
      res.status(307).send("Redirecting to Discord.");
    });
  }

  route() {
    return this.router;
  }
}

export default MainController;
