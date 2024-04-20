import { GameView } from '../../../framework/app/game/view'
import { TimerButton } from './timer-button/view'
import { Container } from 'pixi.js'
import { Bomb } from './bomb/view'
import { Game2Setup, Setup } from '../../../framework/connection/database/interface'

/**
 * View class for the Bombs Away game.
 * @extends GameView
 */
export class BombsAwayView extends GameView {
  private timeOptions!: Array<number>
  private timeButtons!: Array<TimerButton>
  private timeButtonContainer!: Container
  private bomb!: Bomb
  private selectedTime!: number

  /**
   * Creates an instance of BombsAwayView.
   * @param {Setup} setup - The setup for the game.
   */
  constructor(setup: Setup) {
    super(setup)
  }

  /**
   * Creates the initial layout of the game.
   */
  protected createInitial() {
    // Set scale factor and sorting behavior
    this.scaleFactor = 0.9
    this.sortableChildren = true

    // Create bomb and set its position
    this.bomb = new Bomb()
    this.bomb.zIndex = 2

    // Retrieve time options from setup
    const { timeOptions } = this.setup as Game2Setup
    this.timeOptions = timeOptions

    // Create time button container
    this.timeButtonContainer = new Container()

    // Create time buttons based on options
    this.timeButtons = []
    for (let i = 0; i < this.timeOptions.length; i++) {
      this.timeButtons.push(new TimerButton({ text: this.timeOptions[i].toString(), duration: 1 }))
      const timeButton = this.timeButtons[i]
      timeButton.y = (timeButton.height + 30) * i
      this.timeButtonContainer.addChild(timeButton)
    }

    // Position the bomb and time button container
    const height =
      this.timeButtons[this.timeButtons.length - 1].y +
      this.timeButtons[this.timeButtons.length - 1].height
    this.bomb.y = height
    this.bomb.wireLength = height
    this.timeButtonContainer.scale.set(0.94)
    this.timeButtonContainer.y = 22
    this.timeButtonContainer.x = this.bomb.width / 2 + 25

    // Add child elements to the game view
    this.addChild(this.timeButtonContainer)
    this.addChild(this.bomb)
  }

  /**
   * Starts the timer for the selected time.
   * @param {number} time - The selected time duration.
   */
  private async startTimers(time: number) {
    for (let i = 0; i < time; i++) {
      await this.timeButtons[i].time()
    }
  }

  /**
   * Resets all timers to initial state.
   */
  private async resetTimers() {
    if (!this.timeButtons[0].timeTween) return

    for (const timeButton of [...this.timeButtons].reverse()) {
      await timeButton.reset()
    }
  }

  /**
   * Allows the user to select a time option.
   */
  private async userSelection() {
    await this.enableButtons()

    let selectionResolve: () => void
    const selectionPromise = new Promise<void>((resolve) => {
      selectionResolve = resolve
    })

    for (const [timeKey, timeButton] of this.timeButtons.entries()) {
      timeButton.on('pointerdown', () => {
        timeButton.removeAllListeners('pointerdown')
        timeButton.selected = true
        this.selectedTime = timeKey + 1
        selectionResolve()
      })
    }

    await selectionPromise
    await this.disableButtons()
  }

  /**
   * Enables all time selection buttons.
   */
  private async enableButtons() {
    await Promise.all(this.timeButtons.map((timeButton) => timeButton.enable()))
  }

  /**
   * Disables all time selection buttons.
   */
  public async disableButtons() {
    await Promise.all(this.timeButtons.map((timeButton) => timeButton.disable()))
  }

  /**
   * Initiates the game play.
   * @param {object} props - The game play properties.
   * @param {number} props.win - payout amount.
   */
  public async play(props: { win: number }) {
    const { win } = props

    // Reset bomb and timers
    await Promise.all([this.bomb.reset(), this.resetTimers()])

    // User selects a time
    await this.userSelection()

    // Light the bomb
    await this.bomb.light()

    let time = this.selectedTime

    // Determine time based on win/loss
    if (!win) {
      const otherTimes = this.timeOptions.filter((timeOption) => timeOption !== this.selectedTime)
      time = otherTimes[Math.floor(Math.random() * otherTimes.length)]
    }

    // Start bomb timer and time buttons
    await Promise.all([this.bomb.startTimer(time), this.startTimers(time)])

    // Explode the bomb
    await this.bomb.explode()
  }
}
