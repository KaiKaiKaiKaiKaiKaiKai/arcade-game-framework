import { Container, Sprite, Text, Texture } from 'pixi.js'
import { Cup } from './cup/view'
import { Ball } from './ball/view'
import gsap from 'gsap'

export class TrickyCupsView extends Container {
  private ball: Ball
  private cups: Array<Cup> = []
  private selectedCup: Cup
  constructor() {
    super()

    this.scale.set(0.6)
    this.sortableChildren = true

    const table = new Sprite({ texture: Texture.from('table'), y: 500 })
    table.zIndex = 0

    for (let i = 0; i < 3; i++) {
      const cup = new Cup()
      cup.x = 340 * i + 200
      cup.zIndex = 2
      this.cups.push(cup)
    }

    this.selectedCup = this.cups[1]

    this.addChild(table)

    this.ball = new Ball()
    this.ball.zIndex = 1
    this.ball.visible = false

    this.placeBall()
    this.addChild(this.ball)

    for (const cup of this.cups) {
      this.addChild(cup)
    }
  }

  private placeBall() {
    this.ball.x = this.selectedCup.x + (this.selectedCup.width / 2 - this.ball.width / 2)
  }

  private async revealBall() {
    this.ball.visible = true
    const tl = gsap.timeline()

    tl.to(this.selectedCup, { y: '-=200', duration: 1, ease: 'sine.inOut' })
    tl.to({}, { duration: 0.5 })
    tl.to(this.selectedCup, { y: '+=200', duration: 1, ease: 'sine.inOut' })

    await tl
    this.ball.visible = false
  }

  private async shuffleCups() {
    for (let i = 0; i < 10; i++) {
      const cupPromises = []
      const xList = this.cups.map((cup) => cup.x)
      for (const cup of this.cups) {
        const x = xList[Math.floor(Math.random() * xList.length)]
        xList.splice(xList.indexOf(x), 1)
        cupPromises.push(gsap.to(cup, { x, duration: 0.2, ease: 'sine.inOut' }))
      }
      await Promise.all(cupPromises)
    }
  }

  private async userChoice(win: boolean) {
    await new Promise<void>((resolve) => {
      for (const cup of this.cups) {
        cup.interactive = true
        cup.cursor = 'pointer'
        cup.removeAllListeners()
        cup.on('pointerdown', async () => {
          console.log('button win', win)
          this.selectedCup = cup

          if (win) {
            this.placeBall()
          }

          await this.revealBall()

          if (!win) {
            const cups = this.cups.filter((c) => c !== cup)
            this.selectedCup = cups[Math.floor(Math.random() * cups.length)]
            this.placeBall()
          }

          resolve()
        })
      }
    })

    for (const cup of this.cups) {
      cup.interactive = false
      cup.cursor = 'normal'
    }
  }

  public async play(props: { win: boolean }) {
    await this.revealBall()
    await this.shuffleCups()
    console.log(props.win)
    await this.userChoice(props.win)
  }
}
