const FRACTIONS = ['', '⅛', '¼', '⅜', '½', '⅝', '¾', '⅞'];

function millimetres(value: number, unit: string): number {
  if (/^cm$/i.test(unit)) return value * 10;
  if (/^(?:in|inch|inches|")$/i.test(unit)) return value * 25.4;
  return value;
}

function imperialReference(mm: number): string {
  const commonThicknesses: Record<number, string> = {
    10: '⅜"',
    12: '½"',
    15: '⅝"',
    18: '¾"',
    20: '¾"',
    30: '1¼"',
    40: '1½"',
    50: '2"',
    60: '2⅜"',
    80: '3⅛"',
    100: '4"'
  };

  if (commonThicknesses[Math.round(mm)] && Math.abs(mm - Math.round(mm)) < 0.2) {
    return commonThicknesses[Math.round(mm)];
  }

  const eighths = Math.round((mm / 25.4) * 8);
  const whole = Math.floor(eighths / 8);
  const fraction = FRACTIONS[eighths % 8];
  return `${whole || ''}${whole && fraction ? ' ' : ''}${fraction}"`;
}

function formatDimensionGroup(group: string, unit: string): string {
  const metricValues = group.split(/[x×]/i).map((part) => millimetres(Number(part.trim()), unit));
  const metric = metricValues.map((amount) => String(Math.round(amount))).join(' × ');
  const imperial = metricValues.map(imperialReference).join(' × ');
  return `${metric} mm (${imperial})`;
}

function formatRange(start: string, end: string, unit: string): string {
  const startMm = millimetres(Number(start), unit);
  const endMm = millimetres(Number(end), unit);
  return `${Math.round(startMm)}-${Math.round(endMm)} mm (${imperialReference(startMm)}-${imperialReference(endMm)})`;
}

function formatSingle(amount: string, unit: string): string {
  const mm = millimetres(Number(amount), unit);
  return `${Math.round(mm)} mm (${imperialReference(mm)})`;
}

/**
 * Displays trade dimensions with millimetres first and a rounded imperial reference.
 * Final dimensions still follow the approved drawing and written quotation.
 */
export function formatMeasurement(value?: string): string {
  if (!value) return 'Confirm by quotation';

  const placeholders: string[] = [];
  const preserve = (formatted: string) => {
    const token = `__WR_MEASUREMENT_${placeholders.length}__`;
    placeholders.push(formatted);
    return token;
  };

  let formatted = value
    .replace(/((?:\d+(?:\.\d+)?\s*[x×]\s*)+\d+(?:\.\d+)?)\s*(mm|cm|in|inch|inches|")/gi, (_match, group, unit) => preserve(formatDimensionGroup(group, unit)))
    .replace(/(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\s*(mm|cm|in|inch|inches|")/gi, (_match, start, end, unit) => preserve(formatRange(start, end, unit)))
    .replace(/(\d+(?:\.\d+)?)\s*(mm|cm|inches|inch|in|")(?=\W|$)/gi, (_match, amount, unit) => preserve(formatSingle(amount, unit)));

  placeholders.forEach((replacement, index) => {
    formatted = formatted.replace(`__WR_MEASUREMENT_${index}__`, replacement);
  });

  return formatted;
}
