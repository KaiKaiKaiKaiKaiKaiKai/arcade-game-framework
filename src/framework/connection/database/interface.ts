interface IDatabase {
  name: {
    [k in number]: string
  }
  rules: {
    [k in number]: string
  }
  rtp: {
    [k in number]: string
  }
  payout: {
    [k in number]: Array<string>
  }
}
