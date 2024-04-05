import { GameView } from '../../../framework/app/game/view'
import { WinText } from '../../../framework/app/game/text/win/view'

export class BombsAwayView extends GameView {
  private winText: WinText

  constructor() {
    super()

    this.scaleFactor = 1
    this.sortableChildren = true

    this.winText = new WinText()
    this.winText.zIndex = 3

    this.winText.x = this.width / 2
    this.winText.y = this.height / 2

    this.addChild(this.winText)
  }

  public async play(props: { win: number }) {
    const { win } = props

    if (win) {
      await this.winText.showWin(win)
    }
  }
}
