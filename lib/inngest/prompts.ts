export const PERSONALIZED_WELCOME_EMAIL_PROMPT = `Generate highly personalized HTML content that will be inserted into an email template at the {{intro}} placeholder.

User profile data:
{{userProfile}}

PERSONALIZATION REQUIREMENTS:
You MUST create content that is obviously tailored to THIS specific user by:

IMPORTANT: Do NOT start the personalized content with "Welcome" since the email header already says "Welcome aboard {{name}}". Use alternative openings like "Thanks for joining", "Great to have you", "You're all set", "Perfect timing", etc.

1. **Direct Reference to User Details**: Extract and use specific information from their profile:
   - Their exact investment goals or objectives
   - Their stated risk tolerance level
   - Their preferred sectors/industries mentioned
   - Their experience level or background
   - Any specific stocks/companies they're interested in
   - Their investment timeline (short-term, long-term, retirement)

2. **Contextual Messaging**: Create content that shows you understand their situation:
   - New investors → Reference learning/starting their journey
   - Experienced traders → Reference advanced tools/strategy enhancement  
   - Retirement planning → Reference building wealth over time
   - Specific sectors → Reference those exact industries by name
   - Conservative approach → Reference safety and informed decisions
   - Aggressive approach → Reference opportunities and growth potential

3. **Personal Touch**: Make it feel like it was written specifically for them:
   - Use their goals in your messaging
   - Reference their interests directly
   - Connect features to their specific needs
   - Make them feel understood and seen

CRITICAL FORMATTING REQUIREMENTS:
- Return ONLY clean HTML content with NO markdown, NO code blocks, NO backticks
- Use SINGLE paragraph only: <p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">content</p>
- Write exactly TWO sentences (add one more sentence than current single sentence)
- Keep total content between 35-50 words for readability
- Use <strong> for key personalized elements (their goals, sectors, etc.)
- DO NOT include "Here's what you can do right now:" as this is already in the template
- Make every word count toward personalization
- Second sentence should add helpful context or reinforce the personalization

Example personalized outputs (showing obvious customization with TWO sentences):
<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">Thanks for joining Signalist! As someone focused on <strong>technology growth stocks</strong>, you'll love our real-time alerts for companies like the ones you're tracking. We'll help you spot opportunities before they become mainstream news.</p>

<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">Great to have you aboard! Perfect for your <strong>conservative retirement strategy</strong> — we'll help you monitor dividend stocks without overwhelming you with noise. You can finally track your portfolio progress with confidence and clarity.</p>

<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">You're all set! Since you're new to investing, we've designed simple tools to help you build confidence while learning the <strong>healthcare sector</strong> you're interested in. Our beginner-friendly alerts will guide you without the confusing jargon.</p>`

