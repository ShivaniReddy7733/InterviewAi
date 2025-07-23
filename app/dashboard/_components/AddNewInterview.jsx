"use client";

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { chatSession } from "utils/Geminimodel";
import { LoaderCircle } from 'lucide-react';
import { db } from 'utils/db';
import { v4 as uuidv4 } from 'uuid';
import { mockinterview } from '@/utils/schema';
import { useUser } from '@clerk/clerk-react';
import moment from 'moment';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
    const [openDialog, setOpenDialog] = React.useState(false);
    const [Jobpost, setJobpost] = React.useState("");
    const [JobDescription, setJobDescription] = React.useState("");
    const [Experience, setExperience] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [response, setResponse] = React.useState([]);
    const { user } = useUser();
    const Router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const Inputprompt = `Job position: ${Jobpost}, Job Description: ${JobDescription}, Experience: ${Experience}. Based on the Job position, Job Description, and Experience, give me 5 interview questions along with answers in JSON format. Provide both question and answer fields in the JSON.`;

        try {
            const result = await chatSession.sendMessage(Inputprompt);
            let responseText = await result.response.text();

            responseText = responseText.trim()
                .replace(/```json/g, '')
                .replace(/```/g, '');

            let jsonResponse;
            try {
                jsonResponse = JSON.parse(responseText);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                alert("There was an error parsing the response. Please try again.");
                setLoading(false);
                return;
            }

            setResponse(jsonResponse);

            if (jsonResponse) {
                const output = await db.insert(mockinterview).values({
                    mockid: uuidv4(),
                    jsonmockresp: responseText,
                    jobposition: Jobpost,
                    jobdescription: JobDescription,
                    jobexp: Experience,
                    createdby: user?.primaryEmailAddress?.emailAddress,
                    createddate: moment().format('YYYY-MM-DD HH:mm:ss')
                }).returning({ mockId: mockinterview.mockid });

                if (output) {
                    setOpenDialog(false);
                    Router.push(`/dashboard/interview/${output[0].mockId}`);
                }
            }
        } catch (error) {
            console.error("Error fetching interview questions:", error);
            alert("There was an error fetching interview questions. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div
                className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                onClick={() => setOpenDialog(true)}
            >
                <h2 className='text-lg text-center'>+ Add new</h2>
            </div>

            <Dialog open={openDialog}>
                <DialogContent className="bg-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            Tell us more about your Job interview
                        </DialogTitle>
                        <DialogDescription>
                            Add the details mentioned below
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={onSubmit}>
                        <div className='mt-7 my-3'>
                            <label>Job Title</label>
                            <Input
                                placeholder="Ex. Full stack developer"
                                required
                                onChange={(e) => setJobpost(e.target.value)}
                            />
                        </div>
                        <div className='my-3'>
                            <label>Job Description / Tech Stack</label>
                            <Textarea
                                placeholder="Ex. React, Java etc."
                                required
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </div>
                        <div className='my-3'>
                            <label>Enter the Experience you have</label>
                            <Input
                                placeholder="5"
                                max="50"
                                type="number"
                                required
                                onChange={(e) => setExperience(e.target.value)}
                            />
                        </div>

                        <div className='flex gap-5 justify-end'>
                            <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className='bg-blue-700'>
                                {loading ? (
                                    <>
                                        <LoaderCircle className='animate-spin mr-2' />
                                        Generating from AI...
                                    </>
                                ) : (
                                    "Start Interview"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;
