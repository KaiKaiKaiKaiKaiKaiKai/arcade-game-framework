import { UIView } from './view'

export class UI {
  public view: UIView

  constructor(props: { name: string; rtp: number }) {
    const { name, rtp } = props
    this.view = new UIView({ name, rtp })
  }
}
