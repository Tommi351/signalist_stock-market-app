"use client";

import { useDebounce } from '@/hooks/useDebounce';
import {
    addToWatchlist,
    removeFromWatchlist,
} from '@/lib/actions/watchlist.actions';
import { Star, Trash2 } from 'lucide-react';
import React, { useMemo, useState } from "react";
import { toast } from 'sonner';


const WatchlistButton = ({
                             symbol,
                             company,
                             isInWatchlist,
                             showTrashIcon = false,
                             type = "button",
                             onWatchlistChange,
                         }: WatchlistButtonProps) => {
    const [added, setAdded] = useState<boolean>(!!isInWatchlist);

    const label = useMemo(() => {
        if (type === "icon") return added ? "" : "";
        return added ? "Remove from Watchlist" : "Add to Watchlist";
    }, [added, type]);

    // Handle adding/removing stocks from watchlist
    const toggleWatchList = async () => {
        const result = added ? await removeFromWatchlist(symbol) : await addToWatchlist(symbol, company);

        if (result.success) {
            toast.success(added ? 'Added to Watchlist' : 'Removed From Watchlist', {
                description: `${company} ${added ?
                    'removed from' : 'added to'
                } your Watchlist`,
            });

            // Notify parent component of watchlist change for state synchronization
            onWatchlistChange?.(symbol, !added);
        }
    };

    // Debounce the toggle function to prevent rapid API calls (300ms delay)
    const debouncedToggle = useDebounce(toggleWatchList, 300);


    const handleClick = (e: React.MouseEvent) => {
        // Prevent event bubbling and default behavior
        e.stopPropagation();
        e.preventDefault();

        setAdded(!added);
        debouncedToggle();
    };

    if (type === "icon") {
        return (
            <button
                title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
                aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
                className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
                onClick={handleClick}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={added ? "#FACC15" : "none"}
                    stroke="#FACC15"
                    strokeWidth="1.5"
                    className="watchlist-star"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
                    />
                </svg>
                <Star fill={added ? 'currentColor' : 'none'} />
            </button>
        );
    }

    return (
        <button className={`watchlist-btn ${added ? "watchlist-remove" : ""}`} onClick={handleClick}>
            {showTrashIcon && added ? <Trash2 /> : null}
            <span>{label}</span>
        </button>
    );
};

export default WatchlistButton;