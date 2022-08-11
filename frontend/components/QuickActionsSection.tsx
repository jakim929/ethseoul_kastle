import {
  DatabaseIcon,
  UploadIcon,
  DownloadIcon,
  ShoppingCartIcon,
} from '@heroicons/react/outline';
import { addSingleUSDCTransferActionGoerli } from '/lib/mocks';

type CircularIconButtonProps = {
  Icon: React.FC<{ className?: string }>;
}

const CircularIcon = ({
  Icon,
}: CircularIconButtonProps) => {
  return (
    <div
      className="
        shadow 
        shadow-black 
        rounded-full
        w-9
        h-9
        bg-night
        flex
        justify-center
        items-center"
      >
      <Icon className={`w-4 h-4 text-white`}/>
    </div>
  );
}

type CircularIconButtonWithDescriptionProps = CircularIconButtonProps & { description: string, onClick: Function};

const CircularIconButtonWithDescription = ({
  Icon,
  description,
  onClick,
} : CircularIconButtonWithDescriptionProps) => {
  return (
    <button
      className="hover:opacity-80 flex flex-col items-center text-white text-xs tracking-wider w-20"
      onClick={() => onClick()}>
      <CircularIcon Icon={Icon}/>
      <div className="mt-2">
        {description.toUpperCase()}
      </div>
    </button>
  );
}

const QuickActionsSection = () => {
  return (
    <div className="flex py-6 justify-center">
      <CircularIconButtonWithDescription
        Icon={DownloadIcon}
        onClick={() => {}}
        description="Deposit"
      />
      <CircularIconButtonWithDescription
        Icon={UploadIcon}
        onClick={() => addSingleUSDCTransferActionGoerli()}
        description="Send"
      />
      <CircularIconButtonWithDescription
        Icon={ShoppingCartIcon}
        onClick={() => {}}
        description="Buy"
      />
      <CircularIconButtonWithDescription
        Icon={DatabaseIcon}
        onClick={() => {}}
        description="Fill Gas"
      />
    </div>
  )
}

export default QuickActionsSection;
