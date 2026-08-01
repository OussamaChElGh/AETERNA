import { parseJsxAttributes } from './parseJsxAttributes';

export function parseJsxOrCodeProps(contentStr: string): any {
  if (!contentStr || !contentStr.trim()) return {};
  const trimmed = contentStr.trim();

  const jsxParsed = parseJsxAttributes(trimmed);
  if (Object.keys(jsxParsed).length > 0) {
    return jsxParsed;
  }

  try {
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const parsed = new Function(`return (${trimmed});`)();
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (_e) {}

  const propsObj: Record<string, any> = {};
  const lines = contentStr.split('\n');
  let currentKey = '';
  let currentValLines: string[] = [];

  lines.forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0 && /^[A-Z_]+$/.test(line.substring(0, colonIdx).trim())) {
      if (currentKey) {
        propsObj[currentKey.toLowerCase()] = currentValLines.join('\n').trim();
      }
      currentKey = line.substring(0, colonIdx).trim();
      currentValLines = [line.substring(colonIdx + 1)];
    } else if (currentKey) {
      currentValLines.push(line);
    }
  });
  if (currentKey) {
    propsObj[currentKey.toLowerCase()] = currentValLines.join('\n').trim();
  }

  return propsObj;
}
