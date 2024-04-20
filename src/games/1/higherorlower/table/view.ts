import { Sprite, Texture } from 'pixi.js'

/**
 * Represents the table sprite in the game.
 * @extends Sprite
 */
export class Table extends Sprite {
  /**
   * Creates an instance of the Table.
   */
  constructor() {
    super()

    // Assigning the table texture
    this.texture = Texture.from('table')

    // Setting the zIndex to ensure proper layering
    this.zIndex = 0
  }
}
