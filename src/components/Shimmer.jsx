const Shimmer = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-base-300 via-base-200 to-base-300 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
    </div>
  );
};

export default Shimmer;


