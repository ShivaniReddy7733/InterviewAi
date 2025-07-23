"use client";

import { use } from "react";                // for unwrapping params
import React, { useEffect, useState } from "react";
import { mockinterview } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { db } from "@/utils/db";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function InterviewPage({ params }) {
  // 1) Unwrap the params promise on the client
  const { interviewid } = use(params);

  // 2) Local state for your data
  const [interviewdata, setInterviewdata] = useState(null);
  const [webcamenabled, setWebcamenabled] = useState(false);

  // 3) Fetch on mount, using the unwrapped id
  useEffect(() => {
    (async () => {
      try {
        const rows = await db
          .select()
          .from(mockinterview)
          .where(eq(mockinterview.mockid, interviewid));

        if (rows.length > 0) {
          setInterviewdata({ ...rows[0] }); // spread to plain object
        }
      } catch (err) {
        console.error("Error fetching interview details:", err);
      }
    })();
  }, [interviewid]);

  // 4) Render
  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-10">
        {interviewdata && (
          <div className="flex flex-col gap-5">
            <div className="p-5 rounded-lg border">
              <h2 className="text-lg">
                <strong>Job Post:</strong> {interviewdata.jobposition}
              </h2>
              <h2 className="text-lg">
                <strong>Job Description/TechStack:</strong>{" "}
                {interviewdata.jobdescription}
              </h2>
              <h2 className="text-lg">
                <strong>Years of Experience:</strong> {interviewdata.jobexp}
              </h2>
            </div>
            <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
              <h2 className="flex items-center text-yellow-600">
                <Lightbulb className="mr-2" />
                <strong>Information</strong>
              </h2>
              <p className="mt-5">{process.env.NEXT_PUBLIC_INFORMATION}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col justify-center items-center">
          {webcamenabled ? (
            <Webcam
              onUserMedia={() => setWebcamenabled(true)}
              onUserMediaError={() => setWebcamenabled(false)}
              style={{ height: 300, width: 300 }}
              mirrored
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border ml-5" />
              <Button className="mt-5" onClick={() => setWebcamenabled(true)}>
                Enable Webcam and Microphone
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end items-end">
        <Link href={`/dashboard/interview/${interviewid}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}
