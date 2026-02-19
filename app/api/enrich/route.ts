import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { website, companyId } = await req.json();

        if (!website) {
            return NextResponse.json({ error: "Website URL is required" }, { status: 400 });
        }

        let pageText = "";
        try {
            // Basic fetch to get some content. Many sites block simple fetch, 
            // but we'll try to get meta tags or at least the home page text.
            const response = await fetch(website, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                },
                next: { revalidate: 3600 }
            });

            if (response.ok) {
                const html = await response.text();
                // Extract basic text from HTML (very roughly)
                pageText = html.replace(/<[^>]*>?/gm, ' ').substring(0, 4000);
            }
        } catch (e) {
            console.error("Scraping failed, falling back to model knowledge", e);
        }

        const prompt = `
      You are a VC Discovery Agent. Analyze the following content from the website of a company (${website}):
      
      CONTENT:
      ${pageText || "No content could be scraped. Use your internal knowledge if the company is well-known, otherwise infer from the URL and company name."}
      
      Generate a structured JSON report with the following fields:
      - summary (1-2 sentences)
      - what_they_do (3-6 bullets)
      - keywords (5-10 words)
      - signals (2-4 inferred signals, e.g. "Hiring for AI roles", "Recent blog post", "New product launch")
      
      Respond only with valid JSON.
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: "You are a professional VC analyst. Provide objective, high-signal data." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" },
        });

        const content = JSON.parse(completion.choices[0].message.content || "{}");

        return NextResponse.json({
            ...content,
            sources: [
                { url: website, timestamp: new Date().toLocaleString() }
            ]
        });

    } catch (error: any) {
        console.error("Enrichment error:", error);
        return NextResponse.json({ error: "Failed to enrich data" }, { status: 500 });
    }
}
