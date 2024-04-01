import { Game, GameProps } from '../../../framework/app/game/controller'
import { TrickyCupsView } from './view'

export class TrickyCups extends Game<TrickyCupsView> {
  constructor(props: GameProps<TrickyCupsView>) {
    super(props)
  }

  public async play(props: { win: number }): Promise<void> {
    await this.view.play(props)
  }
}
