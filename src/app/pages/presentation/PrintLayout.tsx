import { useMemo, useEffect, Fragment } from "react";
import { getPresenterNotes } from "./presenter-notes";
import type { SlideConfig } from "./deck-builder";

export interface PrintLayoutProps {
    slides: SlideConfig[];
    includeNotes?: boolean;
    onPrintComplete: () => void;
    hiddenSlides: Set<string>;
}

export function PrintLayout({ slides, includeNotes = false, onPrintComplete, hiddenSlides }: PrintLayoutProps) {
    const slidesToPrint = useMemo(() => {
        return slides.filter(slide => !hiddenSlides.has(slide.id));
    }, [hiddenSlides, slides]);

    useEffect(() => {
        // Allow time for images to load before popping print dialog
        const timer = setTimeout(() => {
            window.print();
            onPrintComplete();
        }, 1200);

        return () => clearTimeout(timer);
    }, [onPrintComplete]);

    return (
        <div className="print-only bg-[#0A0A0A] w-full min-h-screen z-[999999] absolute inset-0">
            {slidesToPrint.map((slide, i) => {
                const Component = slide.component;
                return (
                    <Fragment key={slide.id}>
                        <div
                            className="relative flex items-center justify-center w-[1920px] h-[1080px] bg-[#0A0A0A] overflow-hidden"
                            style={{
                                pageBreakAfter: includeNotes ? "always" : (i === slidesToPrint.length - 1 ? "auto" : "always"),
                                breakAfter: includeNotes ? "page" : (i === slidesToPrint.length - 1 ? "auto" : "page"),
                                margin: 0,
                            }}
                        >
                            <Component />
                        </div>
                        {includeNotes && (() => {
                            const notes = getPresenterNotes(slide.id);
                            const label = slide.id.charAt(0).toUpperCase() + slide.id.slice(1).replace(/-/g, ' ');
                            return (
                                <div
                                    className="relative w-[1920px] min-h-[1080px] bg-[#0A0A0A] p-16 box-border"
                                    style={{
                                        pageBreakAfter: i === slidesToPrint.length - 1 ? "auto" : "always",
                                        breakAfter: i === slidesToPrint.length - 1 ? "auto" : "page",
                                        margin: 0,
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}
                                >
                                    <div className="text-white/40 text-[11px] uppercase tracking-widest mb-6">Presenter notes</div>
                                    <h2 className="text-white text-2xl font-medium tracking-tight mb-8" style={{ fontFeatureSettings: "'salt', 'ss04'" }}>{label}</h2>
                                    <ul className="space-y-4 list-none">
                                        {notes.map((line, j) => (
                                            <li key={j} className="text-white/80 text-[15px] leading-[1.6] pl-0" style={{ fontFeatureSettings: "'salt', 'ss04'" }}>
                                                {line}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })()}
                    </Fragment>
                );
            })}
        </div>
    );
}
