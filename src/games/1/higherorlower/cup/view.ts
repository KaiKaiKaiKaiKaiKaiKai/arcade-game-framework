import { Sprite, Texture } from 'pixi.js'

export class Cup extends Sprite {
  constructor() {
    super()

    this.texture = Texture.from('redcup')
    this.y = 300
  }
}
