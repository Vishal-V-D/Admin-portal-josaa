'use client';

import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  IconCheck,
  IconPlus,
  IconTrash,
  IconLink,
  IconInfoCircle,
  IconBuilding,
  IconMapPin,
  IconMap,
  IconMail,
  IconWorld,
  IconId,
  IconTablePlus,
  IconColumns,
  IconPhoto,
  IconChevronDown,
  IconChevronUp,
  IconX,
} from '@tabler/icons-react';
import Image from 'next/image';

// Define the schema type
interface ContentItem {
  type: 'paragraph' | 'points';
  text?: string;
  list?: string[];
}

interface SectionContent {
  title: string;
  content: ContentItem[];
}

interface SchemaData {
  [key: string]: {
    [key: string]: SectionContent;
  };
}

interface LinkItem {
  title: string;
  url: string;
}

interface CollegeSchema {
  mainTitle: string;
  type: string;
  city: string;
  state: string;
  collegeCode: string;
  seatCount: string;
  applyLink: string;
  mail: string;
  website: string;
  collegeImage?: string; // Optional field for college image URL
  links: LinkItem[];
  data: SchemaData;
  nirfTable: string[][];
  nirfTableHeaders: string[];
}

const initialSchema: CollegeSchema = {
  mainTitle: '',
  type: '',
  city: '',
  state: '',
  collegeCode: '',
  seatCount: '',
  applyLink: '',
  mail: '',
  website: '',
  collegeImage: '',
  links: [],
  data: {
    Overview: {
      about: {
        title: 'About the College',
        content: [{ type: 'paragraph', text: '' }],
      },
      structure: {
        title: 'Structure & Departments',
        content: [{ type: 'paragraph', text: '' }, { type: 'points', list: [''] }],
      },
      syllabus: {
        title: 'Syllabus & Curriculum',
        content: [{ type: 'paragraph', text: '' }, { type: 'points', list: [''] }],
      },
    },
    Registration: {
      prerequisites: {
        title: 'Prerequisites for Admission',
        content: [{ type: 'points', list: [''] }],
      },
      dates: {
        title: 'Important Dates',
        content: [{ type: 'points', list: [''] }],
      },
    },
    'Exam Day': {
      guidelines: {
        title: 'Exam Day Guidelines',
        content: [{ type: 'points', list: [''] }],
      },
    },
    Resources: {
      guides: {
        title: 'Preparation Resources',
        content: [{ type: 'paragraph', text: '' }, { type: 'points', list: [''] }],
      },
    },
    Results: {
      declaration: {
        title: 'Result Declaration',
        content: [{ type: 'paragraph', text: '' }],
      },
    },
    Opportunities: {
      careerPaths: {
        title: 'Career Opportunities',
        content: [{ type: 'paragraph', text: '' }],
      },
    },
    Support: {
      officialWebsite: {
        title: 'Official Website & Contact',
        content: [{ type: 'points', list: [''] }],
      },
    },
  },
  nirfTable: [['']],
  nirfTableHeaders: ['Column 1'],
};

