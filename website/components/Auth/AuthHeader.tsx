import Link from "next/link";

export default function AuthHeader() {
  return (
    <div className="flex flex-col items-center mb-10 mt-6 lg:mt-12">
      <Link href="/" className="group flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95 duration-300">
        <div className="flex items-center gap-1 mb-2">
          <span className="font-bold text-4xl tracking-tight text-slate-900">Survival</span>
          <span className="font-light text-4xl tracking-tight text-slate-500">Lens</span>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">
          Zero-Knowledge Protocol
        </p>
      </Link>
    </div>
  );
}
