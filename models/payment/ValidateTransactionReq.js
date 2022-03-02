class ValidateTransactionReq {
  constructor(
    vpc_amount,
    vpc_card,
    vpc_card_uid,
    vpc_command,
    vpc_currency_code,
    vpc_locale,
    vpc_merch_txn_ref,
    vpc_merchant,
    vpc_message,
    vpc_order_info,
    vpc_pay_channel,
    vpc_secure_hash,
    vpc_transaction_no,
    vpc_txn_response_code,
  ) {
    this.vpc_amount = vpc_amount;
    this.vpc_card = vpc_card;
    this.vpc_card_uid = vpc_card_uid;
    this.vpc_command = vpc_command;
    this.vpc_currency_code = vpc_currency_code;
    this.vpc_locale = vpc_locale;
    this.vpc_merch_txn_ref = vpc_merch_txn_ref;
    this.vpc_merchant = vpc_merchant;
    this.vpc_message = vpc_message;
    this.vpc_order_info = vpc_order_info;
    this.vpc_pay_channel = vpc_pay_channel;
    this.vpc_secure_hash = vpc_secure_hash;
    this.vpc_transaction_no = vpc_transaction_no;
    this.vpc_txn_response_code = vpc_txn_response_code;
  }
}

export function createValidateTransactionReq(vpc_amount,
  vpc_card,
  vpc_card_uid,
  vpc_command,
  vpc_currency_code,
  vpc_locale,
  vpc_merch_txn_ref,
  vpc_merchant,
  vpc_message,
  vpc_order_info,
  vpc_pay_channel,
  vpc_secure_hash,
  vpc_transaction_no,
  vpc_txn_response_code,
) {
  return Object.freeze(new ValidateTransactionReq(vpc_amount,
    vpc_card,
    vpc_card_uid,
    vpc_command,
    vpc_currency_code,
    vpc_locale,
    vpc_merch_txn_ref,
    vpc_merchant,
    vpc_message,
    vpc_order_info,
    vpc_pay_channel,
    vpc_secure_hash,
    vpc_transaction_no,
    vpc_txn_response_code)
  );
}
