export type MaterialDisclaimerType =
  | 'digital-image'
  | 'natural-variation'
  | 'engineered-batch-variation'
  | 'typical-technical-data'
  | 'visualizer-simulation'
  | 'quotation-confirmation';

export const materialDisclaimers: Record<MaterialDisclaimerType, { title: string; text: string }> = {
  'digital-image': {
    title: 'Digital image reference',
    text: 'Website images and digital swatches are visual references only. Confirm the selected material, range, finish, and thickness with a physical sample and the written order documents.',
  },
  'natural-variation': {
    title: 'Natural stone variation',
    text: 'Natural stone varies by block and production lot in color, veining, mineral movement, fissures, and other geological characteristics. Approve the relevant physical material range before production.',
  },
  'engineered-batch-variation': {
    title: 'Engineered surface batch variation',
    text: 'Engineered surfaces may vary between production batches in tone, movement, aggregate distribution, finish, and other visual characteristics. Confirm the applicable production sample or batch before approval.',
  },
  'typical-technical-data': {
    title: 'Typical technical data',
    text: 'Values shown on this website are general reference values unless an exact report is identified. Product- or batch-specific test reports and acceptance criteria are confirmed for the order.',
  },
  'visualizer-simulation': {
    title: 'Visualizer simulation',
    text: 'The visualizer is an early design-direction simulation. It does not represent final slab scale, vein placement, color, fabrication, lighting, or installation appearance.',
  },
  'quotation-confirmation': {
    title: 'Written quotation controls',
    text: 'Final dimensions, material availability, finish, edge details, cutouts, packing, capacity, lead time, documents, and price are confirmed by approved drawing and written quotation.',
  },
};
