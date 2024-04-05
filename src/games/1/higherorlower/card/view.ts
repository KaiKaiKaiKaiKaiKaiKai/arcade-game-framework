import gsap from 'gsap'
import { Container, Sprite, Text, Texture } from 'pixi.js'

export class Card extends Container {
  private back: Sprite

  constructor(props: { suit: string; value: string }) {
    super()

    const { suit, value } = props

    const front = new Sprite(Texture.from('cardFront'))
    const suitSprite = new Sprite(Texture.from(suit))
    this.back = new Sprite(Texture.from('cardBack'))

    const topText = new Text(value, { fill: 0x000000, fontSize: 40 })
    const bottomText = new Text(value, { fill: 0x000000, fontSize: 40 })

    topText.scale.set(2)
    bottomText.scale.set(-2)

    topText.x += 10

    bottomText.anchor.set(1)

    suitSprite.x = front.width / 2 - suitSprite.width / 2
    suitSprite.y = front.height / 2 - suitSprite.height / 2

    bottomText.x = front.width - bottomText.width - 10
    bottomText.y = front.height - bottomText.height

    this.pivot = {
      x: front.width / 2,
      y: 0,
    }

    this.addChild(front)
    this.addChild(suitSprite)
    this.addChild(topText)
    this.addChild(bottomText)
    this.addChild(this.back)
  }

  public async reveal(x: number) {
    const oldY = this.y
    const oldX = this.x

    const newHeight = this.height * 2
    const newY = this.y - newHeight / 4

    gsap.to(this, { x, y: newY, duration: 0.5 })

    await gsap.to(this.scale, { x: 2, y: 2, duration: 0.5, ease: 'back.out' })
    await gsap.to(this, { duration: 0.5 })

    await this.flip()

    await gsap.to(this, { duration: 0.5 })

    gsap.to(this, { x: oldX, y: oldY, duration: 0.5 })

    await gsap.to(this.scale, { x: 1, y: 1, duration: 0.5, ease: 'back.in' })
  }

  public async hide() {
    await gsap.to(this.back, { alpha: 1, duration: 0.5 })
  }

  public async flip() {
    await gsap.to(this.scale, { x: 0, duration: 0.2, ease: 'sine.in' })

    this.back.alpha = 0

    await gsap.to(this.scale, { x: 2, duration: 0.2, ease: 'sine.out' })
  }
}
