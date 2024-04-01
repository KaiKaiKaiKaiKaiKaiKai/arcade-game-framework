import { Sprite, Texture } from 'pixi.js'

export class Ball extends Sprite {
  constructor() {
    super()

    this.texture = Texture.from('ball')
    this.y = 200
  }
}
