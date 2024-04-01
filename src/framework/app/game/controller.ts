import { GameView } from './view'

export interface GameProps<TGameView> {
  name: string
  rules: string
  rtp: string
  viewClass: new () => TGameView
}

export abstract class Game<TGameView extends GameView> {
  protected name: string
  protected rules: string
  protected rtp: string
  public view: TGameView

  constructor(props: GameProps<TGameView>) {
    this.name = props.name
    this.rules = props.rules
    this.rtp = props.rtp
    this.view = new props.viewClass()
  }

  public abstract play(props: { win: number }): Promise<void>
}
