export type VerificationStatus = 'VERIFIED' | 'ESTIMATE' | 'CLAIM';
export type ExtendedVerificationStatus = 'VERIFIED' | 'ESTIMATE' | 'REPORTED' | 'CLAIM';

export type BarColorHex = '#3B82F6' | '#D97706' | '#64748B' | '#DC2626';

export type VisualMode =
  | 'bar-chart'
  | 'document-excerpt'
  | 'side-by-side'
  | 'hardware-cutaway'
  | 'kill-chain'
  | 'lower-third'
  | 'delay-timeline'
  | 'range-ring'
  | 'end-screen';

export type VisualModeOption = {
  value: VisualMode;
  label: string;
};

export const VISUAL_MODE_OPTIONS: readonly VisualModeOption[] = [
  { value: 'bar-chart', label: '1. Bar Chart' },
  { value: 'document-excerpt', label: '2. Document Excerpt Highlighter' },
  { value: 'side-by-side', label: '3. Side-by-Side Comparison Card' },
  { value: 'hardware-cutaway', label: '4. Hardware Cutaway Annotator' },
  { value: 'kill-chain', label: '5. Systems / Kill-Chain Node Schematic' },
  { value: 'lower-third', label: '6. Lower-Third Source Stamp' },
  { value: 'delay-timeline', label: '7. Program Delay Timeline' },
  { value: 'range-ring', label: '8. Tactical Range-Ring Visualizer' },
  { value: 'end-screen', label: '9. Clean End-Screen Slate' },
] as const;

export interface BarColorOption {
  label: string;
  hex: BarColorHex;
}

export type ChartRow = {
  id: string;
  label: string;
  value: number;
  status: VerificationStatus;
  color: BarColorHex;
};

export type ChartConfig = {
  title: string;
  subtitle: string;
  footer: string;
  unitSuffix: string;
  durationSeconds: number;
  rows: ChartRow[];
};

export type ExcerptHighlightColor = 'amber' | 'emerald';

export type DocumentExcerptConfig = {
  agencyHeader: string;
  documentDate: string;
  paragraph: string;
  highlightedSubstring: string;
  badge: ExtendedVerificationStatus;
  highlightColor: ExcerptHighlightColor;
  footer: string;
};

export type ComparisonCardSide = {
  title: string;
  bigStat: string;
  badge: ExtendedVerificationStatus;
  bullets: [string, string, string];
  accentColor: BarColorHex;
};

export type SideBySideConfig = {
  title: string;
  subtitle: string;
  leftCard: ComparisonCardSide;
  rightCard: ComparisonCardSide;
  footer: string;
};

export type CutawayPinDirection = 'left' | 'right';

export type CutawayPin = {
  id: string;
  xPercent: number;
  yPercent: number;
  labelTitle: string;
  technicalDetail: string;
  direction: CutawayPinDirection;
  badge: ExtendedVerificationStatus;
};

export type HardwareCutawayConfig = {
  title: string;
  imageDataUrl: string | null;
  imageName: string;
  pins: CutawayPin[];
  footer: string;
};

export type KillChainNode = {
  id: string;
  stepNumber: string;
  nodeTitle: string;
  roleSubtitle: string;
  arrowLabel: string;
  badge: ExtendedVerificationStatus;
};

export type KillChainConfig = {
  title: string;
  subtitle: string;
  nodes: KillChainNode[];
  footer: string;
};

export type LowerThirdConfig = {
  kickerHeader: string;
  headline: string;
  badge: ExtendedVerificationStatus;
  sourceCitation: string;
  chromaKeyGreen: boolean;
};

export type DelayMilestone = {
  id: string;
  dateLabel: string;
  title: string;
  note: string;
  badge: ExtendedVerificationStatus;
};

export type DelayTimelineConfig = {
  title: string;
  subtitle: string;
  milestones: DelayMilestone[];
  footer: string;
};

export type RangeUnit = 'km' | 'nm';
export type RangeLineStyle = 'solid' | 'dashed';

export type RangeArc = {
  id: string;
  label: string;
  distance: number;
  badge: ExtendedVerificationStatus;
  color: BarColorHex;
  lineStyle: RangeLineStyle;
};

export type RangeRingConfig = {
  title: string;
  subtitle: string;
  originLabel: string;
  unit: RangeUnit;
  maxScaleDistance: number;
  arcs: RangeArc[];
  footer: string;
};

