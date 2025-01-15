import {createPool, Pool} from "mysql2/promise";
import {fetchPayload, storePayload} from "@hocuspocus/server";
import {Database as DatabaseExtension} from "@hocuspocus/extension-database";

export default class Database {

  pool: Pool

  constructor(
    public type: string,
    public host: string,
    public port: number,
    public user: string,
    public password: string,
    public database: string,
  ) {
    let config = {host, port, user, password, database}
    this.pool = createPool(config)

    config.password = '***'
    console.log('Create database pool with:', config)
  }

  async fetch({ documentName }: fetchPayload) {
    try {
      const [rows] = await this.pool.execute(
        "SELECT data FROM documents WHERE name = ? LIMIT 1",
        [documentName]
      ) as any
      if (rows.length === 0) {
        return null
      }
      return rows[0].data
    } catch (error) {
      console.error("Error fetching document from MySQL:", error)
      throw error
    }
  }

  async store({ documentName, state }: storePayload){
    try {
      await this.pool.execute(
        `
      INSERT INTO documents (name, data) VALUES (?, ?)
      ON DUPLICATE KEY UPDATE data = VALUES(data)
      `,
        [documentName, state]
      )
    } catch (error) {
      console.error("Error storing document to MySQL:", error)
      throw error
    }
  }

  getExtension() {
    return new DatabaseExtension({
      fetch: payload => this.fetch(payload),
      store: payload => this.store(payload),
    })
  }

}

