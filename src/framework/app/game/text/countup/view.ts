import gsap from 'gsap'
import { Text, TextStyle } from 'pixi.js'

export class CountupText extends Text {
  private value = 0
  private fixed: number
  private prefix: string
  public countupTween!: gsap.core.Tween

  constructor(props: { text: string; options: Partial<TextStyle>; fixed: number; prefix: string }) {
    const { text, options, fixed, prefix } = props

    super(text, options)

    this.fixed = fixed
    this.prefix = prefix
  }

  public async countup(to: number, duration: number) {
    let textWidth = this.width
    let textHeight = this.height

    this.countupTween = gsap.to(this, {
      duration,
      value: to,
      ease: 'sine.inOut',
      onUpdate: () => {
        this.text = `${this.prefix}${parseFloat(this.value.toString()).toFixed(this.fixed)}`

        const scale = Math.min(textWidth / this.width, textHeight / this.height, 1)

        this.scale.x *= scale
        this.scale.y *= scale
      },
      onComplete: () => {
        this.value = 0
      },
    })

    await this.countupTween
  }
}
