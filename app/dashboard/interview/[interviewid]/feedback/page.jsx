"use client";

import { db } from "@/utils/db";
import { userAnswers } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";

function Feedback() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  const router = useRouter();
  const params = useParams();

  const interviewid = params?.interviewid;

  useEffect(() => {
    if (interviewid) {
      GetInterviewData();
    }
  }, [interviewid]);

  const GetInterviewData = async () => {
    try {
      console.log("Interview ID:", interviewid);

      const result = await db
        .select()
        .from(userAnswers)
        .where(eq(userAnswers.mockidRef, interviewid))
        .orderBy(userAnswers.id);

      console.log("Feedback data from DB:", result);

      setFeedbackData(result);
      calculateAverageRating(result);
    } catch (err) {
      console.error("Error fetching feedback data:", err);
    }
  };

  const calculateAverageRating = (data) => {
    if (data.length > 0) {
      const totalRating = data.reduce((sum, item) => {
        const rating = parseFloat(item.rating) || 0;
        return sum + rating;
      }, 0);

      const average = totalRating / data.length;

      setAverageRating(average.toFixed(1));
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-500">
        🎉 Congratulations!
      </h2>

      <h2 className="font-bold text-2xl mt-1">
        Here is your Interview Feedback
      </h2>

      {feedbackData.length === 0 ? (
        <h2 className="text-red-500">No feedback found.</h2>
      ) : (
        <>
          <h2 className="text-primary text-lg my-3">
            Overall Rating: <strong>{averageRating}/10</strong>
          </h2>

          <p className="text-sm text-gray-500">
            Below are your questions with your answers, correct answers, and
            feedback:
          </p>

          {feedbackData.map((data, index) => (
            <div key={index}>
              <Collapsible className="mt-6">
                <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 flex justify-between items-center w-full">
                  {data.question}
                  <ChevronDown />
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="flex flex-col gap-2">
                    <div className="text-red-500 p-2 border rounded-lg">
                      <strong>Rating:</strong> {data.rating}
                    </div>

                    <div className="p-2 border bg-red-50 text-sm rounded-lg text-red-900">
                      <strong>Your Answer: </strong>
                      {data.useranswer}
                    </div>

                    <div className="p-2 border bg-green-50 text-sm rounded-lg text-green-900 text-justify">
                      <strong>Correct Answer: </strong>
                      {data.correctanswer}
                    </div>

                    <div className="p-2 border bg-blue-50 text-sm rounded-lg text-blue-900 text-justify">
                      <strong>Feedback: </strong>
                      {data.feedback}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </>
      )}

      <Button
        className="mt-6"
        onClick={() => router.replace("/dashboard")}
      >
        Go Home
      </Button>
    </div>
  );
}

export default Feedback;