import { Sprite, Texture } from 'pixi.js'
import { Button } from '../../../../framework/app/game/button/view'
import gsap from 'gsap'

export class TimerButton extends Button {
  public duration: number
  public timeTween!: gsap.core.Tween
  public selected: boolean = false
  private background: Sprite

  constructor(props: { text: string; duration: number }) {
    const { text, duration } = props

    super({ text })

    this.duration = duration

    this.background = Sprite.from(Texture.WHITE)

    this.background.height = 0
    this.background.width = this.width
    this.background.tint = 0x3eb489
    this.background.zIndex = 0

    this.addChild(this.background)
  }

  public async time() {
    this.timeTween = gsap.to(this.background, {
      height: this.height,
      duration: this.duration,
      ease: 'none',
    })

    await this.timeTween
  }

  public async reset() {
    await gsap.to(this.background, { height: 0, duration: 0.2, ease: 'none' })
  }

  public async disable() {
    if (this.selected) {
      this.selected = false
      super.disable()
      gsap.killTweensOf(this)
    } else {
      await super.disable()
    }
  }
}
