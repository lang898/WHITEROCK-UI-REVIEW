import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, Calculator, FileCheck, Ship } from 'lucide-react';
import type { LocaleConfig } from '../types';

interface TariffCalculatorProps {
  currentLocale?: LocaleConfig;
  onStartRfq?: () => void;
}

type ProductType = 'vanity' | 'kitchen' | 'slabs' | 'furniture';
type Destination = 'usa' | 'canada' | 'europe' | 'australia';

const productLabels: Record<ProductType, string> = {
  vanity: 'Prefab Vanity Tops',
  kitchen: 'Kitchen Countertops',
  slabs: 'Stone Slabs',
  furniture: 'Stone Furniture',
};

const destinationLabels: Record<Destination, string> = {
  usa: 'United States',
  canada: 'Canada',
  europe: 'Europe',
  australia: 'Australia',
};

export const TariffCalculator: React.FC<TariffCalculatorProps> = ({ onStartRfq }) => {
  const [productType, setProductType] = useState<ProductType>('vanity');
  const [destination, setDestination] = useState<Destination>('usa');
  const [estimatedContainers, setEstimatedContainers] = useState(2);
  const [orderValuePerContainer, setOrderValuePerContainer] = useState(38000);
  const [buyerDutyRate, setBuyerDutyRate] = useState(5);
  const [logisticsPerContainer, setLogisticsPerContainer] = useState(5000);

  const totalOrderValue = estimatedContainers * orderValuePerContainer;
  const estimatedDuty = totalOrderValue * (buyerDutyRate / 100);
  const estimatedLogistics = estimatedContainers * logisticsPerContainer;
  const planningTotal = totalOrderValue + estimatedDuty + estimatedLogistics;

  return (
    <div className="wr-card p-6 sm:p-10 space-y-8 text-[#1d1d1f]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.06] pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-50 text-stone-800 text-xs font-semibold border border-stone-200">
            <Calculator className="w-3.5 h-3.5 text-stone-600" />
            <span className="tech-badge">BUYER-ENTERED IMPORT COST WORKSHEET</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1d1d1f]">
            Plan a Preliminary Landed-Cost Budget
          </h2>
          <p className="text-xs sm:text-sm text-[#86868b] max-w-2xl">
            Enter the working duty rate and logistics allowance provided by your customs broker or freight forwarder. This worksheet is not a customs ruling or freight quotation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-stone-900 bg-stone-50 px-3.5 py-1.5 rounded-full border border-stone-200 shrink-0">
          <FileCheck className="w-4 h-4 text-stone-700" />
          <span>Broker confirmation required</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#1d1d1f] block">Destination market</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(destinationLabels) as Destination[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDestination(id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    destination === id
                      ? 'bg-[#111113] text-white shadow-xs font-semibold'
                      : 'bg-black/[0.03] text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.06]'
                  }`}
                >
                  {destinationLabels[id]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#1d1d1f] block">Stone product category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(productLabels) as ProductType[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setProductType(id)}
                  className={`p-3 rounded-2xl text-xs font-medium text-center border transition-all cursor-pointer ${
                    productType === id
                      ? 'bg-[#111113] text-white border-transparent shadow-xs font-semibold'
                      : 'bg-white text-[#6e6e73] border-black/[0.08] hover:border-black/20 hover:text-[#1d1d1f]'
                  }`}
                >
                  {productLabels[id]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#fbfbfd] p-5 rounded-2xl border border-black/[0.06]">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#86868b] font-medium">Containers:</span>
                <strong className="text-[#1d1d1f] font-mono text-sm">{estimatedContainers}</strong>
              </div>
              <input type="range" min="1" max="20" step="1" value={estimatedContainers} onChange={(event) => setEstimatedContainers(Number(event.target.value))} className="w-full accent-[#111113] cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#86868b] font-medium">Estimated FOB value / container:</span>
                <strong className="text-[#1d1d1f] font-mono text-sm">${orderValuePerContainer.toLocaleString()}</strong>
              </div>
              <input type="range" min="20000" max="80000" step="1000" value={orderValuePerContainer} onChange={(event) => setOrderValuePerContainer(Number(event.target.value))} className="w-full accent-[#111113] cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#86868b] font-medium">Broker-provided duty rate:</span>
                <strong className="text-[#1d1d1f] font-mono text-sm">{buyerDutyRate.toFixed(1)}%</strong>
              </div>
              <input type="range" min="0" max="40" step="0.5" value={buyerDutyRate} onChange={(event) => setBuyerDutyRate(Number(event.target.value))} className="w-full accent-[#111113] cursor-pointer" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#86868b] font-medium">Freight and destination fees / container:</span>
                <strong className="text-[#1d1d1f] font-mono text-sm">${logisticsPerContainer.toLocaleString()}</strong>
              </div>
              <input type="range" min="0" max="15000" step="250" value={logisticsPerContainer} onChange={(event) => setLogisticsPerContainer(Number(event.target.value))} className="w-full accent-[#111113] cursor-pointer" />
            </div>
          </div>

          <div className="flex gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-950 leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Classification, origin, valuation, trade remedies, taxes, and port charges vary by shipment. Confirm every rate and document requirement with qualified advisers before ordering.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between wr-card wr-card--soft p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-black/[0.08] pb-4">
              <span className="tech-badge text-[#6e6e73]">PLANNING SUMMARY</span>
              <Ship className="w-4 h-4 text-[#a1a1a6]" />
            </div>

            <dl className="space-y-3 text-xs">
              <div className="flex justify-between gap-4"><dt className="text-[#6e6e73]">Destination</dt><dd>{destinationLabels[destination]}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#6e6e73]">Product</dt><dd>{productLabels[productType]}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#6e6e73]">Estimated FOB total</dt><dd className="font-mono">${totalOrderValue.toLocaleString()}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#6e6e73]">Estimated duty</dt><dd className="font-mono">${estimatedDuty.toLocaleString()}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-[#6e6e73]">Freight and destination allowance</dt><dd className="font-mono">${estimatedLogistics.toLocaleString()}</dd></div>
            </dl>

            <div className="p-5 bg-white border border-black/[0.08] text-center space-y-1">
              <span className="tech-badge text-[#6e6e73] block">PRELIMINARY LANDED-COST BUDGET</span>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1d1d1f] font-mono">${planningTotal.toLocaleString()}</div>
              <p className="text-[11px] text-[#6e6e73]">Excludes taxes and charges not entered above.</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button type="button" onClick={onStartRfq} className="wr-button wr-button--primary w-full">
              <span>Request a Project Quotation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="text-[10px] text-center text-[#86868b]">Commercial terms are confirmed in the written quotation.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
