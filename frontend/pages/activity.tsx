import type { NextPage } from 'next';
import RequestPane from '/components/RequestPane/RequestPane';
import { useFirstAction } from '/lib/ActionQueueStore';
import History from '/components/History';
import ConnectedDapps from '/components/ConnectedDapps';

const Activity: NextPage = () => {
  const { actionCount, action } = useFirstAction();
  if (!action) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-center py-2">
          <div className="uppercase text-white tracking-widest font-semibold text-sm">
            Connected Dapps
          </div>
        </div>
        <ConnectedDapps />
        <div className="flex justify-center py-2">
          <div className="uppercase text-white tracking-widest font-semibold text-sm">
            Activity
          </div>
        </div>
        {/* <History /> */}
      </div>
    );
  }
  return (
    <div>
      <RequestPane action={action} />
    </div>
  );
}

export default Activity;
