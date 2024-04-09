import { Container, Sprite, Texture } from 'pixi.js'
import { GameView } from '../../../framework/app/game/view'
import gsap from 'gsap'
import { Wheel } from './wheel/view'

export class WheelOfPayoutsView extends GameView {
  private wheelContainer!: Container
  private wheel!: Wheel

  constructor() {
    super()
  }

  protected createInitial() {
    this.scaleFactor = 0.95
    this.sortableChildren = true

    const board = new Sprite(Texture.from('board'))

    this.wheelContainer = new Container()
    this.wheelContainer.angle = -90
    this.wheelContainer.position.set(board.width / 2, board.height / 2)

    this.wheel = new Wheel()

    this.wheelContainer.addChild(this.wheel)

    this.addChild(this.wheelContainer)
    this.addChild(board)
  }

  public async play(props: { win: number }) {
    await this.wheel.spin(props.win)
  }
}
