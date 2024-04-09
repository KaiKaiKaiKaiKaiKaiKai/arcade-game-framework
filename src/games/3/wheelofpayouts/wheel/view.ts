import gsap from 'gsap'
import { Sprite, Text, Texture } from 'pixi.js'

export class Wheel extends Sprite {
  private baseValues: Array<number | string> = [0, 1, 2, 5, '++', 10, 20, 50]
  private doubleValues: Array<number | string> = [1, 2, 4, 10, '++', 20, 40, 100]
  private texts: Array<Text> = []
  private wasDouble: boolean = false

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

  private async pause() {
    await gsap.to(this, { duration: 0.5 })
  }

  private async updateNumbers(isDouble: boolean) {
    await this.pause()

    for (const text of this.texts) {
      const value = Number(text.text)

      if (Number.isNaN(value)) continue

      let newValue: number

      if (isDouble) {
        if (value === 0) {
          newValue = 1
        } else {
          newValue = value * 2
        }
      } else {
        if (value === 1) {
          newValue = 0
        } else {
          newValue = value / 2
        }
      }

      await gsap.to(text, {
        alpha: 0,
        duration: 0.5,
      })
      text.text = `${newValue}`
      await gsap.to(text, { alpha: 1, duration: 0.5 })
    }
  }

  private async rotate(finalAngle: number) {
    await gsap.to(this, { angle: `+=${360 * 6}`, duration: 2, ease: 'sine.in' })
    await gsap.to(this, {
      angle: 360 * 12 + finalAngle,
      duration: 2,
      ease: 'sine.out',
    })

    this.angle = finalAngle
  }

  public async spin(win: number) {
    if (this.wasDouble) {
      await this.updateNumbers(false)
    }

    const onlyDouble = !this.baseValues.includes(win)
    const isDouble = this.doubleValues.includes(win) && (onlyDouble || Math.random() < 0.5)

    const values = isDouble ? this.doubleValues : this.baseValues
    const index = values.indexOf(win)

    if (isDouble) {
      const doubleIndex = values.indexOf('++')
      const doubleAngle = -(doubleIndex / values.length) * 360

      await this.rotate(doubleAngle)
      await this.pause()
      await gsap.to(this.texts[doubleIndex].scale, { x: 1.5, y: 1.5, duration: 0.5 })
      await this.updateNumbers(true)
      await gsap.to(this.texts[doubleIndex].scale, { x: 1, y: 1, duration: 0.5 })
      await this.pause()
    }

    const angle = -(index / values.length) * 360

    await this.rotate(angle)
    await this.pause()
    await gsap.to(this.texts[index].scale, { x: 1.5, y: 1.5, duration: 0.5 })
    await this.pause()
    await gsap.to(this.texts[index].scale, { x: 1, y: 1, duration: 0.5 })

    this.wasDouble = isDouble
  }
}
