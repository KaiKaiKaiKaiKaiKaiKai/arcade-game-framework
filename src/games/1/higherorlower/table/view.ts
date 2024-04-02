import { Sprite, Texture } from 'pixi.js'

export class Table extends Sprite {
  constructor() {
    super()

    this.texture = Texture.from('table')
    this.zIndex = 0
  }
}
