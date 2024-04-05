import { App } from '../../framework/app/controller'
import { BombsAway } from './bombsaway/controller'
import { BombsAwayView } from './bombsaway/view'

new App({
  gameControllerClass: BombsAway,
  gameViewClass: BombsAwayView,
  gameId: 2,
})
