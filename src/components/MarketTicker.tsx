import Image from "next/image";

type Item = {
  key: string;
  iconSrc: string;
  text: string;
};

export function MarketTicker() {
  const items: Item[] = [
    {
      key: "btc",
      iconSrc: "/icons/btc.png",
      text: "BC Up or Down - Hourly (Jan\n24, 2026 14:00 UTC Close",
    },
    {
      key: "eth",
      iconSrc: "/icons/ethereum.png",
      text: "ETH Up or Down - Hourly (Jan\n24, 2026 14:00 UTC Close",
    },
  ];

  // Duplicate items so the marquee loops seamlessly.
  const track = [...items, ...items];

  return (
    <section
      className="relative h-[54px] overflow-hidden"
      aria-label="Market ticker"
    >
      <div className="ticker-track flex h-full w-max items-center gap-[9px]">
        {track.map((it, idx) => (
          <TickerCard key={`${it.key}-${idx}`} iconSrc={it.iconSrc} text={it.text} />
        ))}
      </div>
    </section>
  );
}

function TickerCard({ iconSrc, text }: { iconSrc: string; text: string }) {
  return (
    <div
      className="flex h-[54px] w-[216px] items-center gap-[9px] rounded-[20px] bg-[#080808] px-[13px]"
      style={{ boxShadow: "0px 0px 18px rgba(0,0,0,0.55)" }}
    >
      <div className="relative h-[31px] w-[31px] shrink-0">
        <Image src={iconSrc} alt="" fill className="object-contain" />
      </div>

      <div className="font-ibm text-[13px] font-normal leading-[13px] text-white/50">
        {text.split("\n").map((line, i) => (
          <div key={i} className="truncate">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
