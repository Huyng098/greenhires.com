"use client";
import { Input } from "@/components/ui/input";
import { MagnifyingGlass, Notebook } from "@phosphor-icons/react";

const FAQData = [
  {
    title: "Resumes",
    quantity: 16,
  },
  {
    title: "Cover Letters",
    quantity: 12,
  },
  {
    title: "Accounts",
    quantity: 8,
  },
  {
    title: "Job Search",
    quantity: 7,
  },
];
const questionsColumn1 = [
  "How can I use GreenHires for free",
  "How Do I Cancel, Downgrade or Delete My Account?",
  "Can I download my resume to Word or PDF?",
  "How does billing work?",
  "How Do I Share My Resume and Cover Letter?",
];

const questionsColumn2 = [
  "Do you offer a money-back guarantee?",
  "How can I customize my resume?",
  "Can I change the language of my resume or cover letter?",
  "What can I do with a premium subscription?",
  "How do I change my resume template or design?",
];
export default function FAQPage() {
  return (
    <section className="bg-sky-50 flex flex-col items-center relative h-screen pt-[130px]">
      <div className="h-[300px] bg-secondary-main w-full flex flex-col items-center pt-12">
        <h1 className="text-3xl text-white mb-4">How can we help you?</h1>
        <div className="relative">
          <MagnifyingGlass
            className="absolute right-0 top-1 mr-4"
            size={30}
            weight="light"
          />
          <Input
            type="text"
            className="min-w-[500px]"
            placeholder="Frequent FAQ's"
          />
        </div>
      </div>
      <div className="absolute top-[40%]">
        <div className="rounded-lg p-5 bg-white w-[800px]">
          <p className="font-bold text-2xl p-3 mb-3 border-b-[1px]">
            Most popular Articles
          </p>
          <div className="space-x-4 grid grid-cols-2">
            <div>
              {questionsColumn1.map((question, index) => (
                <div key={index} className="flex gap-2">
                  <Notebook size={25} weight="light" />
                  <p>{question}</p>
                </div>
              ))}
            </div>
            <div>
              {questionsColumn2.map((question, index) => (
                <div key={index} className="flex gap-2">
                  <Notebook size={25} weight="light" />
                  <p>{question}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-16 w-[800px]">
          {FAQData.map((data, idx) => (
            <div key={idx} className="bg-white rounded-md p-5 w-[250px]">
              <h1 className="text-xl font-bold mb-8">{data.title}</h1>
              <p>{data.quantity} articles</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
