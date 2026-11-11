// The JSON escape for "<" (backslash + u003c), so content can never close the script tag.
const ESCAPED_LT = String.fromCharCode(92) + 'u003c'

/** Structured data for search engines (schema.org JSON-LD). */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, ESCAPED_LT) }}
    />
  )
}
