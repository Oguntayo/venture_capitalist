const fs = require('fs');

const industries = ["AI/ML", "Fintech", "SaaS", "Healthtech", "DevTools", "ClimateTech", "E-commerce", "Cybersecurity", "Web3"];
const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Growth"];
const locations = ["San Francisco, CA", "New York, NY", "London, UK", "Berlin, Germany", "Palo Alto, CA", "Austin, TX", "Singapore", "Tel Aviv, Israel"];

const companyPrefixes = ["Solar", "Nova", "Lumen", "Aether", "Quantum", "Vertex", "Apex", "Flow", "Cloud", "Data", "Green", "Bio", "Pulse", "Cyber", "Echo", "Flux", "Nexus", "Prism", "Orbital", "Deep"];
const companySuffixes = ["AI", "Labs", "Systems", "Finance", "Technologies", "Health", "Logistics", "Security", "Networks", "Stack", "Dynamics", "Solutions", "Analytics", "Core", "Point", "Scale"];

const companies = [];

// Real-ish industry leaders
const leaders = [
    { name: "OpenAI", website: "https://openai.com", industry: "AI/ML", stage: "Growth", funding: "13B", founded: 2015, score: 99 },
    { name: "Anthropic", website: "https://anthropic.com", industry: "AI/ML", stage: "Series C", funding: "7.3B", founded: 2021, score: 98 },
    { name: "Mistral AI", website: "https://mistral.ai", industry: "AI/ML", stage: "Series B", funding: "500M", founded: 2023, score: 96 },
    { name: "Stripe", website: "https://stripe.com", industry: "Fintech", stage: "Growth", funding: "9B", founded: 2010, score: 95 },
    { name: "Vercel", website: "https://vercel.com", industry: "DevTools", stage: "Series D", funding: "313M", founded: 2015, score: 92 },
    { name: "Ramp", website: "https://ramp.com", industry: "Fintech", stage: "Growth", funding: "1.7B", founded: 2019, score: 94 },
    { name: "Linear", website: "https://linear.app", industry: "SaaS", stage: "Series B", funding: "50M", founded: 2019, score: 90 },
    { name: "Retool", website: "https://retool.com", industry: "DevTools", stage: "Series C", funding: "127M", founded: 2017, score: 89 },
    { name: "Plaid", website: "https://plaid.com", industry: "Fintech", stage: "Growth", funding: "734M", founded: 2013, score: 91 },
    { name: "Scale AI", website: "https://scale.com", industry: "AI/ML", stage: "Growth", funding: "600M", founded: 2016, score: 93 }
];

leaders.forEach((c, i) => {
    companies.push({
        id: c.name.toLowerCase().replace(/ /g, '-'),
        name: c.name,
        website: c.website,
        description: `Leading ${c.industry} company specializing in ${c.stage.toLowerCase()} operations and global innovation.`,
        industry: c.industry,
        stage: c.stage,
        location: locations[Math.floor(Math.random() * locations.length)],
        logo_url: `https://api.dicebear.com/7.x/initials/svg?seed=${c.name}`,
        funding: c.funding,
        founded: c.founded,
        signal_score: c.score
    });
});

for (let i = 1; i <= 90; i++) {
    const prefix = companyPrefixes[Math.floor(Math.random() * companyPrefixes.length)];
    const suffix = companySuffixes[Math.floor(Math.random() * companySuffixes.length)];
    const name = `${prefix} ${suffix}`;
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const domain = name.toLowerCase().replace(/ /g, '') + ".io";

    companies.push({
        id: `comp-${i + 10}`,
        name: name,
        website: `https://${domain}`,
        description: `A fast-growing ${industry} startup focusing on ${stage.toLowerCase()} scalability and market disruption.`,
        industry: industry,
        stage: stage,
        location: locations[Math.floor(Math.random() * locations.length)],
        logo_url: `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
        funding: `${(Math.random() * 20 + 0.5).toFixed(1)}M`,
        founded: 2020 + Math.floor(Math.random() * 4),
        signal_score: Math.floor(Math.random() * 60) + 30, // 30-90
    });
}

fs.writeFileSync('data/companies.json', JSON.stringify(companies, null, 2));
console.log('Generated 100 realistic companies in data/companies.json');
