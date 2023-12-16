interface IFrame {
  children: React.ReactNode;
}

const FrameWrapper = ({ children }: IFrame) => {
  return <div className="w-fit p-4 shadow-md rounded-md">{children}</div>;
};

export default FrameWrapper;
