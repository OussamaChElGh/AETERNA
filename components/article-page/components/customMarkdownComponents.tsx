'use client';
import React from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import { IndiceNivel } from "@/components/interactive/IndiceNivel";
import { BotonTransicion } from "@/components/interactive/BotonTransicion";
import { PredictionBox } from "@/components/interactive/PredictionBox";
import { ParameterLab } from "@/components/interactive/ParameterLab";
import { GraphLab } from "@/components/interactive/GraphLab";
import { ErrorHunter } from "@/components/interactive/ErrorHunter";
import { ModelBuilder } from "@/components/interactive/ModelBuilder";
import { ConceptMap } from "@/components/interactive/ConceptMap";
import { ArgumentBuilder } from "@/components/interactive/ArgumentBuilder";
import { CausalMap } from "@/components/interactive/CausalMap";
import { EvidenceMatcher } from "@/components/interactive/EvidenceMatcher";
import { Counterexample } from "@/components/interactive/Counterexample";
import { ArgumentEvaluation } from "@/components/interactive/ArgumentEvaluation";
import { SequenceBuilder } from "@/components/interactive/SequenceBuilder";
import { AeternaFlowchart } from "@/components/interactive/AeternaFlowchart";
import { AeternaDecisionBox } from "@/components/interactive/AeternaDecisionBox";
import { AeternaExercise } from "@/components/AeternaExercise";
import { AeternaEngagement } from "@/components/AeternaEngagement";
import { PedagogicalContentBlock } from "@/components/PedagogicalContentBlock";
import { ConnectBlock } from "@/components/blocks/ConnectBlock";
import { HiddenAssumptionBlock } from "@/components/blocks/HiddenAssumptionBlock";
import { TransferBlock } from "@/components/blocks/TransferBlock";
import { AeternaFormula } from "@/components/blocks/AeternaFormula";
import { AeternaInteractiveQuestion } from "@/components/interactive/AeternaInteractiveQuestion";
import { ComparativeTable } from "@/components/interactive/ComparativeTable";
import { ProcessVisual } from "@/components/interactive/ProcessVisual";
import { VisualData } from "@/components/interactive/VisualData";
import AeternaTable, { TableHead, TableRow, TableHeader, TableCell } from "@/components/AeternaTable";
import { preprocessAeternaContent } from "../parsers/preprocessAeternaContent";
import { parseJsxOrCodeProps } from "../parsers/parseJsxOrCodeProps";
import { ConceptTooltip } from "@/components/interactive/ConceptTooltip";
import { remarkConceptGlossaryHtml } from "../utils/remarkGlossary";
import fisicaGlossary from "@/data/glossary/fisica.json";
import type { GlossaryEntry } from "@/types";

