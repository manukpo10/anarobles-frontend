/**
 * Renders a JSON-LD structured-data block.
 *
 * Use inside Server Components so the schema ships in the initial HTML,
 * where crawlers and AI Overviews can read it.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
