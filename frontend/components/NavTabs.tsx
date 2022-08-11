import { Fragment } from 'react'
import Router, { useRouter } from 'next/router'
import { Tab } from '@headlessui/react'
import {
  GlobeAltIcon,
  DatabaseIcon,
  CurrencyDollarIcon,
  HomeIcon,
} from '@heroicons/react/outline';

const TabItem = ({
  name,
  Icon,
}: {
  name: string;
  Icon: React.FC<{ className: string }>;
}) => {
  return (
    <Tab as={Fragment}>
      {({ selected }) => {
        return (
          <button
            className={`
            group
            focus:outline-none
            border-t-2
            ${selected ? 'border-verdant' : 'border-transparent'}
            flex-1
            flex
            flex-col
            items-center
            justify-center`}>
            <Icon className={`w-5 h-5 group-hover:text-white ${selected ? 'text-white' : 'text-smoke'}`}/>
            <div className={`text-2xs pt-[2px] group-hover:text-white ${selected ? 'text-white': 'text-smoke'}`}>
              {name.toUpperCase()}
            </div>
          </button>
        );
      }}
    </Tab>
  );
};

const TabIndexByRoute: Record<string, number> = {
  '/': 0,
  '/assets': 1,
  '/gasTank': 2,
  '/activity': 3,
};

const RouteByTabIndex: Record<number, string> = Object.fromEntries(Object.keys(TabIndexByRoute).map((key) => [TabIndexByRoute[key], key]));

const setTabIndex = (tabIndex: number) => {
  Router.push(RouteByTabIndex[tabIndex]);
}

const NavTabs = () => {
  const router = useRouter();
  const selectedTabIndex = TabIndexByRoute[router.asPath] || 0;
  return (
    <Tab.Group selectedIndex={selectedTabIndex} onChange={setTabIndex}>
      <div className="flex flex-col h-14 bg-ash">
        <Tab.List as={Fragment}>
          <div className="flex-1 flex items-stretch px-2">
            <TabItem name="Home" Icon={HomeIcon} />
            <TabItem name="Assets" Icon={CurrencyDollarIcon} />
            <TabItem name="Gas Tank" Icon={DatabaseIcon} />
            <TabItem name="Activity" Icon={GlobeAltIcon} />
          </div>
        </Tab.List>
      </div>
    </Tab.Group>
  );
};

export default NavTabs;
