
/**
 * Calculates the appropriate sizes for responsive images
 * @param originalWidth Original image width
 * @param originalHeight Original image height
 * @param containerWidth Container width to fit the image in
 * @returns Object with responsive width and height
 */
export const calculateResponsiveImageSize = (
  originalWidth: number,
  originalHeight: number,
  containerWidth: number = 1200
): { width: number; height: number } => {
  if (originalWidth <= containerWidth) {
    return { width: originalWidth, height: originalHeight };
  }
  
  const ratio = originalHeight / originalWidth;
  const newWidth = containerWidth;
  const newHeight = Math.round(containerWidth * ratio);
  
  return { width: newWidth, height: newHeight };
};

/**
 * Generates a placeholder image for lazy loading
 * @param width Width of the placeholder
 * @param height Height of the placeholder
 * @param bgColor Background color of the placeholder
 * @returns SVG string as a data URL
 */
export const generatePlaceholder = (
  width: number, 
  height: number, 
  bgColor: string = '#f3f4f6'
): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Preloads an image to ensure it's available when needed
 * @param src Image source URL
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};
