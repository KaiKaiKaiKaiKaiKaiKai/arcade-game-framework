import { Cups } from './cups/view'
import { Ball } from './ball/view'
import { GameView } from '../../../framework/app/game/view'
import { Table } from './table/view'
import { WinText } from '../../../framework/app/game/text/win/view'

export class TrickyCupsView extends GameView {
  private winText: WinText
  private ball!: Ball
  private cups: Cups
  private table: Table

  constructor() {
    super()

    this.scaleFactor = 0.8
    this.sortableChildren = true

    this.table = new Table()

    this.cups = new Cups()
    this.cups.x = this.table.width / 2 - this.cups.width / 2

    this.winText = new WinText()
    this.winText.zIndex = 3
    this.winText.x = this.table.width / 2
    this.winText.y = this.table.y + this.table.height / 2

    this.addChild(this.table)
    this.addChild(this.cups)
    this.addChild(this.winText)
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
    } else {
      await this.winText.showWin(win)
    }

    this.ball.destroy()
  }
}
