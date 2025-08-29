'use client';

import React, { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IconEye, IconBuilding, IconPencil, IconTrash, IconSearch, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data for colleges
const allColleges = [
  {
    id: '1',
    name: 'Indian Institute of Technology, Madras',
    type: 'IIT',
    city: 'Chennai',
    state: 'Tamil Nadu',
    views: 15200,
  },
  {
    id: '2',
    name: 'National Institute of Technology, Tiruchirappalli',
    type: 'NIT',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    views: 9500,
  },
  {
    id: '3',
    name: 'Indian Institute of Information Technology, Hyderabad',
    type: 'IIIT',
    city: 'Hyderabad',
    state: 'Telangana',
    views: 7500,
  },
  {
    id: '4',
    name: 'Punjab Engineering College',
    type: 'GFTI',
    city: 'Chandigarh',
    state: 'Punjab',
    views: 6200,
  },
  {
    id: '5',
    name: 'Indian Institute of Technology, Delhi',
    type: 'IIT',
    city: 'New Delhi',
    state: 'Delhi',
    views: 11000,
  },
  {
    id: '6',
    name: 'National Institute of Technology, Warangal',
    type: 'NIT',
    city: 'Warangal',
    state: 'Telangana',
    views: 8500,
  },
  {
    id: '7',
    name: 'Indian Institute of Technology, Bombay',
    type: 'IIT',
    city: 'Mumbai',
    state: 'Maharashtra',
    views: 13000,
  },
  {
    id: '8',
    name: 'National Institute of Technology, Rourkela',
    type: 'NIT',
    city: 'Rourkela',
    state: 'Odisha',
    views: 7800,
  },
  {
    id: '9',
    name: 'Indian Institute of Information Technology, Allahabad',
    type: 'IIIT',
    city: 'Allahabad',
    state: 'Uttar Pradesh',
    views: 6500,
  },
  {
    id: '10',
    name: 'Birla Institute of Technology, Mesra',
    type: 'GFTI',
    city: 'Ranchi',
    state: 'Jharkhand',
    views: 9200,
  },
  {
    id: '11',
    name: 'Indian Institute of Technology, Kanpur',
    type: 'IIT',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
    views: 10500,
  },
  {
    id: '12',
    name: 'National Institute of Technology, Karnataka',
    type: 'NIT',
    city: 'Surathkal',
    state: 'Karnataka',
    views: 8900,
  },
  {
    id: '13',
    name: 'Indian Institute of Information Technology, Jabalpur',
    type: 'IIIT',
    city: 'Jabalpur',
    state: 'Madhya Pradesh',
    views: 5800,
  },
  {
    id: '14',
    name: 'School of Planning and Architecture, New Delhi',
    type: 'GFTI',
    city: 'New Delhi',
    state: 'Delhi',
    views: 7100,
  },
];

// College Management Page Component
export default function CollegesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>('All Colleges');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Correct counts for each institution type
  const institutionCounts = {
    'IIT': 23,
    'NIT': 32,
    'IIIT': 26,
    'GFTI': 40,
  };

  const totalCollegesCount = Object.values(institutionCounts).reduce((sum, count) => sum + count, 0);

  const filteredColleges = allColleges.filter(college => {
    const matchesType = selectedType === 'All Colleges' || college.type === selectedType;
    const matchesSearch =
      college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const allFilteredCount = filteredColleges.length;

  const indexOfLastCollege = currentPage * rowsPerPage;
  const indexOfFirstCollege = indexOfLastCollege - rowsPerPage;
  const currentColleges = filteredColleges.slice(indexOfFirstCollege, indexOfLastCollege);
  const totalPages = Math.ceil(allFilteredCount / rowsPerPage);

  const handleTypeClick = (type: string) => {
    setSelectedType(type);
    setSearchTerm('');
    setCurrentPage(1);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const collegeTypes = ['IIT', 'NIT', 'IIIT', 'GFTI'];

  return (
    <PageContainer>
      <div className="flex-1 flex-col space-y-6 min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">College Management</h1>
          <Button>Add New College</Button>
        </div>

        <Separator />

        {/* College Type Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card
            className={`cursor-pointer transition-all ${selectedType === 'All Colleges' ? 'ring-2 ring-primary scale-[1.02]' : ''}`}
            onClick={() => handleTypeClick('All Colleges')}
          >
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <IconBuilding className="h-5 w-5" />
                  <span>All Colleges</span>
                </div>
                <Badge className="bg-primary text-white">
                  {totalCollegesCount}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View all colleges
              </p>
            </CardContent>
          </Card>
          {collegeTypes.map(type => (
            <Card
              key={type}
              className={`cursor-pointer transition-all ${selectedType === type ? 'ring-2 ring-primary scale-[1.02]' : ''}`}
              onClick={() => handleTypeClick(type)}
            >
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <IconBuilding className="h-5 w-5" />
                    <span>{type}</span>
                  </div>
                  <Badge className="bg-primary text-white">
                    {institutionCounts[type as keyof typeof institutionCounts]}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  View colleges of type {type}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center space-x-4">
              <CardTitle>
                {selectedType ? `${selectedType} Colleges` : 'All Colleges'}
              </CardTitle>
              <div className="relative w-full max-w-sm">
                <Input
                  type="text"
                  placeholder="Search colleges..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8"
                />
                <IconSearch className="h-4 w-4 absolute top-1/2 left-2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>College Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentColleges.length > 0 ? (
                  currentColleges.map((college) => (
                    <TableRow key={college.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <IconBuilding className="h-5 w-5 text-gray-500" />
                          <span>{college.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{college.type}</Badge>
                      </TableCell>
                      <TableCell>{college.city}</TableCell>
                      <TableCell>{college.views.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/admin/colleges/${college.id}`}>
                            <Button variant="ghost" size="icon">
                              <IconEye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/colleges/${college.id}/edit`}>
                            <Button variant="ghost" size="icon">
                              <IconPencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon">
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No colleges found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="hidden sm:inline">Rows per page:</span>
                <Select
                  value={String(rowsPerPage)}
                  onValueChange={(value) => {
                    setRowsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder={rowsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <IconChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages || filteredColleges.length === 0}
                >
                  <IconChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}