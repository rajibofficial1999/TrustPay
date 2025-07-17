import Image from "next/image";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

interface PhotoPreviewProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

const PhotoPreview = ({
  src,
  alt,
  width,
  height,
  className,
}: PhotoPreviewProps) => {
  return (
    <PhotoProvider>
      <PhotoView src={src}>
        {height && width ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={className}
          />
        ) : (
          <Image src={src} alt={alt} fill className={className} />
        )}
      </PhotoView>
    </PhotoProvider>
  );
};

export default PhotoPreview;
