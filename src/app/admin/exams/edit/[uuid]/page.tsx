'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { IconArrowLeft, IconGauge } from '@tabler/icons-react';
import PageContainer from '@/components/layout/page-container';
import { toast } from 'sonner';

const API_PORT = 8000;

interface ExamData {
  Name: string;
  "Exam Code": string;
  "Exam Type": string;
  Category: string;
  "Mode of Exam": string;
  "Official Website": string;
  "Organizing Body": string;
  Applylink: string;
  "Application Period": string;
  About: { type: string; content: string };
  [key: string]: any; // allow extra fields like Exam Dates, Resources, etc.
}

export default function EditExamPage() {
  const router = useRouter();
  const params = useParams();
  const uuid = params?.uuid as string;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [examData, setExamData] = useState<ExamData>({
    Name: '',
    "Exam Code": '',
    "Exam Type": '',
    Category: '',
    "Mode of Exam": '',
    Fee: '',
    Eligibility: '',
    Seats: '',
    "Official Website": '',
    "Organizing Body": '',
    Applylink: '',
    "Application Period": '',
    About: { type: 'paragraph', content: '' },
  });

  useEffect(() => {
    const fetchExamData = async () => {
      if (!uuid) return;
      setInitialLoading(true);

      try {
        const response = await fetch(`http://localhost:${API_PORT}/exams/${uuid}`);
        if (!response.ok) throw new Error('Failed to fetch exam data');

        const exam = await response.json();
        console.log('Fetched exam data:', exam);

        setExamData({
          ...exam.data,
          About: exam.data.About || { type: 'paragraph', content: '' },
        });
      } catch (error) {
        console.error('Error fetching exam data:', error);
        toast.error('Failed to load exam data');
        router.push('/admin/exams');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchExamData();
  }, [uuid, router]);

  const handleChange = (field: keyof ExamData, value: any) => {
    setExamData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data for submission
    const dataToSubmit: Record<string, any> = {};
    for (const key in examData) {
      const value = examData[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // For object fields, try to parse them from a stringified JSON
        try {
          if (key === 'About') {
            dataToSubmit[key] = value;
          } else {
            dataToSubmit[key] = JSON.parse(value as string);
          }
        } catch (error) {
          // If parsing fails, just send the string value
          console.error(`Error parsing JSON for field ${key}:`, error);
          dataToSubmit[key] = value;
        }
      } else {
        dataToSubmit[key] = value;
      }
    }

    try {
      const response = await fetch(`http://localhost:${API_PORT}/exams/${uuid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basic_data: dataToSubmit,
          full_details: dataToSubmit,
        }),
      });

      if (!response.ok) throw new Error('Failed to update exam');

      toast.success('Exam updated successfully!');
      router.push('/admin/exams');
    } catch (error) {
      console.error('Error updating exam:', error);
      toast.error('Failed to update exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <PageContainer>
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
            <p>Loading exam data...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  const excludedKeys = new Set(['id', 'uuid']);
  const fieldKeys = Object.keys(examData).filter(key => !excludedKeys.has(key));

  return (
    <PageContainer>
      <div className="w-full min-h-screen">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="icon" onClick={() => router.back()}>
                  <IconArrowLeft size={16} />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Edit Exam</h1>
              </div>
            </div>

            <Separator />

            <form onSubmit={handleSubmit} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Exam Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fieldKeys.map((field) => {
                    const value = examData[field];
                    if (field === 'About') {
                      return (
                        <div key={field}>
                          <Label>About</Label>
                          <Textarea
                            value={value?.content || ''}
                            onChange={(e) =>
                              handleChange('About', { type: 'paragraph', content: e.target.value })
                            }
                            placeholder="Enter about exam"
                            rows={4}
                          />
                        </div>
                      );
                    } else if (typeof value === 'object' && value !== null) {
                      return (
                        <div key={field}>
                          <Label>{field}</Label>
                          <Textarea
                            value={JSON.stringify(value, null, 2)}
                            onChange={(e) => handleChange(field as keyof ExamData, e.target.value)}
                            placeholder={`Enter JSON for ${field}`}
                            rows={6}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={field}>
                          <Label>{field}</Label>
                          <Input
                            value={value || ''}
                            onChange={(e) => handleChange(field as keyof ExamData, e.target.value)}
                            placeholder={`Enter ${field}`}
                          />
                        </div>
                      );
                    }
                  })}
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <IconGauge size={16} className="mr-2" />
                      Update Exam
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}