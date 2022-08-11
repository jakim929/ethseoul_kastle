// TODO; style.
// We sould find a headless button that makes this easy.
const ActionButton = ({
  primaryText,
  secondaryText,
  onClick,
  extraClass = '',
}: {
  primaryText: string;
  secondaryText?: string;
  onClick: Function;
  extraClass?: string;
}) => {
  return (
    <button
      onClick={() => onClick()}
      className={`flex flex-col items-center shadow shadow-black hover:opacity-80 p-4 mx-14 mb-2 mt-2 rounded-lg w-62 h-13 font-sans ${extraClass}`}
    >
      <div className="text-base font-bold tracking-widest">{primaryText}</div>
      <div className="text-sm">{secondaryText}</div>
    </button>
  );
};

export default ActionButton;
