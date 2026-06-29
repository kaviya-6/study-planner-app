import React, { useState } from 'react';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1434030214721-735b928f93d4?q=80&w=1600&auto=format&fit=crop';

interface PageHeroProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}

export const PageHero: React.FC<PageHeroProps> = ({
  imageUrl,
  title,
  subtitle,
  badge,
  action,
}) => {
  const [src, setSrc] = useState(imageUrl);

  return (
    <div className="relative w-full overflow-hidden border-b border-slate-200/80 dark:border-white/5">
      <div className="relative h-44 sm:h-52 md:h-60 lg:h-64">
        <img
          src={src}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="eager"
          referrerPolicy="no-referrer"
          onError={() => setSrc(FALLBACK_IMAGE)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/40 dark:from-[#030712]/95 dark:via-[#030712]/85 dark:to-[#030712]/50 transition-colors duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent dark:from-[#030712]/30 dark:to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-center px-6 py-8 md:px-10 lg:px-12">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2.5 max-w-2xl">
              {badge}
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
                  {subtitle}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CoverImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const CoverImage: React.FC<CoverImageProps> = ({ src, alt, className = '' }) => {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
};
