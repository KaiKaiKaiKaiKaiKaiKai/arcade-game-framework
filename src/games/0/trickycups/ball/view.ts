import { Sprite, Texture } from 'pixi.js'

/**
 * Represents the ball sprite in the Tricky Cups game.
 * @extends Sprite
 */
export class Ball extends Sprite {
  /**
   * Creates an instance of Ball.
   */
  constructor() {
    super()

    // Set the texture of the ball sprite (assuming 'ball' is the texture key)
    this.texture = Texture.from('ball')

    // Set the initial y position of the ball sprite
    this.y = 200
  }
}
