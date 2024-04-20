import { ConnectionModel } from '../connection/model'
import { Stage } from './stage/controller'
import { Game, GameProps } from './game/controller'
import { Assets } from 'pixi.js'
import { GameView } from './game/view'
import { UI } from './ui/controller'
import { WinText } from './game/text/win/view'
import { Setup } from '../connection/database/interface'

interface AppProps<TGameController extends Game<TGameView>, TGameView extends GameView> {
  gameControllerClass: new (props: GameProps<TGameView>) => TGameController
  gameViewClass: new (setup: Setup) => TGameView
  gameId: number
}

export class App<TGameController extends Game<TGameView>, TGameView extends GameView> {
  private connection
  private bank: number
  private bet: number
  private stage!: Stage
  private ui!: UI
  private game!: TGameController
  private winText!: WinText

  constructor(props: AppProps<TGameController, TGameView>) {
    const { gameId } = props

    this.connection = new ConnectionModel({ gameId })

    const { bet, bank } = this.connection

    this.bank = bank
    this.bet = bet

    this.bootSequence(props)
  }

  private async bootSequence(props: AppProps<TGameController, TGameView>) {
    const { gameControllerClass, gameViewClass } = props
    const { name, setup, rtp } = this.connection

    await this.loadAssetsFromManifest()

    document.title = `Kai's ${name}`

    this.stage = new Stage()

    await this.stage.view.appLoaded
    const { resizeContainer } = this.stage.view

    this.ui = new UI({ name, rtp })

    this.updateUI()

    this.game = new gameControllerClass({ setup, viewClass: gameViewClass })
    this.winText = new WinText()

    resizeContainer.addChild(this.game.view)

    this.stage.view.stage.addChild(this.winText)
    this.stage.view.stage.addChild(this.ui.view)

    this.handleResize()

    this.ui.view.on('play', async () => await this.play())
    this.ui.view.on('increase-bet', () => this.updateBet(true))
    this.ui.view.on('decrease-bet', () => this.updateBet(false))

    const debouncedResizeHandler = this.debounce(() => this.handleResize(), 0)
    window.addEventListener('resize', debouncedResizeHandler)
  }

  private async loadAssetsFromManifest() {
    const response = await fetch('assets-manifest.json')
    const data = await response.json()

    const manifest = JSON.parse(JSON.stringify(data))

    await Assets.init({ manifest })
    await Assets.loadBundle('main')
  }

  private updateUI() {
    this.ui.view.bank = this.bank
    this.ui.view.bet = this.bet
  }

  private async play() {
    if (this.bank < this.bet) return

    const { win } = this.connection

    this.bank -= this.bet
    this.updateUI()
    this.handleResize()

    await this.ui.view.disable()
    await this.game.play({ win })

    this.bank += win * this.bet

    if (win) {
      await this.winText.showWin(win * this.bet)
    }

    this.updateUI()
    this.handleResize()

    this.ui.view.enable()
  }

  private updateBet(increase: boolean) {
    this.bet = this.connection.getNextBet(increase, this.bet)

    this.updateUI()
    this.handleResize()
  }

  private debounce<T extends (...args: any[]) => void>(func: T, waitFor: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args)
      }, waitFor)
    }
  }

  private handleResize() {
    const { width, height } = this.stage.view.resizeDimensions
    const { scaleFactor } = this.game.view

    this.ui.view.handleResize({ width, height })
    this.winText.handleResize({ width, height, offset: this.ui.view.height })
    this.stage.view.handleResize({ width, height, offset: this.ui.view.height, scaleFactor })
  }
}
