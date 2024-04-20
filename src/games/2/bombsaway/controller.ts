import { Game, GameProps } from '../../../framework/app/game/controller'
import { BombsAwayView } from './view'

/**
 * Represents the Bombs Away game.
 * @extends Game
 */
export class BombsAway extends Game<BombsAwayView> {
  /**
   * Creates an instance of BombsAway.
   * @param {GameProps<BombsAwayView>} props - The properties for initializing the BombsAway game.
   */
  constructor(props: GameProps<BombsAwayView>) {
    super(props)
  }

  /**
   * Initiates the play action for the Bombs Away game.
   * @param {Object} props - The properties required for playing the game.
   * @param {number} props.win - The win amount.
   * @returns {Promise<void>} A promise that resolves when the play action is completed.
   */
  public async play(props: { win: number }): Promise<void> {
    await this.view.play(props)
  }
}
