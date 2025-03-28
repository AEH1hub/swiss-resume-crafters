
/**
 * Preloads the given font to improve performance
 */
export const preloadFont = (fontFamily: string, weights: number[] = [400, 700]) => {
  if (typeof window === 'undefined') return;
  
  weights.forEach(weight => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@${weight}&display=swap`;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

/**
 * Preloads common resources used throughout the app
 */
export const preloadCommonResources = () => {
  // Preload fonts
  preloadFont('Inter', [300, 400, 500, 600, 700]);
  
  // Preload critical images
  const criticalImages = [
    '/placeholder.svg',
    '/lovable-uploads/d881cc78-f182-4e68-a8c1-20488d0b91fe.png'
  ];
  
  criticalImages.forEach(imageSrc => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageSrc;
    document.head.appendChild(link);
  });
};
