function encodeStringLiterals(expr: string): string {
  let out = '';
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let inner = '';
      i++;
      let closed = false;
      while (i < expr.length) {
        const c = expr[i];
        if (c === '\\' && i + 1 < expr.length) {
          inner += c + expr[i + 1];
          i += 2;
          continue;
        }
        if (c === quote) {
          i++;
          closed = true;
          break;
        }
        inner += c;
        i++;
      }
      out += JSON.stringify(inner);
      if (!closed) break;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

export function parseJsxAttributes(jsxStr: string): Record<string, any> {
  if (!jsxStr || !jsxStr.trim()) return {};

  const objectProps: string[] = [];
  let i = 0;
  const str = jsxStr.trim();

  while (i < str.length) {
    while (i < str.length && /\s|,/.test(str[i])) i++;
    if (i >= str.length) break;

    const keyMatch = str.slice(i).match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=/);
    if (!keyMatch) {
      i++;
      continue;
    }

    const key = keyMatch[1];
    i += keyMatch[0].length;

    while (i < str.length && /\s/.test(str[i])) i++;
    if (i >= str.length) break;

    let valExpr = '';
    const char = str[i];

    if (char === '"' || char === "'") {
      const quote = char;
      let inner = '';
      i++;
      while (i < str.length) {
        if (str[i] === quote && str[i - 1] !== '\\') {
          i++;
          break;
        }
        inner += str[i];
        i++;
      }
      valExpr = JSON.stringify(inner);
    } else if (char === '{') {
      let depth = 0;
      let exprStr = '';
      while (i < str.length) {
        const c = str[i];
        exprStr += c;
        if (c === '{') depth++;
        else if (c === '}') {
          depth--;
          if (depth === 0) {
            i++;
            break;
          }
        }
        i++;
      }
      valExpr = encodeStringLiterals(exprStr.slice(1, -1).trim());
    } else {
      let valStr = '';
      while (i < str.length && !/\s|,|>|\//.test(str[i])) {
        valStr += str[i];
        i++;
      }
      valExpr = valStr;
    }

    if (key && valExpr) {
      objectProps.push(`${JSON.stringify(key)}: (${valExpr})`);
    }
  }

  if (objectProps.length === 0) return {};

  try {
    const parsedObj = new Function(`return ({ ${objectProps.join(',\n')} });`)();
    return parsedObj || {};
  } catch (_err) {
    return {};
  }
}
