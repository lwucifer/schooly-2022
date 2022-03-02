class BannedStudent {
    constructor(payload) {
        this.elearning_id = payload.elearning_id;
        this.user_id = payload.user_id;
        this.banned = payload.banned;
    }
}

export function createBannedStudent(payload) {
    return Object.freeze(new BannedStudent(payload));
}