import databaseJson from '../../database/database.json'

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

  public get payout(): Array<string> {
    return this.database.payout[this.gameId]
  }

  public get bank(): number {
    return 500
  }

  public get bet(): number {
    return 10
  }

  public getNextBet(increase: boolean, currentBet: number): number {
    const betLevels = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500]
    return betLevels[betLevels.indexOf(currentBet) + (increase ? 1 : -1)] ?? currentBet
  }

  public get win(): number {
    const rtp = Number(this.database.rtp[this.gameId])
    const payout = this.database.payout[this.gameId]
    const randomPayout = Number(payout[Math.floor(Math.random() * payout.length)])

    return Math.random() < (rtp * 1) / randomPayout ? randomPayout : 0
  }
}
