import { Container, Sprite, Texture } from 'pixi.js'
import { GameView } from '../../../framework/app/game/view'
import { Wheel } from './wheel/view'
import { Game3Setup, Setup } from '../../../framework/connection/database/interface'

/**
 * Represents the view for the "Wheel of Payouts" game.
 * @extends GameView
 */
export class WheelOfPayoutsView extends GameView {
  /** The container for the wheel. */
  private wheelContainer!: Container
  /** The wheel instance. */
  private wheel!: Wheel

  /**
   * Creates an instance of WheelOfPayoutsView.
   * @param {Setup} setup - The setup for the game.
   */
  constructor(setup: Setup) {
    super(setup)
  }

  /**
   * Creates the initial setup for the view.
   * Overrides the method from the base class.
   */
  protected createInitial() {
    // Set up scaling and sorting properties
    this.scaleFactor = 0.95
    this.sortableChildren = true

    // Create the board sprite
    const board = new Sprite(Texture.from('board'))

    // Create the container for the wheel and position it
    this.wheelContainer = new Container()
    this.wheelContainer.angle = -90 // Rotate the wheel container
    this.wheelContainer.position.set(board.width / 2, board.height / 2)

    // Create and add the wheel to the wheel container
    this.wheel = new Wheel(this.setup as Game3Setup)
    this.wheelContainer.addChild(this.wheel)

    // Add the wheel container and board to the view
    this.addChild(this.wheelContainer)
    this.addChild(board)
  }

  /**
   * Initiates the spinning of the wheel.
   * @param {Object} props - The props object containing the win information.
   * @param {number} props.win - The payout amount.
   */
  public async play(props: { win: number }) {
    await this.wheel.spin(props.win)
  }
}
