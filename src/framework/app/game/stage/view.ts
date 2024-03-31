import { Application, Container, Graphics } from 'pixi.js'

export class StageView {
  public pixiApp: Application
  public appLoaded: Promise<void>
  public resizeContainer: Container
  private resizeDiv: HTMLDivElement

  constructor() {
    this.resizeDiv = document.createElement('div')

    this.resizeDiv.style.width = '100%'
    this.resizeDiv.style.height = '100%'
    this.resizeDiv.style.overflow = 'hidden'

    document.body.appendChild(this.resizeDiv)

    this.resizeContainer = new Container()

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
      })
  }

  public handleResize() {
    console.log(this.resizeContainer.getLocalBounds())
    const { clientWidth, clientHeight } = this.resizeDiv

    this.pixiApp.renderer.resize(clientWidth, clientHeight)

    const scale = Math.min(
      clientWidth / this.resizeContainer.getLocalBounds().width,
      clientHeight / this.resizeContainer.getLocalBounds().height,
      1
    )

    this.resizeContainer.scale.set(scale)

    this.resizeContainer.pivot.set(
      this.resizeContainer.width / 2 / scale,
      this.resizeContainer.height / 2 / scale
    )

    this.resizeContainer.x = clientWidth / 2
    this.resizeContainer.y = clientHeight / 2
  }
}
