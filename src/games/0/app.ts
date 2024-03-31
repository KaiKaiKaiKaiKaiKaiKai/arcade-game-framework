import { App } from '../../framework/app/controller'
import { TrickyCups } from './trickycups/controller'
import { TrickyCupsView } from './trickycups/view'

new App({
  gameControllerClass: TrickyCups,
  gameViewClass: TrickyCupsView,
  gameId: 0,
})
