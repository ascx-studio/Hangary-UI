export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      id={`json-ld-${String(data["@type"] ?? "page")}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
