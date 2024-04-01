import { StageView } from './view'

export class Stage {
  public view: StageView

  constructor() {
    this.view = new StageView()
  }
}
