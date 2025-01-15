import {Hocuspocus} from "@hocuspocus/server";
import { Logger } from "@hocuspocus/extension-logger";
import { SQLite } from "@hocuspocus/extension-sqlite";

const server = new Hocuspocus({
  name: "rhine-var-server",
  port: 11600,
  extensions: [
    new Logger(),
    new SQLite({
      database: 'db.sqlite'
    }),
  ],
})
server.listen()
