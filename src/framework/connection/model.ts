import databaseJson from '../../database/database.json'
import { IDatabase, Setup } from './database/interface'

export class ConnectionModel {
  private database: IDatabase
  private gameId: number

  constructor(props: { gameId: number }) {
    this.database = databaseJson as IDatabase
    this.gameId = props.gameId
  }

  private getWeightedRandom() {
    let totalWeight = 0
    let random

    for (let i = 0; i < this.weight.length; i++) {
      totalWeight += this.weight[i]
    }

    random = Math.random() * totalWeight

    for (let i = 0; i < this.weight.length; i++) {
      if (random < this.weight[i]) {
        return i
      }

      random -= this.weight[i]
    }

    return -1
  }

  private calculateHitRate(): number {
    // Calculate the total weight
    const totalWeight = this.weight.reduce((sum, weight) => sum + weight, 0)

    // Calculate the hit rate
    let hitRate = 0
    for (let i = 0; i < this.payout.length; i++) {
      // Calculate the probability of selecting this payout
      const selectProbability = this.weight[i] / totalWeight
      // Calculate the probability of the condition being true for this payout
      const conditionProbability = this.rtp / this.payout[i]
      // Add the product of the two probabilities to the hit rate
      hitRate += selectProbability * conditionProbability
    }

    // Return the hit rate as a percentage
    return hitRate * 100
  }

  public get name(): string {
    return this.database.name[this.gameId]
  }

  public get rules(): string {
    return this.database.rules[this.gameId]
  }

  public get rtp(): number {
    return this.database.rtp[this.gameId]
  }

  public get payout(): Array<number> {
    return this.database.payout[this.gameId]
  }

  public get weight(): Array<number> {
    return this.database.weight[this.gameId]
  }

  public get setup(): Setup {
    return this.database.setup[this.gameId]
  }

  public get bank(): number {
    return 500
  }

  public get bet(): number {
    return 1
  }

  public getNextBet(increase: boolean, currentBet: number): number {
    const betLevels = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500]
    return betLevels[betLevels.indexOf(currentBet) + (increase ? 1 : -1)] ?? currentBet
  }

  public get win(): number {
    const rtp = Number(this.rtp)
    const randomIndex = this.getWeightedRandom()
    const randomPayout = this.payout[randomIndex]

    return Math.random() < (rtp * 1) / randomPayout ? randomPayout : 0
  }
}
