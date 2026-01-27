import { IconSearch, IconExpand } from "./icons";

export function CategoryRow() {
  // kept for backward compatibility
  return <CategoryRowBase />;
}

export function CategoryRowBase({
  onSearch,
  hideSearch,
}: {
  onSearch?: () => void;
  hideSearch?: boolean;
}) {
  return (
    <section
      className={
        hideSearch
          ? "grid h-[37px] w-full grid-cols-[1fr_36.899px] items-center gap-[10px] px-[17px]"
          : "grid h-[37px] w-full grid-cols-[48px_1fr_36.899px] items-center gap-[10px] px-[17px]"
      }
      aria-label="Categories"
    >
      {/* Search button: 48x37 */}
      {hideSearch ? null : (
        <button
          type="button"
          className="grid h-[37px] w-[48px] place-items-center rounded-[40px] bg-white/0 ring-1 ring-white/10"
          aria-label="Search"
          onClick={onSearch}
        >
          <IconSearch className="h-[18px] w-[18px] text-white/70" />
        </button>
      )}

      {/* Middle buttons */}
      <div
        className={
          hideSearch
            ? "flex items-center justify-start gap-[5px]"
            : "flex items-center justify-center gap-[5px]"
        }
      >
        {/* Trending: 91.749 x 36.899 */}
        <button
          type="button"
          className="flex h-[36.899px] w-[91.749px] items-center justify-center gap-[6px] rounded-[20.5px] bg-[#A10FCA]"
        >
          <span className="text-[15px] leading-none">🔥</span>
          <span className="font-ibm text-[15px] font-normal leading-[15px] text-white">
            Trending
          </span>
        </button>

        {/* Sports: 66.817 x 36.899 */}
        <button
          type="button"
          className="flex h-[36.899px] w-[66.817px] items-center justify-center rounded-[20.5px] bg-[#141414]"
        >
          <span className="font-ibm text-[15px] font-normal leading-[15px] text-white">
            Sports
          </span>
        </button>

        {/* Pre-TGE: 79.782 x 36.899 */}
        <button
          type="button"
          className="flex h-[36.899px] w-[79.782px] items-center justify-center rounded-[20.5px] bg-[#141414]"
        >
          <span className="font-ibm text-[15px] font-normal leading-[15px] text-white">
            Pre-TGE
          </span>
        </button>
      </div>

      {/* Expand: 36.899 x 36.899 */}
      <button
        type="button"
        className="grid h-[36.899px] w-[36.899px] place-items-center rounded-[20.5px] bg-[#141414]"
        aria-label="More"
      >
        <IconExpand className="h-[17.951px] w-[13.962px] text-white" />
      </button>
    </section>
  );
}
