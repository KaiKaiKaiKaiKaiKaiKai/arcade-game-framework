import { Game, GameProps } from '../../../framework/app/game/controller'
import { WheelOfPayoutsView } from './view'

/**
 * Represents the Wheel of Payouts game.
 * @extends Game
 */
export class WheelOfPayouts extends Game<WheelOfPayoutsView> {
  /**
   * Creates an instance of WheelOfPayouts.
   * @param {GameProps<WheelOfPayoutsView>} props - The properties for initializing the WheelOfPayouts game.
   */
  constructor(props: GameProps<WheelOfPayoutsView>) {
    super(props)
  }

  /**
   * Initiates the play action for the Wheel of Payouts game.
   * @param {Object} props - The properties required for playing the game.
   * @param {number} props.win - The win amount.
   * @returns {Promise<void>} A promise that resolves when the play action is completed.
   */
  public async play(props: { win: number }): Promise<void> {
    await this.view.play(props)
  }
}
