import React from 'react';
import {getWatchlistWithData, searchStocks} from "@/lib/actions/finnhub.actions";
import SearchCommand from "@/components/SearchCommand";
import {Star} from "lucide-react";
import {WatchlistTable} from "@/components/watchlist/WatchListTable";
import {AlertCommand} from "@/components/alerts/AlertCommand";

const WatchList = async () => {
    const watchlist = await getWatchlistWithData();
    const initialStocks = await searchStocks();

    // Empty state
    if (watchlist.length === 0) {
        return (
            <section className="flex watchlist-empty-container">
               <div className="flex watchlist-empty">
                 <Star className="watchlist-star" />
                   <h2 className="empty-title">Your Stocks are empty</h2>
                   <p className="empty-description">
                       Search for stocks and then click star to add
                   </p>
               </div>
                <SearchCommand initialStocks={initialStocks} />
            </section>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full min-h-screen">
        <section className="lg:col-span-3">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="watchlist-title">WatchList</h2>
                    <SearchCommand initialStocks={initialStocks} />
                </div>
                <WatchlistTable watchlist={watchlist} />
            </div>
        </section>

            <aside className="watchlist-alerts">
                <AlertCommand />
            </aside>
        </div>
    )
}
export default WatchList
