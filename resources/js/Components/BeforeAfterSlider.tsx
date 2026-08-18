import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Pair {
    before: string | null; // null = show emoji placeholder
    after: string;
    emoji?: string; // emoji shown in the before placeholder, defaults to 🐶
}

export function BeforeAfterSlider({ pairs }: { pairs: Pair[] }) {
    const [pairIndex, setPairIndex] = useState(0);
    const [position, setPosition] = useState(0);
    const [isFlashing, setIsFlashing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const draggingRef = useRef(false);
    const transitioningRef = useRef(false);

    const positionFromX = useCallback((clientX: number) => {
        if (!containerRef.current) return 0;
        const rect = containerRef.current.getBoundingClientRect();
        return Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    }, []);

    // Global drag tracking
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!draggingRef.current) return;
            setPosition(positionFromX(e.clientX));
        };
        const onTouchMove = (e: TouchEvent) => {
            if (!draggingRef.current) return;
            e.preventDefault(); // block browser swipe-to-navigate while dragging
            setPosition(positionFromX(e.touches[0].clientX));
        };
        const onUp = () => {
            draggingRef.current = false;
        };

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onUp);
        };
    }, [positionFromX]);

    // Flash + advance to next pair at 98%
    useEffect(() => {
        if (position >= 98 && !transitioningRef.current) {
            transitioningRef.current = true;
            setIsFlashing(true);
            const t = setTimeout(() => {
                setPairIndex((i) => (i + 1) % pairs.length);
                setPosition(0);
                setIsFlashing(false);
                transitioningRef.current = false;
            }, 520);
            return () => clearTimeout(t);
        }
    }, [position, pairs.length]);

    const pair = pairs[pairIndex];

    return (
        <div className="select-none">
            {/* Pair dot indicators */}
            <div className="mb-5 flex justify-center gap-2.5">
                {pairs.map((_, i) => (
                    <button
                        key={i}
                        aria-label={`Transformation ${i + 1}`}
                        onClick={() => {
                            setPairIndex(i);
                            setPosition(0);
                        }}
                        className={[
                            "h-2 rounded-full transition-all duration-300",
                            i === pairIndex
                                ? "w-6 bg-brand-400"
                                : "w-2 bg-gray-300 hover:bg-gray-400",
                        ].join(" ")}
                    />
                ))}
            </div>

            {/* Slider container */}
            <div
                ref={containerRef}
                className="relative h-80 sm:h-[26rem] overflow-hidden rounded-card cursor-ew-resize"
                onClick={(e) => {
                    if (!draggingRef.current) {
                        setPosition(positionFromX(e.clientX));
                    }
                }}
            >
                {/* Before image or emoji placeholder */}
                {pair.before ? (
                    <img
                        src={pair.before}
                        alt="Before grooming"
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-100 via-purple-100 to-blue-100">
                        <span className="text-8xl select-none" role="img" aria-label="dog">
                            {pair.emoji ?? "🐶"}
                        </span>
                        <span className="rounded-full bg-white/70 px-4 py-1.5 text-sm font-display font-extrabold text-brand-500 backdrop-blur-sm">
                            Before the magic…
                        </span>
                    </div>
                )}

                {/* After image — clipped to slider position */}
                <div
                    className="absolute inset-0 will-change-[clip-path]"
                    style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
                >
                    <img
                        src={pair.after}
                        alt="After grooming"
                        draggable={false}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Flash overlay */}
                <AnimatePresence>
                    {isFlashing && (
                        <motion.div
                            key="flash"
                            className="absolute inset-0 z-30 bg-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 0.52, times: [0, 0.2, 0.65, 1] }}
                        />
                    )}
                </AnimatePresence>

                {/* Before / After labels */}
                <span className="absolute left-3 top-3 z-20 rounded-full bg-black/40 px-3 py-1 text-xs font-display font-extrabold text-white backdrop-blur-sm">
                    Before
                </span>
                <span className="absolute right-3 top-3 z-20 rounded-full bg-brand-500/80 px-3 py-1 text-xs font-display font-extrabold text-white backdrop-blur-sm">
                    After ✨
                </span>

                {/* Drag handle */}
                <div
                    className="absolute inset-y-0 z-20 flex items-center"
                    style={{ left: `${position}%`, transform: "translateX(-50%)" }}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        draggingRef.current = true;
                    }}
                    onTouchStart={(e) => {
                        e.preventDefault();
                        draggingRef.current = true;
                    }}
                >
                    {/* Dividing line */}
                    <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/70 shadow" />
                    {/* Grip circle — three vertical bars, no navigation arrows */}
                    <div className="relative flex size-11 cursor-ew-resize items-center justify-center gap-0.5 rounded-full bg-gradient-to-br from-brand-300 to-brand-500 shadow-xl ring-2 ring-white">
                        <span className="h-4 w-0.5 rounded-full bg-white/80" />
                        <span className="h-4 w-0.5 rounded-full bg-white/80" />
                        <span className="h-4 w-0.5 rounded-full bg-white/80" />
                    </div>
                </div>

                {/* Initial hint */}
                <AnimatePresence>
                    {position === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.3 }}
                            className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center"
                        >
                            <p className="rounded-full bg-black/30 px-5 py-2 text-sm font-display font-extrabold text-white backdrop-blur-sm">
                                Drag to reveal the magic ✨
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
