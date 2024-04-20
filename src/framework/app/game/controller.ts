import { Setup } from '../../connection/database/interface'
import { GameView } from './view'

/**
 * Represents the properties required to initialize a game.
 * @template TGameView - The type of game view.
 */
export interface GameProps<TGameView> {
  /** The setup data for the game. */
  setup: Setup
  /** The class constructor for the game view. */
  viewClass: new (setup: Setup) => TGameView
}

/**
 * Represents an abstract base class for implementing game view.
 * @template TGameView - The type of game view.
 */
export abstract class Game<TGameView extends GameView> {
  /** The setup data for the game. */
  protected setup: Setup
  /** The view instance associated with the game. */
  public view: TGameView

  /**
   * Creates an instance of the Game class.
   * @param {GameProps<TGameView>} props - The properties required to initialize the game.
   */
  constructor(props: GameProps<TGameView>) {
    const { setup, viewClass } = props

    // Initialize properties
    this.setup = setup
    this.view = new viewClass(setup)
  }

  /**
   * Abstract method representing the play action of the game.
   * Must be implemented by subclasses.
   * @param {Object} props - The properties required for the play action.
   * @param {number} props.win - The payout won in the game.
   * @returns {Promise<void>} A promise that resolves when the play action is completed.
   */
  public abstract play(props: { win: number }): Promise<void>
}
