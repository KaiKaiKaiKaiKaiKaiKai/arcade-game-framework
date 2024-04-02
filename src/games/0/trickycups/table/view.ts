import { Sprite, Texture } from 'pixi.js'

export class Table extends Sprite {
  constructor() {
    super()

    this.texture = Texture.from('table')
    this.y = 200
    this.zIndex = 0
  }
}
