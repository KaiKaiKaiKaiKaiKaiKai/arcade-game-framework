import gsap from 'gsap'
import { CountupText } from '../../../framework/app/game/text/countup/view'
import { GameView } from '../../../framework/app/game/view'
import { Table } from './table/view'
import { Card } from './card/view'
import { Sprite, Texture } from 'pixi.js'
import { Button } from './button/view'

export class HigherOrLowerView extends GameView {
  private winText: CountupText
  private table: Table
  private values: Array<string>
  private suits: Array<string>
  private pileLeft: Sprite
  private pileRight: Sprite
  private higherButton: Button
  private lowerButton: Button
  private choseHigher!: Boolean
  private houseCard!: Card
  private userCard!: Card

  constructor() {
    super()

    this.scaleFactor = 0.95
    this.sortableChildren = true

    this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
    this.suits = ['heart', 'diamond', 'club', 'spade']

    this.table = new Table()

    this.pileLeft = new Sprite(Texture.from('cardBack'))
    this.pileRight = new Sprite(Texture.from('cardBack'))
    ;(this.pileLeft.zIndex = 2), (this.pileRight.zIndex = 2)

    this.pileLeft.pivot = {
      x: this.pileLeft.width / 2,
      y: 0,
    }

    this.pileRight.pivot = {
      x: this.pileRight.width / 2,
      y: 0,
    }

    this.pileLeft.x = this.table.width / 2 - this.pileLeft.width / 2 - 25
    this.pileRight.x = this.table.width / 2 + this.pileRight.width / 2 + 25

    this.pileLeft.y = this.table.height / 2 - this.pileLeft.height / 2
    this.pileRight.y = this.table.height / 2 - this.pileRight.height / 2

    this.winText = new CountupText('0', {
      dropShadow: { angle: 1.5, alpha: 0.8, blur: 10, color: '#000000', distance: 0 },
      fill: '#ffffff',
      fontSize: 80,
      fontWeight: 'bold',
    })

    this.winText.zIndex = 4
    this.winText.x = this.table.width / 2
    this.winText.y = this.table.height / 2
    this.winText.scale.set(0)

    this.higherButton = new Button({ text: '▲' })
    this.higherButton.x = this.table.width / 2 - this.higherButton.width / 2
    this.higherButton.y = this.pileLeft.y - this.higherButton.height - 50
    this.higherButton.zIndex = 2

    this.lowerButton = new Button({ text: '▼' })
    this.lowerButton.x = this.table.width / 2 - this.lowerButton.width / 2
    this.lowerButton.y = this.pileLeft.y + this.pileLeft.height + 50
    this.lowerButton.zIndex = 2

    this.addChild(this.table)
    this.addChild(this.pileLeft)
    this.addChild(this.pileRight)
    this.addChild(this.higherButton)
    this.addChild(this.lowerButton)
    this.addChild(this.winText)
  }

  private async showWin(win: number) {
    gsap.to(this.winText.scale, { x: 2, y: 2, duration: 1, ease: 'back.out' })

    await this.winText.countup(win, 2)
    await gsap.to(this, { duration: 1 })
    await gsap.to(this.winText.scale, { x: 0, y: 0, duration: 1, ease: 'back.in' })
  }

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

    this.higherButton.removeAllListeners()
    this.lowerButton.removeAllListeners()

    await this.disableButtons()
  }

  private async enableButtons() {
    await gsap.to([this.higherButton, this.lowerButton], { alpha: 1, duration: 0.5 })

    this.higherButton.interactive = true
    this.higherButton.cursor = 'pointer'

    this.lowerButton.interactive = true
    this.lowerButton.cursor = 'pointer'
  }

  private async disableButtons() {
    this.higherButton.interactive = false
    this.lowerButton.interactive = false

    this.higherButton.cursor = 'default'
    this.lowerButton.cursor = 'default'

    await gsap.to([this.higherButton, this.lowerButton], { alpha: 0.5, duration: 0.5 })
  }

  public async play(props: { win: number }): Promise<void> {
    const { win } = props

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

    if (houseCardValue === 'A' || houseCardValue === '2') {
      await gsap.to(this, { duration: 1 })
      return this.play({ win })
    }

    await this.userSelection()

    const higherValues = this.values.slice(this.values.indexOf(houseCardValue) + 1)
    const lowerValues = this.values.slice(0, this.values.indexOf(houseCardValue))

    const higher = (this.choseHigher && win) || (!this.choseHigher && !win)

    const userValues = higher ? higherValues : lowerValues
    const userCardValue = userValues[Math.floor(Math.random() * userValues.length)]
    const userCardSuit = this.suits[Math.floor(Math.random() * this.suits.length)]

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

    if (win) {
      await this.showWin(win)
    }
  }
}
