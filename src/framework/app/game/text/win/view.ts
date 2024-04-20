import { Container, TextStyle } from 'pixi.js'
import { CountupText } from '../countup/view'
import gsap from 'gsap'

/**
 * Represents a container for displaying win text.
 */
export class WinText extends Container {
  /** The countup text instance for displaying the win amount. */
  private countupText: CountupText
  /** The container for scaling the win text. */
  private scaleContainer: Container

  /**
   * Creates an instance of the WinText class.
   * @param {Partial<TextStyle>} options - Optional text style options.
   */
  constructor(options?: Partial<TextStyle>) {
    super()

    // Initialize properties
    this.visible = false
    this.scaleContainer = new Container()

    // Set default text style options
    const style = options || {
      dropShadow: { angle: 1.5, alpha: 0.8, blur: 10, color: '#000000', distance: 0 },
      fill: '#ffffff',
      fontSize: 160,
      fontWeight: 'bold',
    }

    // Create countup text instance
    this.countupText = new CountupText({ text: 'FUN0.00', options: style, fixed: 2, prefix: 'FUN' })
    this.countupText.anchor.set(0.5, 0.5)

    // Add elements to container
    this.addChild(this.scaleContainer)
    this.scaleContainer.addChild(this.countupText)
  }

  /**
   * Shows the win amount with animation.
   * @param {number} win - The win amount to display.
   * @returns {Promise<void>} A promise that resolves when the win display animation completes.
   */
  public async showWin(win: number): Promise<void> {
    // Scale up animation
    this.scaleContainer.scale.set(0)
    this.visible = true
    gsap.to(this.scaleContainer.scale, { x: 1, y: 1, duration: 1, ease: 'back.out' })

    // Countup animation
    this.countupText.countup(win, 2)

    // Click event to skip animation
    window.addEventListener('click', () => {
      window.removeEventListener('click', () => {})
      this.countupText.countupTween.seek(1.99)
    })

    // Await countup animation completion
    await this.countupText.countupTween
    // Fade out animation
    await gsap.to(this, { duration: 1 })
    // Scale down animation
    await gsap.to(this.scaleContainer.scale, { x: 0, y: 0, duration: 1, ease: 'back.in' })

    // Reset and hide container
    this.visible = false
    this.scaleContainer.scale.set(1)
  }

  /**
   * Handles resizing of the win text.
   * @param {Object} props - The properties containing width, height, and offset dimensions.
   * @param {number} props.width - The width dimension.
   * @param {number} props.height - The height dimension.
   * @param {number} props.offset - The offset dimension.
   */
  public handleResize(props: { width: number; height: number; offset: number }): void {
    const { width, height, offset } = props

    // Calculate scale based on available dimensions
    const scale =
      Math.min(width / this.countupText.width, (height - offset) / this.countupText.height, 1) * 0.9

    // Apply scale and position
    this.scale.set(scale)
    this.x = width / 2
    this.y = height / 2 - offset / 2
  }
}
