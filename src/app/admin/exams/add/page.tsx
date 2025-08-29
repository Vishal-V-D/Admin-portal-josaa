'use client';

import React, { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  IconPlus,
  IconTrash,
  IconTablePlus,
  IconColumns,
} from '@tabler/icons-react';

// Interfaces for the structured data
interface LinkItem {
  title: string;
  url: string;
}

interface ContentItem {
  type: 'paragraph' | 'points';
  text?: string;
  list?: string[];
}

interface SectionContent {
  title: string;
  content: ContentItem[];
}

interface StructuredData {
  Overview: { [key: string]: SectionContent };
  Registration: { [key: string]: SectionContent };
  'Exam Day': { [key: string]: SectionContent };
  Resources: { [key: string]: SectionContent };
  Results: { [key: string]: SectionContent };
  Opportunities: { [key: string]: SectionContent };
  Support: { [key: string]: SectionContent };
}

interface FormData {
  mainTitle: string;
  seatCount: string;
  applyLink: string;
  examImage: string | null;
  links: LinkItem[];
  data: StructuredData;
  nirfTable: string[][];
  nirfTableHeaders: string[];
}

export default function AddExamPage() {
  const [formData, setFormData] = useState<FormData>({
    mainTitle: '',
    seatCount: '',
    applyLink: '',
    examImage: null,
    links: [{ title: '', url: '' }],
    data: {
      Overview: {
        about: {
          title: 'About the Exam',
          content: [{ type: 'paragraph', text: '' }],
        },
        structure: {
          title: 'Exam Structure',
          content: [{ type: 'paragraph', text: '' }, { type: 'points', list: [''] }],
        },
        syllabus: {
          title: 'Syllabus & Coverage',
          content: [{ type: 'paragraph', text: '' }, { type: 'points', list: [''] }],
        },
      },
      Registration: {
        prerequisites: {
          title: 'Pre-Requisites',
          content: [{ type: 'points', list: [''] }],
        },
        dates: {
          title: 'Important Dates',
          content: [{ type: 'points', list: [''] }],
        },
      },
      'Exam Day': {
        guidelines: {
          title: 'Admit Card & Items',
          content: [{ type: 'points', list: [''] }],
        },
      },
      Resources: {
        guides: {
          title: 'Mock Tests & Guides',
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
          title: 'Career Paths',
          content: [{ type: 'paragraph', text: '' }],
        },
      },
      Support: {
        officialWebsite: {
          title: 'Official Website',
          content: [{ type: 'points', list: [''] }],
        },
      },
    },
    nirfTable: [['']],
    nirfTableHeaders: ['Column 1'],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, examImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({ ...prevData, examImage: null }));
    }
  };

  const handleLinkChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newLinks = [...formData.links];
    newLinks[index] = { ...newLinks[index], [name]: value };
    setFormData((prevData) => ({ ...prevData, links: newLinks }));
  };

  const handleAddLink = () => {
    setFormData((prevData) => ({
      ...prevData,
      links: [...prevData.links, { title: '', url: '' }],
    }));
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = formData.links.filter((_, i) => i !== index);
    setFormData((prevData) => ({ ...prevData, links: newLinks }));
  };

  const handleContentChange = (
    sectionKey: keyof StructuredData,
    subsectionKey: string,
    contentIndex: number,
    value: string,
    listIndex?: number
  ) => {
    setFormData((prevData) => {
      const newData = { ...prevData.data };
      const contentItem = newData[sectionKey][subsectionKey].content[contentIndex];

      if (contentItem.type === 'paragraph' && contentItem.text !== undefined) {
        contentItem.text = value;
      } else if (contentItem.type === 'points' && contentItem.list !== undefined && listIndex !== undefined) {
        contentItem.list[listIndex] = value;
      }
      return { ...prevData, data: newData };
    });
  };

  const handleAddContent = (
    sectionKey: keyof StructuredData,
    subsectionKey: string,
    type: 'paragraph' | 'points'
  ) => {
    setFormData((prevData) => {
      const newData = { ...prevData.data };
      const newContent = type === 'paragraph' ? { type: 'paragraph', text: '' } : { type: 'points', list: [''] };
      newData[sectionKey][subsectionKey].content.push(newContent as ContentItem);
      return { ...prevData, data: newData };
    });
  };

  const handleRemoveContent = (
    sectionKey: keyof StructuredData,
    subsectionKey: string,
    contentIndex: number
  ) => {
    setFormData((prevData) => {
      const newData = { ...prevData.data };
      newData[sectionKey][subsectionKey].content.splice(contentIndex, 1);
      return { ...prevData, data: newData };
    });
  };

  const handleAddPoint = (
    sectionKey: keyof StructuredData,
    subsectionKey: string,
    contentIndex: number
  ) => {
    setFormData((prevData) => {
      const newData = { ...prevData.data };
      const contentItem = newData[sectionKey][subsectionKey].content[contentIndex];
      if (contentItem.type === 'points' && contentItem.list !== undefined) {
        contentItem.list.push('');
      }
      return { ...prevData, data: newData };
    });
  };

  const handleRemovePoint = (
    sectionKey: keyof StructuredData,
    subsectionKey: string,
    contentIndex: number,
    pointIndex: number
  ) => {
    setFormData((prevData) => {
      const newData = { ...prevData.data };
      const contentItem = newData[sectionKey][subsectionKey].content[contentIndex];
      if (contentItem.type === 'points' && contentItem.list !== undefined) {
        contentItem.list.splice(pointIndex, 1);
      }
      return { ...prevData, data: newData };
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
      alert('Cannot delete the last row.');
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
      alert('Cannot delete the last column.');
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

  const handleSave = () => {
    console.log('Final Exam Data to be saved:', formData);
  };

  const renderContentItems = (
    sectionKey: keyof StructuredData,
    subsectionKey: string,
    content: ContentItem[]
  ) => (
    <div className="space-y-4">
      {content.map((item, contentIndex) => (
        <div key={contentIndex} className="bg-muted p-4 rounded-md space-y-2 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveContent(sectionKey, subsectionKey, contentIndex)}
            className="absolute top-2 right-2 text-red-500"
            title="Remove content"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
          {item.type === 'paragraph' && (
            <Textarea
              placeholder="Enter paragraph content..."
              value={item.text}
              onChange={(e) =>
                handleContentChange(sectionKey, subsectionKey, contentIndex, e.target.value)
              }
            />
          )}
          {item.type === 'points' && Array.isArray(item.list) && (
            <div className="space-y-2">
              <Label>List Items</Label>
              {item.list.map((point, pointIndex) => (
                <div key={pointIndex} className="flex items-center space-x-2">
                  <Input
                    placeholder="Enter list item..."
                    value={point}
                    onChange={(e) =>
                      handleContentChange(
                        sectionKey,
                        subsectionKey,
                        contentIndex,
                        e.target.value,
                        pointIndex
                      )
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleRemovePoint(sectionKey, subsectionKey, contentIndex, pointIndex)
                    }
                  >
                    <IconTrash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddPoint(sectionKey, subsectionKey, contentIndex)}
              >
                <IconPlus className="h-4 w-4 mr-2" /> Add Point
              </Button>
            </div>
          )}
        </div>
      ))}
      <div className="flex space-x-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddContent(sectionKey, subsectionKey, 'paragraph')}
        >
          <IconPlus className="h-4 w-4 mr-2" /> Add Paragraph
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAddContent(sectionKey, subsectionKey, 'points')}
        >
          <IconPlus className="h-4 w-4 mr-2" /> Add Points List
        </Button>
      </div>
    </div>
  );

  const leftCardKeys = ['Overview', 'Registration', 'Exam Day', 'Resources'];
  const rightCardKeys = ['Opportunities', 'Support', 'Results'];

  return (
    <PageContainer>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Add New Entrance Exam
          </h1>
          <Button onClick={handleSave}>Save Exam</Button>
        </div>
        <Separator />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {Object.entries(formData.data)
              .filter(([mainSection]) => leftCardKeys.includes(mainSection))
              .map(([mainSection, subsections]) => (
                <Card key={mainSection}>
                  <CardHeader>
                    <CardTitle>{mainSection}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {Object.entries(subsections as { [key: string]: SectionContent }).map(([subsectionKey, subsection]) => (
                      <div key={subsectionKey} className="space-y-4">
                        <h3 className="text-lg font-semibold">{subsection.title}</h3>
                        {renderContentItems(
                          mainSection as keyof StructuredData,
                          subsectionKey,
                          subsection.content
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Main Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mainTitle">Main Title</Label>
                  <Input
                    id="mainTitle"
                    name="mainTitle"
                    placeholder="e.g., JEE Mains 2025: Exam Dates, Application, Syllabus & More"
                    value={formData.mainTitle}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seatCount">Seat Count</Label>
                  <Input
                    id="seatCount"
                    name="seatCount"
                    placeholder="e.g., 150k+"
                    value={formData.seatCount}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applyLink">Apply Link</Label>
                  <Input
                    id="applyLink"
                    name="applyLink"
                    placeholder="e.g., https://jeemain.nta.nic.in/"
                    value={formData.applyLink}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exam Image (Optional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="examImage">Upload Image</Label>
                  <Input
                    id="examImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                {formData.examImage && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium">Image Preview:</h3>
                    <img src={formData.examImage} alt="Exam Preview" className="mt-2 rounded-md max-w-full h-auto" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Important Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.links.map((link, index) => (
                  <div key={index} className="flex space-x-2 items-end">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`linkTitle-${index}`}>Link Title</Label>
                      <Input
                        id={`linkTitle-${index}`}
                        name="title"
                        placeholder="e.g., Official Website"
                        value={link.title}
                        onChange={(e) => handleLinkChange(index, e)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`linkUrl-${index}`}>URL</Label>
                      <Input
                        id={`linkUrl-${index}`}
                        name="url"
                        placeholder="e.g., https://example.com"
                        value={link.url}
                        onChange={(e) => handleLinkChange(index, e)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveLink(index)}
                      title="Remove Link"
                      className="mb-2"
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={handleAddLink}>
                  <IconPlus className="h-4 w-4 mr-2" /> Add Link
                </Button>
              </CardContent>
            </Card>

            {Object.entries(formData.data)
              .filter(([mainSection]) => rightCardKeys.includes(mainSection))
              .map(([mainSection, subsections]) => (
                <Card key={mainSection}>
                  <CardHeader>
                    <CardTitle>{mainSection}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {Object.entries(subsections as { [key: string]: SectionContent }).map(([subsectionKey, subsection]) => (
                      <div key={subsectionKey} className="space-y-4">
                        <h3 className="text-lg font-semibold">{subsection.title}</h3>
                        {renderContentItems(
                          mainSection as keyof StructuredData,
                          subsectionKey,
                          subsection.content
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}

            <Card>
              <CardHeader>
                <CardTitle>NIRF Ranking Table</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 w-12"></th>
                        {formData.nirfTableHeaders.map((_, colIndex) => (
                          <th key={colIndex} className="p-2 text-center w-auto">
                            <Button
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
                  <Button variant="outline" size="sm" onClick={handleAddRow}>
                    <IconTablePlus className="h-4 w-4 mr-2" /> Add Row
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleAddColumn}>
                    <IconColumns className="h-4 w-4 mr-2" /> Add Column
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}