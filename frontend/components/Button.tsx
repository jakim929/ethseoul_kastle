const Button = ({
  children,
  onClick,
  extraClass = '',
}: {
  children: React.ReactNode;
  onClick?: Function;
  extraClass?: string;
}) => {
  return (
    <button
      onClick={() => onClick && onClick()}
      className={`p-4 rounded-md border-black border ${extraClass}`}
    >
      {children}
    </button>
  );
};

export default Button;
