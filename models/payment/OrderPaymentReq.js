class OrderPaymentReq {
  constructor(cost, method, note, orders) {
    this.cost = cost;
    this.method = method;
    this.note = note;
    this.orders = orders;
  }
}

export function createOrderPaymentReq(cost, method, note, orders) {
  return Object.freeze(new OrderPaymentReq(cost, method, note, orders));
}