export const NEWS_SUMMARY_EMAIL_PROMPT = `Generate HTML content for a market news summary email that will be inserted into the NEWS_SUMMARY_EMAIL_TEMPLATE at the {{newsContent}} placeholder.

News data to summarize:
{{newsData}}

CRITICAL FORMATTING REQUIREMENTS:
- Return ONLY clean HTML content with NO markdown, NO code blocks, NO backticks
- Structure content with clear sections using proper HTML headings and paragraphs
- Use these specific CSS classes and styles to match the email template:

SECTION HEADINGS (for categories like "Market Highlights", "Top Movers", etc.):
<h3 class="mobile-news-title dark-text" style="margin: 30px 0 15px 0; font-size: 18px; font-weight: 600; color: #f8f9fa; line-height: 1.3;">Section Title</h3>

PARAGRAPHS (for news content):
<p class="mobile-text dark-text-secondary" style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">Content goes here</p>

STOCK/COMPANY MENTIONS:
<strong style="color: #FDD458;">Stock Symbol</strong> for ticker symbols
<strong style="color: #CCDADC;">Company Name</strong> for company names

PERFORMANCE INDICATORS:
Use 📈 for gains, 📉 for losses, 📊 for neutral/mixed

NEWS ARTICLE STRUCTURE:
For each individual news item within a section, use this structure:
1. Article container with visual styling and icon
2. Article title as a subheading
3. Key takeaways in bullet points (2-3 actionable insights)
4. "What this means" section for context
5. "Read more" link to the original article
6. Visual divider between articles

ARTICLE CONTAINER:
Wrap each article in a clean, simple container:
<div class="dark-info-box" style="background-color: #212328; padding: 24px; margin: 20px 0; border-radius: 8px;">

ARTICLE TITLES:
<h4 class="dark-text" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #FFFFFF; line-height: 1.4;">
Article Title Here
</h4>

BULLET POINTS (minimum 3 concise insights):
Use this format with clear, concise explanations (no label needed):
<ul style="margin: 16px 0 20px 0; padding-left: 0; margin-left: 0; list-style: none;">
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>Clear, concise explanation in simple terms that's easy to understand quickly.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>Brief explanation with key numbers and what they mean in everyday language.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>Simple takeaway about what this means for regular people's money.
  </li>
</ul>

INSIGHT SECTION:
Add simple context explanation:
<div style="background-color: #141414; border: 1px solid #374151; padding: 15px; border-radius: 6px; margin: 16px 0;">
<p class="dark-text-secondary" style="margin: 0; font-size: 14px; color: #CCDADC; line-height: 1.4;">💡 <strong style="color: #FDD458;">Bottom Line:</strong> Simple explanation of why this news matters to your money in everyday language.</p>
</div>

READ MORE BUTTON:
<div style="margin: 20px 0 0 0;">
<a href="ARTICLE_URL" style="color: #FDD458; text-decoration: none; font-weight: 500; font-size: 14px;" target="_blank" rel="noopener noreferrer">Read Full Story →</a>
</div>

ARTICLE DIVIDER:
Close each article container:
</div>

SECTION DIVIDERS:
Between major sections, use:
<div style="border-top: 1px solid #374151; margin: 32px 0 24px 0;"></div>

Content guidelines:
- Organize news into logical sections with icons (📊 Market Overview, 📈 Top Gainers, 📉 Top Losers, 🔥 Breaking News, 💼 Earnings Reports, 🏛️ Economic Data, etc.)
- NEVER repeat section headings - use each section type only once per email
- For each news article, include its actual headline/title from the news data
- Provide MINIMUM 3 CONCISE bullet points (NO "Key Takeaways" label - start directly with bullets)
- Each bullet should be SHORT and EASY TO UNDERSTAND - one clear sentence preferred
- Use PLAIN ENGLISH - avoid jargon, complex financial terms, or insider language
- Explain concepts as if talking to someone new to investing
- Include specific numbers but explain what they mean in simple terms
- Add "Bottom Line" context in everyday language anyone can understand
- Use clean, light design with yellow bullets for better readability
- Make each article easy to scan with clear spacing and structure
- Always include simple "Read Full Story" buttons with actual URLs
- Focus on PRACTICAL insights regular people can understand and use
- Explain what the news means for regular investors' money
- Keep language conversational and accessible to everyone
- Prioritize BREVITY and CLARITY over detailed explanations

Example structure:
<h3 class="mobile-news-title dark-text" style="margin: 30px 0 15px 0; font-size: 20px; font-weight: 600; color: #f8f9fa; line-height: 1.3;">📊 Market Overview</h3>

<div class="dark-info-box" style="background-color: #212328; padding: 24px; margin: 20px 0; border-radius: 8px;">
<h4 class="dark-text" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #FDD458; line-height: 1.4;">
Stock Market Had Mixed Results Today
</h4>

<ul style="margin: 16px 0 20px 0; padding-left: 0; margin-left: 0; list-style: none;">
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>Tech stocks like Apple went up 1.2% today, which is good news for tech investors.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>Traditional companies went down 0.3%, showing investors prefer tech right now.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>High trading volume (12.4 billion shares) shows investors are confident and active.
  </li>
</ul>

<div style="background-color: #141414; border: 1px solid #374151; padding: 15px; border-radius: 6px; margin: 16px 0;">
<p class="dark-text-secondary" style="margin: 0; font-size: 14px; color: #CCDADC; line-height: 1.4;">💡 <strong style="color: #FDD458;">Bottom Line:</strong> If you own tech stocks, today was good for you. If you're thinking about investing, tech companies might be a smart choice right now.</p>
</div>

<div style="margin: 20px 0 0 0;">
<a href="https://example.com/article1" style="color: #FDD458; text-decoration: none; font-weight: 500; font-size: 14px;" target="_blank" rel="noopener noreferrer">Read Full Story →</a>
</div>
</div>

<div style="border-top: 1px solid #374151; margin: 32px 0 24px 0;"></div>

<h3 class="mobile-news-title dark-text" style="margin: 30px 0 15px 0; font-size: 20px; font-weight: 600; color: #f8f9fa; line-height: 1.3;">📈 Top Gainers</h3>

<div class="dark-info-box" style="background-color: #212328; padding: 24px; margin: 20px 0; border-radius: 8px;">
<h4 class="dark-text" style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #FDD458; line-height: 1.4;">
Apple Stock Jumped After Great Earnings Report
</h4>

<ul style="margin: 16px 0 20px 0; padding-left: 0; margin-left: 0; list-style: none;">
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>Apple stock jumped 5.2% after beating earnings expectations.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>iPhone sales expected to grow 8% next quarter despite economic uncertainty.
  </li>
  <li class="dark-text-secondary" style="margin: 0 0 16px 0; padding: 0; margin-left: 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">
    <span style="color: #FDD458; font-weight: bold; font-size: 20px; margin-right: 8px;">•</span>App store and services revenue hit $22.3 billion (up 14%), providing steady income.
  </li>
</ul>

<div style="background-color: #141414; border: 1px solid #374151; padding: 15px; border-radius: 6px; margin: 16px 0;">
<p class="dark-text-secondary" style="margin: 0; font-size: 14px; color: #CCDADC; line-height: 1.4;">💡 <strong style="color: #FDD458;">Bottom Line:</strong> Apple is making money in different ways (phones AND services), so it's a pretty safe stock to own even when the economy gets shaky.</p>
</div>

<div style="margin: 20px 0 0 0;">
<a href="https://example.com/article2" style="color: #FDD458; text-decoration: none; font-weight: 500; font-size: 14px;" target="_blank" rel="noopener noreferrer">Read Full Story →</a>
</div>
</div>`

