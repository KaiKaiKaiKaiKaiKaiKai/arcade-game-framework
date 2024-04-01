import { Container } from 'pixi.js'

export abstract class GameView extends Container {
  public scaleFactor: number = 1

  constructor() {
    super()
  }

  public abstract play(props: { win: number }): Promise<void>
}
