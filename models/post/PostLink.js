class PostLink {
  constructor({
    detect,
    url,
    siteName,
    title,
    description,
    imageUrl
  }) {
    this.detect = detect;
    this.url = url;
    this.site_name = siteName;
    this.title = title;
    this.description = description;
    this.image_url = imageUrl;
  }
}

export function createPostLink(...args) {
  return Object.freeze(new PostLink(...args));
}
