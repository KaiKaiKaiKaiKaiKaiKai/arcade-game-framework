import { Container, Sprite, Text, Texture } from 'pixi.js'

export class TrickyCupsView extends Container {
  constructor() {
    super()

    const text = new Text('Tricky Cups', { fill: 0xffffff })
    const texture = Texture.from('flowers')
    const sprite = new Sprite(texture)
    this.addChild(text)
    this.addChild(sprite)
  }
}
