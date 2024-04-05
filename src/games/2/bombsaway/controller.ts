import { Game, GameProps } from '../../../framework/app/game/controller'
import { BombsAwayView } from './view'

export class BombsAway extends Game<BombsAwayView> {
  constructor(props: GameProps<BombsAwayView>) {
    super(props)
  }

  public async play(props: { win: number }): Promise<void> {
    await this.view.play(props)
  }
}
