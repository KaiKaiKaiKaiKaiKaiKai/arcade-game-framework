import { Game, GameProps } from '../../../framework/app/game/controller'
import { HigherOrLowerView } from './view'

export class HigherOrLower extends Game<HigherOrLowerView> {
  constructor(props: GameProps<HigherOrLowerView>) {
    super(props)
  }

  public async play(props: { win: number }): Promise<void> {
    await this.view.play(props)
  }
}
