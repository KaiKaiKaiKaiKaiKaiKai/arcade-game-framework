import databaseJson from '../../database/database.json'
import { IDatabase, Setup } from './database/interface'

/**
 * Represents a connection model for interacting with game data.
 */
export class ConnectionModel {
  private database: IDatabase
  private gameId: number

  /**
   * Creates an instance of ConnectionModel.
   * @param {number} props.gameId - The ID of the game.
   */
  constructor(props: { gameId: number }) {
    this.database = databaseJson as IDatabase
    this.gameId = props.gameId
  }

  /**
   * Retrieves the name of the game.
   * @type {string}
   */
  public get name(): string {
    return this.database.name[this.gameId]
  }

  /**
   * Retrieves the rules of the game.
   * @type {string}
   */
  public get rules(): string {
    return this.database.rules[this.gameId]
  }

  /**
   * Retrieves the RTP (Return to Player) of the game.
   * @type {number}
   */
  public get rtp(): number {
    return this.database.rtp[this.gameId]
  }

  /**
   * Retrieves the payout options of the game.
   * @type {Array<number>}
   */
  public get payout(): Array<number> {
    return this.database.payout[this.gameId]
  }

  /**
   * Retrieves the weight options of the game.
   * @type {Array<number>}
   */
  public get weight(): Array<number> {
    return this.database.weight[this.gameId]
  }

  /**
   * Retrieves the setup details of the game.
   * @type {Setup}
   */
  public get setup(): Setup {
    return this.database.setup[this.gameId]
  }

  /**
   * Retrieves the starting bank amount.
   * @type {number}
   */
  public get bank(): number {
    return 500
  }

  /**
   * Retrieves the starting bet amount.
   * @type {number}
   */
  public get bet(): number {
    return 1
  }

  /**
   * Calculates the next bet amount based on the current bet and whether to increase or decrease.
   * @param {boolean} increase - Whether to increase the bet.
   * @param {number} currentBet - The current bet amount.
   * @returns {number} - The next bet amount.
   */
  public getNextBet(increase: boolean, currentBet: number): number {
    const betLevels = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500]
    return betLevels[betLevels.indexOf(currentBet) + (increase ? 1 : -1)] ?? currentBet
  }

  /**
   * Retrieves the win amount based on the game's RTP and payout options.
   * @type {number}
   */
  public get win(): number {
    const rtp = Number(this.rtp)
    const randomIndex = this.getWeightedRandom()
    const randomPayout = this.payout[randomIndex]

    return Math.random() < (rtp * 1) / randomPayout ? randomPayout : 0
  }

  /**
   * Generates a weighted random number to select from available options.
   * @private
   * @returns {number} - The index of the selected option.
   */
  private getWeightedRandom(): number {
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

  /**
   * Calculates the hit rate based on game parameters. (Only used for testing purposes.)
   * @private
   * @returns {number} - The hit rate as a percentage.
   */
  protected calculateHitRate(): number {
    const totalWeight = this.weight.reduce((sum, weight) => sum + weight, 0)
    let hitRate = 0

    for (let i = 0; i < this.payout.length; i++) {
      const selectProbability = this.weight[i] / totalWeight
      const conditionProbability = this.rtp / this.payout[i]
      hitRate += selectProbability * conditionProbability
    }

    return hitRate * 100
  }
}
