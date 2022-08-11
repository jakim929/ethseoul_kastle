import ActionButton from './ActionButton';
import { PersonalSignAction } from '/lib/ActionQueueStore';
import { UserWallet } from '/lib/UserWallet';
import { ethers } from 'ethers';
import {useGasTankBalance} from '/lib/useGasTankBalance';
import {formatCents} from '/lib/formatCents';

const personalSign = async (message: string) => {
  console.log('message to sign:', message);
  const plainString = ethers.utils.toUtf8String(message);
  console.log('test:', ethers.utils.toUtf8String(message));
  // console.log('hashed message:', ethers.utils.keccak256((message)));

  console.log('hashed message:', ethers.utils.hashMessage(plainString));
  const result = (await UserWallet.signMessage(ethers.utils.arrayify(message)))  + '00';
  console.log('result', result);
  return result;
};

const SignatureActionApproval = ({
  action,
}: {
  action: PersonalSignAction;
}) => {
  const { data: messageToSign, onApprove, onReject, onComplete } = action;

  const { data } = useGasTankBalance();

  console.log('data from opensea', messageToSign);
  return (
    <div className="flex flex-col flex-1 text-white">
      <div className="font-bold text-base">
        Message
      </div>
      <div className="font-mono text-sm break-words w-80">
        {messageToSign}
      </div>
      <ActionButton
        primaryText={'CONFIRM'}
        secondaryText={data ? `Gas tank balance: ${formatCents(data)}` : 'Loading gas tank balance' }
        extraClass={'bg-green'}
        onClick={async () => {
          const signature = await personalSign(messageToSign);
          onApprove(signature);
          onComplete();
        }}
      />
      <ActionButton
        extraClass={'bg-red'}
        primaryText={'REJECT'}
        onClick={async () => {
          onReject();
          onComplete();
        }}
      />
    </div>
  );
};

export default SignatureActionApproval;
