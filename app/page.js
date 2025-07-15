"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "./dashboard/_components/Header";
import { ReceiptText, Focus, AtomIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <Image
        src="/grid.svg"
        alt="Background graphic"
        className="absolute inset-0 w-full z-[-10]"
        width={1200}
        height={300}
        priority
      />

      <Header />

      <section className="z-10">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">
            Your Personal AI Interview Coach
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48">
            Double your chances of landing that job offer with our AI‑powered interview prep
          </p>
          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <Link
              href="/dashboard"
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-white bg-primary rounded-lg hover:bg-primary/90 focus:ring-4 focus:ring-primary-300"
            >
              Get Started
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <h2 className="font-bold text-3xl">How it Works?</h2>
        <p className="mt-2 text-md text-gray-500">
          Give a mock interview in just 3 simple steps
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10">
            <ReceiptText className="h-8 w-8 mx-auto text-primary" />
            <h3 className="mt-4 text-xl font-bold text-black">Give Job Description</h3>
            <p className="mt-1 text-sm text-gray-600">
              Enter your job title, company, tech stack, and other details.
            </p>
          </div>

          <div className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10">
            <Focus className="h-8 w-8 mx-auto text-primary" />
            <h3 className="mt-4 text-xl font-bold text-black">Give Interview</h3>
            <p className="mt-1 text-sm text-gray-600">
              You’ll get 5 AI‑generated questions—answer them live to receive feedback.
            </p>
          </div>

          <div className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10">
            <AtomIcon className="h-8 w-8 mx-auto text-primary" />
            <h3 className="mt-4 text-xl font-bold text-black">Get Feedback</h3>
            <p className="mt-1 text-sm text-gray-600">
              Our AI will review your answers and give you actionable feedback.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
