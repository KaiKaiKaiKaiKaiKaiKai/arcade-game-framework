import { Container } from 'pixi.js'

export interface IGame {
  name: string
  rules: string
  rtp: string
  view: Container
}
