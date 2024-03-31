import { Container } from 'pixi.js'
import { GameView } from './view'

export interface IGame {
  name: string
  rules: string
  rtp: string
  view: GameView
}
