import { IGame } from '../../../framework/app/game/interface'
import { Game } from '../../../framework/app/game/controller'

export class TrickyCups extends Game {
  constructor(props: IGame) {
    super(props)
  }

  public async play(props: { win: number }): Promise<void> {
    await this.view.play(props)
  }
}
