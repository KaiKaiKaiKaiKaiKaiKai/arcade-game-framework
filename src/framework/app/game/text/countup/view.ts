import gsap from 'gsap'
import { Text, TextStyle } from 'pixi.js'

/**
 * Represents a text element with countup animation functionality.
 */
export class CountupText extends Text {
  /** The current value for countup animation. */
  private value = 0
  /** The number of decimal places to round the displayed value. */
  private fixed: number
  /** The prefix to display before the countup value. */
  private prefix: string
  /** The Tween instance for countup animation. */
  public countupTween!: gsap.core.Tween

  /**
   * Creates an instance of the CountupText class.
   * @param {Object} props - The properties for initializing the countup text.
   * @param {string} props.text - The initial text content.
   * @param {Partial<TextStyle>} props.options - The text style options.
   * @param {number} props.fixed - The number of decimal places to round the displayed value.
   * @param {string} props.prefix - The prefix to display before the countup value.
   */
  constructor(props: { text: string; options: Partial<TextStyle>; fixed: number; prefix: string }) {
    const { text, options, fixed, prefix } = props

    // Call super constructor to initialize Text element
    super(text, options)

    // Initialize properties
    this.fixed = fixed
    this.prefix = prefix
  }

  /**
   * Performs countup animation to the specified value.
   * @param {number} to - The target value for countup animation.
   * @param {number} duration - The duration of the countup animation in seconds.
   * @returns {Promise<void>} A promise that resolves when the countup animation is completed.
   */
  public async countup(to: number, duration: number): Promise<void> {
    // Initialize text dimensions
    let textWidth = this.width
    let textHeight = this.height

    // Create countup animation Tween
    this.countupTween = gsap.to(this, {
      duration,
      value: to,
      ease: 'sine.inOut',
      onUpdate: () => {
        // Update text content with prefixed value
        this.text = `${this.prefix}${parseFloat(this.value.toString()).toFixed(this.fixed)}`

        // Calculate scale to fit text within original dimensions
        const scale = Math.min(textWidth / this.width, textHeight / this.height, 1)

        // Apply scale to maintain text size
        this.scale.x *= scale
        this.scale.y *= scale
      },
      onComplete: () => {
        // Reset value after completion
        this.value = 0
      },
    })

    // Wait for countup animation to complete
    await this.countupTween
  }
}