export type EndScreenConfig = {
  channelTitle: string;
  nextEpisodeLabel: string;
  signoffCitation: string;
};

export type BroadcastStudioState = {
  mode: VisualMode;
  durationSeconds: number;
  barChart: ChartConfig;
  documentExcerpt: DocumentExcerptConfig;
  sideBySide: SideBySideConfig;
  hardwareCutaway: HardwareCutawayConfig;
  killChain: KillChainConfig;
  lowerThird: LowerThirdConfig;
  delayTimeline: DelayTimelineConfig;
  rangeRing: RangeRingConfig;
  endScreen: EndScreenConfig;
};

export const COMPOSITION_WIDTH = 1920;
export const COMPOSITION_HEIGHT = 1080;
export const COMPOSITION_FPS = 30;
export const MIN_DURATION_SECONDS = 3;
export const MAX_DURATION_SECONDS = 30;

export const BAR_COLOR_OPTIONS: readonly BarColorOption[] = [
  { label: 'Steel Blue', hex: '#3B82F6' },
  { label: 'Muted Amber', hex: '#D97706' },
  { label: 'Slate Gray', hex: '#64748B' },
  { label: 'Crimson', hex: '#DC2626' },
] as const;

export const VERIFICATION_STATUS_OPTIONS: readonly VerificationStatus[] = [
  'VERIFIED',
  'ESTIMATE',
  'CLAIM',
] as const;

export const EXTENDED_VERIFICATION_STATUS_OPTIONS: readonly ExtendedVerificationStatus[] = [
  'VERIFIED',
  'ESTIMATE',
  'REPORTED',
  'CLAIM',
] as const;

export const VERIFICATION_BADGE_STYLES: Record<
  ExtendedVerificationStatus,
  { color: string; backgroundColor: string; borderColor: string }
> = {
  VERIFIED: {
    color: '#10B981',
    backgroundColor: '#064E3B',
    borderColor: '#10B981',
  },
  ESTIMATE: {
    color: '#F59E0B',
    backgroundColor: '#451A03',
    borderColor: '#F59E0B',
  },
  REPORTED: {
    color: '#60A5FA',
    backgroundColor: '#0F294A',
    borderColor: '#3B82F6',
  },
  CLAIM: {
    color: '#EF4444',
    backgroundColor: '#450A0A',
    borderColor: '#EF4444',
  },
};

export const DEFAULT_CHART_CONFIG: ChartConfig = {
  title: '5TH-GEN STEALTH FIGHTER FLEET SCALE',
  subtitle: 'Operational & Serial Airframes Assessable via Open-Source Reporting',
  footer: 'Sources: IISS Military Balance, DoD Selected Acquisition Reports, OSINT',
  unitSuffix: 'airframes',
  durationSeconds: 8,
  rows: [
    {
      id: 'row-f35',
      label: 'F-35 Lightning II (US & Allies)',
      value: 1000,
      status: 'VERIFIED',
      color: '#3B82F6',
    },
    {
      id: 'row-j20',
      label: 'Chengdu J-20 (PLAAF)',
      value: 250,
      status: 'ESTIMATE',
      color: '#D97706',
    },
    {
      id: 'row-su57',
      label: 'Sukhoi Su-57 (RuAF)',
      value: 32,
      status: 'ESTIMATE',
      color: '#DC2626',
    },
  ],
};

export const DEFAULT_DOCUMENT_EXCERPT_CONFIG: DocumentExcerptConfig = {
  agencyHeader: 'U.S. DEPARTMENT OF DEFENSE · SELECTED ACQUISITION REPORT',
  documentDate: 'FY2025 ASSESSMENT · SECTION 4.2',
  paragraph:
    'Program sustainment reviews indicate that full-rate Lot 17 propulsion deliveries remain constrained by sub-tier turbine blade casting capacity. Consequently, Block 4 TR-3 hardware integration is projected to require an additional 14 months before full combat-coded squadron acceptance.',
  highlightedSubstring: 'additional 14 months before full combat-coded squadron acceptance',
  badge: 'VERIFIED',
  highlightColor: 'amber',
  footer: 'Source: DoD Selected Acquisition Report (SAR), Dec 2024 Release',
};

