import { Application, Container, EventEmitter, Graphics } from 'pixi.js'
import { UI } from './ui/controller'

export class StageView {
  public pixiApp: Application
  public appLoaded: Promise<void>
  public resizeContainer: Container
  private resizeDiv: HTMLDivElement
  private ui: UI

  constructor(props: { name: string }) {
    this.resizeDiv = document.createElement('div')

    this.resizeDiv.style.width = '100%'
    this.resizeDiv.style.height = '100%'
    this.resizeDiv.style.overflow = 'hidden'

    document.body.appendChild(this.resizeDiv)

    this.resizeContainer = new Container()
    this.ui = new UI({ name: props.name })

    this.pixiApp = new Application()
    this.appLoaded = this.pixiApp
      .init({
        width: this.resizeDiv.clientWidth,
        height: this.resizeDiv.clientHeight,
      })
      .then(() => {
        ;(globalThis as any).__PIXI_APP__ = this.pixiApp

        this.resizeDiv.appendChild(this.pixiApp.canvas)

        this.pixiApp.stage.addChild(this.resizeContainer)
        this.pixiApp.stage.addChild(this.ui.view)
      })
  }

  public handleResize() {
    const { clientWidth, clientHeight } = this.resizeDiv

    this.pixiApp.renderer.resize(clientWidth, clientHeight)
    this.ui.view.handleResize({ width: clientWidth, height: clientHeight })

    const scale = Math.min(
      clientWidth / this.resizeContainer.getLocalBounds().width,
      (clientHeight - this.ui.view.height) / this.resizeContainer.getLocalBounds().height,
      1
    )

    this.resizeContainer.scale.set(scale)

    this.resizeContainer.pivot.set(
      this.resizeContainer.width / 2 / scale,
      (this.resizeContainer.height + this.ui.view.height) / 2 / scale
    )

    this.resizeContainer.x = clientWidth / 2
    this.resizeContainer.y = clientHeight / 2
  }

  public enableUI() {
    this.ui.view.enable()
  }

  public set uiCallback(callback: () => Promise<void>) {
    this.ui.view.on('play', callback)
  }
}
