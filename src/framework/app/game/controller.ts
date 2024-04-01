import { Container } from 'pixi.js'
import { IGame } from '../../../framework/app/game/interface'
import { GameView } from './view'

export abstract class Game {
  protected name: string
  protected rules: string
  protected rtp: string
  public view: GameView

  constructor(props: IGame) {
    this.name = props.name
    this.rules = props.rules
    this.rtp = props.rtp
    this.view = props.view
  }

  public async play(props: { win: number }): Promise<void> {}
}