export const DEFAULT_SIDE_BY_SIDE_CONFIG: SideBySideConfig = {
  title: 'LONG-RANGE AIR-TO-AIR ENGAGEMENT ARCHITECTURE',
  subtitle: 'Comparative Propulsion & Seeker Envelope Assessment',
  leftCard: {
    title: 'AIM-260 JATM (USAF / USN)',
    bigStat: '200+ km',
    badge: 'ESTIMATE',
    bullets: [
      'Solid-fuel dual-pulse rocket motor architecture',
      'Internal weapons bay fitment for F-22 & F-35',
      'Two-way datalink with third-party targeting',
    ],
    accentColor: '#3B82F6',
  },
  rightCard: {
    title: 'PL-15 (PLAAF)',
    bigStat: '200–300 km',
    badge: 'REPORTED',
    bullets: [
      'Dual-pulse solid propellant burn profile',
      'Active electronically scanned array (AESA) seeker',
      'Primary BVR armament for J-20 & J-16 fleets',
    ],
    accentColor: '#D97706',
  },
  footer: 'Sources: RUSI Air Power Review, IISS Military Balance, Open-Source Telemetry',
};

export const DEFAULT_HARDWARE_CUTAWAY_CONFIG: HardwareCutawayConfig = {
  title: 'LOW-OBSERVABLE AIRFRAME SUBSYSTEM BREAKDOWN',
  imageDataUrl: null,
  imageName: '',
  pins: [
    {
      id: 'pin-1',
      xPercent: 28,
      yPercent: 44,
      labelTitle: 'AN/APG-81 AESA RADAR',
      technicalDetail: '1,676 T/R modules; LPI frequency-agile modes',
      direction: 'left',
      badge: 'VERIFIED',
    },
    {
      id: 'pin-2',
      xPercent: 52,
      yPercent: 38,
      labelTitle: 'DSI INLET GEOMETRY',
      technicalDetail: 'Diverterless supersonic inlet reduces frontal RCS',
      direction: 'right',
      badge: 'VERIFIED',
    },
    {
      id: 'pin-3',
      xPercent: 64,
      yPercent: 64,
      labelTitle: 'INTERNAL WEAPONS BAY',
      technicalDetail: '4-station carriage maintaining clean stealth profile',
      direction: 'right',
      badge: 'ESTIMATE',
    },
  ],
  footer: 'Source: Northrop Grumman / Lockheed Martin Technical Briefs',
};

export const DEFAULT_KILL_CHAIN_CONFIG: KillChainConfig = {
  title: 'OVER-THE-HORIZON MARITIME STRIKE KILL CHAIN',
  subtitle: 'Distributed Sensor-to-Shooter Telemetry Architecture',
  nodes: [
    {
      id: 'kc-1',
      stepNumber: '01',
      nodeTitle: 'SPACE / HALE ISR',
      roleSubtitle: 'SAR satellite & high-altitude UAV wide-area maritime sweep',
      arrowLabel: 'Cueing Track',
      badge: 'VERIFIED',
    },
    {
      id: 'kc-2',
      stepNumber: '02',
      nodeTitle: 'FUSION C2 NODE',
      roleSubtitle: 'Multi-source track correlation & fire-control assignment',
      arrowLabel: 'Target Vector',
      badge: 'ESTIMATE',
    },
    {
      id: 'kc-3',
      stepNumber: '03',
      nodeTitle: 'STRIKE LAUNCHER',
      roleSubtitle: 'Mobile TEL or surface combatant VLS salvo release',
      arrowLabel: 'Mid-Course Update',
      badge: 'VERIFIED',
    },
    {
      id: 'kc-4',
      stepNumber: '04',
      nodeTitle: 'TERMINAL SEEKER',
      roleSubtitle: 'Dual-mode RF/IIR terminal acquisition & impact',
      arrowLabel: '',
      badge: 'REPORTED',
    },
  ],
  footer: 'Sources: CSIS Missile Defense Project, DoD China Military Power Report',
};

export const DEFAULT_LOWER_THIRD_CONFIG: LowerThirdConfig = {
  kickerHeader: 'IISS MILITARY BALANCE · 2025 EDITION',
  headline: '420+ Operational H-6 / J-20 Combat Airframes Assessed in Eastern Theater',
  badge: 'ESTIMATE',
  sourceCitation: 'Verified via commercial SAR satellite imagery & serial tail tracking',
  chromaKeyGreen: false,
};

