import React from 'react'
import {getWatchlistWithData, searchStocks} from "@/lib/actions/finnhub.actions";
import SearchCommand from "@/components/SearchCommand";
import {Star} from "lucide-react";
import {WatchlistTable} from "@/components/WatchListTable";
import {Button} from "@/components/ui/button";


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
        <div>
        <section className="watchlist">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="watchlist-title">WatchList</h2>
                    <SearchCommand initialStocks={initialStocks} />
                </div>
                <WatchlistTable watchlist={watchlist} />
            </div>
        </section>

            <section className="watchlist-alerts">
              <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between">
                     <h2 className="alert-title">Alert</h2>
                     <Button className="add-alert">Add Alert</Button>
                 </div>
              </div>
            </section>
        </div>
    )
}
export default WatchList
