import gsap from 'gsap'
import { Container, Sprite, Text, Texture } from 'pixi.js'

export class Button extends Container {
  constructor(props: { text: string }) {
    super()

    const { text } = props

    this.sortableChildren = true

    const background = Sprite.from(Texture.WHITE)

    background.height = 130
    background.width = 130
    background.tint = 0x3e95b4
    background.zIndex = 0

    const label = new Text(text, { fill: 0x101010, fontSize: 50, fontWeight: 'bold' })

    label.scale.set(2)
    label.x = (background.width - label.width) / 2
    label.y = (background.height - label.height) / 2
    label.zIndex = 1

    this.alpha = 0.5

    this.addChild(background)
    this.addChild(label)
  }

  public async enable() {
    await gsap.to(this, { alpha: 1, duration: 0.5 })

    this.interactive = true
    this.cursor = 'pointer'
  }

  public async disable() {
    this.interactive = false

    this.cursor = 'default'

    await gsap.to(this, { alpha: 0.5, duration: 0.5 })
  }
}
