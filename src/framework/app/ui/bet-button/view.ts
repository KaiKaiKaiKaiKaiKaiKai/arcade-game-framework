import { Container, Sprite, Text, Texture } from 'pixi.js'

export class BetButton extends Container {
  private background: Sprite
  private text: Text

  constructor(props: { text: string }) {
    super()

    this.background = Sprite.from(Texture.WHITE)
    this.background.height = 25
    this.background.width = 25
    this.background.tint = 0xa1a1a1

    this.text = new Text(props.text, { fill: 0x101010, fontSize: 15, fontWeight: 'bold' })

    this.addChild(this.background)
    this.addChild(this.text)

    this.text.x = (this.background.width - this.text.width) / 2
    this.text.y = (this.background.height - this.text.height) / 2
  }
}
