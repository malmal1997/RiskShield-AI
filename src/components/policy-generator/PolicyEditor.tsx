"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Edit3, Save, X } from "lucide-react";

interface PolicyContent {
  title: string;
  companyName: string;
  effectiveDate: string;
  institutionType: string;
  employeeCount?: string;
  assets?: string;
  nextReviewDate: string;
  sections: Array<{
    number: string;
    title: string;
    content?: string;
    items?: string[];
  }>;
}

interface PolicyEditorProps {
  policy: PolicyContent;
  selectedPolicyName: string;
  onSave: (updatedPolicy: PolicyContent) => void;
  onCancel: () => void;
}

const PolicyEditor: React.FC<PolicyEditorProps> = ({ policy, selectedPolicyName, onSave, onCancel }) => {
  const [editedPolicy, setEditedPolicy] = React.useState<PolicyContent>(policy);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedPolicy((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleSectionTitleChange = (index: number, value: string) => {
    const newSections = [...editedPolicy.sections];
    newSections[index].title = value;
    setEditedPolicy((prev) => ({ ...prev, sections: newSections }));
  };

  const handleSectionContentChange = (index: number, value: string) => {
    const newSections = [...editedPolicy.sections];
    newSections[index].content = value;
    setEditedPolicy((prev) => ({ ...prev, sections: newSections }));
  };

  const handleSectionItemChange = (sectionIndex: number, itemIndex: number, value: string) => {
    const newSections = [...editedPolicy.sections];
    if (newSections[sectionIndex].items) {
      newSections[sectionIndex].items![itemIndex] = value;
    }
    setEditedPolicy((prev) => ({ ...prev, sections: newSections }));
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Edit3 className="h-5 w-5 text-blue-600" />
              <span>Editing: {selectedPolicyName}</span>
            </CardTitle>
            <CardDescription>Make any necessary changes to the policy content</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button size="sm" onClick={() => onSave(editedPolicy)}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Policy Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Policy Title</label>
            <input
              type="text"
              value={editedPolicy.title || ""}
              onChange={handleTitleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Policy Sections */}
          {editedPolicy.sections?.map((section: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section {section.number}: {section.title}
                </label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleSectionTitleChange(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {section.content && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <Textarea
                    value={section.content}
                    onChange={(e) => handleSectionContentChange(index, e.target.value)}
                    className="min-h-24"
                  />
                </div>
              )}
              {section.items && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Items</label>
                  {section.items.map((item: string, itemIndex: number) => (
                    <div key={itemIndex} className="mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleSectionItemChange(index, itemIndex, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyEditor;
