import gsap from 'gsap'
import { CountupText } from '../../../framework/app/game/text/countup/view'
import { GameView } from '../../../framework/app/game/view'
import { Table } from './table/view'

export class HigherOrLowerView extends GameView {
  private winText: CountupText
  private table: Table

  constructor() {
    super()

    this.scaleFactor = 0.95

    this.table = new Table()

    this.winText = new CountupText('0', { fill: 0xffffff, fontSize: 80 })
    this.winText.zIndex = 3
    this.winText.x = this.table.width / 2
    this.winText.y = this.table.height / 2
    this.winText.scale.set(0)

    this.addChild(this.table)
    this.addChild(this.winText)
  }

  private async showWin(win: number) {
    gsap.to(this.winText.scale, { x: 2, y: 2, duration: 1, ease: 'back.out' })

    await this.winText.countup(win, 5)
    await gsap.to(this, { duration: 1 })
    await gsap.to(this.winText.scale, { x: 0, y: 0, duration: 1, ease: 'back.in' })
  }

  public async play(props: { win: number }) {
    const { win } = props

    if (win) {
      await this.showWin(win)
    }
  }
}
