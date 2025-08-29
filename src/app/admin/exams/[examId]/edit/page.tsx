'use client';

import React, { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import Link from 'next/link';

// Define the data structure for an individual exam
interface Exam {
  id: string;
  name: string;
  shortName: string;
  description: string;
  website: string;
  category: string;
}

// Mock data for the exams (this should be replaced by API calls)
const EXAMS_DATA = {
  central: {
    title: 'Central Government',
    exams: [
      { id: '1', name: 'Joint Entrance Examination (Main)', shortName: 'JEE Main', description: 'Admission to NITs, IIITs, and other centrally funded technical institutions.', website: 'https://jeemain.nta.nic.in/', category: 'central' },
      { id: '2', name: 'National Eligibility cum Entrance Test (UG)', shortName: 'NEET UG', description: 'Admission to undergraduate medical and dental courses across India.', website: 'https://neet.nta.nic.in/', category: 'central' },
      { id: '8', name: 'UPSC Civil Services Examination', shortName: 'UPSC CSE', description: 'Recruitment to various Civil Services of the Government of India.', website: 'https://www.upsc.gov.in/', category: 'central' },
    ],
  },
  state: {
    title: 'State Government',
    exams: [
      { id: '3', name: 'Karnataka Common Entrance Test', shortName: 'KCET', description: 'Admission to engineering and other courses in Karnataka.', website: 'https://cetonline.karnataka.gov.in/', category: 'state' },
      { id: '4', name: 'Maharashtra Common Entrance Test', shortName: 'MHT CET', description: 'Admission to professional courses in Maharashtra state.', website: 'https://cetcell.mahacet.org/', category: 'state' },
    ],
  },
  private: {
    title: 'Private Institution',
    exams: [
      { id: '5', name: 'Vellore Institute of Technology Engineering Entrance Exam', shortName: 'VITEEE', description: 'Admission to engineering programs at VIT campuses.', website: 'https://viteee.vit.ac.in/', category: 'private' },
      { id: '6', name: 'Manipal Entrance Test', shortName: 'MET', description: 'Entrance test for various courses at MAHE.', website: 'https://manipal.edu/mu/admission.html', category: 'private' },
    ],
  },
  'college-specific': {
    title: 'College-Specific',
    exams: [
      { id: '7', name: 'Birla Institute of Technology and Science Admission Test', shortName: 'BITSAT', description: 'Admission to integrated first degree programs at BITS campuses.', website: 'https://www.bitsadmission.com/', category: 'college-specific' },
    ],
  },
};

const flattenExams = () => {
  return Object.values(EXAMS_DATA).flatMap(category => category.exams);
};

const allExams = flattenExams();

export default function EditExamPage() {
  const params = useParams();
  const examId = params.examId as string;

  // Find the exam data from our mock data based on the URL parameter
  const examToEdit = allExams.find(exam => exam.id === examId);

  // If the exam is not found, show a 404 page
  if (!examToEdit) {
    notFound();
  }

  // Set initial form state with the found exam data
  const [formData, setFormData] = useState<Exam>(examToEdit);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Handle select component changes for the category
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated Exam Data:', formData);
    
    // In a real application, you would send this data to your backend API
    // e.g., using fetch or a library like axios
    // Example: await fetch(`/api/exams/${examId}`, { method: 'PUT', body: JSON.stringify(formData) });

    // Show a success message to the user
    toast.success('Exam updated successfully!', {
      description: `Exam "${formData.name}" has been updated.`,
    });
  };

  return (
    <PageContainer>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Edit Exam: {formData.shortName}
          </h1>
          <Link href="/admin/exams" passHref>
            <Button variant="outline">Back to List</Button>
          </Link>
        </div>
        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Exam Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Joint Entrance Examination (Main)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortName">Short Name</Label>
                <Input
                  id="shortName"
                  value={formData.shortName}
                  onChange={handleInputChange}
                  placeholder="e.g., JEE Main"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter a brief description of the exam."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Official Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="e.g., https://jeemain.nta.nic.in/"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={handleSelectChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="central">Central Government</SelectItem>
                    <SelectItem value="state">State Government</SelectItem>
                    <SelectItem value="private">Private Institution</SelectItem>
                    <SelectItem value="college-specific">College-Specific</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Link href="/admin/exams" passHref>
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}