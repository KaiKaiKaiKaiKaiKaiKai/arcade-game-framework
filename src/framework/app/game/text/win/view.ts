import { TextStyle } from 'pixi.js'
import { CountupText } from '../countup/view'
import gsap from 'gsap'

export class WinText extends CountupText {
  constructor(options?: Partial<TextStyle>) {
    const style = options || {
      dropShadow: { angle: 1.5, alpha: 0.8, blur: 10, color: '#000000', distance: 0 },
      fill: '#ffffff',
      fontSize: 160,
      fontWeight: 'bold',
    }

    super('FUN0.00', style)

    this.scale.set(0)
  }

  public async showWin(win: number) {
    gsap.to(this.scale, { x: 1, y: 1, duration: 1, ease: 'back.out' })

    await this.countup(win, 2)
    await gsap.to(this, { duration: 1 })
    await gsap.to(this.scale, { x: 0, y: 0, duration: 1, ease: 'back.in' })
  }
}