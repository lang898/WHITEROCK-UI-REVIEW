import localesData from '../../data/locales.json';
import siteConfigData from '../../data/site.config.json';
import type { LocaleConfig } from '../types';

export const locales: LocaleConfig[] = localesData.locales as LocaleConfig[];
export const siteConfig = siteConfigData;
