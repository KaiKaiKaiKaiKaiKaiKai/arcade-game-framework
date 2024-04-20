import gsap from 'gsap'
import { Container, Sprite, Texture } from 'pixi.js'

/**
 * Represents the cups container in the Tricky Cups game.
 * @extends Container
 */
export class Cups extends Container {
  private cups: Array<Sprite> = [] // Array to store cup sprites
  private chosenCup: Sprite | null = null // Reference to the chosen cup sprite
  public winningCup: Sprite // Reference to the winning cup sprite

  /**
   * Creates an instance of Cups.
   * @param {number} cupAmount - The number of cups to create.
   */
  constructor(cupAmount: number) {
    super()

    // Set the z-index of the cups container
    this.zIndex = 2

    // Create cup sprites based on the provided cup amount
    for (let i = 0; i < cupAmount; i++) {
      const cup = Sprite.from(Texture.from('redcup')) // Assuming 'redcup' is the texture key
      cup.x = (cup.width + 50) * i // Position each cup horizontally with a gap of 50 pixels

      // Add the cup sprite to the cups array and to the container
      this.cups.push(cup)
      this.addChild(cup)
    }

    // Initially sets the winning cup to the middle cup
    this.winningCup = this.cups[Math.round((this.cups.length - 1) / 2)]
  }

  /**
   * Lifts a cup sprite with animation.
   * @param {Sprite} cup - The cup sprite to lift.
   * @returns {Promise<void>} A promise that resolves when the animation completes.
   * @private
   */
  private async liftCup(cup: Sprite): Promise<void> {
    // Define a timeline for cup lifting animation
    const tl = gsap.timeline()

    // Define the sequence of animation steps
    tl.to(cup, { y: '-=190', duration: 0.5, ease: 'sine.inOut' })
      .to(cup, { y: '+=10', duration: 0.5, ease: 'sine.inOut' })
      .to(cup, { y: '-=10', duration: 0.5, ease: 'sine.inOut' })
      .to(cup, { y: '+=10', duration: 0.5, ease: 'sine.inOut' })
      .to(cup, { y: '-=10', duration: 0.5, ease: 'sine.inOut' })
      .to(cup, { y: '+=190', duration: 0.5, ease: 'sine.inOut' })

    // Await the animation to complete
    await tl
  }

  /**
   * Shuffles the cups with animation.
   * @returns {Promise<void>} A promise that resolves when the shuffling completes.
   */
  public async shuffleCups(): Promise<void> {
    for (let i = 0; i < 20; i++) {
      const cupPromises = []
      const xList = this.cups.map((cup) => cup.x)

      for (const cup of this.cups) {
        const x = xList[Math.floor(Math.random() * xList.length)]
        xList.splice(xList.indexOf(x), 1)
        cupPromises.push(gsap.to(cup, { x, duration: 0.2, ease: 'sine.inOut' }))
      }

      await Promise.all(cupPromises)
    }
  }

  /**
   * Lifts the winning cup with animation.
   * @returns {Promise<void>} A promise that resolves when the animation completes.
   */
  public async liftWinningCup(): Promise<void> {
    await this.liftCup(this.winningCup)
  }

  /**
   * Lifts the chosen cup with animation.
   * @returns {Promise<void>} A promise that resolves when the animation completes.
   */
  public async liftChosenCup(): Promise<void> {
    await this.liftCup(this.chosenCup as Sprite)
  }

  /**
   * Handles user selection of a cup.
   * @param {number} win - The win amount.
   * @returns {Promise<void>} A promise that resolves when the user makes a selection.
   */
  public async userSelection(win: number): Promise<void> {
    let selectionResolve: () => void

    // Create a promise to resolve user selection
    const selectionPromise = new Promise<void>((resolve) => {
      selectionResolve = resolve
    })

    // Enable interaction for cup sprites and handle user selection
    for (const cup of this.cups) {
      cup.interactive = true
      cup.cursor = 'pointer'

      cup.on('pointerdown', () => {
        // Set the chosen cup
        this.chosenCup = cup

        // Set the winning cup based on the user's choice
        if (win) {
          this.winningCup = this.chosenCup
        } else {
          const remainingCups = this.cups.filter((c) => c !== this.chosenCup)
          const randomCup = remainingCups[Math.floor(Math.random() * remainingCups.length)]

          this.winningCup = randomCup
        }

        // Resolve the user selection promise
        selectionResolve()
      })
    }

    // Wait for the user to make a selection
    await selectionPromise

    // Disable interaction for cup sprites after user selection
    for (const cup of this.cups) {
      cup.removeAllListeners('pointerdown')
      cup.interactive = false
      cup.cursor = 'default'
    }
  }
}
