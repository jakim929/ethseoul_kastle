import { Disclosure, RadioGroup, Tab } from "@headlessui/react";
import { Fragment, useState } from "react";
import Image from 'next/image';
import amexLogo from '/public/amex_logo.png';
import mastercardLogo from '/public/mastercard_logo.png';
import ActionButton from "/components/RequestPane/ActionButton";
const PaymentOptionTab = ({
  name,
}: {
  name: string;
}) => {
  return (
    <Tab as={Fragment}>
      {({ selected }) => {
        return (
          <button
            className={`
              flex-1
              flex
              justify-center
              py-2
              ${selected? 'bg-neutral-100 text-black' : 'bg-neutral-700 text-white'}
              hover:opacity-80
              uppercase
              text-2xs
              font-semibold
              tracking-wide
            `}>
            {name}
          </button>
        )      
      }}
    </Tab>
  );
}

const PaymentMethodSection = () => {
  return (
    <Tab.Group>
      <Tab.List>
        <div className="shadow shadow-black flex justify-between divide-x rounded-full overflow-hidden">
          <PaymentOptionTab name="Credit card"  />
          <PaymentOptionTab name="Crypto" />
          <PaymentOptionTab name="Bank transfer" />
        </div>
      </Tab.List>
      <Tab.Panels>
        <div className="pt-6 flex flex-col">
          <Tab.Panel>
            <CreditCardPanel />
          </Tab.Panel>
          <Tab.Panel>
            <CryptoPanel />
          </Tab.Panel>
          <Tab.Panel>
            <BankTransferPanel />
          </Tab.Panel>
        </div>
      </Tab.Panels>
  </Tab.Group>
);
}

const AmountSelectionSection = () => {
  const options = [10, 25, 50, 75, 100];
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col">
        <div className="flex text-white uppercase text-sm font-semibold tracking-wider pb-2">
          Amount
        </div>
        <Tab.Group selectedIndex={selectedTabIndex} onChange={setSelectedTabIndex}>
          <Tab.List>
            <div className="flex space-x-4">
              {options.map((option, index) => (
                <Tab as={Fragment} key={`credit_card_amount_${option}`}>
                  {({ selected }) => {
                      return (
                        <button
                          className={`
                            flex-1
                            flex
                            justify-center
                            text-sm
                            py-1
                            rounded
                            shadow-sm
                            shadow-black
                            hover:opacity-80
                            ${selected? 'bg-neutral-100 text-black' : 'bg-neutral-700 text-white'}
                          `}>
                          ${option}
                        </button>
                      );
                  }}
                </Tab>
              ))}
            </div>
          </Tab.List>
        </Tab.Group>
      </div>
      <div className="flex flex-col text-white">
        <div className="flex text-white uppercase text-sm font-semibold tracking-wider pb-2">
          Payment Method
        </div>
        
      </div>
    </div>
  );
}

const CreditCardPanel = () => {
  const [plan, setPlan] = useState('startup')
  return (
      <RadioGroup value={plan} onChange={setPlan}>
            <div className="flex flex-col text-white">

        <div className="flex flex-col space-y-2">
          <RadioGroup.Option value="startup">
            {({ checked }) => (
                    <div className="flex items-center cursor-pointer">
                    <div className={`w-3 h-3 mr-2 ${checked? 'bg-green-500' : 'bg-white'} rounded-full shadow shadow-black`}>
                    </div>
                    <div className="flex justify-center items-center mr-2 rounded w-8 overflow-hidden">
                  <Image src={amexLogo} width={22} height={22} />
                </div>
                <div>
                  <span className="font-semibold">Amex</span>&nbsp; ending in 2121

                </div>
              </div>
            )}
          </RadioGroup.Option>
          <RadioGroup.Option value="else">
            {({ checked }) => (
              <div className="flex items-center cursor-pointer">
                <div className={`w-3 h-3 mr-2 ${checked? 'bg-green-500' : 'bg-white'} rounded-full shadow shadow-black`}>
                </div>
                <div className="flex justify-center items-center mr-2 rounded w-8 overflow-hidden">
                  <Image src={mastercardLogo} width={28} height={22} />
                </div>
                <div>
                  <span className="font-semibold">Mastercard</span>&nbsp; ending in 5190

                </div>
              </div>
            )}
          </RadioGroup.Option>
        </div>
        <button className="rounded-full mt-4 tracking-widest flex justify-center py-1 uppercase bg-meadows px-4">
          Purchase
        </button>
        </div>

      </RadioGroup>
  )
}

const CryptoPanel = () => {
  return (
    <div>
      Crypto panel
    </div>
  );
}

const BankTransferPanel = () => {
  return (
    <div>
      Bank transfer panel
    </div>
  );
}

const LoadGasTankSection = () => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <div className="uppercase text-white font-semibold py-3 tracking-widest">
          Buy more gas
        </div>
      </div>
      <AmountSelectionSection />
      <PaymentMethodSection />
    </div>
  );
}

export default LoadGasTankSection;
