'use client';

import React, { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  IconCheck,
  IconBuilding,
  IconCalendar,
  IconMail,
  IconWorld,
  IconId,
  IconMapPin,
  IconSchool,
} from '@tabler/icons-react';

// Mock data for colleges (This would ideally be a separate data file or API call)
const allColleges = [
  {
    id: '1',
    name: 'Indian Institute of Technology, Madras',
    type: 'IIT',
    city: 'Chennai',
    state: 'Tamil Nadu',
    views: 15200,
    establishedYear: 1959,
    contactEmail: 'admissions@iitm.ac.in',
    website: 'https://www.iitm.ac.in/',
  },
  {
    id: '2',
    name: 'National Institute of Technology, Tiruchirappalli',
    type: 'NIT',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    views: 9500,
    establishedYear: 1964,
    contactEmail: 'director@nitt.edu',
    website: 'https://www.nitt.edu/',
  },
  {
    id: '3',
    name: 'Indian Institute of Information Technology, Hyderabad',
    type: 'IIIT',
    city: 'Hyderabad',
    state: 'Telangana',
    views: 7500,
    establishedYear: 1998,
    contactEmail: 'info@iiit.ac.in',
    website: 'https://www.iiit.ac.in/',
  },
  {
    id: '4',
    name: 'Punjab Engineering College',
    type: 'GFTI',
    city: 'Chandigarh',
    state: 'Punjab',
    views: 6200,
    establishedYear: 1921,
    contactEmail: 'info@pec.ac.in',
    website: 'https://www.pec.ac.in/',
  },
  {
    id: '5',
    name: 'Indian Institute of Technology, Delhi',
    type: 'IIT',
    city: 'New Delhi',
    state: 'Delhi',
    views: 11000,
    establishedYear: 1961,
    contactEmail: 'web@iitd.ac.in',
    website: 'https://home.iitd.ac.in/',
  },
  {
    id: '6',
    name: 'National Institute of Technology, Warangal',
    type: 'NIT',
    city: 'Warangal',
    state: 'Telangana',
    views: 8500,
    establishedYear: 1959,
    contactEmail: 'director@nitw.ac.in',
    website: 'https://www.nitw.ac.in/',
  },
];

interface EditCollegePageProps {
  params: {
    collegeId: string;
  };
}

export default function EditCollegePage({ params }: EditCollegePageProps) {
  const { collegeId } = params;
  const [collegeData, setCollegeData] = useState({
    id: '',
    name: '',
    type: '',
    city: '',
    state: '',
    views: 0,
    establishedYear: 0,
    contactEmail: '',
    website: '',
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Find the college data when the component mounts
  useEffect(() => {
    const collegeToEdit = allColleges.find(c => c.id === collegeId);
    if (!collegeToEdit) {
      notFound(); // This will show the standard 404 page if the ID is not found
    } else {
      setCollegeData(collegeToEdit);
    }
  }, [collegeId]);

  // Handle the success message
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); // Hide the message after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCollegeData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated College Data:', collegeData);
    // In a real application, you would send this data to an API
    setShowSuccessMessage(true);
  };

  return (
    <PageContainer>
      <div className="relative flex-1 flex-col space-y-6 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Edit College: {collegeData.name}
          </h1>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>College Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">College ID</Label>
                  <div className="relative">
                    <IconId className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="id"
                      name="id"
                      value={collegeData.id}
                      disabled // ID is not editable
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">College Name</Label>
                  <div className="relative">
                    <IconBuilding className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      value={collegeData.name}
                      onChange={handleInputChange}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <div className="relative">
                    <IconSchool className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="type"
                      name="type"
                      value={collegeData.type}
                      onChange={handleInputChange}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <div className="relative">
                    <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="city"
                      name="city"
                      value={collegeData.city}
                      onChange={handleInputChange}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <div className="relative">
                    <IconMapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="state"
                      name="state"
                      value={collegeData.state}
                      onChange={handleInputChange}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Established Year</Label>
                  <div className="relative">
                    <IconCalendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="establishedYear"
                      name="establishedYear"
                      type="number"
                      value={collegeData.establishedYear}
                      onChange={handleInputChange}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <div className="relative">
                    <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      value={collegeData.contactEmail}
                      onChange={handleInputChange}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <IconWorld className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={collegeData.website}
                      onChange={handleInputChange}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {showSuccessMessage && (
          <div className="fixed bottom-6 right-6 flex items-center space-x-2 rounded-lg bg-green-500 p-4 text-white shadow-lg transition-opacity duration-300">
            <IconCheck className="h-6 w-6" />
            <span>Changes saved successfully!</span>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