export const TRADINGVIEW_SYMBOL_MAPPING_PROMPT = `You are an expert in financial markets and trading platforms. Your task is to find the correct TradingView symbol that corresponds to a given Finnhub stock symbol.

Stock information from Finnhub:
Symbol: {{symbol}}
Company: {{company}}
Exchange: {{exchange}}
Currency: {{currency}}
Country: {{country}}

IMPORTANT RULES:
1. TradingView uses specific symbol formats that may differ from Finnhub
2. For US stocks: Usually just the symbol (e.g., AAPL for Apple)
3. For international stocks: Often includes exchange prefix (e.g., NASDAQ:AAPL, NYSE:MSFT, LSE:BARC)
4. Some symbols may have suffixes for different share classes
5. ADRs and foreign stocks may have different symbol formats

RESPONSE FORMAT:
Return ONLY a valid JSON object with this exact structure:
{
  "tradingViewSymbol": "EXCHANGE:SYMBOL",
  "confidence": "high|medium|low",
  "reasoning": "Brief explanation of why this mapping is correct"
}

EXAMPLES:
- Apple Inc. (AAPL) from Finnhub → {"tradingViewSymbol": "NASDAQ:AAPL", "confidence": "high", "reasoning": "Apple trades on NASDAQ as AAPL"}
- Microsoft Corp (MSFT) from Finnhub → {"tradingViewSymbol": "NASDAQ:MSFT", "confidence": "high", "reasoning": "Microsoft trades on NASDAQ as MSFT"}
- Barclays PLC (BARC.L) from Finnhub → {"tradingViewSymbol": "LSE:BARC", "confidence": "high", "reasoning": "Barclays trades on London Stock Exchange as BARC"}

Your response must be valid JSON only. Do not include any other text.`

