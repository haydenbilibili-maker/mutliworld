import type { Person, PersonDomain } from '@/types/person';
import type { RegionId } from '@/types/region';
import { dicebearAvatarUrl } from '@/lib/person/avatar';
import { WIKIPEDIA_AVATAR_PRESETS } from '@/lib/person/avatar-presets';

/** 快捷构造人物条目 */
export function person(
  id: string,
  name: string,
  role: string,
  domain: PersonDomain,
  regionIds: RegionId[],
  lng: number,
  lat: number,
  bio: string,
  extra?: Partial<Person>,
): Person {
  const avatar =
    extra?.avatar ??
    WIKIPEDIA_AVATAR_PRESETS[id] ??
    dicebearAvatarUrl(name, domain);
  return { id, name, role, domain, regionIds, lng, lat, bio, ...extra, avatar };
}
