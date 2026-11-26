import React from 'react';
import type { BroadcastStudioState } from '../types/chart';
import { DefenseBriefingChart } from './DefenseBriefingChart';
import { DelayTimelineTemplate } from './templates/DelayTimelineTemplate';
import { DocumentExcerptTemplate } from './templates/DocumentExcerptTemplate';
import { EndScreenTemplate } from './templates/EndScreenTemplate';
import { HardwareCutawayTemplate } from './templates/HardwareCutawayTemplate';
import { KillChainTemplate } from './templates/KillChainTemplate';
import { LowerThirdTemplate } from './templates/LowerThirdTemplate';
import { RangeRingTemplate } from './templates/RangeRingTemplate';
import { SideBySideTemplate } from './templates/SideBySideTemplate';

export type BroadcastCompositionProps = BroadcastStudioState;

export const BroadcastComposition: React.FC<BroadcastCompositionProps> = (state) => {
  switch (state.mode) {
    case 'bar-chart':
      return <DefenseBriefingChart {...state.barChart} />;
    case 'document-excerpt':
      return <DocumentExcerptTemplate {...state.documentExcerpt} />;
    case 'side-by-side':
      return <SideBySideTemplate {...state.sideBySide} />;
    case 'hardware-cutaway':
      return <HardwareCutawayTemplate {...state.hardwareCutaway} />;
    case 'kill-chain':
      return <KillChainTemplate {...state.killChain} />;
    case 'lower-third':
      return <LowerThirdTemplate {...state.lowerThird} />;
    case 'delay-timeline':
      return <DelayTimelineTemplate {...state.delayTimeline} />;
    case 'range-ring':
      return <RangeRingTemplate {...state.rangeRing} />;
    case 'end-screen':
      return <EndScreenTemplate {...state.endScreen} />;
    default:
      return <DefenseBriefingChart {...state.barChart} />;
  }
};