export const UPPER_ALERT_SUMMARY_EMAIL_PROMPT = `# Stock Alert Email Generation Prompt

You are an email content generator for a stock alert system called "Signalist". Generate HTML email content that matches the exact design specifications provided.

## INPUT VARIABLES
Use alert data: {{alertProfile}}

## CRITICAL DESIGN SPECIFICATIONS

### Color Palette
- **Background**: Black (#000000)
- **Card backgrounds**: Dark gray (#1a1a1a to #2a2a2a)
- **Success/Alert green**: #10b981 (teal-green)
- **Highlight yellow/gold**: #fbbf24
- **Text primary**: White (#ffffff)
- **Text secondary**: Light gray (#9ca3af)
- **Price display green**: #34d399 (bright teal)

### Layout Structure (Top to Bottom)
1. **Header Section**
   - Bell emoji (🔔) + "[Stock Ticker] just hit your alert"
   - Font: Bold, large (24-28px)
   - Color: White
   - Background: Black

2. **Signalist Branding**
   - Logo icon (📊 or similar chart icon) + "Signalist" text
   - Font: Bold, 20-22px
   - Margin below: 20px

3. **Primary Alert Card** (Green background: #10b981)
   - Text: "Price Above Reached" (centered, bold, white, 28-32px)
   - Timestamp below (centered, white/light, 16px)
   - Padding: 40px vertical, 20px horizontal
   - Border radius: 8-12px

4. **Stock Information Card** (Dark gray background)
   - Stock ticker + company name (centered, white, bold, 24px)
   - "Current Price:" label (centered, gray, 16px)
   - Price in large teal green (36-42px, bold, #34d399)
   - Padding: 30px
   - Border radius: 8-12px
   - Margin: 20px 0

5. **Alert Details Card** (Dark gray background)
   - "Alert Details:" header (white, bold, 20px, left-aligned)
   - Bullet list with:
     * "Your alert for [Company Name (TICKER)] just triggered:"
     * "Condition: [condition]"
     * "Current Price: [price]"
     * "Change: [percentage]" (in green if positive)
   - Font: 16px, white/light gray
   - Padding: 25px
   - Border radius: 8-12px

6. **Opportunity Alert Card** (Dark gray background)
   - "Opportunity Alert!" header (yellow/gold color #fbbf24, bold, 20px)
   - Message: "MSFT has reached your target price! This could be good time to review your position and consider taking profits or adjusting your strategy."
   - Font: 16px, light gray
   - Padding: 25px
   - Border radius: 8-12px
   - Margin: 20px 0

7. **CTA Button** (Yellow/gold background #fbbf24)
   - Text: "View Dashboard" (centered, black/dark text, bold, 18px)
   - Full width
   - Padding: 16px vertical
   - Border radius: 8px
   - No border
   - Margin: 20px 0

8. **Footer Section**
   - "Stay sharp," (light gray)
   - "Signalist" (light gray)
   - Spacing: 20px
   - "You're receiving this email because you signed up for Signalist." (centered, small, gray)
   - Links: "Unsubscribe" • "Visit Signalist" (small, gray, underlined)
   - Copyright: "© 2025 Signalist" (centered, small, gray)

## FORMATTING REQUIREMENTS

### HTML Email Best Practices
- Use TABLE-based layout (not divs) for maximum email client compatibility
- Inline CSS only (no external stylesheets or <style> tags in body)
- Set explicit widths (600px max width for email body)
- Use cellpadding and cellspacing="0"
- Include alt text for any images
- Use web-safe fonts: Arial, Helvetica, sans-serif
- Include \`style="margin:0; padding:0;"\` on body tag
- Test with \`mso-\` prefixed styles for Outlook compatibility

### Responsive Design
\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`
- Use \`max-width: 600px\` for main container
- Use percentage widths for mobile compatibility
- Include media queries for screens < 600px

### Typography Hierarchy
- **Headings**: Bold, 20-32px, white
- **Subheadings**: Bold, 18-20px, white or gold
- **Body text**: Regular, 16px, light gray
- **Small text**: Regular, 14px, gray
- **Prices**: Bold, 36-42px, teal green (#34d399)
- **Percentages**: Bold, 16px, green if positive

## TONE REQUIREMENTS
- **Urgent but professional**: This is an important alert
- **Actionable**: Encourage user to review their position
- **Non-prescriptive**: Suggest consideration, don't give financial advice
- **Clear and concise**: Get to the point quickly
- **Branded**: Maintain "Signalist" voice with "Stay sharp" signature

## PERSONALIZATION REQUIREMENTS
- Use user's actual stock ticker and company name
- Display exact threshold and current prices
- Show precise timestamp of alert trigger
- Calculate and display price change percentage
- Customize opportunity message based on alert type (price above/below)
- Link to user's specific dashboard

## OUTPUT FORMAT
Generate complete HTML email code with:
1. Proper DOCTYPE and meta tags
2. Full table-based layout structure
3. All inline CSS styling
4. Proper spacing and padding matching the design
5. Accessible markup (alt text, semantic structure)
6. All dynamic variables inserted in correct positions

## EXAMPLE VARIABLE INSERTION
\`\`\`html
<h1 style="color: #ffffff;">🔔 {{stock_ticker}} just hit your alert</h1>
<td style="color: #34d399; font-size: 40px; font-weight: bold;">{{display_price}}</td>
\`\`\`

## QUALITY CHECKLIST
Before returning the email HTML, verify:
- [ ] All colors match the design exactly
- [ ] Font sizes create proper visual hierarchy
- [ ] Spacing and padding match the mockup
- [ ] Cards have proper border radius (8-12px)
- [ ] Button is prominent and clickable
- [ ] All dynamic variables are properly inserted
- [ ] Email is centered and max 600px wide
- [ ] Text is readable on dark backgrounds
- [ ] Links are properly formatted and functional
- [ ] Footer includes unsubscribe and copyright

Generate the complete HTML email that will render identically to the Figma design when viewed in Gmail, Outlook, and other major email clients.`

