class HashKeyReq {
  constructor(payload) {
    this.AgainLink = payload.AgainLink;
    this.Title = payload.Title;
    this.vpc_access_code = payload.vpc_access_code;
    this.vpc_Amount = payload.vpc_Amount;
    this.vpc_card_list = payload.vpc_card_list;
    this.vpc_command = payload.vpc_command;
    this.vpc_currency = payload.vpc_currency;
    this.vpc_customer_email = payload.vpc_customer_email;
    this.vpc_customer_id = payload.vpc_customer_id;
    this.vpc_customer_phone = payload.vpc_customer_phone;
    this.vpc_locale = payload.vpc_locale;
    this.vpc_merch_txn_ref = payload.vpc_merch_txn_ref;
    this.vpc_merchant = payload.vpc_merchant;
    this.vpc_order_info = payload.vpc_order_info;
    this.vpc_ReturnURL = payload.vpc_ReturnURL;
    this.vpc_secure_hash = payload.vpc_secure_hash;
    this.vpc_ticket_no = payload.vpc_ticket_no;
    this.vpc_txn_response_code = payload.vpc_txn_response_code;
    this.vpc_version = payload.vpc_version;
    this.payment_request = payload.payment_request;
  }
}

export function createHashKeyReq(payload) {
  return Object.freeze(
    new HashKeyReq({
      AgainLink: payload.AgainLink,
      Title: payload.Title,
      vpc_access_code: payload.vpc_access_code,
      vpc_Amount: payload.vpc_Amount,
      vpc_card_list: payload.vpc_card_list,
      vpc_command: payload.vpc_command,
      vpc_currency: payload.vpc_currency,
      vpc_customer_email: payload.vpc_customer_email,
      vpc_customer_id: payload.vpc_customer_id,
      vpc_customer_phone: payload.vpc_customer_phone,
      vpc_locale: payload.vpc_locale,
      vpc_merch_txn_ref: payload.vpc_merch_txn_ref,
      vpc_merchant: payload.vpc_merchant,
      vpc_order_info: payload.vpc_order_info,
      vpc_ReturnURL: payload.vpc_ReturnURL,
      vpc_secure_hash: payload.vpc_secure_hash,
      vpc_ticket_no: payload.vpc_ticket_no,
      vpc_txn_response_code: payload.vpc_txn_response_code,
      vpc_version: payload.vpc_version,
      payment_request: payload.payment_request,
    })
  );
}
