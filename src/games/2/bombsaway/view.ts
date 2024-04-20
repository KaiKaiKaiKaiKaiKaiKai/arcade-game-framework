import { GameView } from '../../../framework/app/game/view'
import { WinText } from '../../../framework/app/game/text/win/view'
import { TimerButton } from './timer-button/view'
import { Container, Sprite, Texture } from 'pixi.js'
import { Bomb } from './bomb/view'
import { Game2Setup, Setup } from '../../../framework/connection/database/interface'

export class BombsAwayView extends GameView {
  private timeOptions!: Array<number>
  private timeButtons!: Array<TimerButton>
  private timeButtonContainer!: Container
  private bomb!: Bomb
  private selectedTime!: number

  constructor(setup: Setup) {
    super(setup)
  }

  protected createInitial() {
    this.scaleFactor = 0.9
    this.sortableChildren = true

    this.bomb = new Bomb()
    this.bomb.zIndex = 2

    const { timeOptions } = this.setup as Game2Setup

    this.timeOptions = timeOptions
    this.timeButtonContainer = new Container()

    this.timeButtons = []

    for (let i = 0; i < this.timeOptions.length; i++) {
      this.timeButtons.push(new TimerButton({ text: this.timeOptions[i].toString(), duration: 1 }))

      const timeButton = this.timeButtons[i]

      timeButton.y = (timeButton.height + 30) * i

      this.timeButtonContainer.addChild(timeButton)
    }

    const height =
      this.timeButtons[this.timeButtons.length - 1].y +
      this.timeButtons[this.timeButtons.length - 1].height

    this.bomb.y = height
    this.bomb.wireLength = height

    this.timeButtonContainer.scale.set(0.94)
    this.timeButtonContainer.y = 22
    this.timeButtonContainer.x = this.bomb.width / 2 + 25

    this.addChild(this.timeButtonContainer)
    this.addChild(this.bomb)
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
  }
}
