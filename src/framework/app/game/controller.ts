import { Container, Text } from 'pixi.js'
import { IGame } from '../../../framework/app/game/interface'

export class Game {
  protected name: string
  protected rules: string
  protected rtp: string
  public view: Container

  constructor(props: IGame & { view: Container }) {
    this.name = props.name
    this.rules = props.rules
    this.rtp = props.rtp
    this.view = props.view
  }
}
