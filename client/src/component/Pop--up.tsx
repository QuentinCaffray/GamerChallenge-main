export default function PopUp(message: string) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none">
      <div
        className="
          pointer-events-none
          rounded-3xl
          bg-background/70
          ring-1 ring-foreground/15
          shadow-[0_20px_60px_rgba(0,0,0,0.65)]
          px-8 py-6
          text-center
          text-xl md:text-2xl
          font-semibold
          animate-fadeInOut
        "
      >
        {message}
      </div>
    </div>
  );
}
