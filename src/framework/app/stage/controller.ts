import { StageView } from './view'

export class Stage {
  public view: StageView

  constructor(props: { name: string }) {
    this.view = new StageView({ name: props.name })
  }
}
