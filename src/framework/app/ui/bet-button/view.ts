import { ColorSource, Container, Sprite, Text, Texture } from 'pixi.js'

/**
 * Represents a bet button UI component.
 */
export class BetButton extends Container {
  private background: Sprite // Background sprite of the button
  private text: Text // Text label of the button

  /**
   * Creates an instance of the BetButton class.
   * @param {Object} props - The properties required to initialize the bet button.
   * @param {string} props.text - The text displayed on the button.
   * @param {ColorSource} props.tint - The color tint of the button background.
   */
  constructor(props: { text: string; tint: ColorSource }) {
    super()

    const { text, tint } = props

    // Create and configure the background sprite
    this.background = Sprite.from(Texture.WHITE)
    this.background.height = 25
    this.background.width = 25
    this.background.tint = tint

    // Create and configure the text label
    this.text = new Text(text, { fill: 0x101010, fontSize: 15, fontWeight: 'bold' })

    // Add background and text to the button container
    this.addChild(this.background)
    this.addChild(this.text)

    // Position the text label at the center of the button
    this.text.x = (this.background.width - this.text.width) / 2
    this.text.y = (this.background.height - this.text.height) / 2
  }
}
