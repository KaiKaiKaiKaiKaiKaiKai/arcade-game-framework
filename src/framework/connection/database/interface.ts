export interface IDatabase {
  name: {
    [k in number]: string
  }
  rules: {
    [k in number]: string
  }
  rtp: {
    [k in number]: number
  }
  payout: {
    [k in number]: Array<number>
  }
  weight: {
    [k in number]: Array<number>
  }
  setup: {
    [k in number]: Setup
  }
}

export type Setup = Game0Setup | Game1Setup | Game2Setup | Game3Setup

export interface Game0Setup {
  cupAmount: number
}

export interface Game1Setup {
  values: Array<string>
  suits: Array<string>
}

export interface Game2Setup {
  timeOptions: Array<number>
}

export interface Game3Setup {
  baseValues: Array<number | string>
  doubleValues: Array<number | string>
}
