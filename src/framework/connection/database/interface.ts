/**
 * Represents the structure of the database containing game data.
 */
export interface IDatabase {
  /**
   * Stores the names of the games indexed by their IDs.
   */
  name: {
    [k in number]: string
  }
  /**
   * Stores the rules of the games indexed by their IDs.
   */
  rules: {
    [k in number]: string
  }
  /**
   * Stores the RTP (Return to Player) percentages of the games indexed by their IDs.
   */
  rtp: {
    [k in number]: number
  }
  /**
   * Stores the payout options of the games indexed by their IDs.
   */
  payout: {
    [k in number]: Array<number>
  }
  /**
   * Stores the weight options of the games indexed by their IDs.
   */
  weight: {
    [k in number]: Array<number>
  }
  /**
   * Stores the setup details of the games indexed by their IDs.
   */
  setup: {
    [k in number]: Setup
  }
}

/**
 * Represents the setup details of a game.
 */
export type Setup = Game0Setup | Game1Setup | Game2Setup | Game3Setup

/**
 * Represents the setup details of Game 0.
 */
export interface Game0Setup {
  /**
   * The amount of cups used in the game.
   */
  cupAmount: number
}

/**
 * Represents the setup details of Game 1.
 */
export interface Game1Setup {
  /**
   * The values available in the game.
   */
  values: Array<string>
  /**
   * The suits available in the game.
   */
  suits: Array<string>
}

/**
 * Represents the setup details of Game 2.
 */
export interface Game2Setup {
  /**
   * The time options available in the game.
   */
  timeOptions: Array<number>
}

/**
 * Represents the setup details of Game 3.
 */
export interface Game3Setup {
  /**
   * The base values available in the game.
   */
  baseValues: Array<number | string>
  /**
   * The double values available in the game.
   */
  doubleValues: Array<number | string>
}
