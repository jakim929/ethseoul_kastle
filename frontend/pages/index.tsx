import type { NextPage } from 'next';
import ConnectToDappSection from '/components/ConnectToDappSection';
import FeatureSection from '/components/FeatureSection';
import QuickActionsSection from '/components/QuickActionsSection';
import SummarySection from '/components/SummarySection';

const Home: NextPage = () => {
  return (
    <div className="flex flex-col">
      <QuickActionsSection />
      <ConnectToDappSection />
      <FeatureSection />
      <SummarySection />
    </div>
  );
};

export default Home;
