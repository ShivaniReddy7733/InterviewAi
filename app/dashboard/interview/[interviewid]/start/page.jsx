"use client";

import { use } from "react";                      // ← unwrap params
import React, { useEffect, useState } from "react";
import { mockinterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { db } from "utils/db";
import QuestionsList from "./_components/QuestionsList";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StartInterview({ params }) {
  // 1️⃣ Unwrap the params promise into a plain object
  const { interviewid } = use(params);

  // 2️⃣ Local state
  const [interviewdata, setInterviewdata] = useState(null);
  const [mockinterviewquestions, setMockinterviewquestions] = useState([]);
  const [activequestionindex, setActivequestionindex] = useState(0);

  // 3️⃣ Fetch on mount
  useEffect(() => {
    (async () => {
      try {
        const rows = await db
          .select()
          .from(mockinterview)
          .where(eq(mockinterview.mockid, interviewid));

        if (rows.length === 0) {
          console.error("No interview data for ID:", interviewid);
          return;
        }

        const row = { ...rows[0] }; // plain object
        setInterviewdata(row);
        setMockinterviewquestions(JSON.parse(row.jsonmockresp));
      } catch (err) {
        console.error("Error fetching interview details:", err);
      }
    })();
  }, [interviewid]);

  // 4️⃣ Render
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionsList
          mockinterviewquestions={mockinterviewquestions}
          activequestionindex={activequestionindex}
          setActivequestionindex={setActivequestionindex}
        />

        <RecordAnswerSection
          mockinterviewquestions={mockinterviewquestions}
          activequestionindex={activequestionindex}
          interviewdata={interviewdata}
        />
      </div>

      <div className="flex justify-end gap-6 mt-6">
        {activequestionindex > 0 && (
          <Button onClick={() => setActivequestionindex(activequestionindex - 1)}>
            Previous Question
          </Button>
        )}
        {activequestionindex < mockinterviewquestions.length - 1 && (
          <Button onClick={() => setActivequestionindex(activequestionindex + 1)}>
            Next Question
          </Button>
        )}
        {activequestionindex === mockinterviewquestions.length - 1 && (
          <Link href={`/dashboard/interview/${interviewid}/feedback`}>
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
