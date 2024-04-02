import { App } from '../../framework/app/controller'
import { HigherOrLower } from './higherorlower/controller'
import { HigherOrLowerView } from './higherorlower/view'

new App({
  gameControllerClass: HigherOrLower,
  gameViewClass: HigherOrLowerView,
  gameId: 1,
})
