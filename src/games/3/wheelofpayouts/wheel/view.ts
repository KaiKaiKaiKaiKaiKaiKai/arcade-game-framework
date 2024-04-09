import gsap from 'gsap'
import { Sprite, Text, Texture } from 'pixi.js'

export class Wheel extends Sprite {
  private baseValues: Array<number | string> = [0, 1, '++', 2, 5, 10, 20, 50]
  private doubleValues: Array<number | string> = [1, 2, '++', 4, 10, 20, 40, 100]
  private texts: Array<Text> = []

  constructor() {
    super(Texture.from('wheel'))

    this.anchor.set(0.5)

    for (let i = 0; i < this.baseValues.length; i++) {
      const value = this.baseValues[i]
      const text = new Text(`${value}`, { fill: 0x000000, fontSize: 80 })

      text.anchor.set(0.5)

      text.x = (Math.cos((i / this.baseValues.length) * Math.PI * 2) * this.width) / Math.PI
      text.y = (Math.sin((i / this.baseValues.length) * Math.PI * 2) * this.height) / Math.PI
      text.angle = (i / this.baseValues.length) * 360 + 90

      this.texts.push(text)
      this.addChild(text)
    }
  }

  public async spin(win: number) {
    const onlyDouble = !this.baseValues.includes(win)
    const isDouble = this.doubleValues.includes(win) && (onlyDouble || Math.random() < 0.5)

    const values = isDouble ? this.doubleValues : this.baseValues
    const index = values.indexOf(win)

    const angle = -(index / values.length) * 360

    this.angle = angle
  }
}
