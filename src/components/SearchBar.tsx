import { IconSearch } from "./icons";

export function SearchBar({
  placeholder = "Search Markets",
}: {
  placeholder?: string;
}) {
  return (
    <label className="relative flex h-[46px] w-full items-center rounded-[40px] bg-[#1a1a1a] px-[15px]">
      <IconSearch className="h-[18px] w-[18px] text-white/50" />
      <input
        className="ml-[7px] h-full w-full bg-transparent font-ibm text-[15px] font-normal leading-[15px] text-white/80 placeholder:text-white/50 focus:outline-none"
        placeholder={placeholder}
        autoFocus
      />
    </label>
  );
}
