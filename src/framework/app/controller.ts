import { ConnectionModel } from '../../framework/app/connection/model'
import { IGame } from '../../framework/app/game/interface'
import { Stage } from './game/stage/controller'
import { Game } from './game/controller'
import { Assets, Container } from 'pixi.js'

export class App<TGameController extends Game, TGameView extends Container> {
  constructor(props: {
    gameControllerClass: new (props: IGame) => TGameController
    gameViewClass: new () => TGameView
    gameId: number
  }) {
    const { gameControllerClass, gameViewClass, gameId } = props
    const connection = new ConnectionModel({ gameId })

    const { name, rules, rtp } = connection

    // Call the function to load assets
    this.loadAssetsFromManifest(gameId).then(() => {
      const stage = new Stage({ name })

      stage.view.appLoaded.then(() => {
        const { resizeContainer } = stage.view

        const view = new gameViewClass()
        const game = new gameControllerClass({ name, rules, rtp, view })

        resizeContainer.addChild(game.view)
        stage.view.handleResize()

        stage.view.uiCallback = async () => {
          await game.play()
          stage.view.enableUI()
        }
      })
    })
  }

  private async loadAssetsFromManifest(gameId: number) {
    const response = await fetch('assets-manifest.json')
    const data = await response.json()

    const manifest = JSON.parse(JSON.stringify(data))

    await Assets.init({ manifest })
    await Assets.loadBundle(gameId.toString())
  }
}
