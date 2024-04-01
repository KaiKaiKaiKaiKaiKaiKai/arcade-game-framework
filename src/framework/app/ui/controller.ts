import { UIView } from './view'

export class UI {
  public view: UIView
  constructor(props: { name: string }) {
    this.view = new UIView({ name: props.name })
  }
}
