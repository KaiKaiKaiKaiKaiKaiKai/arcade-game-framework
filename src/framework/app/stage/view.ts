import { Application, Container, Sprite, Texture } from 'pixi.js'

export class StageView {
  public appLoaded: Promise<void>
  private pixiApp: Application
  public resizeContainer: Container & { initialWidth?: number; initialHeight?: number }
  private background: Sprite

  constructor() {
    this.resizeContainer = new Container()
    this.background = new Sprite(Texture.from('background'))

    this.pixiApp = new Application()

    this.appLoaded = this.pixiApp
      .init({
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio || 1,
      })
      .then(() => {
        ;(globalThis as any).__PIXI_APP__ = this.pixiApp

        document.body.appendChild(this.pixiApp.canvas)

        this.pixiApp.canvas.style.position = 'absolute'
        this.pixiApp.canvas.style.display = 'block'
        this.pixiApp.canvas.style.width = '100%'
        this.pixiApp.canvas.style.height = '100%'
        this.pixiApp.canvas.style.top = '0'
        this.pixiApp.canvas.style.left = '0'

        this.pixiApp.stage.addChild(this.background)
        this.pixiApp.stage.addChild(this.resizeContainer)
      })
  }

  private resizeBackground(props: { width: number; height: number; offset: number }) {
    const { width, height, offset } = props
    const scale = Math.max(
      width / this.background.texture.width,
      (height - offset) / this.background.texture.height
    )

    this.background.scale.set(scale)

    this.background.x = (width - this.background.width) / 2
    this.background.y = (height - offset - this.background.height) / 2
  }

  public handleResize(props: {
    width: number
    height: number
    offset: number
    scaleFactor: number
  }) {
    const { width, height, offset, scaleFactor } = props
    this.pixiApp.renderer.resize(width, height)

    if (!(this.resizeContainer.initialWidth && this.resizeContainer.initialHeight)) {
      this.resizeContainer.initialWidth = this.resizeContainer.width
      this.resizeContainer.initialHeight = this.resizeContainer.height
    }

    const { initialWidth, initialHeight } = this.resizeContainer

    const scale = Math.min(width / initialWidth, (height - offset) / initialHeight, 1) * scaleFactor

    this.resizeContainer.scale.set(scale)

    this.resizeContainer.x = width / 2
    this.resizeContainer.y = (height - offset) / 2

    this.resizeBackground({ width, height, offset })
  }

  public get resizeDimensions() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  public get stage() {
    return this.pixiApp.stage
  }
}
