import { ColorSource, Container, Sprite, Text, Texture } from 'pixi.js'

export class BetButton extends Container {
  private background: Sprite
  private text: Text

  constructor(props: { text: string; tint: ColorSource }) {
    super()

    const { text, tint } = props

    this.background = Sprite.from(Texture.WHITE)
    this.background.height = 25
    this.background.width = 25
    this.background.tint = tint

    this.text = new Text(text, { fill: 0x101010, fontSize: 15, fontWeight: 'bold' })

    this.addChild(this.background)
    this.addChild(this.text)

    this.text.x = (this.background.width - this.text.width) / 2
    this.text.y = (this.background.height - this.text.height) / 2
  }
}
