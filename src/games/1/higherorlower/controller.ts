import { Game, GameProps } from '../../../framework/app/game/controller'
import { HigherOrLowerView } from './view'

/**
 * Represents the Higher or Lower game.
 * @extends Game
 */
export class HigherOrLower extends Game<HigherOrLowerView> {
  /**
   * Creates an instance of HigherOrLower.
   * @param {GameProps<HigherOrLowerView>} props - The properties for initializing the HigherOrLower game.
   */
  constructor(props: GameProps<HigherOrLowerView>) {
    super(props)
  }

  /**
   * Initiates the play action for the Higher or Lower game.
   * @param {Object} props - The properties required for playing the game.
   * @param {number} props.win - The win amount.
   * @returns {Promise<void>} A promise that resolves when the play action is completed.
   */
  public async play(props: { win: number }): Promise<void> {
    await this.view.play(props)
  }
}
