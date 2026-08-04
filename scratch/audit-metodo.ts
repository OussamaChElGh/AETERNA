import path from 'path';
import { auditArticle, formatTerminalReport } from '../framework/anektia-learning';

const articlePath = path.join(process.cwd(), 'content/guias/ciencias_naturales/fisica/fisica-1-4-metodo.md');
const report = auditArticle(articlePath, 'bachillerato');

console.log(formatTerminalReport(report));
