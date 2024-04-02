import gsap from 'gsap'
import { Container, Sprite, Text, Texture } from 'pixi.js'
import { BetButton } from './bet-button/view'

export class UIView extends Container {
  private playButton: Container
  private increaseBet: BetButton
  private decreaseBet: BetButton
  private playBackground: Sprite
  private nameBackground: Sprite
  private betBackground: Sprite
  private bankText: Text
  private betText: Text
  private gameName: Text
  private playText: Text

  constructor(props: { name: string }) {
    super()

    this.playButton = new Container()

    this.increaseBet = new BetButton({ text: '+' })
    this.decreaseBet = new BetButton({ text: '–' })

    this.playBackground = Sprite.from(Texture.WHITE)
    this.playBackground.height = 50
    this.playBackground.tint = 0x3eb489

    this.betBackground = Sprite.from(Texture.WHITE)
    this.betBackground.height = 25
    this.betBackground.tint = 0x101010

    this.nameBackground = Sprite.from(Texture.WHITE)
    this.nameBackground.height = 25
    this.nameBackground.tint = 0x101010

    this.gameName = new Text(props.name, { fill: 0xa1a1a1, fontSize: 15 })
    this.playText = new Text('Play Round', { fill: 0x101010, fontWeight: 'bold', fontSize: 20 })
    this.bankText = new Text('', { fill: 0xffffff, fontSize: 15 })
    this.betText = new Text('', { fill: 0xffffff, fontSize: 15 })

    this.playButton.addChild(this.playBackground)
    this.playButton.addChild(this.playText)

    this.addChild(this.playButton)
    this.addChild(this.nameBackground)
    this.addChild(this.betBackground)
    this.addChild(this.gameName)
    this.addChild(this.bankText)
    this.addChild(this.betText)
    this.addChild(this.increaseBet)
    this.addChild(this.decreaseBet)

    this.playButton.on('pointerdown', async () => {
      this.emit('play')
    })

    this.increaseBet.on('pointerdown', () => this.emit('increase-bet'))
    this.decreaseBet.on('pointerdown', () => this.emit('decrease-bet'))

    this.enable()
  }

  public async enable(): Promise<void> {
    const buttons = [this.playButton, this.increaseBet, this.decreaseBet]

    await gsap.to(buttons, { alpha: 1, duration: 0.5 })

    this.interactive = true

    for (const button of buttons) {
      button.interactive = true
      button.cursor = 'pointer'
    }
  }

  public async disable(): Promise<void> {
    const buttons = [this.playButton, this.increaseBet, this.decreaseBet]

    this.interactive = false

    for (const button of buttons) {
      button.interactive = false
      button.cursor = 'default'
    }

    await gsap.to(buttons, { alpha: 0.5, duration: 0.5 })
  }

  public handleResize(props: { width: number; height: number }) {
    this.betBackground.width = props.width
    this.playBackground.width = props.width
    this.nameBackground.width = props.width

    this.playBackground.y = this.betBackground.height
    this.nameBackground.y = this.playBackground.y + this.playBackground.height
    this.gameName.y =
      this.nameBackground.y + (this.nameBackground.height - this.gameName.height) / 2

    this.gameName.x = this.nameBackground.width / 2 - this.gameName.width / 2

    this.playText.x = this.playBackground.x + (this.playBackground.width - this.playText.width) / 2
    this.playText.y =
      this.playBackground.y + (this.playBackground.height - this.playText.height) / 2

    this.bankText.x = this.betBackground.x + this.betBackground.width / 2 - this.bankText.width - 10
    this.bankText.y = this.betBackground.y + (this.betBackground.height - this.bankText.height) / 2

    this.betText.x = this.betBackground.x + this.betBackground.width / 2 + 10
    this.betText.y = this.betBackground.y + (this.betBackground.height - this.betText.height) / 2

    this.increaseBet.x = this.betText.x + this.betText.width + 10
    this.increaseBet.y =
      this.betBackground.y + (this.betBackground.height - this.increaseBet.height) / 2

    this.decreaseBet.x = this.increaseBet.x + this.increaseBet.width + 5
    this.decreaseBet.y =
      this.betBackground.y + (this.betBackground.height - this.decreaseBet.height) / 2

    this.y = props.height - this.height
  }

  public set bank(bank: number) {
    this.bankText.text = `Bank: FUN${bank.toFixed(2)}`
  }

  public set bet(bet: number) {
    this.betText.text = `Bet: FUN${bet.toFixed(2)}`
  }
}
