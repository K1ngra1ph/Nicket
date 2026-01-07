
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQItem } from '../types';

const FAQ_DATA: FAQItem[] = [
  {
    question: "Is this platform legit?",
    answer: "Absolutely. Nicket is a registered gaming company with fully transparent raffle mechanics. We provide real-time updates and public winners lists for every draw."
  },
  {
    question: "How do I enter a raffle?",
    answer: "Simply choose a prize you like, select how many tickets you want to buy, and complete your purchase using our secure payment gateway. Once a raffle is filled, the draw happens automatically!"
  },
  {
    question: "What can I win?",
    answer: "We offer everything from the latest gadgets like iPhones and MacBooks to cash prizes, luxury experiences, and even dream cars. Check our prize list for current active raffles!"
  },
  {
    question: "What happens if I don't win the main prize?",
    answer: "Nicket's promise is 'No Empty Hands'. While there's only one main prize winner, many of our raffles feature secondary rewards, discount vouchers, or credit points for future plays."
  },
  {
    question: "How do I get my prize?",
    answer: "Winners are contacted immediately via email and phone. Physical prizes are delivered to your doorstep within Nigeria, while cash prizes are transferred to your verified bank account within 24 hours."
  }
];

const AccordionItem: React.FC<{ item: FAQItem }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-custom-card p-6 rounded-2xl flex items-center justify-between border border-custom hover:border-brand-light dark:hover:border-brand-dark transition-all text-left shadow-sm"
      >
        <span className="text-xl font-medium">{item.question}</span>
        {isOpen ? <ChevronUp className="text-brand-light dark:text-brand-dark" /> : <ChevronDown className="text-gray-500" />}
      </button>
      {isOpen && (
        <div className="bg-custom-card px-6 pb-6 rounded-b-2xl border-x border-b border-custom text-gray-500 dark:text-gray-400 leading-relaxed animate-in slide-in-from-top-2 duration-300">
          {item.answer}
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-32">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-albert font-bold mb-4">
          Frequently <span className="font-passion text-brand-light dark:text-brand-dark italic">Asked</span> Questions
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-400">Everything you need to know about playing and winning with Nicket.</p>
      </div>
      
      <div className="space-y-4">
        {FAQ_DATA.map((item, idx) => (
          <AccordionItem key={idx} item={item} />
        ))}
      </div>
    </section>
  );
};

export default FAQ;
