import { useState, createContext, useContext, useCallback, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import YetAnotherReactLightbox from 'yet-another-react-lightbox';
import type { Slide } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface ImageSlide extends Slide {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface LightboxContextType {
  registerImage: (src: string, alt?: string, width?: number, height?: number) => void;
  openLightbox: (src: string) => void;
}

const LightboxContext = createContext<LightboxContextType | null>(null);

// Hook 定义在组件文件外部以满足 fast refresh 要求
// eslint-disable-next-line react-refresh/only-export-components
export const useLightbox = () => {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error('useLightbox must be used within LightboxProvider');
  }
  return context;
};

interface LightboxProviderProps {
  children: ReactNode;
}

export function LightboxProvider({ children }: LightboxProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef<ImageSlide[]>([]);
  const [slides, setSlides] = useState<ImageSlide[]>([]);

  // 注册图片到 slides 数组中
  const registerImage = useCallback(
    (src: string, alt?: string, width?: number, height?: number) => {
      // const existingIndex = slidesRef.current.findIndex(slide => slide.src === src);

      const newSlide: ImageSlide = {
        src,
        alt,
        ...(width && height ? { width, height } : {}),
      };

      // 新图片，添加到数组
      slidesRef.current = [...slidesRef.current, newSlide];
      setSlides([...slidesRef.current]);

      // if (existingIndex === -1) {
      //   // 新图片，添加到数组
      //   slidesRef.current = [...slidesRef.current, newSlide];
      //   setSlides([...slidesRef.current]);
      // } else {
      //   // 已存在的图片，更新信息（比如尺寸信息）
      //   const needsUpdate =
      //     slidesRef.current[existingIndex].width !== newSlide.width ||
      //     slidesRef.current[existingIndex].height !== newSlide.height;

      //   if (needsUpdate && width && height) {
      //     slidesRef.current[existingIndex] = newSlide;
      //     setSlides([...slidesRef.current]);
      //   }
      // }
    },
    []
  );

  // 打开灯箱并定位到指定图片
  const openLightbox = useCallback((src: string) => {
    const index = slidesRef.current.findIndex(slide => slide.src === src);
    if (index !== -1) {
      setCurrentIndex(index);
      setIsOpen(true);
    }
  }, []);

  // 当组件卸载时清空 slides
  useEffect(() => {
    return () => {
      slidesRef.current = [];
      setSlides([]);
    };
  }, []);

  return (
    <LightboxContext.Provider value={{ registerImage, openLightbox }}>
      {children}
      <YetAnotherReactLightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        index={currentIndex}
        // 动画配置
        animation={{
          fade: 0,
          swipe: 500,
        }}
        // 控制器配置
        controller={{
          closeOnBackdropClick: true,
        }}
        // 轮播配置
        carousel={{
          finite: slides.length <= 1,
          preload: 2,
          padding: '16px',
          spacing: '30%',
          imageFit: 'contain',
        }}
        // 自定义渲染：隐藏按钮
        render={{
          buttonPrev: slides.length <= 1 ? () => null : undefined,
          buttonNext: slides.length <= 1 ? () => null : undefined,
          buttonClose: () => null,
        }}
        // 事件处理：点击图片关闭
        on={{
          click: () => {
            setIsOpen(false);
          },
        }}
        // 样式配置：添加半透明 + 毛玻璃（blur）效果
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // 半透明暗色遮罩
            backdropFilter: 'blur(8px)', // 毛玻璃效果
            WebkitBackdropFilter: 'blur(8px)', // Safari 支持
          },
        }}
      />
    </LightboxContext.Provider>
  );
}
