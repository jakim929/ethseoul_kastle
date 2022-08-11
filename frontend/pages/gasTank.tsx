import { Tab } from '@headlessui/react';
import type { NextPage } from 'next';
import LoadGasTankSection from '/components/LoadGasTankSection';
import { formatCents } from '/lib/formatCents';
import { useGasTankBalance } from '/lib/useGasTankBalance';

const GasTankBalanceSection = () => {
  const { data, error } = useGasTankBalance();
  return (
    <div className="flex justify-between items-center text-white pb-2 border-b">
      <div className="uppercase tracking-wider">
        Gas Tank
      </div>
      <div className="flex flex-col items-center">
        <div className="text-2xl tracking-wider">
          {data ? formatCents(data) : 'Loading...'}
        </div>
        <div className="text-neutral-500 text-2xs">
          Last loaded yesterday
        </div>
      </div>
    </div>
  );
}


const GasTank: NextPage = () => {
  return (
    <div className="flex flex-col px-8 py-4">
      <GasTankBalanceSection />
      <LoadGasTankSection />
    </div>
  );
}

export default GasTank;
