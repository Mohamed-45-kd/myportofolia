/**
 * Serialises a JSON-LD object for embedding in a <script> tag.
 *
 * JSON.stringify alone is NOT safe here. It does not escape `<`, so any
 * content that reaches the graph - a project title, a post excerpt, the site
 * description, all of which are editable from the dashboard - could contain
 * `</script>` and break out of the script element into executable HTML.
 *
 * Escaping `<`, `>` and `&` as unicode sequences keeps the JSON semantically
 * identical (parsers decode the escapes) while making it impossible to end the
 * script element early. U+2028 and U+2029 are escaped too: they are valid
 * inside a JSON string but terminate a line in JavaScript source.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
