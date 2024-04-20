import gsap from 'gsap'
import { Container, Sprite, Texture } from 'pixi.js'

export class Cups extends Container {
  private cups: Array<Sprite> = []
  private chosenCup: Sprite | null = null
  public winningCup: Sprite

  constructor(cupAmount: number) {
    super()

    this.zIndex = 2

    for (let i = 0; i < cupAmount; i++) {
      const cup = Sprite.from(Texture.from('redcup'))
      cup.x = (cup.width + 50) * i

      this.cups.push(cup)
      this.addChild(cup)
    }

    // Initially set the winning cup to the middle cup
    this.winningCup = this.cups[Math.round((this.cups.length - 1) / 2)]
  }

  private async liftCup(cup: Sprite) {
    const tl = gsap.timeline()

    tl.to(cup, { y: '-=190', duration: 0.5, ease: 'sine.inOut' })
    tl.to(cup, { y: '+=10', duration: 0.5, ease: 'sine.inOut' })
    tl.to(cup, { y: '-=10', duration: 0.5, ease: 'sine.inOut' })
    tl.to(cup, { y: '+=10', duration: 0.5, ease: 'sine.inOut' })
    tl.to(cup, { y: '-=10', duration: 0.5, ease: 'sine.inOut' })
    tl.to(cup, { y: '+=190', duration: 0.5, ease: 'sine.inOut' })

    await tl
  }

  public async shuffleCups() {
    for (let i = 0; i < 20; i++) {
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

  public async liftWinningCup() {
    await this.liftCup(this.winningCup)
  }

  public async liftChosenCup() {
    await this.liftCup(this.chosenCup as Sprite)
  }

  public async userSelection(win: number) {
    let selectionResolve: () => void

    const selectionPromise = new Promise<void>((resolve) => {
      selectionResolve = resolve
    })

    for (const cup of this.cups) {
      cup.interactive = true
      cup.cursor = 'pointer'

      cup.on('pointerdown', () => {
        this.chosenCup = cup

        if (win) {
          this.winningCup = this.chosenCup
        } else {
          const remainingCups = this.cups.filter((c) => c !== this.chosenCup)
          const randomCup = remainingCups[Math.floor(Math.random() * remainingCups.length)]

          this.winningCup = randomCup
        }

        selectionResolve()
      })
    }

    await selectionPromise

    for (const cup of this.cups) {
      cup.removeAllListeners('pointerdown')

      cup.interactive = false
      cup.cursor = 'default'
    }
  }
}
