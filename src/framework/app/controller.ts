import { ConnectionModel } from '../connection/model'
import { Stage } from './stage/controller'
import { Game, GameProps } from './game/controller'
import { Assets } from 'pixi.js'
import { GameView } from './game/view'
import { UI } from './ui/controller'
import { WinText } from './game/text/win/view'
import { Setup } from '../connection/database/interface'

/**
 * Represents the properties required to initialize an instance of the App class.
 */
interface AppProps<TGameController extends Game<TGameView>, TGameView extends GameView> {
  gameControllerClass: new (props: GameProps<TGameView>) => TGameController
  gameViewClass: new (setup: Setup) => TGameView
  gameId: number
}

/**
 * Represents the application responsible for managing the game.
 * @template TGameController - The type of the game controller.
 * @template TGameView - The type of the game view.
 */
export class App<TGameController extends Game<TGameView>, TGameView extends GameView> {
  private connection: ConnectionModel
  private bank: number
  private bet: number
  private stage!: Stage
  private ui!: UI
  private game!: TGameController
  private winText!: WinText

  /**
   * Creates an instance of the App class.
   * @param {AppProps<TGameController, TGameView>} props - The properties required to initialize the app.
   */
  constructor(props: AppProps<TGameController, TGameView>) {
    const { gameId } = props

    // Initialize connection with the game data
    this.connection = new ConnectionModel({ gameId })

    // Initialize bank and bet values from the connection
    const { bet, bank } = this.connection
    this.bank = bank
    this.bet = bet

    // Start the boot sequence to set up the app
    this.bootSequence(props)
  }

  /**
   * Boots up the application by loading assets and setting up the game.
   * @param {AppProps<TGameController, TGameView>} props - The properties required to initialize the app.
   * @returns {Promise<void>}
   */
  private async bootSequence(props: AppProps<TGameController, TGameView>): Promise<void> {
    const { gameControllerClass, gameViewClass } = props
    const { name, setup, rtp } = this.connection

    // Load assets from the manifest file
    await this.loadAssetsFromManifest()

    // Set the title of the document
    document.title = `Kai's ${name}`

    // Initialize the stage and UI components
    this.stage = new Stage()
    await this.stage.view.appLoaded
    const { resizeContainer } = this.stage.view
    this.ui = new UI({ name, rtp })

    // Update UI components
    this.updateUI()

    // Initialize the game controller and win text
    this.game = new gameControllerClass({ setup, viewClass: gameViewClass })
    this.winText = new WinText()

    // Add game view and UI to the stage
    resizeContainer.addChild(this.game.view)
    this.stage.view.stage.addChild(this.winText)
    this.stage.view.stage.addChild(this.ui.view)

    // Handle resize events
    this.handleResize()

    // Set event listeners for UI actions
    this.ui.view.on('play', async () => await this.play())
    this.ui.view.on('increase-bet', () => this.updateBet(true))
    this.ui.view.on('decrease-bet', () => this.updateBet(false))

    // Debounce resize handler
    const debouncedResizeHandler = this.debounce(() => this.handleResize(), 0)
    window.addEventListener('resize', debouncedResizeHandler)
  }

  /**
   * Loads assets from the manifest file.
   * @returns {Promise<void>}
   */
  private async loadAssetsFromManifest(): Promise<void> {
    const response = await fetch('assets-manifest.json')
    const data = await response.json()
    const manifest = JSON.parse(JSON.stringify(data))

    await Assets.init({ manifest })
    await Assets.loadBundle('main')
  }

  /**
   * Updates the UI with current bank and bet values.
   */
  private updateUI(): void {
    this.ui.view.bank = this.bank
    this.ui.view.bet = this.bet
  }

  /**
   * Initiates a game play sequence.
   * @returns {Promise<void>}
   */
  private async play(): Promise<void> {
    // Check if there's enough bank balance for the bet
    if (this.bank < this.bet) return

    const { win } = this.connection

    // Update bank balance and UI
    this.bank -= this.bet
    this.updateUI()
    this.handleResize()

    // Disable UI during game play
    await this.ui.view.disable()
    await this.game.play({ win })

    // Update bank balance and UI after game play
    this.bank += win * this.bet
    if (win) {
      await this.winText.showWin(win * this.bet)
    }
    this.updateUI()
    this.handleResize()

    // Enable UI after game play
    this.ui.view.enable()
  }

  /**
   * Updates the bet amount based on the increase or decrease action.
   * @param {boolean} increase - Whether to increase the bet.
   */
  private updateBet(increase: boolean): void {
    this.bet = this.connection.getNextBet(increase, this.bet)
    this.updateUI()
    this.handleResize()
  }

  /**
   * Debounces a function call to prevent rapid invocations.
   * @param {(...args: any[]) => void} func - The function to debounce.
   * @param {number} waitFor - The debounce wait duration.
   * @returns {(...args: any[]) => void} - The debounced function.
   */
  private debounce<T extends (...args: any[]) => void>(
    func: T,
    waitFor: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args)
      }, waitFor)
    }
  }

  /**
   * Handles resize events by updating UI and stage dimensions.
   */
  private handleResize(): void {
    const { width, height } = this.stage.view.resizeDimensions
    const { scaleFactor } = this.game.view

    this.ui.view.handleResize({ width, height })
    this.winText.handleResize({ width, height, offset: this.ui.view.height })
    this.stage.view.handleResize({ width, height, offset: this.ui.view.height, scaleFactor })
  }
}
