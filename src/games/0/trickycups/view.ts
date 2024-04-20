import { Cups } from './cups/view'
import { Ball } from './ball/view'
import { GameView } from '../../../framework/app/game/view'
import { Table } from './table/view'
import { Game0Setup, Setup } from '../../../framework/connection/database/interface'

/**
 * Represents the view for the Tricky Cups game.
 * @extends GameView
 */
export class TrickyCupsView extends GameView {
  private ball!: Ball
  private cups!: Cups
  private table!: Table

  /**
   * Creates an instance of TrickyCupsView.
   * @param {Setup} setup - The setup for the Tricky Cups game.
   */
  constructor(setup: Setup) {
    super(setup)
  }

  /**
   * Creates the initial elements for the Tricky Cups game.
   * @protected
   */
  protected createInitial() {
    this.scaleFactor = 0.95
    this.sortableChildren = true

    this.table = new Table()

    const { cupAmount } = this.setup as Game0Setup

    this.cups = new Cups(cupAmount)
    this.cups.x = this.table.width / 2 - this.cups.width / 2

    this.addChild(this.table)
    this.addChild(this.cups)
  }

  /**
   * Handles the user's selection.
   * @private
   * @param {number} win - The payout.
   * @returns {Promise<void>} A promise that resolves when the user's selection is processed.
   */
  private async userSelection(win: number): Promise<void> {
    await this.cups.userSelection(win)
  }

  /**
   * Places the ball on the winning cup.
   * @private
   */
  private placeBall(): void {
    const winningCup = this.cups.winningCup
    const { x, width } = winningCup

    this.ball = new Ball()
    this.ball.x = this.cups.x + x + width / 2 - this.ball.width / 2

    this.addChild(this.ball)
  }

  /**
   * Initiates the play action for the Tricky Cups game.
   * @param {Object} props - The properties required for playing the game.
   * @param {number} props.win - The payout.
   * @returns {Promise<void>} A promise that resolves when the play action is completed.
   */
  public async play(props: { win: number }): Promise<void> {
    const { win } = props

    this.placeBall()

    await this.cups.liftWinningCup()

    this.ball.destroy()

    await this.cups.shuffleCups()
    await this.userSelection(win)

    this.placeBall()

    await this.cups.liftChosenCup()

    if (!win) {
      await this.cups.liftWinningCup()
    }

    this.ball.destroy()
  }
}
