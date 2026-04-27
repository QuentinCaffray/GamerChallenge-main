'use client';

import { useState } from 'react';
import { faqData } from '../support/faqData';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg--background text--foreground p-8">
      {/* Header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Support Center</h1>
        <p className="text-foreground opacity-70">Find quick answers to your questions</p>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

        <div className="space-y-2">
          {faqData.map((item) => (
            <FAQItem key={item.id} question={item.question} answer={item.answer} />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-3xl mx-auto text-center bg-(--button-area) p-8 rounded-lg border border-(--header-button-area)">
        <h2 className="text-2xl font-bold mb-4">Can&apos;t find an answer?</h2>
        <p className="text-foreground opacity-70 mb-6">Contact our support team</p>

        <a
          href="mailto:support@challengearena.com?subject=Help Request - GamerChallenges"
          className="inline-block bg-(--button-select) hover:bg-(--button-game-challenge-hover) font-semibold px-6 py-3 rounded-lg transition"
        >
          Send an email
        </a>
      </section>
    </div>
  );
}

// FAQItem component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-(--header-button-area) py-4">
      <button
        onClick={handleClick}
        className="w-full flex justify-between items-center text-left hover:text-(--button-select) transition"
      >
        <span className="font-semibold text-lg">{question}</span>
        <span className="text-2xl">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && <div className="mt-3 text-foreground opacity-80 pl-4">{answer}</div>}
    </div>
  );
}
