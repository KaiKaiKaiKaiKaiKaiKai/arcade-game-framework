import gsap from 'gsap'
import { Container, Sprite, Text, Texture } from 'pixi.js'

export class UIView extends Container {
  private playButton: Container
  private playBackground: Sprite
  private nameBackground: Sprite
  private gameName: Text
  private playText: Text

  constructor(props: { name: string }) {
    super()

    this.playButton = new Container()

    this.playBackground = Sprite.from(Texture.WHITE)
    this.playBackground.height = 50
    this.playBackground.tint = 0xd01554

    this.nameBackground = Sprite.from(Texture.WHITE)
    this.nameBackground.height = 25
    this.nameBackground.tint = 0x101010

    this.gameName = new Text(props.name, { fill: 0xffffff, fontSize: 15 })

    this.playText = new Text('Play Round', { fill: 0x101010, fontWeight: 'bold', fontSize: 20 })

    this.playButton.addChild(this.playBackground)
    this.playButton.addChild(this.playText)

    this.addChild(this.playButton)
    this.addChild(this.nameBackground)
    this.addChild(this.gameName)

    this.playButton.on('pointerdown', async () => {
      await this.disable()
      this.emit('play')
    })

    this.enable()
  }

  public async enable(): Promise<void> {
    await gsap.to(this.playButton, { alpha: 1, duration: 0.5 })

    this.interactive = true
    this.playButton.interactive = true
    this.playButton.cursor = 'pointer'
  }

  public async disable(): Promise<void> {
    this.interactive = false
    this.playButton.interactive = false
    this.playButton.cursor = 'normal'

    await gsap.to(this.playButton, { alpha: 0.5, duration: 0.5 })
  }

  public handleResize(props: { width: number; height: number }) {
    this.playBackground.width = props.width
    this.nameBackground.width = props.width
    this.nameBackground.y = this.playBackground.height
    this.gameName.y =
      this.nameBackground.y + (this.nameBackground.height - this.gameName.height) / 2
    this.gameName.x = this.nameBackground.width / 2 - this.gameName.width / 2
    this.playText.x = this.playBackground.x + (this.playBackground.width - this.playText.width) / 2
    this.playText.y = (this.playBackground.height - this.playText.height) / 2

    this.y = props.height - this.height
  }
}