export const customMarkdownComponents: any = {
  IndiceNivel: (props: any) => <IndiceNivel titulo={props.titulo}>{props.children}</IndiceNivel>,
  BotonTransicion: (props: any) => <BotonTransicion nivel={props.nivel || "intermedio"}>{props.children}</BotonTransicion>,
  NivelActivo: (props: any) => <div className="space-y-6">{props.children}</div>,
  PredictionBox: (props: any) => <PredictionBox {...props} />,
  ParameterLab: (props: any) => <ParameterLab {...props} />,
  GraphLab: (props: any) => <GraphLab {...props} />,
  ErrorHunter: (props: any) => <ErrorHunter {...props} />,
  ModelBuilder: (props: any) => <ModelBuilder {...props} />,
  ConceptMap: (props: any) => <ConceptMap {...props} />,
  ArgumentBuilder: (props: any) => <ArgumentBuilder {...props} />,
  CausalMap: (props: any) => <CausalMap {...props} />,
  EvidenceMatcher: (props: any) => <EvidenceMatcher {...props} />,
  Counterexample: (props: any) => <Counterexample {...props} />,
  ArgumentEvaluation: (props: any) => <ArgumentEvaluation {...props} />,
  SequenceBuilder: (props: any) => <SequenceBuilder {...props} />,
  AeternaFlowchart: (props: any) => <AeternaFlowchart steps={[]} {...props} />,
  Flowchart: (props: any) => <AeternaFlowchart steps={[]} {...props} />,
  AeternaFormula: (props: any) => <AeternaFormula {...props} />,
  FormulaBlock: (props: any) => <AeternaFormula {...props} />,
  Formula: (props: any) => <AeternaFormula {...props} />,
  AeternaDecisionBox: (props: any) => <AeternaDecisionBox {...props} />,
  AeternaExercise: (props: any) => <AeternaExercise {...props} />,
  AeternaEngagement: (props: any) => <AeternaEngagement {...props} />,
  PedagogicalContentBlock: (props: any) => <PedagogicalContentBlock {...props} />,
  Connect: (props: any) => <ConnectBlock {...props} />,
  ConnectBlock: (props: any) => <ConnectBlock {...props} />,
  HiddenAssumption: (props: any) => <HiddenAssumptionBlock {...props} />,
  HiddenAssumptionBlock: (props: any) => <HiddenAssumptionBlock {...props} />,
  Transfer: (props: any) => <TransferBlock {...props} />,
  TransferBlock: (props: any) => <TransferBlock {...props} />,
  conceptTerm: (props: any) => (
    <ConceptTooltip term={props.term} definition={props.definition} tags={props.tags || []}>
      {props.children}
    </ConceptTooltip>
  ),
  a: (props: any) => {
    const glossaryTerm = props['data-glossary'];
    if (glossaryTerm) {
      const tags = (props['data-tags'] || '').split(',').filter(Boolean);
      return (
        <ConceptTooltip term={glossaryTerm} definition={props['data-def'] || ''} tags={tags}>
          {props.children}
        </ConceptTooltip>
      );
    }
    return <a {...props} />;
  },
  table: (props: any) => <AeternaTable {...props} />,
  thead: (props: any) => <TableHead {...props} />,
  tr: (props: any) => <TableRow {...props} />,
  th: (props: any) => <TableHeader {...props} />,
  td: (props: any) => <TableCell {...props} />,
  code: ({ inline, className, children, ...props }: any) => {
    const match = /language-(\S+)/.exec(className || '');
    const lang = match ? match[1].toLowerCase() : '';
    const contentStr = String(children || '').trim();

    if (lang === 'pedagogical-content-block') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <PedagogicalContentBlock type={parsedProps.type || 'archive-fragment'} {...parsedProps} />;
    }

    if (lang === 'connect') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <ConnectBlock content={parsedProps.content || ''} {...parsedProps} />;
    }

    if (lang === 'hidden-assumption') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <HiddenAssumptionBlock assumption={parsedProps.assumption || parsedProps.content || ''} {...parsedProps} />;
    }

    if (lang === 'transfer') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <TransferBlock targetDomain={parsedProps.targetDomain || 'Nuevo Contexto'} prompt={parsedProps.prompt || parsedProps.content || ''} {...parsedProps} />;
    }

    if (lang === 'aeterna-engagement') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <AeternaEngagement type={parsedProps.type || 'archive-fragment'} title={parsedProps.title || 'Bloque'} content={parsedProps.content || ''} {...parsedProps} />;
    }

    if (lang === 'boton-transicion') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <BotonTransicion nivel={parsedProps.nivel || 'intermedio'}>{parsedProps.text || contentStr}</BotonTransicion>;
    }

    if (lang === 'aeterna-exercise' || lang === 'aeterna-ejercicio') {
      return <AeternaExercise content={contentStr} />;
    }

    if (lang === 'aeterna-decision' || lang === 'aeterna-decision-box') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      if (parsedProps.content) return <AeternaDecisionBox {...parsedProps} />;
      return <AeternaDecisionBox content={contentStr} />;
    }

    if (lang === 'prediction-box' || lang === 'prediction') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <PredictionBox question="" options={[]} {...parsedProps} content={contentStr} />;
    }

    if (lang === 'parameter-lab' || lang === 'parameter') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <ParameterLab parameters={[]} outputLabel="" outputUnit="" {...parsedProps} content={contentStr} />;
    }

    if (lang === 'graph-lab' || lang === 'graph') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <GraphLab data={[]} question="" options={[]} {...parsedProps} content={contentStr} />;
    }

    if (lang === 'error-hunter' || lang === 'error') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <ErrorHunter steps={[]} {...parsedProps} content={contentStr} />;
    }

    if (lang === 'model-builder' || lang === 'model') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <ModelBuilder problemDescription="" availableVariables={[]} {...parsedProps} content={contentStr} />;
    }

    if (lang === 'concept-map' || lang === 'concept') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <ConceptMap nodes={[]} validConnections={[]} {...parsedProps} content={contentStr} />;
    }

    if (lang === 'argument-builder' || lang === 'argument') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <ArgumentBuilder claimOrConclusion="" premises={[]} correctOrderIds={[]} {...parsedProps} content={contentStr} />;
    }

    if (lang === 'causal-map' || lang === 'causal') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <CausalMap nodes={[]} validEdges={[]} {...parsedProps} content={contentStr} />;
    }

    if (lang === 'evidence-matcher' || lang === 'evidence') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <EvidenceMatcher claims={[]} evidences={[]} {...parsedProps} content={contentStr} />;
    }

    if (lang === 'counterexample') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <Counterexample generalStatement="" candidates={[]} {...parsedProps} content={contentStr} />;
    }

    if (lang === 'argument-evaluation') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <ArgumentEvaluation argumentText="" criteria={[]} {...parsedProps} content={contentStr} />;
    }

    if (lang === 'sequence-builder' || lang === 'sequence') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <SequenceBuilder steps={[]} correctOrderIds={[]} {...parsedProps} content={contentStr} />;
    }

    if (lang === 'aeterna-flowchart' || lang === 'flowchart') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <AeternaFlowchart steps={[]} {...parsedProps} content={contentStr} />;
    }

    if (lang === 'aeterna-formula' || lang === 'formula') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <AeternaFormula {...parsedProps} formula={parsedProps.formula || parsedProps.expression || contentStr} />;
    }

    if (lang === 'comparative-table') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <ComparativeTable title={parsedProps.title || 'Cuadro Comparativo'} headers={parsedProps.headers || []} rows={parsedProps.rows || []} {...parsedProps} />;
    }

    if (lang === 'process-visual') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <ProcessVisual title={parsedProps.title || 'Proceso'} steps={parsedProps.steps || parsedProps.content || []} {...parsedProps} />;
    }

    if (lang === 'visual-data') {
      const parsedProps = parseJsxOrCodeProps(contentStr);
      return <VisualData title={parsedProps.title || 'Visualización de Datos'} type={parsedProps.type || 'scatter'} dataPoints={parsedProps.dataPoints || parsedProps.datapoints || []} realValue={parsedProps.realValue || parsedProps.realvalue} {...parsedProps} />;
    }

    return <code className={className} {...props}>{children}</code>;
  },
  pre: ({ children, ...props }: any) => {
    if (React.isValidElement(children) && (children.type as any) !== 'code') {
      return <>{children}</>;
    }
    return <pre {...props}>{children}</pre>;
  },
  div: ({ className, children, ...props }: any) => {
    if (className?.includes("aeterna-ejercicio")) {
      return <AeternaExercise content={String(children || '')} />;
    }
    if (className?.includes("aeterna-interactivo")) {
      return <AeternaInteractiveQuestion content={String(children || '')} />;
    }
    if (className?.includes("aeterna-decision")) {
      return <AeternaDecisionBox content={String(children || '')} />;
    }
    if (className?.includes("prediction-box")) {
      return <PredictionBox question="" options={[]} content={String(children || '')} />;
    }
    if (className?.includes("parameter-lab")) {
      return <ParameterLab parameters={[]} outputLabel="" outputUnit="" content={String(children || '')} />;
    }
    if (className?.includes("graph-lab")) {
      return <GraphLab data={[]} question="" options={[]} content={String(children || '')} />;
    }
    if (className?.includes("error-hunter")) {
      return <ErrorHunter steps={[]} content={String(children || '')} />;
    }
    if (className?.includes("model-builder")) {
      return <ModelBuilder problemDescription="" availableVariables={[]} content={String(children || '')} />;
    }
    return <div className={className} {...props}>{children}</div>;
  }
};

const glossaryEntries = (fisicaGlossary as GlossaryEntry[]) || [];

export const markdownPlugins = {
  remark: [remarkGfm, remarkMath, remarkConceptGlossaryHtml(glossaryEntries)],
  rehype: [rehypeRaw, rehypeKatex, rehypeSlug]
};

export function renderMarkdown(content: string) {
  return (
    <ReactMarkdown
      remarkPlugins={markdownPlugins.remark}
      rehypePlugins={markdownPlugins.rehype}
      components={customMarkdownComponents}
    >
      {preprocessAeternaContent(content)}
    </ReactMarkdown>
  );
}
