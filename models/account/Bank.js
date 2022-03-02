class AddBank{
    constructor(payload) {
        if (payload.account_name) {
            this.account_name = payload.account_name;
        }
        if (payload.account_number) {
            this.account_number = payload.account_number;
        }
        if (payload.bank_code) {
            this.bank_code = payload.bank_code;
        }
        if (payload.bank_name) {
            this.bank_name = payload.bank_name;
        }
        if (payload.id) {
            this.id = payload.id;
        }
        if (payload.branch) {
            this.branch = payload.branch;
        }
        if (payload.is_testing) {
            this.is_testing = payload.is_testing;
        }
    }
}
export function createPayloadAddBank(payload) {
    return Object.freeze(new AddBank(payload));
  }

class Withdraw{
    constructor(payload) {
        if (payload.user_bank_id) {
            this.user_bank_id = payload.user_bank_id;
        }
        
        if (payload.note) {
            this.note = payload.note;
        }
    
        if (payload.amount) {
            this.amount = payload.amount;
        }
    }
}

export function createPayloadWithdraw(payload) {
    return Object.freeze(new Withdraw(payload));
}