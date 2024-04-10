interface IDatabase {
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
}
