import gsap from 'gsap'
import { Container, Sprite, Text, Texture } from 'pixi.js'

/**
 * Represents a clickable button with text.
 */
export class Button extends Container {
  /**
   * Creates an instance of the Button class.
   * @param {Object} props - The properties for initializing the button.
   * @param {string} props.text - The text content of the button.
   */
  constructor(props: { text: string }) {
    super()

    const { text } = props

    // Enable sorting of children by zIndex
    this.sortableChildren = true

    // Create background sprite
    const background = Sprite.from(Texture.WHITE)
    background.height = 130
    background.width = 130
    background.tint = 0x3e95b4
    background.zIndex = 0

    // Create label text
    const label = new Text(text, { fill: 0x101010, fontSize: 100, fontWeight: 'bold' })
    label.scale.set(1)
    label.x = (background.width - label.width) / 2
    label.y = (background.height - label.height) / 2
    label.zIndex = 1

    // Set initial transparency
    this.alpha = 0.5

    // Add background and label to the button container
    this.addChild(background)
    this.addChild(label)
  }

  /**
   * Enables the button for interaction.
   * @returns {Promise<void>} A promise that resolves when the button is fully enabled.
   */
  public async enable(): Promise<void> {
    // Animate button opacity to full visibility
    await gsap.to(this, { alpha: 1, duration: 0.5 })

    // Enable interactivity and change cursor to pointer
    this.interactive = true
    this.cursor = 'pointer'
  }

  /**
   * Disables the button for interaction.
   * @returns {Promise<void>} A promise that resolves when the button is fully disabled.
   */
  public async disable(): Promise<void> {
    // Disable interactivity and change cursor to default
    this.interactive = false
    this.cursor = 'default'

    // Animate button opacity to half visibility
    await gsap.to(this, { alpha: 0.5, duration: 0.5 })
  }
}
