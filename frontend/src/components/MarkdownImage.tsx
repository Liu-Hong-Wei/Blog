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
      className="my-6 cursor-pointer outline-none"
      aria-label={`View full size: ${alt || 'image'}`}
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
        className={mergeClassName(
          'max-h-[480px] mx-auto w-fit rounded-sm object-contain util-transition hover:opacity-90 hover:shadow-md',
          className
        )}
      />
    </div>
  );
};

export default MarkdownImage;
