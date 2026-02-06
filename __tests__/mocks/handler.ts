// Example: mocking Finnhub API
import {http, HttpResponse} from "msw";

export const handlers = [
    http.get('https://finnhub.io/api/v1/quote', () => {
        return HttpResponse.json({
            c: 150, // current price
            dp: 0.5 // change percent
        }, {status: 200})
      }),
    http.get('https://api.example.com/user', () => {
        return HttpResponse.json({
            id: 'abc-123',
            firstName: 'John',
            lastName: 'Maverick',
        })
    }),
    // Add other API endpoints you want to mock
];
