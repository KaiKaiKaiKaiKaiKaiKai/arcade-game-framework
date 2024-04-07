import { Container } from 'pixi.js'

export abstract class GameView extends Container {
  public scaleFactor: number = 1

  constructor() {
    super()

    this.createInitial()
    this.pivot.set(this.width / 2, this.height / 2)
  }

  public abstract play(props: { win: number }): Promise<void>

  protected abstract createInitial(): void
}
