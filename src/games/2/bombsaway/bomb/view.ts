import gsap from 'gsap'
import { Container, Sprite, Texture } from 'pixi.js'

/**
 * Represents a bomb in the game.
 * @extends Container
 */
export class Bomb extends Container {
  /** The sprite representing the bomb. */
  private bomb: Sprite
  /** The sprite representing the flame. */
  private flame: Sprite
  /** The sprite representing the explosion. */
  private explosion: Sprite
  /** The sprite representing the wire above the bomb. */
  private wire: Sprite
  /** The sprite representing the back wire behind the wire. */
  private backWire: Sprite
  /** The length of the wire. */
  private _wireLength!: number

  constructor() {
    super()

    // Initialize container properties
    this.sortableChildren = true

    // Initialize sprites for bomb, flame, explosion, and wire
    this.bomb = Sprite.from('bomb')
    this.backWire = Sprite.from(Texture.WHITE)
    this.wire = Sprite.from(Texture.WHITE)
    this.flame = Sprite.from('flame')
    this.explosion = Sprite.from('explosion')

    // Configure visual properties of wire, backWire, and flame
    this.backWire.tint = 0xe8d1a1
    this.backWire.alpha = 0.5
    this.wire.tint = 0xe8d1a1
    this.wire.height = 1
    this.wire.width = 10
    this.flame.visible = false
    this.explosion.visible = false
    this.explosion.scale.set(0)

    // Add sprites to the container
    this.addChild(this.bomb)
    this.addChild(this.backWire)
    this.addChild(this.wire)
    this.addChild(this.flame)
    this.addChild(this.explosion)
  }

  /**
   * Sets the length of the wire.
   */
  public set wireLength(length: number) {
    this._wireLength = length

    // Adjust wire and backWire visuals based on wire length
    this.wire.x = this.bomb.width / 2 - this.wire.width / 2
    this.wire.scale.y = this._wireLength
    this.wire.y = -this._wireLength
    this.backWire.height = this.wire.height
    this.backWire.width = this.wire.width
    this.backWire.x = this.wire.x
    this.backWire.y = this.wire.y
    this.flame.y = -this._wireLength - this.flame.height
    this.flame.scale.set(0)
  }

  /**
   * Lights the bomb's flame.
   */
  public async light() {
    this.flame.visible = true

    // Animate flame scaling
    gsap.to(this.flame.scale, {
      x: 0.5,
      y: 0.5,
      duration: 0.5,
      onUpdate: () => {
        this.flame.x = this.bomb.width / 2 - this.flame.width / 2
      },
      ease: 'sine.out',
    })
  }

  /**
   * Starts the bomb's timer animation.
   * @param {number} duration - The duration of the timer animation.
   */
  public async startTimer(duration: number) {
    // Animate wire scaling to simulate timer countdown
    await gsap.to(this.wire.scale, {
      y: 0,
      duration,
      onUpdate: () => {
        this.wire.y = -this.wire.height
        this.flame.y = -this.wire.height - this.flame.height
      },
      ease: 'none',
    })

    // Hide wire after timer completes
    this.wire.visible = false
  }

  /**
   * Initiates the explosion animation.
   */
  public async explode() {
    // Animate flame scaling to simulate flame extinguishing
    await gsap.to(this.flame.scale, {
      x: 0,
      y: 0,
      duration: 0.5,
      onUpdate: () => {
        this.flame.y = -this.wire.height - this.flame.height
        this.flame.x = this.bomb.width / 2 - this.flame.width / 2
      },
      ease: 'none',
    })

    // Hide flame after animation completes
    this.flame.visible = false
    this.flame.scale.set(0)

    // Show explosion animation
    this.explosion.visible = true
    this.explosion.alpha = 1

    // Animate explosion scaling and position
    await gsap.to(this.explosion.scale, {
      x: 1,
      y: 1,
      duration: 0.5,
      ease: 'sine.out',
      onUpdate: () => {
        this.explosion.x = this.bomb.width / 2 - this.explosion.width / 2
        this.explosion.y = this.bomb.height / 2 - this.explosion.height / 2
      },
    })

    // Fade out explosion animation
    this.bomb.alpha = 0.5
    await gsap.to(this.explosion, { alpha: 0, duration: 0.2 })

    // Reset explosion animation state
    this.explosion.visible = false
    this.explosion.scale.set(0)
  }

  /**
   * Resets the bomb to its initial state.
   */
  public async reset() {
    // If bomb is already active, return
    if (this.bomb.alpha === 1) return

    // Show wire and reset its alpha and position
    this.wire.alpha = 0
    this.wire.scale.y = this._wireLength
    this.wire.y = -this.wire.height
    this.wire.visible = true

    // Animate bomb and wire to show reset state
    await Promise.all([
      gsap.to(this.bomb, { alpha: 1, duration: 0.5 }),
      gsap.to(this.wire, { alpha: 1, duration: 0.5 }),
    ])
  }
}
