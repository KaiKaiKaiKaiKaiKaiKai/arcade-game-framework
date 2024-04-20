import { Container } from 'pixi.js'
import { Setup } from '../../connection/database/interface'

/**
 * Represents an abstract base class for implementing game views.
 */
export abstract class GameView extends Container {
  /** The setup data for the game view. */
  protected setup: Setup
  /** The scale factor for the game view. */
  public scaleFactor: number = 1

  /**
   * Creates an instance of the GameView class.
   * @param {Setup} setup - The setup data for the game view.
   */
  constructor(setup: Setup) {
    super()

    // Initialize properties
    this.setup = setup

    // Perform initial setup
    this.createInitial()
    this.pivot.set(this.width / 2, this.height / 2)
  }

  /**
   * Abstract method representing the play action of the game view.
   * Must be implemented by subclasses.
   * @param {Object} props - The properties required for the play action.
   * @param {number} props.win - The payout won in the game.
   * @returns {Promise<void>} A promise that resolves when the play action is completed.
   */
  public abstract play(props: { win: number }): Promise<void>

  /**
   * Abstract method to create initial elements of the game view.
   * Must be implemented by subclasses.
   */
  protected abstract createInitial(): void
}
