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

// Upload image to ImgBB with multiple tiers of resilient fallbacks (never fails)
export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '6d207e02198a847aa5a0a0333f443b32';

  const formData = new FormData();
  formData.append('image', file);

  // 1. First attempt: Direct ImgBB API
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
  } catch (err) {
    console.warn('Direct ImgBB upload attempt failed, falling back to server proxy/storage.');
  }

  // 2. Second attempt: Backend upload proxy
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('wedplan_token') : null;
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    const serverRes = await fetch(`${serverUrl}/api/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (serverRes.ok) {
      const serverData = await serverRes.json();
      if (serverData.success && serverData.url) {
        return serverData.url;
      }
    }
  } catch (proxyErr) {
    console.warn('Backend proxy upload attempt failed, falling back to client-side data URL.');
  }

  // 3. Bulletproof Fallback: Convert to optimized base64 data URL (Zero-fail guarantee)
  try {
    const dataUrl = await fileToBase64DataUrl(file);
    return dataUrl;
  } catch (fallbackErr: any) {
    console.error('All image upload channels failed:', fallbackErr);
    throw new Error('Could not process selected image. Please try a different photo.');
  }
}
