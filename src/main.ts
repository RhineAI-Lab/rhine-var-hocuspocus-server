import * as dotenv from 'dotenv'
dotenv.config()
import {Server} from "@hocuspocus/server"
import {Logger} from "@hocuspocus/extension-logger"
import Database from "./database";

const db = new Database(
  process.env.DATABASE_TYPE as string,
  process.env.DATABASE_HOST as string,
  parseInt(process.env.DATABASE_PORT as string),
  process.env.DATABASE_USER as string,
  process.env.DATABASE_PASSWORD as string,
  process.env.DATABASE_NAME as string,
)

const server = Server.configure({
  name: "rhine-var-server",
  port: 11600,
  extensions: [
    new Logger(),
    db.getExtension(),
  ],
})

server.listen().then(() => {
  console.log("Hocuspocus server is running on port 11600")
}).catch((error) => {
  console.error("Failed to start Hocuspocus server:", error)
})
