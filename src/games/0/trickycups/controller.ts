import { Game, GameProps } from '../../../framework/app/game/controller'
import { TrickyCupsView } from './view'

/**
 * Represents the Tricky Cups game.
 * @extends Game
 */
export class TrickyCups extends Game<TrickyCupsView> {
  /**
   * Creates an instance of TrickyCups.
   * @param {GameProps<TrickyCupsView>} props - The properties for initializing the TrickyCups game.
   */
  constructor(props: GameProps<TrickyCupsView>) {
    super(props)
  }

  /**
   * Initiates the play action for the Tricky Cups game.
   * @param {Object} props - The properties required for playing the game.
   * @param {number} props.win - The win amount.
   * @returns {Promise<void>} A promise that resolves when the play action is completed.
   */
  public async play(props: { win: number }): Promise<void> {
    await this.view.play(props)
  }
}
