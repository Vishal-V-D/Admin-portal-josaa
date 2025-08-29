'use client';

import React, { useState, useMemo } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  IconBuilding,
  IconBuildingEstate,
  IconBuildingMonument,
  IconEye,
  IconPencil,
  IconTrash,
  IconSearch,
  IconWorld,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define the data structure for an individual exam
interface Exam {
  id: string;
  name: string;
  shortName: string;
  description: string;
  website: string;
  category: string;
}

// Define the data structure for an exam category
interface ExamCategory {
  key: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

// Mock data for the exams
const EXAMS_DATA: { [key: string]: Omit<ExamCategory, 'key'> & { exams: Exam[] } } = {
  central: {
    title: 'Central Government',
    description: 'National-level exams.',
    icon: <IconBuildingMonument className="h-6 w-6 text-indigo-500" />,
    exams: [
      {
        id: '1',
        name: 'Joint Entrance Examination (Main)',
        shortName: 'JEE Main',
        description: 'Admission to NITs, IIITs, and other centrally funded technical institutions.',
        website: 'https://jeemain.nta.nic.in/',
        category: 'central',
      },
      {
        id: '2',
        name: 'National Eligibility cum Entrance Test (UG)',
        shortName: 'NEET UG',
        description: 'Admission to undergraduate medical and dental courses across India.',
        website: 'https://neet.nta.nic.in/',
        category: 'central',
      },
      {
        id: '8',
        name: 'UPSC Civil Services Examination',
        shortName: 'UPSC CSE',
        description: 'Recruitment to various Civil Services of the Government of India.',
        website: 'https://www.upsc.gov.in/',
        category: 'central',
      },
    ],
  },
  state: {
    title: 'State Government',
    description: 'State-level college and university exams.',
    icon: <IconBuilding className="h-6 w-6 text-green-500" />,
    exams: [
      {
        id: '3',
        name: 'Karnataka Common Entrance Test',
        shortName: 'KCET',
        description: 'Admission to engineering and other courses in Karnataka.',
        website: 'https://cetonline.karnataka.gov.in/',
        category: 'state',
      },
      {
        id: '4',
        name: 'Maharashtra Common Entrance Test',
        shortName: 'MHT CET',
        description: 'Admission to professional courses in Maharashtra state.',
        website: 'https://cetcell.mahacet.org/',
        category: 'state',
      },
      {
        id: '9',
        name: 'Tamil Nadu Engineering Admissions',
        shortName: 'TNEA',
        description: 'Centralized admission process for engineering colleges in Tamil Nadu.',
        website: 'https://www.tnea.ac.in/',
        category: 'state',
      },
    ],
  },
  private: {
    title: 'Private Institution',
    description: 'Entrance exams by private universities.',
    icon: <IconBuildingEstate className="h-6 w-6 text-orange-500" />,
    exams: [
      {
        id: '5',
        name: 'Vellore Institute of Technology Engineering Entrance Exam',
        shortName: 'VITEEE',
        description: 'Admission to engineering programs at VIT campuses.',
        website: 'https://viteee.vit.ac.in/',
        category: 'private',
      },
      {
        id: '6',
        name: 'Manipal Entrance Test',
        shortName: 'MET',
        description: 'Entrance test for various courses at MAHE.',
        website: 'https://manipal.edu/mu/admission.html',
        category: 'private',
      },
    ],
  },
  'college-specific': {
    title: 'College-Specific',
    description: 'Exams conducted by individual colleges.',
    icon: <IconWorld className="h-6 w-6 text-purple-500" />,
    exams: [
      {
        id: '7',
        name: 'Birla Institute of Technology and Science Admission Test',
        shortName: 'BITSAT',
        description: 'Admission to integrated first degree programs at BITS campuses.',
        website: 'https://www.bitsadmission.com/',
        category: 'college-specific',
      },
    ],
  },
};

const flattenExams = () => {
  return Object.values(EXAMS_DATA).flatMap(category => category.exams);
};

const allExams = flattenExams();

const examCategories: ExamCategory[] = [
  {
    key: 'all',
    title: 'All Exams',
    description: 'View all entrance exams.',
    icon: <IconWorld className="h-6 w-6 text-gray-500" />,
  },
  ...Object.entries(EXAMS_DATA).map(([key, value]) => ({
    key,
    title: value.title,
    description: value.description,
    icon: value.icon,
  })),
];

export default function ExamsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredExams = useMemo(() => {
    return allExams.filter(exam => {
      const matchesCategory = selectedCategory === 'all' || exam.category === selectedCategory;
      const matchesSearch =
        exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const currentItems = filteredExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <PageContainer>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Entrance Exams
          </h1>
          <Link href="/admin/exams/add" passHref>
            <Button>Add New Exam</Button>
          </Link>
        </div>
        <Separator />

        <div className="relative p-2 overflow-x-auto pb-4">
          <div className="flex space-x-4">
            {examCategories.map((category) => (
              <Card
                key={category.key}
                className={`flex-shrink-0 w-[220px] cursor-pointer transition-all duration-300 ${
                  selectedCategory === category.key
                    ? 'shadow-lg ring-2 ring-primary'
                    : 'hover:shadow-md'
                }`}
                onClick={() => {
                  setSelectedCategory(category.key);
                  setCurrentPage(1); // Reset to first page when category changes
                }}
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      {category.icon}
                      <span>{category.title}</span>
                    </div>
                    <Badge className="bg-primary text-white">
                      {category.key === 'all'
                        ? allExams.length
                        : EXAMS_DATA[category.key as keyof typeof EXAMS_DATA]?.exams.length || 0}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <CardTitle className="text-xl font-semibold">
                {selectedCategory ? `${examCategories.find(c => c.key === selectedCategory)?.title}` : 'All Exams'} ({filteredExams.length})
              </CardTitle>
              <div className="relative w-full max-w-sm">
                <Input
                  type="text"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page on search
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
                  <TableHead>Exam Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="text-base">{exam.name}</span>
                          <span className="text-sm text-muted-foreground">{exam.shortName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-sm">
                        <p className="text-sm">{exam.description}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{exam.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/admin/exams/${exam.id}`} passHref>
                            <Button variant="ghost" size="icon" title="View">
                              <IconEye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/exams/${exam.id}/edit`} passHref>
                            <Button variant="ghost" size="icon" title="Edit">
                              <IconPencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="icon" title="Delete">
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No exams found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        {filteredExams.length > itemsPerPage && (
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <IconChevronLeft className="h-4 w-4" />
              </Button>
              {pageNumbers.map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'secondary' : 'outline'}
                  size="icon"
                  onClick={() => goToPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                <IconChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}