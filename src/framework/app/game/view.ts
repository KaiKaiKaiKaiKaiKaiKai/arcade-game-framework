import { Container } from 'pixi.js'
import { Setup } from '../../connection/database/interface'

export abstract class GameView extends Container {
  protected setup: Setup
  public scaleFactor: number = 1

  constructor(setup: Setup) {
    super()

    this.setup = setup

    this.createInitial()
    this.pivot.set(this.width / 2, this.height / 2)
  }

  public abstract play(props: { win: number }): Promise<void>

  protected abstract createInitial(): void
}
