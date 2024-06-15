export default function jsonToFrontmatter(json: any): string {
    return `---
${Object.entries(json)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n")}
---`;
}