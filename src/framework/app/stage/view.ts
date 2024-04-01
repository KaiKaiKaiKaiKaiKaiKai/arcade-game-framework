import { Application, Container, Sprite, Texture } from 'pixi.js'

export class StageView {
  public appLoaded: Promise<void>
  private pixiApp: Application
  public resizeContainer: Container
  private resizeDiv: HTMLDivElement
  private background: Sprite

  constructor() {
    this.resizeDiv = document.createElement('div')

    this.resizeDiv.style.width = '100%'
    this.resizeDiv.style.height = '100%'
    this.resizeDiv.style.overflow = 'hidden'

    document.body.appendChild(this.resizeDiv)

    this.resizeContainer = new Container()
    this.background = new Sprite(Texture.from('background'))

    this.pixiApp = new Application()
    this.appLoaded = this.pixiApp
      .init({
        width: this.resizeDiv.clientWidth,
        height: this.resizeDiv.clientHeight,
      })
      .then(() => {
        ;(globalThis as any).__PIXI_APP__ = this.pixiApp

        this.resizeDiv.appendChild(this.pixiApp.canvas)

        this.pixiApp.stage.addChild(this.background)
        this.pixiApp.stage.addChild(this.resizeContainer)
      })
  }

  private resizeBackground(props: { width: number; height: number }) {
    const scale = Math.max(
      props.width / this.background.texture.width,
      props.height / this.background.texture.height
    )

    this.background.scale.set(scale)

    this.background.x = (props.width - this.background.width) / 2
    this.background.y = (props.height - this.background.height) / 2
  }

  public handleResize(props: {
    width: number
    height: number
    offset: number
    scaleFactor: number
  }) {
    const { width, height, offset, scaleFactor } = props
    this.pixiApp.renderer.resize(width, height)

    const scale =
      Math.min(
        width / this.resizeContainer.getLocalBounds().width,
        (height - offset) / this.resizeContainer.getLocalBounds().height,
        1
      ) * scaleFactor

    this.resizeContainer.scale.set(scale)

    this.resizeContainer.x = width / 2 - this.resizeContainer.width / 2
    this.resizeContainer.y = (height - offset) / 2 - this.resizeContainer.height / 2

    this.resizeBackground({ width, height })
  }

  public get resizeDimensions() {
    return {
      width: this.resizeDiv.clientWidth,
      height: this.resizeDiv.clientHeight,
    }
  }

  public get stage() {
    return this.pixiApp.stage
  }
}
