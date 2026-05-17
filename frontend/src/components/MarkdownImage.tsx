import { useEffect, useRef, useState } from 'react';
import type { ComponentProps } from 'react';

import { useLightbox } from './Lightbox';

const mergeClassName = (base: string, className?: string) =>
  className ? `${base} ${className}` : base;

// 图片组件，支持灯箱功能
const MarkdownImage = ({
  className,
  loading = 'lazy',
  src,
  alt,
  width,
  height,
  ...props
}: ComponentProps<'img'>) => {
  const { registerImage, openLightbox } = useLightbox();
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // 注册图片到灯箱（仅在图片首次加载或尺寸变化时注册）
  useEffect(() => {
    if (!src) return;

    // 如果提供了宽高，直接使用
    if (width && height) {
      registerImage(src, alt, Number(width), Number(height));
      return;
    }

    // 如果已经获取到实际尺寸，使用实际尺寸
    if (imageDimensions) {
      registerImage(src, alt, imageDimensions.width, imageDimensions.height);
      return;
    }

    // 否则先注册，等待图片加载完成后会再次更新
    registerImage(src, alt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, alt, width, height, imageDimensions]);

  // 图片加载完成后获取实际尺寸
  const handleImageLoad = () => {
    setIsLoading(false);
    if (imgRef.current && !width && !height) {
      setImageDimensions({
        width: imgRef.current.naturalWidth,
        height: imgRef.current.naturalHeight,
      });
    }
  };

  const handleClick = () => {
    if (src) openLightbox(src);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && src) {
      e.preventDefault();
      openLightbox(src);
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="my-8 flex w-full cursor-zoom-in justify-center outline-none"
      aria-label={`查看大图: ${alt || 'image'}`}
    >
      <div
        className={mergeClassName(
          'relative flex items-center justify-center overflow-hidden rounded-md',
          isLoading
            ? 'min-h-[250px] w-full max-w-[800px] animate-pulse bg-bgsecondary/20'
            : 'bg-transparent'
        )}
      >
        <img
          {...props}
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={handleImageLoad}
          onError={() => setIsLoading(false)}
          className={mergeClassName(
            'max-h-[600px] w-fit rounded-md object-contain util-transition-colors hover:opacity-90 hover:shadow-md dark:brightness-80',
            isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300',
            className
          )}
        />
      </div>
    </div>
  );
};

export default MarkdownImage;
