'use client';

import { useState } from 'react';
import {
  DOMAIN_AVATAR_HEX,
  personInitials,
  resolvePersonAvatar,
} from '@/lib/person/avatar';
import type { Person } from '@/types/person';

interface PersonAvatarProps {
  person: Person;
  size?: number;
  className?: string;
}

/**
 * 人物头像：Wikipedia / Dicebear / 领域色首字母圆 三级降级
 */
export function PersonAvatar({ person, size = 28, className = '' }: PersonAvatarProps) {
  const [failed, setFailed] = useState(false);
  const src = resolvePersonAvatar(person);
  const color = DOMAIN_AVATAR_HEX[person.domain];
  const initials = personInitials(person.name);

  if (failed) {
    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white ${className}`}
        style={{
          width: size,
          height: size,
          fontSize: Math.max(9, size * 0.38),
          backgroundColor: color,
        }}
        aria-hidden
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={`shrink-0 rounded-full object-cover bg-white/10 ${className}`}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
