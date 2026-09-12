// Avatar utilities: default presets, SVG generators, and lightweight image compressor for display pictures

export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  category: 'hiking' | 'trip' | 'family' | 'companion';
  bgGradient: string;
  dataUrl: string;
}

// Generate inline SVG data URI with gradient and emoji or symbol
function createSvgAvatar(emoji: string, bg1: string, bg2: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}" />
        <stop offset="100%" stop-color="${bg2}" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="50" fill="url(#g)" />
    <text x="50" y="58" font-size="44" text-anchor="middle" dominant-baseline="central">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function generateInitialsAvatar(name: string, bg1 = '#3b82f6', bg2 = '#1d4ed8'): string {
  const clean = name.trim();
  const initials = clean
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('') || clean.charAt(0).toUpperCase() || '?';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bg1}" />
        <stop offset="100%" stop-color="${bg2}" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="50" fill="url(#g)" />
    <text x="50" y="53" font-size="38" font-weight="900" font-family="system-ui, -apple-system, sans-serif" fill="#ffffff" text-anchor="middle" dominant-baseline="central">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRESET_AVATARS: AvatarOption[] = [
  {
    id: 'hiker-mountain',
    name: 'Mountain Hiker',
    emoji: '🏔️',
    category: 'hiking',
    bgGradient: 'from-emerald-500 to-teal-700',
    dataUrl: createSvgAvatar('🏔️', '#10b981', '#0f766e'),
  },
  {
    id: 'hiker-backpack',
    name: 'Backpacker',
    emoji: '🎒',
    category: 'hiking',
    bgGradient: 'from-amber-500 to-orange-700',
    dataUrl: createSvgAvatar('🎒', '#f59e0b', '#c2410c'),
  },
  {
    id: 'trail-compass',
    name: 'Trail Navigator',
    emoji: '🧭',
    category: 'hiking',
    bgGradient: 'from-cyan-500 to-blue-700',
    dataUrl: createSvgAvatar('🧭', '#06b6d4', '#1d4ed8'),
  },
  {
    id: 'outdoor-camp',
    name: 'Camper',
    emoji: '⛺',
    category: 'hiking',
    bgGradient: 'from-indigo-500 to-purple-800',
    dataUrl: createSvgAvatar('⛺', '#6366f1', '#581c87'),
  },
  {
    id: 'trip-plane',
    name: 'World Explorer',
    emoji: '✈️',
    category: 'trip',
    bgGradient: 'from-sky-400 to-blue-600',
    dataUrl: createSvgAvatar('✈️', '#38bdf8', '#2563eb'),
  },
  {
    id: 'trip-camera',
    name: 'Photographer',
    emoji: '📸',
    category: 'trip',
    bgGradient: 'from-rose-400 to-pink-600',
    dataUrl: createSvgAvatar('📸', '#fb7185', '#db2777'),
  },
  {
    id: 'trip-sunglasses',
    name: 'Road Tripper',
    emoji: '🕶️',
    category: 'trip',
    bgGradient: 'from-amber-400 to-yellow-600',
    dataUrl: createSvgAvatar('🕶️', '#fbbf24', '#ca8a04'),
  },
  {
    id: 'family-mom',
    name: 'Warm Elder',
    emoji: '👵',
    category: 'family',
    bgGradient: 'from-purple-400 to-indigo-600',
    dataUrl: createSvgAvatar('👵', '#c084fc', '#4f46e5'),
  },
  {
    id: 'family-grandpa',
    name: 'Grandpa Joe',
    emoji: '👴',
    category: 'family',
    bgGradient: 'from-blue-400 to-indigo-700',
    dataUrl: createSvgAvatar('👴', '#60a5fa', '#3730a3'),
  },
  {
    id: 'family-heart',
    name: 'Caring Guardian',
    emoji: '💜',
    category: 'family',
    bgGradient: 'from-fuchsia-400 to-rose-600',
    dataUrl: createSvgAvatar('💜', '#e879f9', '#e11d48'),
  },
  {
    id: 'companion-dog',
    name: 'Trail Pup',
    emoji: '🐕',
    category: 'companion',
    bgGradient: 'from-emerald-400 to-teal-600',
    dataUrl: createSvgAvatar('🐕', '#34d399', '#0d9488'),
  },
  {
    id: 'companion-coffee',
    name: 'Campfire Brew',
    emoji: '☕',
    category: 'companion',
    bgGradient: 'from-amber-600 to-stone-800',
    dataUrl: createSvgAvatar('☕', '#d97706', '#292524'),
  },
];

/**
 * Compresses an image uploaded from user's camera or device
 * to a lightweight WebP/JPEG data URI (~15-30KB) so it saves seamlessly to localStorage
 */
export async function compressUploadedImage(file: File, maxDim = 140): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image data'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Scale proportionally to square crop or fit maxDim
        const minDim = Math.min(width, height);
        const startX = (width - minDim) / 2;
        const startY = (height - minDim) / 2;

        canvas.width = maxDim;
        canvas.height = maxDim;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Draw cropped center square
        ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, maxDim, maxDim);

        // Export as compressed JPEG / WebP
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
