import { useEffect, useMemo, useState } from 'react';

type ProductImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
};

const FALLBACK_SRC = '/placeholder.png';

const normalizeSrc = (source?: string | null): string => {
  return source || FALLBACK_SRC;
};

export default function ProductImage({ src, alt, className }: ProductImageProps) {
  const normalizedSrc = useMemo(() => normalizeSrc(src), [src]);
  const [imgSrc, setImgSrc] = useState(normalizedSrc);

  useEffect(() => {
    if (!src) {
      setImgSrc(FALLBACK_SRC);
      return;
    }

    if (src.startsWith('http://') || src.startsWith('https://')) {
      setImgSrc(src);
      return;
    }

    const normalizedPath = src.replace(/\\/g, '/').replace(/^\/+/, '');
    const pathWithUploads = normalizedPath.startsWith('uploads/')
      ? normalizedPath
      : `uploads/${normalizedPath}`;
    const apiBaseUrl = 'http://https://luxewatch-backend.onrender.com';
    setImgSrc(`${apiBaseUrl}/${pathWithUploads}`);
  }, [src]);

  const handleError = () => {
    if (imgSrc !== FALLBACK_SRC) {
      setImgSrc(FALLBACK_SRC);
    }
  };

  return <img src={imgSrc} alt={alt} className={className} onError={handleError} />;
}
