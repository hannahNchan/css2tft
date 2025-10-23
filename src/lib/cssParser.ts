export function extractCssRules(css: string): Record<string, Record<string, string>> {
  const rules: Record<string, Record<string, string>> = {};
  const regex = /([\w\.#\-]+)\s*\{([^}]+)\}/g;
  let match;
  while ((match = regex.exec(css)) !== null) {
    const selector = match[1].trim();
    const body = match[2].trim();
    rules[selector] = {};
    body.split(';').forEach((decl) => {
      const [prop, val] = decl.split(':').map((s) => s.trim());
      if (prop && val) rules[selector][prop] = val;
    });
  }
  return rules;
}
