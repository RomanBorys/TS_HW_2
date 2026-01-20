declare module "simplelightbox" {
  export interface SimpleLightboxOptions {
    captions?: boolean;
    captionsData?: "alt" | "title" | "data-title";
    captionDelay?: number;
    captionPosition?: "bottom" | "top";
  }

  export default class SimpleLightbox {
    constructor(selector: string, options?: SimpleLightboxOptions);
    refresh(): void;
  }
}
