import { GameView } from '../../../framework/app/game/view'

export class HigherOrLowerView extends GameView {
  constructor() {
    super()

    this.scaleFactor = 0.8
  }

  public async play(props: { win: number }) {}
}
