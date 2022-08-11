import {
  XIcon
} from '@heroicons/react/outline';

const FeatureSection = () => {
  return (
    <div className="flex self-stretch mx-4 my-3">
      <button
        className="
          hover:opacity-90
          relative
          flex-1
          flex
          px-6
          py-3
          bg-neutral-700
          rounded-md
          shadow-sm
          shadow-black
        ">
        <div
          className="
            absolute
            top-1
            right-1
          ">
          <XIcon className="w-4 h-4 text-white" />
        </div>
        <div
          className="
            flex-1
            flex
            flex-col
            text-left
            text-sm
            text-white
          ">
          <div className="font-light">
            Enjoying Kastle? Refer a friend.
          </div>
          <div
            className="flex justify-between">
            <div className="font-semibold">
              Get $5 gas, give $5 gas.
            </div>
            <div
              className="
                underline
                font-light
              ">
              See more &gt;
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default FeatureSection;