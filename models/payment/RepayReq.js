class RepayReq {
  constructor(payload) {
    this.vpc_ReturnURL = payload.vpc_ReturnURL;
    this.vpc_Amount = payload.vpc_Amount;
    this.AgainLink = payload.AgainLink;
    this.Title = payload.Title;
    this.vpc_OrderInfo = payload.vpc_OrderInfo;
  }
}

export function createRepayReq(payload) {
  return Object.freeze(new RepayReq(payload));
}
