import Router from "next/router";
import { formatCents } from "/lib/formatCents";
import { useGasTankBalance } from "/lib/useGasTankBalance";

const SummaryRow = ({
  title,
  status,
  onClick,
}: {
  title: string;
  status: React.ReactNode;
  onClick: Function;
}) => {
  return (
    <button onClick={() => onClick()} className="hover:opacity-80 flex items-center text-white  text-sm font-light">
      <div
        className="flex-1 uppercase tracking-wider">
        {title}
      </div>
      <div className="flex-1 flex items-center justify-between">
        <div>
          {status}
        </div>
        <div className="uppercase text-xs">
          All &gt;
        </div>
      </div>
    </button>
  );
}

const SummarySection = () => {
  const { data } =  useGasTankBalance();
  return (
    <div className="rounded-md flex mx-4 bg-neutral-800">
      <div className="flex-1 flex flex-col p-6 space-y-3">
        <SummaryRow title="Requests" status="1" onClick={() => Router.push('/activity')} />
        <SummaryRow title="Assets" status="$72.98" onClick={() => Router.push('/assets')} />
        <SummaryRow title="Gas Tank" status={`${data ?  formatCents(data) : ''}`} onClick={() => Router.push('/gasTank')} />
      </div>
    </div>

  )
}

export default SummarySection;
