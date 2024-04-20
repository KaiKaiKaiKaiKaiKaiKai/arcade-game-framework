import { UIView } from './view'

/**
 * Represents the UI controller responsible for managing the user interface.
 */
export class UI {
  /**
   * The view instance associated with the UI.
   * @type {UIView}
   */
  public view: UIView

  /**
   * Creates an instance of the UI controller.
   * @param {Object} props - The properties required to initialize the UI.
   * @param {string} props.name - The name of the game.
   * @param {number} props.rtp - The RTP (Return to Player) percentage of the game.
   */
  constructor(props: { name: string; rtp: number }) {
    const { name, rtp } = props

    // Initialize the view with provided properties
    this.view = new UIView({ name, rtp })
  }
}
