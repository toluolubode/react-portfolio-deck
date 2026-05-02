import { useState } from "react";
import { motion } from "motion/react";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { DownloadSimple as Download } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { FileText } from "@phosphor-icons/react/dist/ssr/FileText";
import { Spinner as Loader2 } from "@phosphor-icons/react/dist/ssr/Spinner";
import { FFS } from "./data";
import type { SlideConfig } from "./deck-builder";

interface ExportModalProps {
    slides: SlideConfig[];
    onClose: () => void;
    onExport: (includeNotes?: boolean) => Promise<void>;
    hiddenSlides: Set<string>;
}

export function ExportModal({ slides, onClose, onExport, hiddenSlides }: ExportModalProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [includeNotes, setIncludeNotes] = useState(false);

    const visibleSlidesCount = slides.filter(s => !hiddenSlides.has(s.id)).length;

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await onExport(includeNotes);
        } finally {
            setIsExporting(false);
            onClose();
        }
    };

    return (
        <motion.div
            className="export-ignore absolute inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div
                className="absolute inset-0"
                style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(12px)" }}
                onClick={() => !isExporting && onClose()}
            />

            <motion.div
                className="relative z-10 w-full max-w-md rounded-[20px] overflow-hidden flex flex-col"
                style={{
                    background: "rgba(20, 20, 22, 0.95)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 24px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
                initial={{ y: 20, scale: 0.95 }}
                animate={{ y: 0, scale: 1 }}
                exit={{ y: 20, scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as any }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-emerald-400" strokeWidth={2} />
                        <h2 className="font-['DM_Sans',sans-serif] text-[16px] font-medium tracking-tight text-white" style={FFS}>
                            Export Presentation
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isExporting}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.05] disabled:opacity-50"
                    >
                        <X className="w-4 h-4 text-white/50" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="font-['Satoshi',sans-serif] text-[14px] leading-relaxed text-white/60 mb-6" style={FFS}>
                        Export your visible slides to a PDF format. Hidden slides will be automatically excluded.
                    </p>

                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer mb-2 border border-white/[0.06]">
                        <input
                            type="checkbox"
                            checked={includeNotes}
                            onChange={(e) => setIncludeNotes(e.target.checked)}
                            disabled={isExporting}
                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/50"
                        />
                        <span className="font-['DM_Sans',sans-serif] text-[14px] text-white/80" style={FFS}>
                            Include presenter notes (adds a notes page after each slide)
                        </span>
                    </label>
                </div>

                {/* Footer */}
                <div className="p-6 pt-0">
                    <button
                        disabled={isExporting || visibleSlidesCount === 0}
                        onClick={handleExport}
                        className="w-full relative flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-[14px] tracking-wide transition-all overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: "linear-gradient(180deg, rgba(52, 211, 153, 0.15) 0%, rgba(52, 211, 153, 0.05) 100%)",
                            border: "1px solid rgba(52, 211, 153, 0.3)",
                            color: "#34D399",
                            ...FFS
                        }}
                    >
                        <div className="absolute inset-0 bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                        {isExporting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Generating PDF...</span>
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                <span>Export {visibleSlidesCount} visible slides</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}
