import gsap from 'gsap'
import { Container, Sprite, Text, Texture } from 'pixi.js'

/**
 * Represents a card in the game.
 * @extends Container
 */
export class Card extends Container {
  private back: Sprite

  /**
   * Creates an instance of the Card.
   * @param {object} props - The properties of the card.
   * @param {string} props.suit - The suit of the card.
   * @param {string} props.value - The value of the card.
   */
  constructor(props: { suit: string; value: string }) {
    super()

    const { suit, value } = props

    // Creating the front and back sprites of the card
    const front = new Sprite(Texture.from('cardFront'))
    const suitSprite = new Sprite(Texture.from(suit))
    this.back = new Sprite(Texture.from('cardBack'))

    // Creating the text objects for the card's value
    const topText = new Text(value, { fill: 0x000000, fontSize: 80 })
    const bottomText = new Text(value, { fill: 0x000000, fontSize: 80 })

    // Adjusting the position of the top text
    topText.x += 10

    // Adjusting the position and orientation of the bottom text
    bottomText.scale.set(-1)
    bottomText.anchor.set(1)

    // Positioning the suit sprite
    suitSprite.x = front.width / 2 - suitSprite.width / 2
    suitSprite.y = front.height / 2 - suitSprite.height / 2

    // Positioning the bottom text
    bottomText.x = front.width - bottomText.width - 10
    bottomText.y = front.height - bottomText.height

    // Setting the pivot point for rotation
    this.pivot = {
      x: front.width / 2,
      y: 0,
    }

    // Adding child elements to the card
    this.addChild(front)
    this.addChild(suitSprite)
    this.addChild(topText)
    this.addChild(bottomText)
    this.addChild(this.back)
  }

  /**
   * Reveals the card's front side with animation.
   * @param {number} x - The target x-coordinate of the card.
   */
  public async reveal(x: number) {
    const oldY = this.y
    const oldX = this.x

    // Setting the new position and scale for animation
    const newHeight = this.height * 2
    const newY = this.y - newHeight / 4

    // Animating the card to reveal
    gsap.to(this, { x, y: newY, duration: 0.5 })
    await gsap.to(this.scale, { x: 2, y: 2, duration: 0.5, ease: 'back.out' })
    await gsap.to(this, { duration: 0.5 })
    await this.flip()
    await gsap.to(this, { duration: 0.5 })
    gsap.to(this, { x: oldX, y: oldY, duration: 0.5 })
    await gsap.to(this.scale, { x: 1, y: 1, duration: 0.5, ease: 'back.in' })
  }

  /**
   * Hides the card.
   */
  public async hide() {
    // Animating the back sprite to fade in
    await gsap.to(this.back, { alpha: 1, duration: 0.5 })
  }

  /**
   * Flips the card to reveal the back side.
   */
  public async flip() {
    // Animating the card to flip
    await gsap.to(this.scale, { x: 0, duration: 0.2, ease: 'sine.in' })
    this.back.alpha = 0
    await gsap.to(this.scale, { x: 2, duration: 0.2, ease: 'sine.out' })
  }
}
