import { Tab } from '@headlessui/react'
import Image, {StaticImageData} from 'next/image';
import { Fragment, useState } from 'react'
import ethereumLogo from '/public/chain_logos/ethereum.png';
import polygonLogo from '/public/chain_logos/polygon.png';
import optimismLogo from '/public/chain_logos/optimism.png';
import solanaLogo from '/public/chain_logos/solana.png';
import nearLogo from '/public/chain_logos/near.png';
import {useLocalStorageValue} from '@react-hookz/web';

const ChainTabItem = ({
  imgSrc,
} : {
  imgSrc: StaticImageData,
}) => {
  return (
    <Tab as={Fragment}>
      {({ selected }) => {
        return (
          <button className={`
            group
            focus:outline-none
            border-b-2
            mx-2
            py-2
            ${selected ? 'border-verdant' : 'border-transparent'}
            flex-1
            flex
            flex-col
            items-center
            justify-center`}>
            <Image src={imgSrc} height={20} width={(imgSrc.width / imgSrc.height * 20)} />
          </button>
        );
      }}
    </Tab>
  );
}

const indexToChainId = (index: number): number => {
  switch (index) {
    case 0:
      return 5;
    case 1:
      return 137;
    case 2:
      return 10;
    case 3:
      return 5;
    case 4:
      return 5;
    default:
      // Just default to Goerli - not really for any good reason right now.
      return 5;
  }
}

const ChainTabs = () => {
  const [_selectedChainId, setSelectedChainId] = useLocalStorageValue<number>('selected_chain_id', 5);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  return (
    <Tab.Group
      selectedIndex={selectedIndex}
      onChange={(index) => {
        console.log(index);
        setSelectedIndex(index);
        setSelectedChainId(indexToChainId(index));
      }}
    >
      <Tab.List>
        <div className="flex justify-between px-12 pt-2">
          <ChainTabItem imgSrc={ethereumLogo} />
          <ChainTabItem imgSrc={polygonLogo} />
          <ChainTabItem imgSrc={optimismLogo} />
          <ChainTabItem imgSrc={solanaLogo} />
          <ChainTabItem imgSrc={nearLogo} />
        </div>
      </Tab.List>
    </Tab.Group>
  );
}

export default ChainTabs;