export const DEFAULT_DELAY_TIMELINE_CONFIG: DelayTimelineConfig = {
  title: 'NEXT-GEN FRIGATE PROCUREMENT SCHEDULE SLIP',
  subtitle: 'Baseline Contract Award vs. Revised IOC Milestones',
  milestones: [
    {
      id: 'ms-1',
      dateLabel: 'APR 2020',
      title: 'Detail Design & Lead Hull Award',
      note: 'Original target lead-ship delivery set for Q3 2026',
      badge: 'VERIFIED',
    },
    {
      id: 'ms-2',
      dateLabel: 'AUG 2022',
      title: 'Hull Form & Propulsion Redesign',
      note: 'Parent design commonality dropped from 85% to 15%',
      badge: 'VERIFIED',
    },
    {
      id: 'ms-3',
      dateLabel: 'APR 2024',
      title: 'USN 45-Day Shipbuilding Review',
      note: 'GAO flags 36-month cumulative schedule slippage',
      badge: 'VERIFIED',
    },
    {
      id: 'ms-4',
      dateLabel: 'NOV 2025',
      title: 'Yard Workforce & Supplier Bottleneck',
      note: 'Updated hull completion forecast pushed to 2029',
      badge: 'REPORTED',
    },
    {
      id: 'ms-5',
      dateLabel: 'Q4 2029',
      title: 'Revised Lead Hull Delivery Target',
      note: 'Projected IOC delayed 3+ years past initial baseline',
      badge: 'ESTIMATE',
    },
  ],
  footer: 'Sources: U.S. Government Accountability Office (GAO-24-106), Congressional Research Service',
};

export const DEFAULT_RANGE_RING_CONFIG: RangeRingConfig = {
  title: 'REGIONAL ANTI-SHIP & LAND-ATTACK ENGAGEMENT ENVELOPES',
  subtitle: 'Nominal Maximum Weapon Reach from Coastal Launch Baseline',
  originLabel: 'LAUNCH ORIGIN: COASTAL BATTERY',
  unit: 'km',
  maxScaleDistance: 2000,
  arcs: [
    {
      id: 'arc-1',
      label: 'YJ-12B Coastal AShM',
      distance: 400,
      badge: 'ESTIMATE',
      color: '#64748B',
      lineStyle: 'solid',
    },
    {
      id: 'arc-2',
      label: 'CJ-10 Land-Attack Cruise',
      distance: 1500,
      badge: 'REPORTED',
      color: '#D97706',
      lineStyle: 'dashed',
    },
    {
      id: 'arc-3',
      label: 'DF-21D ASBM',
      distance: 1750,
      badge: 'VERIFIED',
      color: '#3B82F6',
      lineStyle: 'solid',
    },
    {
      id: 'arc-4',
      label: 'DF-26 IRBM Nominal',
      distance: 2000,
      badge: 'CLAIM',
      color: '#DC2626',
      lineStyle: 'dashed',
    },
  ],
  footer: 'Sources: CSIS Missile Threat Database, DoD Annual Report to Congress',
};

export const DEFAULT_END_SCREEN_CONFIG: EndScreenConfig = {
  channelTitle: 'OPEN SOURCE DEFENSE BRIEFING',
  nextEpisodeLabel: 'CONTINUE BRIEFING: NEXT ANALYSIS & SOURCE ARCHIVE',
  signoffCitation: 'All graphics generated from open-source assessments · Subscribe for weekly procurement briefs',
};

export const DEFAULT_STUDIO_STATE: BroadcastStudioState = {
  mode: 'bar-chart',
  durationSeconds: 8,
  barChart: DEFAULT_CHART_CONFIG,
  documentExcerpt: DEFAULT_DOCUMENT_EXCERPT_CONFIG,
  sideBySide: DEFAULT_SIDE_BY_SIDE_CONFIG,
  hardwareCutaway: DEFAULT_HARDWARE_CUTAWAY_CONFIG,
  killChain: DEFAULT_KILL_CHAIN_CONFIG,
  lowerThird: DEFAULT_LOWER_THIRD_CONFIG,
  delayTimeline: DEFAULT_DELAY_TIMELINE_CONFIG,
  rangeRing: DEFAULT_RANGE_RING_CONFIG,
  endScreen: DEFAULT_END_SCREEN_CONFIG,
};
