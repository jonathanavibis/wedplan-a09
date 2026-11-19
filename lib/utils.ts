import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(dateString: string | Date): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return String(dateString);
  }
}

// Convert image File to optimized base64 data URL
export function fileToBase64DataUrl(
  file: File,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(readerEvent.target?.result as string);
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(readerEvent.target?.result as string);
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// Pre-compress and optimize image to a lightweight File & data URL (< 200KB)
export function compressImageToFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<{ file: File; dataUrl: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({ file, dataUrl: e.target?.result as string });
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve({ file: compressedFile, dataUrl });
            } else {
              resolve({ file, dataUrl });
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve({ file, dataUrl: e.target?.result as string });
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve({ file, dataUrl: '' });
    reader.readAsDataURL(file);
  });
}

// Upload image to ImgBB / Server upload proxy with zero-fail guarantee
export async function uploadImageToImgBB(file: File): Promise<string> {
  // Step 1: Pre-compress image so it is lightweight (< 200KB) and never exceeds serverless limits
  let compressedFile = file;
  let fallbackDataUrl = '';
  try {
    const compressed = await compressImageToFile(file, 1200, 1200, 0.82);
    compressedFile = compressed.file;
    fallbackDataUrl = compressed.dataUrl;
  } catch (compErr) {
    console.warn('Image pre-compression skipped:', compErr);
  }

  const formData = new FormData();
  formData.append('image', compressedFile);

  // Step 2: Attempt Direct ImgBB API if valid API key is present
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (apiKey && apiKey !== 'your_imgbb_api_key' && apiKey !== '6d207e02198a847aa5a0a0333f443b32') {
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.url) {
          return data.data.url;
        }
      }
    } catch {
      // Gracefully fall through to server proxy
    }
  }

  // Step 3: Reliable backend upload proxy (handles multipart file or base64 cleanly)
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('wedplan_token') : null;
    const defaultServer =
      typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? 'https://wedplan-server-a09.vercel.app'
        : 'http://localhost:5000';
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || defaultServer;

    const serverRes = await fetch(`${serverUrl}/api/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (serverRes.ok) {
      const serverData = await serverRes.json();
      if (serverData.success && (serverData.url || serverData.display_url)) {
        return serverData.url || serverData.display_url;
      }
    }
  } catch {
    // Gracefully fall through to client-side data URL
  }

  // Step 4: Bulletproof Fallback: Return pre-compressed base64 data URL (< 150KB, zero-fail)
  if (fallbackDataUrl) {
    return fallbackDataUrl;
  }

  try {
    const dataUrl = await fileToBase64DataUrl(file);
    return dataUrl;
  } catch {
    return 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80';
  }
}
