import gsap from 'gsap'
import { Container, Sprite, Text, Texture } from 'pixi.js'
import { BetButton } from './bet-button/view'

/**
 * Represents the UI view responsible for managing the user interface components.
 */
export class UIView extends Container {
  private playButton: Container
  private increaseBet: BetButton
  private decreaseBet: BetButton
  private playBackgroundBlack: Sprite
  private playBackground: Sprite
  private nameBackground: Sprite
  private betBackground: Sprite
  private bankText: Text
  private betText: Text
  private gameName: Text
  private playText: Text

  /**
   * Creates an instance of the UIView class.
   * @param {Object} props - The properties required to initialize the UI view.
   * @param {string} props.name - The name of the game.
   * @param {number} props.rtp - The RTP (Return to Player) percentage of the game.
   */
  constructor(props: { name: string; rtp: number }) {
    super()

    const { name, rtp } = props

    // Initialize UI elements
    this.playButton = new Container()
    this.increaseBet = new BetButton({ text: '+', tint: 0x3eb489 })
    this.decreaseBet = new BetButton({ text: '–', tint: 0xb43e50 })
    this.playBackgroundBlack = Sprite.from(Texture.WHITE)
    this.playBackground = Sprite.from(Texture.WHITE)
    this.betBackground = Sprite.from(Texture.WHITE)
    this.nameBackground = Sprite.from(Texture.WHITE)
    this.gameName = new Text(`${name} | ${rtp * 100}%`, { fill: 0xa1a1a1, fontSize: 15 })
    this.playText = new Text('Play Round', { fill: 0x101010, fontWeight: 'bold', fontSize: 20 })
    this.bankText = new Text('', { fill: 0xffffff, fontSize: 15 })
    this.betText = new Text('', { fill: 0xffffff, fontSize: 15 })

    // Set initial properties for UI elements
    this.playBackgroundBlack.height = 50
    this.playBackgroundBlack.tint = 0x101010

    this.playBackground.height = 50
    this.playBackground.tint = 0x3e95b4

    this.betBackground.height = 25
    this.betBackground.tint = 0x101010

    this.nameBackground.height = 25
    this.nameBackground.tint = 0x101010

    // Add UI elements to containers
    this.playButton.addChild(this.playBackground)
    this.playButton.addChild(this.playText)
    this.addChild(this.playBackgroundBlack)
    this.addChild(this.playButton)
    this.addChild(this.nameBackground)
    this.addChild(this.betBackground)
    this.addChild(this.gameName)
    this.addChild(this.bankText)
    this.addChild(this.betText)
    this.addChild(this.increaseBet)
    this.addChild(this.decreaseBet)

    // Set event listeners
    this.playButton.on('pointerdown', () => this.emit('play'))
    this.increaseBet.on('pointerdown', () => this.emit('increase-bet'))
    this.decreaseBet.on('pointerdown', () => this.emit('decrease-bet'))

    // Enable UI
    this.enable()
  }

  /**
   * Enables UI elements for interaction.
   * @returns {Promise<void>}
   */
  public async enable(): Promise<void> {
    const buttons = [this.playButton, this.increaseBet, this.decreaseBet]

    await gsap.to(buttons, { alpha: 1, duration: 0.5 })

    this.interactive = true

    for (const button of buttons) {
      button.interactive = true
      button.cursor = 'pointer'
    }
  }

  /**
   * Disables UI elements from interaction.
   * @returns {Promise<void>}
   */
  public async disable(): Promise<void> {
    const buttons = [this.playButton, this.increaseBet, this.decreaseBet]

    this.interactive = false

    for (const button of buttons) {
      button.interactive = false
      button.cursor = 'default'
    }

    await gsap.to(buttons, { alpha: 0.5, duration: 0.5 })
  }

  /**
   * Handles resizing of UI elements based on provided dimensions.
   * @param {Object} props - The properties containing width and height dimensions.
   * @param {number} props.width - The width dimension.
   * @param {number} props.height - The height dimension.
   */
  public handleResize(props: { width: number; height: number }): void {
    // Destructure width from the props object
    const { width } = props

    // Set the width of UI background elements to match the provided width
    this.betBackground.width = width
    this.playBackground.width = width
    this.playBackgroundBlack.width = width
    this.nameBackground.width = width

    // Position the play background below the bet background
    this.playBackground.y = this.betBackground.height
    this.playBackgroundBlack.y = this.playBackground.y

    // Position the name background below the play background
    this.nameBackground.y = this.playBackground.y + this.playBackground.height

    // Center the game name vertically within the name background
    this.gameName.y =
      this.nameBackground.y + (this.nameBackground.height - this.gameName.height) / 2

    // Center the game name horizontally within the name background
    this.gameName.x = this.nameBackground.width / 2 - this.gameName.width / 2

    // Position the play text within the play background
    this.playText.x = this.playBackground.x + (this.playBackground.width - this.playText.width) / 2
    this.playText.y =
      this.playBackground.y + (this.playBackground.height - this.playText.height) / 2

    // Position the increase bet button centered horizontally and vertically within the bet background
    this.increaseBet.x =
      this.betBackground.x + this.betBackground.width / 2 - this.increaseBet.width
    this.increaseBet.y =
      this.betBackground.y + (this.betBackground.height - this.increaseBet.height) / 2

    // Position the decrease bet button next to the increase bet button
    this.decreaseBet.x = this.increaseBet.x + this.increaseBet.width
    this.decreaseBet.y =
      this.betBackground.y + (this.betBackground.height - this.decreaseBet.height) / 2

    // Position the bank text to the left of the increase bet button with a slight margin
    this.bankText.x = this.increaseBet.x - this.bankText.width - 10
    this.bankText.y = this.betBackground.y + (this.betBackground.height - this.bankText.height) / 2

    // Position the bet text to the right of the decrease bet button with a slight margin
    this.betText.x = this.decreaseBet.x + this.decreaseBet.width + 10
    this.betText.y = this.betBackground.y + (this.betBackground.height - this.betText.height) / 2

    // Set the y position of the entire UI view to align with the bottom of the provided height
    this.y = props.height - this.height
  }

  /**
   * Sets the bank value displayed in the UI.
   * @param {number} bank - The bank value to set.
   */
  public set bank(bank: number) {
    this.bankText.text = `Bank: FUN${bank.toFixed(2)}`
  }

  /**
   * Sets the bet value displayed in the UI.
   * @param {number} bet - The bet value to set.
   */
  public set bet(bet: number) {
    this.betText.text = `Bet: FUN${bet.toFixed(2)}`
  }
}
