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

  public get payout(): string {
    return this.database.payout[this.gameId]
  }

  public get win(): boolean {
    const payout = Number(this.database.payout[this.gameId])
    const rtp = Number(this.database.rtp[this.gameId])

    return Math.random() < (rtp * 1) / payout
  }
}
