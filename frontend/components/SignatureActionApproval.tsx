import { ethers } from 'ethers';
import Button from '/components/Button';
import { PersonalSignAction } from '/lib/ActionQueueStore';
import { UserWallet } from '/lib/UserWallet';

const personalSign = async (message: string) => {
  return await UserWallet.signMessage(ethers.utils.arrayify(message));
};

const SignatureActionApproval = ({
  action,
}: {
  action: PersonalSignAction;
}) => {
  const { data: messageToSign, onApprove, onReject, onComplete } = action;

  return (
    <div className="flex flex-col">
      <div>Signature</div>
      <div>message to sign: {messageToSign}</div>
      <div className="flex">
        <Button
          onClick={async () => {
            onReject();
            onComplete();
          }}
        >
          Reject
        </Button>
        <Button
          extraClass="ml-2 bg-gray-200"
          onClick={async () => {
            const signature = await personalSign(messageToSign);
            onApprove(signature);
            onComplete();
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default SignatureActionApproval;
