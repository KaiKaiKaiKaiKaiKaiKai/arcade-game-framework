import { Game, GameProps } from '../../../framework/app/game/controller'
import { WheelOfPayoutsView } from './view'

export class WheelOfPayouts extends Game<WheelOfPayoutsView> {
  constructor(props: GameProps<WheelOfPayoutsView>) {
    super(props)
  }

  public async play(props: { win: number }): Promise<void> {
    await this.view.play(props)
  }
}
