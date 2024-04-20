import { Container, Sprite, Texture } from 'pixi.js'
import { GameView } from '../../../framework/app/game/view'
import { Wheel } from './wheel/view'
import { Game3Setup, Setup } from '../../../framework/connection/database/interface'

export class WheelOfPayoutsView extends GameView {
  private wheelContainer!: Container
  private wheel!: Wheel

  constructor(setup: Setup) {
    super(setup)
  }

  protected createInitial() {
    this.scaleFactor = 0.95
    this.sortableChildren = true

    const board = new Sprite(Texture.from('board'))

    this.wheelContainer = new Container()
    this.wheelContainer.angle = -90
    this.wheelContainer.position.set(board.width / 2, board.height / 2)

    this.wheel = new Wheel(this.setup as Game3Setup)

    this.wheelContainer.addChild(this.wheel)

    this.addChild(this.wheelContainer)
    this.addChild(board)
  }

  public async play(props: { win: number }) {
    await this.wheel.spin(props.win)
  }
}
