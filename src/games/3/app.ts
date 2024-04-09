import { App } from '../../framework/app/controller'
import { WheelOfPayouts } from './wheelofpayouts/controller'
import { WheelOfPayoutsView } from './wheelofpayouts/view'

new App({
  gameControllerClass: WheelOfPayouts,
  gameViewClass: WheelOfPayoutsView,
  gameId: 3,
})
