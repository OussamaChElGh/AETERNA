'use client';
import React from 'react';
import { PedagogicalBlockType, PEDAGOGICAL_BLOCKS_REGISTRY } from '@/framework/aeterna-learning/experiences/pedagogical-blocks-registry';
import { AeternaEngagement } from './AeternaEngagement';
import { ConnectBlock } from './blocks/ConnectBlock';
import { HiddenAssumptionBlock } from './blocks/HiddenAssumptionBlock';
import { TransferBlock } from './blocks/TransferBlock';

export interface PedagogicalContentBlockProps {
  type: PedagogicalBlockType;
  title?: string;
  content: string;
  extra?: string;
  sourceConcept?: string;
  targetConcept?: string;
  assumption?: string;
  implication?: string;
  targetDomain?: string;
}

export function PedagogicalContentBlock({
  type,
  title,
  content,
  extra,
  sourceConcept,
  targetConcept,
  assumption,
  implication,
  targetDomain
}: PedagogicalContentBlockProps) {
  const metadata = PEDAGOGICAL_BLOCKS_REGISTRY[type];

  if (type === 'connect') {
    return (
      <ConnectBlock
        title={title || metadata?.visibleTitle}
        content={content}
        sourceConcept={sourceConcept}
        targetConcept={targetConcept}
      />
    );
  }

  if (type === 'hidden-assumption') {
    return (
      <HiddenAssumptionBlock
        title={title || metadata?.visibleTitle}
        assumption={assumption || content}
        implication={implication || extra}
      />
    );
  }

  if (type === 'transfer') {
    return (
      <TransferBlock
        title={title || metadata?.visibleTitle}
        targetDomain={targetDomain || extra || 'Nuevo Contexto'}
        prompt={content}
      />
    );
  }

  return (
    <AeternaEngagement
      type={type as any}
      title={title || metadata?.visibleTitle || 'Bloque Pedagógico'}
      content={content}
      extra={extra}
    />
  );
}
