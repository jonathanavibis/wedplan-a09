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

// Upload image to ImgBB directly or via API
export async function uploadImageToImgBB(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '6d207e02198a847aa5a0a0333f443b32';

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (data.success && data.data && data.data.url) {
      return data.data.url;
    }
    throw new Error(data?.error?.message || 'Failed to upload image to ImgBB');
  } catch (err: any) {
    // If direct fails (CORS or network), fallback to server upload proxy
    const token = typeof window !== 'undefined' ? localStorage.getItem('wedplan_token') : null;
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';
    const serverRes = await fetch(`${serverUrl}/api/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    const serverData = await serverRes.json();
    if (serverData.success && serverData.url) {
      return serverData.url;
    }
    throw new Error(serverData?.message || err.message || 'Image upload failed');
  }
}
