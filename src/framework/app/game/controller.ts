import { GameView } from './view'

export interface GameProps<TGameView> {
  name: string
  viewClass: new () => TGameView
}

export abstract class Game<TGameView extends GameView> {
  protected name: string
  public view: TGameView

  constructor(props: GameProps<TGameView>) {
    this.name = props.name
    this.view = new props.viewClass()
  }

  public abstract play(props: { win: number }): Promise<void>
}
