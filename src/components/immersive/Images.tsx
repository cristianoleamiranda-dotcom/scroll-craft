import type { CSSProperties } from "react";
import { srcset } from "@/data/images";

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  position?: string;
  style?: CSSProperties;
}

function pictureProps(src: string) {
  return srcset[src];
}

export function EditorialImage({ src, alt, className, priority, position, style }: ImageProps) {
  const set = pictureProps(src);
  return (
    <img
      className={className}
      src={src}
      srcSet={set?.srcSet}
      sizes={set?.sizes}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{ objectPosition: position, ...style }}
    />
  );
}

export function ImmersiveImage(props: ImageProps) {
  return <EditorialImage {...props} />;
}

export function CinematicImage(props: ImageProps) {
  return <EditorialImage {...props} priority={props.priority ?? true} />;
}

export function ParallaxImage({ src, alt, className, position }: ImageProps) {
  return (
    <div className={`parallax ${className ?? ""}`} data-parallax>
      <EditorialImage src={src} alt={alt} position={position} />
    </div>
  );
}

export function DepthImage({ src, alt, caption }: ImageProps & { caption: string }) {
  return (
    <figure className="depth">
      <EditorialImage className="depth-back" src={src} alt="" position="30% 40%" />
      <EditorialImage className="depth-front" src={src} alt={alt} position="62% 40%" />
      <span className="ticks" aria-hidden="true" />
      <figcaption className="figcap">
        <span>{caption}</span>
        <span>SENDER</span>
      </figcaption>
    </figure>
  );
}
