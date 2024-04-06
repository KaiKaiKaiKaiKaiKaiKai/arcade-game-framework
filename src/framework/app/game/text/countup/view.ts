import gsap from 'gsap'
import { Text, TextStyle } from 'pixi.js'

export class CountupText extends Text {
  private value = 0
  private fixed: number
  private prefix: string

  constructor(props: { options: Partial<TextStyle>; fixed: number; prefix: string }) {
    const { options, fixed, prefix } = props

    super('', options)

    this.fixed = fixed
    this.prefix = prefix

    this.anchor.set(0.5, 0.5)
  }

  public async countup(to: number, duration: number) {
    await gsap.to(this, {
      duration,
      value: to,
      ease: 'sine.inOut',
      onUpdate: () => {
        this.text = `${this.prefix}${parseFloat(this.value.toString()).toFixed(this.fixed)}`
      },
      onComplete: () => {
        this.value = 0
      },
    })
  }
}
