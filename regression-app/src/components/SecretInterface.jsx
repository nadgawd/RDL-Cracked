import { useState, useEffect, useRef } from 'react';
import { queryOllama, ragFilter } from '../utils/ragLogic';

const SecretInterface = ({ onResponseReceived, isGenerating, setIsGenerating }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    // Open with Cmd+F / Ctrl+F — intercept before browser
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(true);
                // Focus after the bar mounts
                setTimeout(() => inputRef.current?.focus(), 60);
                return;
            }
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                setQuery('');
            }
        };
        window.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!query.trim() || isGenerating) return;
        const trimmed = query.trim();
        setIsOpen(false);
        setQuery('');
        setIsGenerating(true);
        const context = ragFilter(trimmed);
        const answer = await queryOllama(trimmed, context);
        onResponseReceived(trimmed, answer);
        setIsGenerating(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit();
        if (e.key === 'Escape') { setIsOpen(false); setQuery(''); }
    };

    if (!isOpen) return null;

    return (
        <div className="find-bar-backdrop" onClick={() => { setIsOpen(false); setQuery(''); }}>
            <div className="find-bar-container" onClick={(e) => e.stopPropagation()}>
                <input
                    ref={inputRef}
                    className="find-bar-input"
                    placeholder=""
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    spellCheck={false}
                    autoComplete="off"
                />

                {/* Separator */}
                <div className="find-bar-separator" />

                {/* Up chevron (submit on click) */}
                <button
                    className="find-bar-nav-btn"
                    onClick={handleSubmit}
                    disabled={!query.trim() || isGenerating}
                    aria-label="Previous"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </button>

                {/* Down chevron (submit on click) */}
                <button
                    className="find-bar-nav-btn"
                    onClick={handleSubmit}
                    disabled={!query.trim() || isGenerating}
                    aria-label="Next"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>

                {/* Close X */}
                <button
                    className="find-bar-close-btn"
                    onClick={() => { setIsOpen(false); setQuery(''); }}
                    aria-label="Close"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SecretInterface;
