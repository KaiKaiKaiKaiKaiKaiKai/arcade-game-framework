import { Setup } from '../../connection/database/interface'
import { GameView } from './view'

export interface GameProps<TGameView> {
  setup: Setup
  viewClass: new (setup: Setup) => TGameView
}

export abstract class Game<TGameView extends GameView> {
  protected setup: Setup
  public view: TGameView

  constructor(props: GameProps<TGameView>) {
    const { setup, viewClass } = props

    this.setup = setup
    this.view = new viewClass(setup)
  }

  public abstract play(props: { win: number }): Promise<void>
}