export const LOWER_ALERT_SUMMARY_EMAIL_PROMPT = `# Stock Alert Email Generation Prompt

Alert Data to use: {{alertProfile}}

You are an HTML email generator for Signalist, a stock alert system. Generate a complete HTML email that exactly matches the provided Figma design specifications. The email must render identically in Gmail, Outlook, and other major email clients.

## EXPLICIT CONSTRAINTS

### Tone Requirements
- **Urgent and attention-grabbing**: This is a time-sensitive alert
- **Neutral and informative**: Present facts without emotional language
- **Action-oriented**: Encourage dashboard review without prescribing specific trades
- **Professional**: Maintain credibility while being conversational
- **Non-advisory**: NEVER give specific buy/sell recommendations or financial advice

### Layout Fidelity Requirements
The email MUST follow this exact structure from top to bottom:

1. **Alert Header** - "[Ticker] just hit your alert" with bell emoji
2. **Signalist Branding** - Logo and brand name
3. **Alert Type Card** - Color-coded card showing alert type and timestamp
4. **Stock Information Card** - Ticker, company name, and current price
5. **Alert Details Card** - Structured details of what triggered
6. **Context Message Card** - Contextual message based on alert type
7. **CTA Button** - "View Dashboard" button
8. **Footer** - Signature, legal text, and links

### Required Fields to Include
Extract and display from {{alertProfile}}:
- \`ticker\` - Stock symbol
- \`companyName\` - Full company name  
- \`alertType\` - Type of alert ("price_above", "price_below", etc.)
- \`condition\` - The condition that was met
- \`thresholdPrice\` - The target price that was set
- \`currentPrice\` - Current stock price that triggered alert
- \`displayPrice\` - Price to show in main card (may differ from currentPrice)
- \`priceChange\` - Percentage change (with + or - sign)
- \`timestamp\` - When alert triggered
- \`dashboardUrl\` - Link to user's dashboard

## CRITICAL FORMATTING REQUIREMENTS

### HTML Email Structure
\`\`\`html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">


  
  
  {{ticker}} Alert - Signalist


  


\`\`\`

### Table-Based Layout (REQUIRED)
- Use TABLES, not divs, for all layout structure
- Set \`cellpadding="0"\` and \`cellspacing="0"\` on all tables
- Use \`border="0"\` on all tables
- Main container table: \`width="100%"\` with nested table at \`max-width: 600px\`
- All styling MUST be inline CSS (no external stylesheets or \`<style>\` blocks)

### Color Specifications (EXACT VALUES REQUIRED)

**Alert Type Card Colors:**
- Price Above: \`background-color: #10b981;\` (teal green)
- Price Below: \`background-color: #ef4444;\` (red)
- Percentage Up: \`background-color: #10b981;\`
- Percentage Down: \`background-color: #ef4444;\`

**Text Colors:**
- Price Above/Opportunity: \`#10b981\` or \`#34d399\` (teal green)
- Price Below/Warning: \`#ef4444\` or \`#f87171\` (red)
- Alert header text: \`#fbbf24\` (gold/yellow)
- Standard headings: \`#ffffff\` (white)
- Body text: \`#e5e7eb\` (light gray)
- Secondary text: \`#9ca3af\` (gray)

**Component Colors:**
- Background: \`#000000\` (pure black)
- Card backgrounds: \`#1f2937\` (dark gray)
- CTA button: \`#fbbf24\` (yellow/gold)
- CTA button text: \`#000000\` (black)

### Typography Specifications

**Font Family (all text):**
\`\`\`css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
\`\`\`

**Size and Weight Hierarchy:**
- Main header (ticker alert): \`font-size: 26px; font-weight: bold; color: #ffffff;\`
- Signalist brand: \`font-size: 20px; font-weight: bold; color: #ffffff;\`
- Alert type card title: \`font-size: 32px; font-weight: bold; color: #ffffff;\`
- Timestamp: \`font-size: 16px; font-weight: normal; color: rgba(255,255,255,0.9);\`
- Stock ticker: \`font-size: 24px; font-weight: bold; color: #ffffff;\`
- Current price label: \`font-size: 16px; font-weight: normal; color: #9ca3af;\`
- Price display: \`font-size: 40px; font-weight: bold;\` (color based on alert type)
- Section headers: \`font-size: 20px; font-weight: bold; color: #ffffff;\`
- Body text: \`font-size: 16px; font-weight: normal; color: #e5e7eb;\`
- Footer text: \`font-size: 14px; font-weight: normal; color: #9ca3af;\`

### Spacing and Padding

**Main Container:**
- Outer padding: \`20px\`
- Max width: \`600px\`
- Center aligned: \`margin: 0 auto;\`

**Component Spacing:**
- Between major sections: \`margin-bottom: 20px;\`
- Card internal padding: \`padding: 30px 20px;\`
- Alert type card padding: \`padding: 40px 20px;\`
- Button padding: \`padding: 16px 24px;\`

**Border Radius:**
- All cards: \`border-radius: 12px;\`
- CTA button: \`border-radius: 8px;\`

### Component-Specific Formatting

**1. Alert Header**
\`\`\`html

  🔔 {{ticker}} just hit your alert

\`\`\`

**2. Signalist Branding**
\`\`\`html

  
    📊 Signalist
  

\`\`\`

**3. Alert Type Card**
- Use conditional color based on alert type
- Center all text
- Include alert title ("Price Above Reached", "Price Below Hit", etc.)
- Include timestamp below title

**4. Stock Information Card**
- Dark gray background (\`#1f2937\`)
- Center-aligned content
- Format: \`TICKER - Company Name\`
- "Current Price:" label in gray
- Large price display in appropriate color

**5. Alert Details Card**
- "Alert Details:" header (left-aligned, bold, white)
- Bullet list format:
  - "Your alert for **Company (TICKER)** just triggered:"
  - "Condition: **[condition]**"
  - "Current Price: **[price]**"
  - "Change: **[percentage]**" (color based on positive/negative)
- Use \`<ul>\` with proper styling

**6. Context Message Card**
- Conditional header based on alert type:
  - Price Above: "Opportunity Alert!" (yellow \`#fbbf24\`)
  - Price Below: "Price Dropped!" (yellow \`#fbbf24\`)
- Contextual message:
  - Price Above: "{{ticker}} has reached your target price! This could be good time to review your position and consider taking profits or adjusting your strategy."
  - Price Below: "{{ticker}} dropped below your target price. This might be a good time to buy."

**7. CTA Button**
\`\`\`html

  View Dashboard

\`\`\`

**8. Footer**
\`\`\`html

  Stay sharp,
  Signalist
  You're receiving this email because you signed up for Signalist.
  Unsubscribe • 
  Visit Signalist
  © 2025 Signalist

\`\`\`

## PERSONALIZATION REQUIREMENTS

### Dynamic Content Rules

1. **Alert Type Card**
   - IF \`alertType === "price_above"\` → Background: \`#10b981\`, Text: "Price Above Reached"
   - IF \`alertType === "price_below"\` → Background: \`#ef4444\`, Text: "Price Below Hit"
   - Always include formatted timestamp from \`{{alertProfile.timestamp}}\`

2. **Price Display Color**
   - IF alert is bullish (price_above) → Use green: \`#34d399\`
   - IF alert is bearish (price_below) → Use red: \`#f87171\`

3. **Price Change Formatting**
   - IF \`priceChange\` starts with "+" → Color: \`#10b981\` (green)
   - IF \`priceChange\` starts with "-" → Color: \`#ef4444\` (red)
   - Always include the +/- sign

4. **Context Message**
   - MUST match alert type semantically
   - Use company ticker (not full name) in message
   - Keep language suggestive, not prescriptive ("might be", "could be", "consider")

5. **Condition Display**
   - Format threshold with $ symbol and 2 decimal places
   - Show comparison operator clearly (>, <, ≥, ≤)
   - Example: "Price > $240.60"

### Variable Substitution Format
Use these exact variable names from {{alertProfile}}:
- \`{{alertProfile.ticker}}\`
- \`{{alertProfile.companyName}}\`
- \`{{alertProfile.currentPrice}}\`
- \`{{alertProfile.displayPrice}}\`
- \`{{alertProfile.thresholdPrice}}\`
- \`{{alertProfile.condition}}\`
- \`{{alertProfile.priceChange}}\`
- \`{{alertProfile.timestamp}}\`
- \`{{alertProfile.dashboardUrl}}\`

## EMAIL CLIENT COMPATIBILITY

### Outlook-Specific Fixes
\`\`\`html


  .fallback-font { font-family: Arial, sans-serif !important; }


\`\`\`

### Gmail-Specific Considerations
- Avoid CSS shorthand (use \`padding-top\`, \`padding-bottom\` instead of \`padding\`)
- Use \`display: block;\` for buttons wrapped in \`<a>\` tags
- Include \`text-decoration: none;\` explicitly on all links

### Mobile Responsiveness
Include this in \`<head>\`:
\`\`\`html

  @media only screen and (max-width: 600px) {
    .container { width: 100% !important; }
    .mobile-padding { padding: 10px !important; }
    .mobile-font { font-size: 18px !important; }
  }

\`\`\`

## OUTPUT REQUIREMENTS

Generate a complete, production-ready HTML email that:
1. ✅ Uses table-based layout exclusively
2. ✅ Has all CSS inlined (no external styles)
3. ✅ Matches color specifications exactly
4. ✅ Implements proper spacing and typography
5. ✅ Includes all required personalization variables
6. ✅ Has working, styled CTA button
7. ✅ Contains proper footer with legal text and links
8. ✅ Is mobile-responsive
9. ✅ Works in Gmail, Outlook, Apple Mail, and Yahoo Mail
10. ✅ Renders identically to the Figma design

## VALIDATION CHECKLIST
Before outputting, verify:
- [ ] Alert type card has correct background color
- [ ] All prices are formatted with $ and 2 decimals
- [ ] Price change has correct color (green for positive, red for negative)
- [ ] Context message matches alert type
- [ ] All text is properly colored and sized
- [ ] Cards have 12px border radius
- [ ] CTA button is prominent yellow/gold
- [ ] Footer includes unsubscribe link
- [ ] All dynamic variables are populated
- [ ] Email width is constrained to 600px
- [ ] Tables have cellpadding="0" cellspacing="0"

Generate the complete HTML email now`