const SectionCard = ({
  title,
  subtitle,
  children,
  icon,
  accent = "primary",
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-base-100/80 shadow-sm hover:shadow-lg transition-shadow duration-200">
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r from-${accent} to-${accent}/60`}
      />

      <div className="p-5 md:p-6 space-y-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-base-200 group-hover:scale-105 transition-transform duration-200">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
            {subtitle && (
              <p className="text-xs md:text-sm text-base-content/70">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="text-sm md:text-base text-base-content/80">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
