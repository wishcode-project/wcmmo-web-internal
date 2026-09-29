// Story pictures cut from the concept boards (scripts/crop-boards.py). Public: they hold no
// spoilers and no placeholder names. Markdown refers to them as `story:<id>`, e.g. `story:ch0-1`.
const files = import.meta.glob('./*.webp', { query: '?url', import: 'default', eager: true }) as Record<string, string>

export const storyImages: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.replace(/^\.\//, '').replace(/\.webp$/, ''), url]),
)

/** URL for `story:<id>` (or a bare id); undefined if there is no such picture. */
export const storyImage = (ref: string | undefined) => (ref ? storyImages[ref.replace(/^story:/, '')] : undefined)
