export interface NfiSignalInfo {
  code: string;
  category: string;
  description: string;
  isShort: boolean;
  bgLight: string;
  textLight: string;
  borderLight: string;
  bgDark: string;
  textDark: string;
  borderDark: string;
}

/**
 * 📖 NFI / E0V1E / Generic strategyEntrySignal智能解析速查字典：
 * • 支持结构化带方括号标签（如：buy_new [Deep drop：跌破SMA15均线4.0%强力Bottom fishing]）
 * • 1~13：Trend swing long
 * • 21~26：Volume breakout long
 * • 41~53：Oversold rebound
 * • 61~68：Pullback accumulation
 * • 141~145：Large-cap leaders
 * • 161~173：High-frequency scalping
 * • 500+：Short signal system
 */
export function parseNfiSignal(tag?: string | null): NfiSignalInfo {
  if (!tag || tag.trim() === '' || tag.trim() === '-') {
    return {
      code: '-',
      category: 'Standard entry',
      description: 'Standard or manual trade with no specific signal tag',
      isShort: false,
      bgLight: 'bg-slate-100',
      textLight: 'text-slate-600',
      borderLight: 'border-slate-200',
      bgDark: 'bg-slate-800/80',
      textDark: 'text-slate-400',
      borderDark: 'border-slate-700',
    };
  }

  const cleanTag = tag.trim();

  // 1. 结构化带括号/方括号的Strategy标签匹配 (如 E0V1E/NFI 常用: "buy_new [Deep drop：跌破SMA15均线4.0%强力Bottom fishing]" 或 "buy_1 [Oversold dropWick：跌破SMA15均线2.7%且RSIOversold]")
  const bracketMatch = cleanTag.match(/^([^[(\s]+)?\s*[[(]([^\])]+)[\])]/i);
  if (bracketMatch) {
    const rawPrefix = bracketMatch[1]?.trim() || '';
    const rawInside = bracketMatch[2]?.trim() || '';

    let category = rawInside;
    if (rawInside.includes('：') || rawInside.includes(':')) {
      const parts = rawInside.split(/[：:]/);
      category = parts[0].trim();
    }

    const code = rawPrefix || category;
    const isShort = cleanTag.toLowerCase().includes('short') || cleanTag.includes('Short');

    // 智能语义配色
    let bgLight = 'bg-cyan-50';
    let textLight = 'text-cyan-700';
    let borderLight = 'border-cyan-200';
    let bgDark = 'bg-cyan-950/50';
    let textDark = 'text-cyan-400';
    let borderDark = 'border-cyan-800/60';

    if (isShort) {
      bgLight = 'bg-rose-50';
      textLight = 'text-rose-700';
      borderLight = 'border-rose-200';
      bgDark = 'bg-rose-950/50';
      textDark = 'text-rose-400';
      borderDark = 'border-rose-800/60';
    } else if (
      cleanTag.includes('Wick') ||
      cleanTag.includes('Scalp') ||
      cleanTag.includes('Ultra-short') ||
      cleanTag.toLowerCase().includes('scalp') ||
      cleanTag.toLowerCase().includes('pin')
    ) {
      bgLight = 'bg-purple-50';
      textLight = 'text-purple-700';
      borderLight = 'border-purple-200';
      bgDark = 'bg-purple-950/50';
      textDark = 'text-purple-400';
      borderDark = 'border-purple-800/60';
    } else if (
      cleanTag.includes('Sharp drop') ||
      cleanTag.includes('Oversold drop') ||
      cleanTag.includes('Bottom fishing') ||
      cleanTag.includes('Oversold') ||
      cleanTag.toLowerCase().includes('dip') ||
      cleanTag.toLowerCase().includes('oversold')
    ) {
      bgLight = 'bg-amber-50';
      textLight = 'text-amber-700';
      borderLight = 'border-amber-200';
      bgDark = 'bg-amber-950/50';
      textDark = 'text-amber-400';
      borderDark = 'border-amber-800/60';
    } else if (
      cleanTag.includes('Buy dip') ||
      cleanTag.includes('Pullback') ||
      cleanTag.includes('Support') ||
      cleanTag.toLowerCase().includes('pullback')
    ) {
      bgLight = 'bg-blue-50';
      textLight = 'text-blue-700';
      borderLight = 'border-blue-200';
      bgDark = 'bg-blue-950/50';
      textDark = 'text-blue-400';
      borderDark = 'border-blue-800/60';
    } else if (
      cleanTag.includes('Breakout') ||
      cleanTag.includes('Chase long') ||
      cleanTag.includes('High volume') ||
      cleanTag.includes('Rally') ||
      cleanTag.toLowerCase().includes('breakout')
    ) {
      bgLight = 'bg-emerald-50';
      textLight = 'text-emerald-700';
      borderLight = 'border-emerald-200';
      bgDark = 'bg-emerald-950/50';
      textDark = 'text-emerald-400';
      borderDark = 'border-emerald-800/60';
    }

    return {
      code,
      category,
      description: cleanTag,
      isShort,
      bgLight,
      textLight,
      borderLight,
      bgDark,
      textDark,
      borderDark,
    };
  }

  // 2. 纯数字 NFI 经典标签解析 (如 "120", "42", "142", "501")
  const match = cleanTag.match(/\b(\d+)\b/) || cleanTag.match(/(\d+)/);
  const num = match ? parseInt(match[1], 10) : null;

  if (num !== null) {
    // 500+：Short signal system
    if (num >= 500) {
      return {
        code: `${num}`,
        category: 'Short signal system',
        description: 'Short signal system for overbought divergence and reversals',
        isShort: true,
        bgLight: 'bg-rose-50',
        textLight: 'text-rose-700',
        borderLight: 'border-rose-200',
        bgDark: 'bg-rose-950/50',
        textDark: 'text-rose-400',
        borderDark: 'border-rose-800/60',
      };
    }

    // 161~173：High-frequency scalping
    if (num >= 161 && num <= 173) {
      return {
        code: `${num}`,
        category: 'High-frequency scalping',
        description: '微观结构快速剥Scalp套利',
        isShort: false,
        bgLight: 'bg-pink-50',
        textLight: 'text-pink-700',
        borderLight: 'border-pink-200',
        bgDark: 'bg-pink-950/50',
        textDark: 'text-pink-400',
        borderDark: 'border-pink-800/60',
      };
    }

    // 141~145：Large-cap leaders
    if (num >= 141 && num <= 145) {
      return {
        code: `${num}`,
        category: 'Large-cap leaders',
        description: 'Long signal for major BTC/ETH assets',
        isShort: false,
        bgLight: 'bg-purple-50',
        textLight: 'text-purple-700',
        borderLight: 'border-purple-200',
        bgDark: 'bg-purple-950/50',
        textDark: 'text-purple-400',
        borderDark: 'border-purple-800/60',
      };
    }

    // 1~13 & 120等波段体系：Trend swing long
    if ((num >= 1 && num <= 13) || num === 120 || num === 12) {
      return {
        code: `${num}`,
        category: 'Trend swing long',
        description: 'Major moving-average trend swing long',
        isShort: false,
        bgLight: 'bg-emerald-50',
        textLight: 'text-emerald-700',
        borderLight: 'border-emerald-200',
        bgDark: 'bg-emerald-950/50',
        textDark: 'text-emerald-400',
        borderDark: 'border-emerald-800/60',
      };
    }

    // 21~26：Volume breakout long
    if (num >= 21 && num <= 26) {
      return {
        code: `${num}`,
        category: 'Volume breakout long',
        description: 'Volume expansion and breakout momentum long',
        isShort: false,
        bgLight: 'bg-cyan-50',
        textLight: 'text-cyan-700',
        borderLight: 'border-cyan-200',
        bgDark: 'bg-cyan-950/50',
        textDark: 'text-cyan-400',
        borderDark: 'border-cyan-800/60',
      };
    }

    // 41~53：Oversold rebound
    if (num >= 41 && num <= 53) {
      return {
        code: `${num}`,
        category: 'Oversold rebound',
        description: 'Fast rebound after extreme oversold drop',
        isShort: false,
        bgLight: 'bg-amber-50',
        textLight: 'text-amber-700',
        borderLight: 'border-amber-200',
        bgDark: 'bg-amber-950/50',
        textDark: 'text-amber-400',
        borderDark: 'border-amber-800/60',
      };
    }

    // 61~68：Pullback accumulation
    if (num >= 61 && num <= 68) {
      return {
        code: `${num}`,
        category: 'Pullback accumulation',
        description: 'Buy pullbacks at stable moving-average support',
        isShort: false,
        bgLight: 'bg-blue-50',
        textLight: 'text-blue-700',
        borderLight: 'border-blue-200',
        bgDark: 'bg-blue-950/50',
        textDark: 'text-blue-400',
        borderDark: 'border-blue-800/60',
      };
    }
  }

  // 3. 通用命名标签兜底
  const isShort = cleanTag.toLowerCase().includes('short') || cleanTag.includes('Short');
  return {
    code: cleanTag.length > 14 ? `${cleanTag.slice(0, 12)}…` : cleanTag,
    category: 'Strategy signal',
    description: `StrategyEntry signal: ${cleanTag}`,
    isShort,
    bgLight: isShort ? 'bg-rose-50' : 'bg-cyan-50',
    textLight: isShort ? 'text-rose-700' : 'text-cyan-700',
    borderLight: isShort ? 'border-rose-200' : 'border-cyan-200',
    bgDark: isShort ? 'bg-rose-950/50' : 'bg-cyan-950/50',
    textDark: isShort ? 'text-rose-400' : 'text-cyan-400',
    borderDark: isShort ? 'border-rose-800/60' : 'border-cyan-800/60',
  };
}

/**
 * Checks if the current bot strategy is NostalgiaForInfinity (NFI) / E0V1E
 */
export function isNfiStrategy(strategyName?: string | null): boolean {
  if (!strategyName) return false;
  const s = strategyName.toLowerCase().trim();
  return (
    s.startsWith('nostalgia') ||
    s.startsWith('nfi') ||
    s.includes('nostalgiaforinfinity') ||
    s.includes('nfix') ||
    s.startsWith('e0v1') ||
    s.startsWith('e0v')
  );
}
