import { Container } from 'pixi.js'

export abstract class GameView extends Container {
  constructor() {
    super()
  }

  public async play(props: { win: number }): Promise<void> {}
}