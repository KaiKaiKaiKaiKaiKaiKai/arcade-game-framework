import databaseJson from '../../../database/database.json'

export class ConnectionModel {
  private database: IDatabase
  private gameId: number

  constructor(props: { gameId: number }) {
    this.database = databaseJson as IDatabase
    this.gameId = props.gameId
  }

  public get name(): string {
    return this.database.name[this.gameId]
  }

  public get rules(): string {
    return this.database.rules[this.gameId]
  }

  public get rtp(): string {
    return this.database.rtp[this.gameId]
  }
}
