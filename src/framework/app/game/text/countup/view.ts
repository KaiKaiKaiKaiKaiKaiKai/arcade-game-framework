import gsap from 'gsap'
import { Text, TextStyle } from 'pixi.js'

export class CountupText extends Text {
  constructor(text: string, options: Partial<TextStyle>) {
    super(text, options)

    this.anchor.set(0.5, 0.5)
  }

  public async countup(to: number, duration: number) {
    let count = 0

    await gsap.to(this, {
      duration,
      onUpdate: () => {
        count += to / 60 / duration
        this.text = `FUN${parseFloat(count.toString()).toFixed(2)}`
      },
      onComplete: () => {
        this.text = `FUN${to.toFixed(2)}`
      },
    })
  }
}
