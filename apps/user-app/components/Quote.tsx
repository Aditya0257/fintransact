export const Quote = () => {

    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }

    let currentQuote = getRandomQuote();

    return (
        <div className="bg-slate-200 h-screen flex">
            <div className="w-full flex flex-col justify-center mx-12">
                <div className=" text-3xl font-bold">
                    {currentQuote}
                </div>
            </div>
        </div>
    );
};

const quotes = [
    "“The road to financial freedom isn’t found overnight; it’s a journey of mindful choices, patience, and a commitment to small steps that lead to big changes.” – Anonymous",
    "“Wealth is not built in a day but through disciplined action, calculated risks, and a mindset that focuses on long-term gains over instant gratification.” – Dave Ramsey",
    "“Success in any financial endeavor doesn’t come from the sheer pursuit of money; it comes from the pursuit of knowledge, strategy, and wise decision-making over time.” – Robert Kiyosaki",
    "“A budget is more than just a collection of numbers; it’s a roadmap to realizing your financial dreams and achieving a secure future, step by step.” – Suze Orman",
    "“Your financial health is as essential as your physical health, built through daily habits, consistency, and a willingness to learn and adapt to new challenges.” – Warren Buffett",
    "“Remember, it’s not how much you make, but how much you keep, how wisely you invest, and how diligently you protect what you've worked so hard for.” – Chris Hogan",
    "“The foundation of a strong financial future is laid not in moments of fortune, but in the simple, consistent acts of saving, investing, and thoughtful planning.” – John C. Bogle",
    "“Achieving financial freedom requires patience and resilience; it's about building a future that’s guided by purpose and a commitment to sound choices.” – Ramit Sethi",
    "“True financial freedom is about choice; the choice to work because you want to, not because you have to, and to live a life driven by values, not by debt.” – Vicki Robin",
    "“Don’t just chase wealth; seek knowledge, for true success comes not from merely accumulating money, but from understanding and using it wisely for the future.” – Benjamin Franklin",
    "“Financial stability doesn’t come from luck; it’s the result of making informed decisions, setting goals, and managing risks in a constantly changing world.” – Peter Lynch",
    "“While some look to gain wealth quickly, those who build it steadily understand that real success comes from commitment, discipline, and an eye on long-term goals.” – Tony Robbins",
];
