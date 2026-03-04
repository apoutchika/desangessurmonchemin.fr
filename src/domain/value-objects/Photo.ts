// Value Object: Photo
export class Photo {
  private constructor(
    public readonly src: string,
    public readonly alt: string,
    public readonly caption?: string,
    public readonly width?: number,
    public readonly height?: number
  ) {}

  static create(
    src: string,
    alt: string,
    caption?: string,
    width?: number,
    height?: number
  ): Photo {
    if (!src.trim()) {
      throw new Error("Photo src cannot be empty");
    }
    return new Photo(src, alt, caption, width, height);
  }

  static fromPlain(data: {
    src: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
  }): Photo {
    return Photo.create(data.src, data.alt, data.caption, data.width, data.height);
  }

  hasCaption(): boolean {
    return !!this.caption;
  }

  hasDimensions(): boolean {
    return this.width !== undefined && this.height !== undefined;
  }
}
