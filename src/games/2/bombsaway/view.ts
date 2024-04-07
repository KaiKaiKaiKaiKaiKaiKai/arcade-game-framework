import { GameView } from '../../../framework/app/game/view'
import { WinText } from '../../../framework/app/game/text/win/view'
import { TimerButton } from './timer-button/view'
import { Sprite, Texture } from 'pixi.js'
import { Bomb } from './bomb/view'

export class BombsAwayView extends GameView {
  private winText: WinText
  private timeOptions: Array<number>
  private timeButtons: Array<TimerButton> = []
  private bomb: Bomb
  private selectedTime!: number

  constructor() {
    super()

    this.scaleFactor = 0.8
    this.sortableChildren = true

    this.bomb = new Bomb()
    this.bomb.zIndex = 0

    this.timeOptions = [1, 2, 3, 4, 5]

    for (let i = 0; i < this.timeOptions.length; i++) {
      this.timeButtons.push(new TimerButton({ text: `${this.timeOptions[i]}s`, duration: 1 }))

      const timeButton = this.timeButtons[i]

      timeButton.y = (timeButton.height + 20) * i
      timeButton.x = this.bomb.width + 300
      timeButton.zIndex = 2

      this.addChild(timeButton)
    }

    const timingBar = new Sprite(Texture.WHITE)

    timingBar.height = this.height
    timingBar.width = this.timeButtons[0].width
    timingBar.tint = 0x101010
    timingBar.zIndex = 1
    timingBar.x = this.timeButtons[0].x

    this.bomb.y = timingBar.height
    this.bomb.wireLength = timingBar.height

    this.winText = new WinText()
    this.winText.zIndex = 3

    this.addChild(this.bomb)
    this.addChild(timingBar)
    this.addChild(this.winText)

    this.winText.x = this.width / 2
    this.winText.y = this.height / 2
  }

  private async startTimers(time: number) {
    for (let i = 0; i < time; i++) {
      await this.timeButtons[i].time()
    }
  }

  private async resetTimers() {
    if (!this.timeButtons[0].timeTween) return

    for (const timeButton of [...this.timeButtons].reverse()) {
      await timeButton.reset()
    }
  }

  private async userSelection() {
    await this.enableButtons()

    let selectionResolve: () => void
    const selectionPromise = new Promise<void>((resolve) => {
      selectionResolve = resolve
    })

    for (const timeKey in this.timeButtons) {
      const timeButton = this.timeButtons[timeKey]

      timeButton.on('pointerdown', () => {
        timeButton.removeAllListeners('pointerdown')

        timeButton.selected = true
        this.selectedTime = parseInt(timeKey) + 1

        selectionResolve()
      })
    }

    await selectionPromise
    await this.disableButtons()
  }

  private async enableButtons() {
    await Promise.all(this.timeButtons.map((timeButton) => timeButton.enable()))
  }

  public async disableButtons() {
    await Promise.all(this.timeButtons.map((timeButton) => timeButton.disable()))
  }

  public async play(props: { win: number }) {
    const { win } = props

    await Promise.all([this.bomb.reset(), this.resetTimers()])

    await this.userSelection()

    await this.bomb.light()

    let time = this.selectedTime

    if (!win) {
      const otherTimes = this.timeOptions.filter((timeOption) => timeOption !== this.selectedTime)
      time = otherTimes[Math.floor(Math.random() * otherTimes.length)]
    }

    await Promise.all([this.bomb.startTimer(time), this.startTimers(time)])

    await this.bomb.explode()

    if (win) {
      await this.winText.showWin(win)
    }
  }
}
