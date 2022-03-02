class OlClass {
    constructor(
      elearning_id,
      enable,
      id,
      is_allow_download,
      is_invite_all,
      name,
      schedules,
    ) {
      this.source_id = source_id;
      this.parent_comment_id = parent_comment_id;
      this.comment_content = comment_content;
      this.comment_link = comment_link;
      this.list_tag = list_tag;
      this.comment_images = comment_images;
    }
  }
  
  export function createComment(...args) {
    return Object.freeze(new CreateComment(...args));
  }
  