import { Container, TextStyle } from 'pixi.js'
import { CountupText } from '../countup/view'
import gsap from 'gsap'

export class WinText extends Container {
  private countupText: CountupText
  private scaleContainer: Container

  constructor(options?: Partial<TextStyle>) {
    super()

    this.visible = false
    this.scaleContainer = new Container()

    const style = options || {
      dropShadow: { angle: 1.5, alpha: 0.8, blur: 10, color: '#000000', distance: 0 },
      fill: '#ffffff',
      fontSize: 160,
      fontWeight: 'bold',
    }

    this.countupText = new CountupText({ text: 'FUN0.00', options: style, fixed: 2, prefix: 'FUN' })
    this.countupText.anchor.set(0.5, 0.5)

    this.addChild(this.scaleContainer)
    this.scaleContainer.addChild(this.countupText)
  }

  public async showWin(win: number) {
    this.scaleContainer.scale.set(0)
    this.visible = true
    gsap.to(this.scaleContainer.scale, { x: 1, y: 1, duration: 1, ease: 'back.out' })

    this.countupText.countup(win, 2)

    window.addEventListener('click', () => {
      window.removeEventListener('click', () => {})

      this.countupText.countupTween.seek(1.99)
    })

    await this.countupText.countupTween
    await gsap.to(this, { duration: 1 })
    await gsap.to(this.scaleContainer.scale, { x: 0, y: 0, duration: 1, ease: 'back.in' })

    this.visible = false
    this.scaleContainer.scale.set(1)
  }

  public handleResize(props: { width: number; height: number; offset: number }) {
    const { width, height, offset } = props
    const scale =
      Math.min(width / this.countupText.width, (height - offset) / this.countupText.height, 1) * 0.9

    this.scale.set(scale)

    this.x = width / 2
    this.y = height / 2 - offset / 2
  }
}
