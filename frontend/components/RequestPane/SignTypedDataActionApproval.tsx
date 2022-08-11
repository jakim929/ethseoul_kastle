// @ts-nocheck
import ActionButton from './ActionButton';
import { PersonalSignAction } from '/lib/ActionQueueStore';
import { UserWallet } from '/lib/UserWallet';
import { ethers } from 'ethers';
import {useGasTankBalance} from '/lib/useGasTankBalance';
import {formatCents} from '/lib/formatCents';
import { SignTypedDataAction } from "/lib/ActionQueueStore";
import { TypedData } from '/lib/types/eip712';
import { _TypedDataEncoder, keccak256, arrayify, joinSignature } from 'ethers/lib/utils';
import { TypedDataUtils } from "ethers-eip712";


const encodeType = (dataToSign: TypedData) => {
  const {
    domain,
    types,
    message,
    primaryType,
  } = dataToSign;
  const buf = Buffer.concat([
    Buffer.from("1901", "hex"),
    TypedDataUtils.hashStruct("EIP712Domain", domain, types),
    TypedDataUtils.hashStruct(primaryType as string, message, types),
  ]);
  return ethers.utils.hexlify(buf);
}


const signTypedData = async (dataToSign: TypedData) => {
  const {
    domain,
    types,
    message,
  } = dataToSign;
  console.log(dataToSign)
  const digest = TypedDataUtils.encodeDigest(dataToSign);
  const digestHex = ethers.utils.hexlify(digest)
  console.log('digestHex', digestHex)
  const result = joinSignature(await UserWallet._signingKey().signDigest(digestHex));
  return `${ethers.utils.hexlify(result)}00` ;
}

const signTypedDataOld = async (dataToSign: TypedData) => {
  const {
    domain,
    types,
    message,
  } = dataToSign;
  console.log(dataToSign)
  // const typesRemoved = {...types};

  
  const encodeResult = encodeType(dataToSign);
  const hashResult = keccak256(arrayify(encodeResult));
  console.log('hashton result', ((hashResult)));
  // delete types.EIP712Domain;
  // console.log("hashResult", _TypedDataEncoder.hash(domain, types, message));

  const typeRemoved = {...types};
  delete typeRemoved.EIP712Domain;
  const newHash = _TypedDataEncoder.hash(domain, typeRemoved, message)
    console.log("hashResult", newHash);

  // const result = await UserWallet._signTypedData(domain, typeRemoved, message);

  const result = joinSignature(await UserWallet._signingKey().signDigest(hashResult));
  const sig = ethers.utils.arrayify(result);
  console.log('sig', sig);
  if (sig[64] < 27) sig[64] += 27
  console.log('result', result)
  return `${ethers.utils.hexlify(sig)}00`

  return `${ethers.utils.hexlify(sig)}00` ;
}

const SignTypedDataActionApproval = ({ action }: { action: SignTypedDataAction }) => {
  const { data: dataToSign, onApprove, onReject, onComplete } = action;

  return (
    <div className="flex flex-col flex-1 text-white">
      <div className="font-bold text-base">
        Message
      </div>
      <div className="font-mono text-sm break-words w-80">
        {JSON.stringify(dataToSign.message)}
      </div>
      <ActionButton
        primaryText={'CONFIRM'}
        extraClass={'bg-green'}
        onClick={async () => {
          const signature = await signTypedData(dataToSign);
          console.log('testsignatures', signature);
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
}

export default SignTypedDataActionApproval;