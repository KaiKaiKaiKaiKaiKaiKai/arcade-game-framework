import { StageView } from './view'

export class Stage {
  public view: StageView

  constructor() {
    this.view = new StageView()

    const debouncedResizeHandler = this.debounce(() => this.view.handleResize(), 200)
    window.addEventListener('resize', debouncedResizeHandler)
  }

  private debounce<T extends (...args: any[]) => void>(func: T, waitFor: number) {
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        func.apply(this, args)
      }, waitFor)
    }
  }
}
