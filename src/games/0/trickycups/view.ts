import { Cups } from './cups/view'
import { Ball } from './ball/view'
import { GameView } from '../../../framework/app/game/view'
import { Table } from './table/view'
import { Game0Setup, Setup } from '../../../framework/connection/database/interface'

export class TrickyCupsView extends GameView {
  private ball!: Ball
  private cups!: Cups
  private table!: Table

  constructor(setup: Setup) {
    super(setup)
  }

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

  private async userSelection(win: number) {
    await this.cups.userSelection(win)
  }

  private placeBall() {
    const winningCup = this.cups.winningCup
    const { x, width } = winningCup

    this.ball = new Ball()
    this.ball.x = this.cups.x + x + width / 2 - this.ball.width / 2

    this.addChild(this.ball)
  }

  public async play(props: { win: number }) {
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
