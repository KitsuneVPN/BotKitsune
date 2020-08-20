import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";

@Entity()
export class AffiliateLink {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  slug: string;

  @Column()
  discordId: string;

  @Column()
  linkHits: number;

  @Column()
  hitIPs: string[];
}
