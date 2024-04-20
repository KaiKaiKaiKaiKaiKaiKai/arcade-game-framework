import gsap from 'gsap'
import { GameView } from '../../../framework/app/game/view'
import { Table } from './table/view'
import { Card } from './card/view'
import { Sprite, Texture } from 'pixi.js'
import { Button } from '../../../framework/app/game/button/view'
import { Game1Setup, Setup } from '../../../framework/connection/database/interface'

/**
 * Represents the view logic for the Higher or Lower game.
 * @extends GameView
 */
export class HigherOrLowerView extends GameView {
  private table!: Table
  private values!: Array<string>
  private suits!: Array<string>
  private pileLeft!: Sprite
  private pileRight!: Sprite
  private higherButton!: Button
  private lowerButton!: Button
  private choseHigher!: Boolean
  private houseCard!: Card
  private userCard!: Card

  /**
   * Creates an instance of HigherOrLowerView.
   * @param {Setup} setup - The setup for the game view.
   */
  constructor(setup: Setup) {
    super(setup)
  }

  /**
   * Initializes the game view by creating the initial setup.
   */
  protected createInitial() {
    this.scaleFactor = 1
    this.sortableChildren = true

    const { values, suits } = this.setup as Game1Setup

    this.values = values
    this.suits = suits

    this.table = new Table()

    // Creating the left and right card piles
    this.pileLeft = new Sprite(Texture.from('cardBack'))
    this.pileRight = new Sprite(Texture.from('cardBack'))

    // Setting up positions and zIndex for the card piles
    // Left pile
    this.pileLeft.zIndex = 2
    this.pileLeft.pivot = {
      x: this.pileLeft.width / 2,
      y: 0,
    }
    this.pileLeft.x = this.table.width / 2 - this.pileLeft.width / 2 - 25
    this.pileLeft.y = this.table.height / 2 - this.pileLeft.height / 2
    // Right pile
    this.pileRight.zIndex = 2
    this.pileRight.pivot = {
      x: this.pileRight.width / 2,
      y: 0,
    }
    this.pileRight.x = this.table.width / 2 + this.pileRight.width / 2 + 25
    this.pileRight.y = this.table.height / 2 - this.pileRight.height / 2

    // Creating higher and lower buttons
    this.higherButton = new Button({ text: '▲' })
    this.lowerButton = new Button({ text: '▼' })
    this.higherButton.x = this.lowerButton.x = this.table.width / 2 - this.higherButton.width / 2
    this.higherButton.y = this.pileLeft.y - this.higherButton.height - 50
    this.lowerButton.y = this.pileLeft.y + this.pileLeft.height + 50
    this.higherButton.zIndex = this.lowerButton.zIndex = 2

    // Adding elements to the game view
    this.addChild(this.table)
    this.addChild(this.pileLeft)
    this.addChild(this.pileRight)
    this.addChild(this.higherButton)
    this.addChild(this.lowerButton)
  }

  /**
   * Allows the user to select "higher" or "lower".
   */
  private async userSelection() {
    await this.enableButtons()

    let selectionResolve: () => void
    const selectionPromise = new Promise<void>((resolve) => {
      selectionResolve = resolve
    })

    this.higherButton.on('pointerdown', () => {
      this.choseHigher = true
      selectionResolve()
    })

    this.lowerButton.on('pointerdown', () => {
      this.choseHigher = false
      selectionResolve()
    })

    await selectionPromise

    this.higherButton.removeAllListeners('pointerdown')
    this.lowerButton.removeAllListeners('pointerdown')

    await this.disableButtons()
  }

  /**
   * Enables the higher and lower buttons.
   */
  private async enableButtons() {
    await Promise.all([this.higherButton.enable(), this.lowerButton.enable()])
  }

  /**
   * Disables the higher and lower buttons.
   */
  private async disableButtons() {
    await Promise.all([this.higherButton.disable(), this.lowerButton.disable()])
  }

  /**
   * Initiates the play action for the Higher or Lower game.
   * @param {Object} props - The properties for the play action.
   * @param {number} props.win - The payout.
   * @returns {Promise<void>} A promise that resolves when the play action is complete.
   */
  public async play(props: { win: number }): Promise<void> {
    const { win } = props

    // Handling previous cards
    let oldCardPromises: Array<Promise<void>> = []

    if (this.houseCard) {
      oldCardPromises.push(this.houseCard.hide())
    }

    if (this.userCard) {
      oldCardPromises.push(this.userCard.hide())
    }

    if (oldCardPromises.length) {
      await Promise.all(oldCardPromises)
      await gsap.to(this, { duration: 0.5 })
    }

    // Generating a new house card
    const houseCardValue = this.values[Math.floor(Math.random() * this.values.length)]
    const houseCardSuit = this.suits[Math.floor(Math.random() * this.suits.length)]

    const houseCard = new Card({
      value: houseCardValue,
      suit: houseCardSuit,
    })

    houseCard.zIndex = 3
    houseCard.position = this.pileLeft.position

    this.addChild(houseCard)

    await houseCard.reveal(this.table.width / 2)

    if (this.houseCard) {
      this.houseCard.destroy()
    }

    this.houseCard = houseCard

    // Checking if the house card is on the extreme values
    if (
      this.values.indexOf(houseCardValue) === 0 ||
      this.values.indexOf(houseCardValue) === this.values.length - 1
    ) {
      await gsap.to(this, { duration: 1 })
      return this.play({ win })
    }

    // User selects higher or lower
    await this.userSelection()

    const higherValues = this.values.slice(this.values.indexOf(houseCardValue))
    const lowerValues = this.values.slice(0, this.values.indexOf(houseCardValue) + 1)

    const higher = (this.choseHigher && win) || (!this.choseHigher && !win)

    const userValues = higher ? higherValues : lowerValues
    const userCardValue = userValues[Math.floor(Math.random() * userValues.length)]

    // Generating a user card
    let userSuits = [...this.suits]

    if (userCardValue === houseCardValue) {
      userSuits = userSuits.filter((suit) => suit !== houseCardSuit)
    }

    const userCardSuit = userSuits[Math.floor(Math.random() * userSuits.length)]

    const userCard = new Card({
      value: userCardValue,
      suit: userCardSuit,
    })

    userCard.zIndex = 3
    userCard.position = this.pileRight.position

    this.addChild(userCard)

    await userCard.reveal(this.table.width / 2)

    if (this.userCard) {
      this.userCard.destroy()
    }

    this.userCard = userCard

    // If the user and house cards match, replay
    if (houseCardValue === userCardValue) {
      await gsap.to(this, { duration: 1 })
      return this.play({ win })
    }
  }
}
