import { StageView } from './view'

/**
 * Represents the stage controller responsible for managing the stage view.
 */
export class Stage {
  /** The view instance associated with the stage. */
  public view: StageView

  /**
   * Creates an instance of the Stage controller.
   */
  constructor() {
    // Initialize the view with a new StageView instance
    this.view = new StageView()
  }
}
