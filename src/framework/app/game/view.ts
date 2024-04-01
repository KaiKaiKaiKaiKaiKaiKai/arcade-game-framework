import { Container } from 'pixi.js'

export abstract class GameView extends Container {
  constructor() {
    super()
  }

  public abstract play(props: { win: number }): Promise<void>
}
