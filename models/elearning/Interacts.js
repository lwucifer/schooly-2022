class Interact {
    constructor(payload) {
        this.elearning_id = payload.elearning_id;
        this.title = payload.title;
        this.content = payload.content;
    }
}

export function createInteract(payload) {
    return Object.freeze(new Interact(payload));
}

class InteractAnswer{
    constructor(payload){
        this.question_id = payload.question_id;
        this.content = payload.content;
        this.image = payload.image;
    }
}
export function createInteractAnswer(payload) {
    return Object.freeze(new InteractAnswer(payload));
}