export default function AddCollegePage() {
  const [formData, setFormData] = useState<CollegeSchema>(initialSchema);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({
    'Basic Information': true,
    'College Image': true,
    'Important Links': true,
    'NIRF Ranking Table': true,
    'Overview': true,
    'Registration': true,
    'Exam Day': true,
    'Resources': true,
    'Results': true,
    'Opportunities': true,
    'Support': true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Handle the success message
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); // Hide the message after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const toggleCard = (cardTitle: string) => {
    setOpenCards(prev => ({ ...prev, [cardTitle]: !prev[cardTitle] }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, collegeImage: '' })); // Clear URL when file is selected
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, collegeImage: url }));
    setImageFile(null); // Clear file when URL is entered
    setImagePreview(null);
  };

  // A helper function to safely update nested state immutably
  const updateNestedState = (path: string, value: any) => {
    setFormData(prev => {
      const newForm = { ...prev };
      const keys = path.split('.');
      let current: any = newForm;

      // Navigate to the correct nested object, creating a copy at each level
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (i === keys.length - 1) {
          if (Array.isArray(current)) {
            current[parseInt(key)] = value;
          } else {
            current[key] = value;
          }
        } else {
          if (Array.isArray(current[key])) {
            current[key] = [...current[key]];
          } else if (typeof current[key] === 'object' && current[key] !== null) {
            current[key] = { ...current[key] };
          } else {
            current[key] = {};
          }
          current = current[key];
        }
      }
      return newForm;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, path: string) => {
    updateNestedState(path, e.target.value);
  };

  const handleListChange = (e: React.ChangeEvent<HTMLInputElement>, path: string, index: number) => {
    setFormData(prev => {
      const newForm = { ...prev };
      const keys = path.split('.');
      let current: any = newForm;
      for (let i = 0; i < keys.length; i++) {
        current = current[keys[i]];
      }
      current[index] = e.target.value;
      return newForm;
    });
  };

  const addListItem = (path: string) => {
    setFormData(prev => {
      const newForm = { ...prev };
      const keys = path.split('.');
      let current: any = newForm;
      for (let i = 0; i < keys.length; i++) {
        current = current[keys[i]];
      }
      current.push('');
      return newForm;
    });
  };

  const removeListItem = (path: string, index: number) => {
    setFormData(prev => {
      const newForm = { ...prev };
      const keys = path.split('.');
      let current: any = newForm;
      for (let i = 0; i < keys.length; i++) {
        current = current[keys[i]];
      }
      if (current.length > 1) {
        current.splice(index, 1);
      }
      return newForm;
    });
  };

  const handleTableChange = (rowIndex: number, colIndex: number, value: string) => {
    setFormData((prevData) => {
      const newTable = [...prevData.nirfTable];
      newTable[rowIndex][colIndex] = value;
      return { ...prevData, nirfTable: newTable };
    });
  };

  const handleHeaderChange = (colIndex: number, value: string) => {
    setFormData((prevData) => {
      const newHeaders = [...prevData.nirfTableHeaders];
      newHeaders[colIndex] = value;
      return { ...prevData, nirfTableHeaders: newHeaders };
    });
  };

  const handleAddRow = () => {
    setFormData((prevData) => {
      const newTable = [...prevData.nirfTable, new Array(prevData.nirfTableHeaders.length).fill('')];
      return { ...prevData, nirfTable: newTable };
    });
  };

  const handleRemoveRow = (rowIndex: number) => {
    if (formData.nirfTable.length === 1) {
      console.error('Cannot delete the last row.');
      return;
    }
    setFormData((prevData) => {
      const newTable = prevData.nirfTable.filter((_, i) => i !== rowIndex);
      return { ...prevData, nirfTable: newTable };
    });
  };

  const handleAddColumn = () => {
    setFormData((prevData) => {
      const newTable = prevData.nirfTable.map((row) => [...row, '']);
      const newHeaders = [...prevData.nirfTableHeaders, `Column ${prevData.nirfTableHeaders.length + 1}`];
      return { ...prevData, nirfTable: newTable, nirfTableHeaders: newHeaders };
    });
  };

  const handleRemoveColumn = (colIndex: number) => {
    if (formData.nirfTableHeaders.length === 1) {
      console.error('Cannot delete the last column.');
      return;
    }
    setFormData((prevData) => {
      const newTable = prevData.nirfTable.map((row) => {
        const newRow = [...row];
        newRow.splice(colIndex, 1);
        return newRow;
      });
      const newHeaders = [...prevData.nirfTableHeaders];
      newHeaders.splice(colIndex, 1);
      return { ...prevData, nirfTable: newTable, nirfTableHeaders: newHeaders };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('New College Data:', formData);
    if (imageFile) {
      console.log('Image file to be uploaded:', imageFile);
      // Here you would typically upload the file to a storage service (like Firebase Storage)
    }
    setShowSuccessMessage(true);
    setFormData(initialSchema);
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <PageContainer>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Add New College</h1>
        </div>

        <Separator />

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl">Basic Information</CardTitle>
              <Button type="button" variant="ghost" size="icon" onClick={() => toggleCard('Basic Information')}>
                {openCards['Basic Information'] ? <IconChevronUp /> : <IconChevronDown />}
              </Button>
            </CardHeader>
            {openCards['Basic Information'] && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mainTitle">Main Title</Label>
                    <div className="relative">
                      <IconBuilding className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="mainTitle"
                        name="mainTitle"
                        value={formData.mainTitle}
                        onChange={(e) => handleInputChange(e, 'mainTitle')}
                        placeholder="e.g., Indian Institute of Technology, Madras"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="collegeCode">College Code</Label>
                    <div className="relative">
                      <IconId className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="collegeCode"
                        name="collegeCode"
                        value={formData.collegeCode}
                        onChange={(e) => handleInputChange(e, 'collegeCode')}
                        placeholder="e.g., IITM-2024"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">College Type</Label>
                    <div className="relative">
                      <IconBuilding className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={(e) => handleInputChange(e, 'type')}
                        placeholder="e.g., IIT, NIT, IIIT"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seatCount">Seat Count</Label>
                    <div className="relative">
                      <IconInfoCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="seatCount"
                        name="seatCount"
                        value={formData.seatCount}
                        onChange={(e) => handleInputChange(e, 'seatCount')}
                        placeholder="e.g., 150k+"
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
                        value={formData.city}
                        onChange={(e) => handleInputChange(e, 'city')}
                        placeholder="e.g., Chennai"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <div className="relative">
                      <IconMap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange(e, 'state')}
                        placeholder="e.g., Tamil Nadu"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mail">Email</Label>
                    <div className="relative">
                      <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="mail"
                        name="mail"
                        type="email"
                        value={formData.mail}
                        onChange={(e) => handleInputChange(e, 'mail')}
                        placeholder="e.g., contact@iitm.ac.in"
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
                        value={formData.website}
                        onChange={(e) => handleInputChange(e, 'website')}
                        placeholder="https://www.iitm.ac.in"
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applyLink">Apply Link</Label>
                    <div className="relative">
                      <IconLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="applyLink"
                        name="applyLink"
                        type="url"
                        value={formData.applyLink}
                        onChange={(e) => handleInputChange(e, 'applyLink')}
                        placeholder="https://example.com/apply"
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl">College Image (Optional)</CardTitle>
              <Button type="button" variant="ghost" size="icon" onClick={() => toggleCard('College Image')}>
                {openCards['College Image'] ? <IconChevronUp /> : <IconChevronDown />}
              </Button>
            </CardHeader>
            {openCards['College Image'] && (
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="collegeImage">College Image URL</Label>
                      <div className="relative">
                        <IconPhoto className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="collegeImage"
                          name="collegeImage"
                          type="url"
                          value={formData.collegeImage}
                          onChange={handleImageUrlChange}
                          placeholder="https://example.com/college-image.jpg"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      <Label htmlFor="collegeImageFile">Upload Image from Device</Label>
                      <Input
                        id="collegeImageFile"
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="cursor-pointer"
                      />
                    </div>
                  </div>
                  {(imagePreview || formData.collegeImage) && (
                    <div className="relative h-64 overflow-hidden rounded-lg border">
                      <Image
                        src={imagePreview || formData.collegeImage || ''}
                        alt="College preview"
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl">Important Links</CardTitle>
              <Button type="button" variant="ghost" size="icon" onClick={() => toggleCard('Important Links')}>
                {openCards['Important Links'] ? <IconChevronUp /> : <IconChevronDown />}
              </Button>
            </CardHeader>
            {openCards['Important Links'] && (
              <CardContent>
                <div className="space-y-4">
                  <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, links: [...prev.links, { title: '', url: '' }] }))}>
                    <IconPlus className="h-4 w-4 mr-2" /> Add Link
                  </Button>
                  {formData.links.map((link, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative border p-4 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor={`link-title-${index}`}>Link Title</Label>
                        <div className="relative">
                          <IconLink className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id={`link-title-${index}`}
                            value={link.title}
                            onChange={(e) => setFormData(prev => {
                              const newLinks = [...prev.links];
                              newLinks[index].title = e.target.value;
                              return { ...prev, links: newLinks };
                            })}
                            placeholder="e.g., Official Website"
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`link-url-${index}`}>Link URL</Label>
                        <div className="relative">
                          <IconWorld className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id={`link-url-${index}`}
                            type="url"
                            value={link.url}
                            onChange={(e) => setFormData(prev => {
                              const newLinks = [...prev.links];
                              newLinks[index].url = e.target.value;
                              return { ...prev, links: newLinks };
                            })}
                            placeholder="https://example.com"
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end items-end">
                        <Button type="button" variant="destructive" size="sm" onClick={() => setFormData(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }))}>
                          <IconTrash className="h-4 w-4 mr-2" /> Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
              <CardTitle className="text-xl">NIRF Ranking Table</CardTitle>
              <Button type="button" variant="ghost" size="icon" onClick={() => toggleCard('NIRF Ranking Table')}>
                {openCards['NIRF Ranking Table'] ? <IconChevronUp /> : <IconChevronDown />}
              </Button>
            </CardHeader>
            {openCards['NIRF Ranking Table'] && (
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 w-12"></th>
                        {formData.nirfTableHeaders.map((_, colIndex) => (
                          <th key={colIndex} className="p-2 text-center w-auto">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveColumn(colIndex)}
                              title="Remove column"
                              className="text-red-500"
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </th>
                        ))}
                      </tr>
                      <tr>
                        <th className="p-2 w-12"></th>
                        {formData.nirfTableHeaders.map((header, colIndex) => (
                          <th key={colIndex} className="p-2 border-b border-gray-200 text-left w-auto">
                            <Input
                              value={header}
                              onChange={(e) => handleHeaderChange(colIndex, e.target.value)}
                              placeholder={`Column ${colIndex + 1}`}
                              className="font-semibold"
                            />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {formData.nirfTable.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          <td className="p-2 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveRow(rowIndex)}
                              title="Remove row"
                              className="text-red-500"
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </td>
                          {row.map((cell, colIndex) => (
                            <td key={colIndex} className="p-2 border border-gray-200">
                              <Input
                                value={cell}
                                onChange={(e) =>
                                  handleTableChange(rowIndex, colIndex, e.target.value)
                                }
                                placeholder="Enter value"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button type="button" variant="outline" size="sm" onClick={handleAddRow}>
                    <IconTablePlus className="h-4 w-4 mr-2" /> Add Row
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddColumn}>
                    <IconColumns className="h-4 w-4 mr-2" /> Add Column
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {Object.entries(formData.data).map(([category, sections]) => (
            <Card key={category}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <CardTitle className="text-xl">{category}</CardTitle>
                <Button type="button" variant="ghost" size="icon" onClick={() => toggleCard(category)}>
                  {openCards[category] ? <IconChevronUp /> : <IconChevronDown />}
                </Button>
              </CardHeader>
              {openCards[category] && (
                <CardContent className="space-y-4">
                  {Object.entries(sections).map(([sectionKey, sectionData]) => (
                    <div key={sectionKey}>
                      <h3 className="text-lg font-semibold mb-2">{sectionData.title}</h3>
                      {Array.isArray(sectionData.content) && sectionData.content.map((item, contentIndex) => (
                        <div key={contentIndex} className="space-y-2">
                          {item.type === 'paragraph' && (
                            <Textarea
                              placeholder="Paragraph content..."
                              value={item.text}
                              onChange={(e) => updateNestedState(`data.${category}.${sectionKey}.content.${contentIndex}.text`, e.target.value)}
                              rows={4}
                              className="w-full"
                            />
                          )}
                          {item.type === 'points' && (
                            <div className="space-y-2">
                              {Array.isArray(item.list) && item.list.map((point, pointIndex) => (
                                <div key={pointIndex} className="flex items-center m-2 space-x-2">
                                  <Input
                                    placeholder="List item..."
                                    value={point}
                                    onChange={(e) => handleListChange(e, `data.${category}.${sectionKey}.content.${contentIndex}.list`, pointIndex)}
                                    className="w-full"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeListItem(`data.${category}.${sectionKey}.content.${contentIndex}.list`, pointIndex)}
                                  >
                                    <IconX className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addListItem(`data.${category}.${sectionKey}.content.${contentIndex}.list`)}
                              >
                                <IconPlus className="h-4 w-4 mr-2" /> Add Item
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}

          <div className="flex justify-end pt-4">
            <Button type="submit">Add College</Button>
          </div>
        </form>

        {showSuccessMessage && (
          <div className="fixed bottom-6 right-6 flex items-center space-x-2 rounded-lg bg-green-500 p-4 text-white shadow-lg transition-opacity duration-300">
            <IconCheck className="h-6 w-6" />
            <span>New college added successfully!</span>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
