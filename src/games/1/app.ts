import { App } from '../../framework/app/controller'
import { TrickyCups } from './higherorlower/controller'
import { TrickyCupsView } from './higherorlower/view'

new App({
  gameControllerClass: TrickyCups,
  gameViewClass: TrickyCupsView,
  gameId: 1,
})
