"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { chatSession } from "@/utils/Geminimodel";
import { db } from "@/utils/db";
import moment from "moment";
import { userAnswers } from "@/utils/schema";

const Webcam = dynamic(() => import("react-webcam"), {
  ssr: false,
});

function RecordAnswerSection({
  mockinterviewquestions,
  activequestionindex,
  interviewdata,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [webcamError, setWebcamError] = useState("");

  const { user } = useUser();

  // Keep latest answer available even when React state has not updated yet
  const userAnswerRef = useRef("");

  // Prevent duplicate DB/Gemini calls
  const savingAnswerRef = useRef(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    interimResults: true,
  });

  // -----------------------------------------
  // HANDLE SPEECH RESULTS
  // -----------------------------------------

  useEffect(() => {
    if (results && results.length > 0) {
      const newText = results
        .map((result) => result?.transcript)
        .filter(Boolean)
        .join(" ");

      if (newText) {
        setUserAnswer((prev) => {
          const updatedAnswer = (prev + " " + newText).trim();

          userAnswerRef.current = updatedAnswer;

          return updatedAnswer;
        });
      }
    }
  }, [results]);

  // -----------------------------------------
  // START / STOP RECORDING
  // -----------------------------------------

  const saveUserAnswer = async () => {
    if (isRecording) {
      console.log("Stopping recording...");

      stopSpeechToText();

      // Wait briefly for the final speech-to-text result
      setTimeout(() => {
        const finalAnswer = userAnswerRef.current.trim();

        console.log("Final answer before Gemini:", finalAnswer);

        if (finalAnswer.length <= 10) {
          toast.error("Answer should be more than 10 characters.");
          return;
        }

        updateUserAnswerInDb(finalAnswer);
      }, 1000);
    } else {
      console.log("Starting recording...");

      // Reset previous answer
      setUserAnswer("");
      userAnswerRef.current = "";

      setResults([]);

      savingAnswerRef.current = false;

      startSpeechToText();

      toast.info("Start speaking your answer.");
    }
  };

  // -----------------------------------------
  // SEND ANSWER TO GEMINI + SAVE TO DB
  // -----------------------------------------

  const updateUserAnswerInDb = async (finalAnswer) => {
    if (savingAnswerRef.current) {
      console.log("Answer is already being saved.");
      return;
    }

    savingAnswerRef.current = true;
    setLoading(true);

    console.log("=================================");
    console.log("ANSWER BEING SENT TO GEMINI:");
    console.log(finalAnswer);
    console.log("=================================");

    // Check interview data
    if (!interviewdata || !interviewdata.mockid) {
      console.error("Interview data or mockid is undefined.");

      toast.error(
        "Interview data is not available. Please try again."
      );

      savingAnswerRef.current = false;
      setLoading(false);

      return;
    }

    try {
      const question =
        mockinterviewquestions[activequestionindex]?.question;

      const correctAnswer =
        mockinterviewquestions[activequestionindex]?.answer;

      // -----------------------------------------
      // GEMINI PROMPT
      // -----------------------------------------

      const feedbackPrompt = `
You are an expert technical interviewer.

Interview Question:
${question}

Candidate's Answer:
${finalAnswer}

Evaluate ONLY the candidate's answer written above.

Give a rating from 1 to 10 and detailed constructive feedback.

Return ONLY valid JSON.

The JSON MUST have exactly these fields:

{
  "rating": 8,
  "feedback": "Your feedback here"
}

Important:
- The candidate's answer is NOT empty.
- Evaluate the exact answer provided above.
- Rating must be a number between 1 and 10.
- Feedback must explain what was good and what could be improved.
- Do not return markdown.
- Do not return code fences.
- Do not return any text outside the JSON.
`;

      console.log("Sending evaluation request to Gemini...");

      const result = await chatSession.sendMessage(feedbackPrompt);

      let responseText = await result.response.text();

      console.log("Gemini raw response:");
      console.log(responseText);

      // -----------------------------------------
      // CLEAN GEMINI RESPONSE
      // -----------------------------------------

      responseText = responseText
        .trim()
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      console.log("Cleaned Gemini response:");
      console.log(responseText);

      let jsonResponse;

      try {
        jsonResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.error(
          "Could not parse Gemini response:",
          parseError
        );

        toast.error(
          "Gemini returned an invalid feedback response."
        );

        savingAnswerRef.current = false;
        setLoading(false);

        return;
      }

      console.log("Parsed Gemini response:");
      console.log(jsonResponse);

      // -----------------------------------------
      // VALIDATE RATING
      // -----------------------------------------

      const rating = Number(jsonResponse?.rating);

      const feedback = jsonResponse?.feedback;

      if (
        !Number.isFinite(rating) ||
        rating < 1 ||
        rating > 10 ||
        !feedback
      ) {
        console.error(
          "Invalid Gemini evaluation:",
          jsonResponse
        );

        toast.error(
          "Gemini returned incomplete feedback. Please try again."
        );

        savingAnswerRef.current = false;
        setLoading(false);

        return;
      }

      // -----------------------------------------
      // SAVE TO NEON DATABASE
      // -----------------------------------------

      console.log("Saving answer to Neon DB...");

      const resp = await db.insert(userAnswers).values({
        mockidRef: interviewdata.mockid,
        question: question,
        correctanswer: correctAnswer,
        useranswer: finalAnswer,
        feedback: feedback,
        rating: rating,
        userEmail:
          user?.primaryEmailAddress?.emailAddress,
        createdat: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      console.log("Database response:", resp);

      toast.success("Answer recorded successfully");

      // Reset
      setUserAnswer("");
      userAnswerRef.current = "";

      setResults([]);

      toast.success(
        "Click on Next Question to continue"
      );
    } catch (error) {
      console.error(
        "Error while evaluating/saving answer:",
        error
      );

      if (
        error?.message?.includes("503") ||
        error?.message?.includes("high demand")
      ) {
        toast.error(
          "Gemini is temporarily busy. Please try again.",
          {
            duration: 5000,
          }
        );
      } else {
        toast.error(
          "There was an error evaluating your answer. Please try again.",
          {
            duration: 5000,
          }
        );
      }
    } finally {
      setLoading(false);
      savingAnswerRef.current = false;
    }
  };

  // -----------------------------------------
  // WEBCAM ERROR
  // -----------------------------------------

  const handleWebcamError = (error) => {
    console.error("Webcam error:", error);

    setWebcamError(
      "Could not access webcam. Please check permissions and try again."
    );

    toast.error(
      "Could not access webcam. Please check permissions."
    );
  };

  // -----------------------------------------
  // UI
  // -----------------------------------------

  return (
    <div className="flex flex-col items-center justify-center">

      <div className="flex flex-col mt-20 justify-center items-center rounded-lg p-5 my-15 bg-black">

        {webcamError ? (
          <p className="text-red-500">
            {webcamError}
          </p>
        ) : (
          <>
            <Image
              src="/webcam.png"
              width={200}
              height={200}
              className="absolute"
              alt="Webcam Placeholder"
            />

            <Webcam
              mirrored={true}
              onUserMediaError={handleWebcamError}
              style={{
                width: "100%",
                height: 300,
                zIndex: 10,
              }}
            />
          </>
        )}
      </div>

      <Button
        variant="outline"
        className="my-10"
        disabled={loading}
        onClick={saveUserAnswer}
      >
        {isRecording ? (
          <h2 className="text-red-700 flex gap-2">
            <Mic />
            Recording ...
          </h2>
        ) : loading ? (
          <h2 className="text-gray-600 flex gap-2">
            Evaluating...
          </h2>
        ) : (
          <h2 className="text-blue-700 flex gap-2">
            <Mic />
            Record Answer
          </h2>
        )}
      </Button>

    </div>
  );
}

export default RecordAnswerSection;