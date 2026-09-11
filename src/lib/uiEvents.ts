export const OPEN_RFQ_EVENT = 'whiterock:open-rfq';

export const openRfqBuilder = () => {
  window.dispatchEvent(new CustomEvent(OPEN_RFQ_EVENT));
};
