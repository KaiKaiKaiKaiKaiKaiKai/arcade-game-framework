import { Application, Container, Sprite, Texture } from 'pixi.js'

/**
 * Represents the stage view responsible for managing the PixiJS application and stage.
 */
export class StageView {
  /** A promise that resolves when the PixiJS application has finished initializing. */
  public appLoaded: Promise<void>
  /** The PixiJS application instance. */
  private pixiApp: Application
  /** The container used for resizing elements on the stage. */
  public resizeContainer: Container & { initialWidth?: number; initialHeight?: number }
  /** The background sprite of the stage. */
  private background: Sprite

  /**
   * Creates an instance of the StageView class.
   */
  constructor() {
    // Initialize properties
    this.resizeContainer = new Container()
    this.background = new Sprite(Texture.from('background'))
    this.pixiApp = new Application()

    // Initialize the appLoaded promise
    this.appLoaded = this.pixiApp
      .init({
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio || 1,
      })
      .then(() => {
        // Add the PixiJS canvas to the document body
        document.body.appendChild(this.pixiApp.canvas)
        // Set canvas styles for full-screen display
        this.pixiApp.canvas.style.position = 'absolute'
        this.pixiApp.canvas.style.display = 'block'
        this.pixiApp.canvas.style.width = '100%'
        this.pixiApp.canvas.style.height = '100%'
        this.pixiApp.canvas.style.top = '0'
        this.pixiApp.canvas.style.left = '0'

        // Add background and resize container to the stage
        this.pixiApp.stage.addChild(this.background)
        this.pixiApp.stage.addChild(this.resizeContainer)
      })
  }

  /**
   * Resize the background sprite to fit the stage dimensions.
   * @param {Object} props - The properties containing width, height, and offset dimensions.
   * @param {number} props.width - The width dimension.
   * @param {number} props.height - The height dimension.
   * @param {number} props.offset - The offset value.
   */
  private resizeBackground(props: { width: number; height: number; offset: number }): void {
    const { width, height, offset } = props
    const scale = Math.max(
      width / this.background.texture.width,
      (height - offset) / this.background.texture.height
    )

    this.background.scale.set(scale)
    this.background.x = (width - this.background.width) / 2
    this.background.y = (height - offset - this.background.height) / 2
  }

  /**
   * Handle resizing of stage elements.
   * @param {Object} props - The properties containing width, height, offset, and scaleFactor dimensions.
   * @param {number} props.width - The width dimension.
   * @param {number} props.height - The height dimension.
   * @param {number} props.offset - The offset value.
   * @param {number} props.scaleFactor - The scale factor.
   */
  public handleResize(props: {
    width: number
    height: number
    offset: number
    scaleFactor: number
  }): void {
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

  /**
   * Get the current dimensions of the window for resizing purposes.
   * @returns {Object} An object containing the width and height dimensions of the window.
   */
  public get resizeDimensions(): { width: number; height: number } {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  /**
   * Get the stage instance.
   * @returns {Container} The stage container.
   */
  public get stage(): Container {
    return this.pixiApp.stage
  }
}
