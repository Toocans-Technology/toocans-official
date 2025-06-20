declare module 'qrcode' {
  export function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: {
      width?: number;
      margin?: number;
      color?: {
        dark?: string;
        light?: string;
      };
      errorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high' | 'L' | 'M' | 'Q' | 'H';
      scale?: number;
      width?: number;
    },
    callback?: (error: Error | null | undefined) => void
  ): Promise<void>;

  export function toDataURL(
    text: string,
    options?: {
      errorCorrectionLevel?: string;
      type?: string;
      quality?: number;
      margin?: number;
      scale?: number;
      color?: {
        dark?: string;
        light?: string;
      };
      width?: number;
    }
  ): Promise<string>;

  export interface QRCodeToDataURLOptions {
    errorCorrectionLevel?: string;
    type?: string;
    quality?: number;
    margin?: number;
    scale?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  export interface QRCodeToStringOptions {
    type?: 'utf8' | 'svg' | 'terminal';
    errorCorrectionLevel?: 'low' | 'medium' | 'quartile' | 'high' | 'L' | 'M' | 'Q' | 'H';
    margin?: number;
    scale?: number;
    width?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }

  export function toString(
    text: string,
    options?: QRCodeToStringOptions
  ): Promise<string>;
}
