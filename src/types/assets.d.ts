/**
 * Type declarations for static asset imports
 */

declare module '*.gif' {
  const content: string | { src: string; width: number; height: number };
  export default content;
}

declare module '*.png' {
  const content: string | { src: string; width: number; height: number };
  export default content;
}

declare module '*.jpg' {
  const content: string | { src: string; width: number; height: number };
  export default content;
}

declare module '*.jpeg' {
  const content: string | { src: string; width: number; height: number };
  export default content;
}

declare module '*.svg' {
  const content: string | { src: string; width: number; height: number };
  export default content;
}

declare module '*.webp' {
  const content: string | { src: string; width: number; height: number };
  export default content;
}

