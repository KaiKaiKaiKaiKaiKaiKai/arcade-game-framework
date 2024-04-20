import { Sprite, Texture } from 'pixi.js'

/**
 * Represents the table sprite in the Tricky Cups game.
 * @extends Sprite
 */
export class Table extends Sprite {
  /**
   * Creates an instance of Table.
   */
  constructor() {
    super()

    // Set the texture of the table sprite
    this.texture = Texture.from('table')

    // Position the table sprite vertically
    this.y = 200

    // Set the z-index of the table sprite
    this.zIndex = 0
  }
}
