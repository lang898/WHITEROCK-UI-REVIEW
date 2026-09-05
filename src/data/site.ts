import localesData from '../../data/locales.json';
import siteConfigData from '../../data/site.config.json';
import type { LocaleConfig } from '../types';

export const locales: LocaleConfig[] = (localesData.locales as LocaleConfig[]).filter((locale) => locale.id === 'en');
export const siteConfig = {
  ...siteConfigData,
  web3FormsAccessKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY?.trim() || siteConfigData.web3FormsAccessKey,
  web3FormsAttachmentsEnabled: import.meta.env.VITE_WEB3FORMS_ATTACHMENTS_ENABLED === 'true',
};
