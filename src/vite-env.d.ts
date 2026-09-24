/// <reference types="vite/client" />

interface LevelUpLoaderOptions {
  container?: HTMLElement | string;
  delay?: number;
  minVisible?: number;
  slowAfter?: number;
  failAfter?: number;
  onRetry?: () => void;
}

interface Window {
  __marker?: number;
  LevelUpLoader?: {
    wrap: <T>(promise: Promise<T> | (() => Promise<T>), options?: LevelUpLoaderOptions) => Promise<T>;
    createStarSvg: (width?: number, height?: number, className?: string) => SVGSVGElement;
    createCrackedStarSvg: (width?: number, height?: number) => SVGSVGElement;
    hideNavigationOverlay: () => void;
    showOfflineToast: () => void;
  };
}

interface ImportMetaEnv {
  readonly [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
