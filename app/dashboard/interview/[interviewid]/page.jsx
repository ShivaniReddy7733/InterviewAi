"use client";

import { mockinterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { db } from "utils/db";
import QuestionsList from "./_components/QuestionsList";
import RecordAnswerSection from "./_components/RecordAnswerSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function StartInterview({ interviewid }) {
  const [interviewdata, setInterviewdata] = useState();
  const [mockinterviewquestions, setMockinterviewquestions] = useState([]);
  const [activequestionindex, setActivequestionindex] = useState(0);

  useEffect(() => {
    dbdata();
  }, []);

  const dbdata = async () => {
    try {
      const result = await db
        .select()
        .from(mockinterview)
        .where(eq(mockinterview.mockid, interviewid));

      if (result.length === 0) {
        console.error("No interview data found for ID:", interviewid);
        return;
      }

      const questions = JSON.parse(result[0].jsonmockresp);
      setMockinterviewquestions(questions);
      setInterviewdata({ ...result[0] }); // Convert to plain object
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

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

      <div className="flex justify-end gap-6 mt-4">
        {activequestionindex > 0 && (
          <Button onClick={() => setActivequestionindex(activequestionindex - 1)}>
            Previous Question
          </Button>
        )}

        {activequestionindex !== mockinterviewquestions.length - 1 && (
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

export default StartInterview;
