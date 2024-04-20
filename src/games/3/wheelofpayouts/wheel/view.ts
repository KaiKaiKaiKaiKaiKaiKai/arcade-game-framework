import gsap from 'gsap'
import { Sprite, Text, Texture } from 'pixi.js'

type Value = number | string

/**
 * Represents a spinning wheel in the game.
 * @extends Sprite
 */
export class Wheel extends Sprite {
  /** The base values on the wheel. */
  private baseValues: Array<Value>
  /** The values that trigger a double effect. */
  private doubleValues: Array<Value>
  /** Text objects representing the values on the wheel. */
  private texts: Array<Text> = []
  /** Indicates if the previous spin was a double. */
  private wasDouble: boolean = false

  /**
   * Creates an instance of the Wheel.
   * @param {Object} props - The properties of the wheel.
   * @param {Array<Value>} props.baseValues - The base values on the wheel.
   * @param {Array<Value>} props.doubleValues - The doubled up values on the wheel.
   */
  constructor(props: { baseValues: Array<Value>; doubleValues: Array<Value> }) {
    super(Texture.from('wheel'))

    this.anchor.set(0.5)

    this.baseValues = props.baseValues
    this.doubleValues = props.doubleValues

    // Create text labels for each value on the wheel
    for (let i = 0; i < this.baseValues.length; i++) {
      const value = this.baseValues[i]
      const text = new Text(`${value}`, {
        fill: 0x000000,
        fontWeight: typeof value === 'string' ? 'bold' : 'normal',
        fontSize: 80,
      })

      text.anchor.set(0.5)

      // Position the text label around the wheel
      text.x = (Math.cos((i / this.baseValues.length) * Math.PI * 2) * this.width) / Math.PI
      text.y = (Math.sin((i / this.baseValues.length) * Math.PI * 2) * this.height) / Math.PI
      text.angle = (i / this.baseValues.length) * 360 + 90

      this.texts.push(text)
      this.addChild(text)
    }
  }

  /** Pauses animations. */
  private async pause() {
    await gsap.to(this, { duration: 0.5 })
  }

  /**
   * Updates the numbers on the wheel.
   * @param {boolean} isDouble - Indicates if it's a double spin.
   * @param {number} duration - Duration of the animation.
   */
  private async updateNumbers(isDouble: boolean, duration: number) {
    await this.pause()

    for (const text of this.texts) {
      const value = Number(text.text)

      if (Number.isNaN(value)) continue

      let newValue: number
      let newWeight: 'bold' | 'normal'

      if (isDouble) {
        if (value === 0) {
          newValue = 1
        } else {
          newValue = value * 2
        }

        newWeight = 'bold'
      } else {
        if (value === 1) {
          newValue = 0
        } else {
          newValue = value / 2
        }

        newWeight = 'normal'
      }

      // Update the text label with new value and font weight
      await gsap.to(text, {
        alpha: 0,
        duration: duration / 2,
      })
      text.text = `${newValue}`
      text.style.fontWeight = newWeight
      await gsap.to(text, { alpha: 1, duration: duration / 2 })
    }
  }

  /**
   * Rotates the wheel to a final angle.
   * @param {number} finalAngle - The final angle of rotation.
   */
  private async rotate(finalAngle: number) {
    // Rotate the wheel several times before spinning to give a more realistic effect
    await gsap.to(this, { angle: `+=${360 * 5}`, duration: 2, ease: 'sine.in' })
    await gsap.to(this, {
      angle: 360 * 10 + finalAngle + 10,
      duration: 2,
      ease: 'sine.out',
    })
    await gsap.to(this, {
      angle: '-=10',
      duration: 0.5,
      ease: 'sine.inOut',
    })

    // Set the final angle of rotation
    this.angle = finalAngle
  }

  /**
   * Spins the wheel.
   * @param {number} win - The payout amount.
   */
  public async spin(win: number) {
    // If the previous spin was a double, reset the numbers
    if (this.wasDouble) {
      await this.updateNumbers(false, 0.5)
    }

    // Determine if it's a double spin
    const onlyDouble = !this.baseValues.includes(win)
    const isDouble = this.doubleValues.includes(win) && (onlyDouble || Math.random() < 0.25)

    // Get the list of values to spin to
    const values = isDouble ? this.doubleValues : this.baseValues
    const index = values.indexOf(win)

    // If it's a double spin, handle double logic
    if (isDouble) {
      const doubleIndex = values.findIndex((value) => typeof value === 'string')
      const doubleAngle = -(doubleIndex / values.length) * 360

      // Rotate to the double symbol position
      await this.rotate(doubleAngle)
      await this.pause()

      // Scale up the double symbol text
      await gsap.to(this.texts[doubleIndex].scale, { x: 1.5, y: 1.5, duration: 0.5 })

      // Update the numbers on the wheel
      await this.updateNumbers(true, 0.5)

      // Scale down the double symbol text
      await gsap.to(this.texts[doubleIndex].scale, { x: 1, y: 1, duration: 0.5 })
      await this.pause()
    }

    // Rotate to the winning value position
    const angle = -(index / values.length) * 360
    await this.rotate(angle)

    // If there's a win, scale up the winning value text
    if (win) {
      await this.pause()
      await gsap.to(this.texts[index].scale, { x: 1.5, y: 1.5, duration: 0.5 })
      await this.pause()
      await gsap.to(this.texts[index].scale, { x: 1, y: 1, duration: 0.5 })
    }

    // Update the flag for the next spin
    this.wasDouble = isDouble
  }
}
