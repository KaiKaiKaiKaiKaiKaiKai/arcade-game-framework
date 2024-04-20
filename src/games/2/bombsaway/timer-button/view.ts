import { Sprite, Texture } from 'pixi.js'
import { Button } from '../../../../framework/app/game/button/view'
import gsap from 'gsap'

/**
 * Represents a timer button used in the game.
 * @extends Button
 */
export class TimerButton extends Button {
  /** The duration of the timer animation. */
  public duration: number
  /** The GSAP tween object for timer animation. */
  public timeTween!: gsap.core.Tween
  /** Flag indicating if the button is selected. */
  public selected: boolean = false
  /** The background sprite of the button. */
  private background: Sprite

  /**
   * Creates an instance of TimerButton.
   * @param {object} props - The properties of the timer button.
   * @param {string} props.text - The text displayed on the button.
   * @param {number} props.duration - The duration of the timer animation.
   */
  constructor(props: { text: string; duration: number }) {
    const { text, duration } = props
    super({ text })

    // Set duration and create background sprite
    this.duration = duration
    this.background = Sprite.from(Texture.WHITE)

    // Set initial properties of the background sprite
    this.background.height = 0
    this.background.width = this.width
    this.background.tint = 0x3eb489
    this.background.zIndex = 0

    // Add background sprite to the button
    this.addChild(this.background)
  }

  /**
   * Initiates the timer animation.
   */
  public async time() {
    // Start the timer animation and await its completion
    this.timeTween = gsap.to(this.background, {
      height: this.height,
      duration: this.duration,
      ease: 'none',
    })
    await this.timeTween
  }

  /**
   * Resets the timer animation.
   */
  public async reset() {
    // Reset the height of the background sprite
    await gsap.to(this.background, { height: 0, duration: 0.2, ease: 'none' })
  }

  /**
   * Disables the button.
   */
  public async disable() {
    if (this.selected) {
      // If the button is selected, reset its state and disable it
      this.selected = false
      super.disable()
      gsap.killTweensOf(this)
    } else {
      // Otherwise, simply disable the button
      await super.disable()
    }
  }
}
