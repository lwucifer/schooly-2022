class CreatePost {
  constructor({
    id,
    privacy,
    type,
    text,
    tags,
    checkin,
    link,
    feeling,
    shared_post_id,
  }) {
    this.type = type; // required
    id && (this.id = id);
    privacy && (this.privacy = privacy);
    text && (this.text = text);
    tags && (this.tags = tags);
    checkin && (this.checkin = checkin);
    link && (this.link = link);
    feeling && (this.feeling = feeling);
    shared_post_id && (this.shared_post_id = shared_post_id);
  }
}

class EditPost {
  constructor({ text, checkin, feeling, attachments }) {
    text && (this.text = text);
    checkin && (this.checkin = checkin);
    feeling && (this.feeling = feeling);
    attachments && attachments.length && (this.attachments = attachments);
  }
}

export function createPost(params) {
  return Object.freeze(new CreatePost(params));
}

export function editPost(params) {
  return Object.freeze(new EditPost(params));
}
