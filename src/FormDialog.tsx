import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface FormData {
  id?: string;
  title: string;
  description: string;
  questions: string[];
}

const FormDialog: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    questions: ['']
  });
  const [shareableLink, setShareableLink] = useState<string>('');

  const handleAddQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, '']
    }));
  };

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = value;
    setFormData(prev => ({
      ...prev,
      questions: newQuestions
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const generateShareableLink = (formId: string) => {
    // In a real app, this would be your domain
    return `${window.location.origin}/form/${formId}`;
  };

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a unique ID for the form
    const formId = crypto.randomUUID();
    const newForm = { ...formData, id: formId };
    
    // Save form to localStorage
    const existingForms = JSON.parse(localStorage.getItem('forms') || '[]');
    localStorage.setItem('forms', JSON.stringify([...existingForms, newForm]));
    
    // Generate and set shareable link
    const link = generateShareableLink(formId);
    setShareableLink(link);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create New Form</DialogTitle>
      </DialogHeader>
      
      {!shareableLink ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Form Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter form title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter form description"
              required
            />
          </div>

          <div className="space-y-4">
            <Label>Questions</Label>
            {formData.questions.map((question, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  placeholder={`Question ${index + 1}`}
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleRemoveQuestion(index)}
                  className="shrink-0"
                  disabled={formData.questions.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddQuestion}
              className="w-full"
            >
              Add Question
            </Button>
          </div>

          <Button type="submit" className="w-full">Create Form</Button>
        </form>
      ) : (
        <div className="space-y-4">
          <Card className="p-4 bg-green-50">
            <p className="font-medium text-green-800">Form created successfully!</p>
            <p className="text-sm text-green-700">Share this link with others to collect responses:</p>
            <div className="flex gap-2 mt-2">
              <Input
                value={shareableLink}
                readOnly
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(shareableLink);
                  alert('Link copied to clipboard!');
                }}
                className="shrink-0"
              >
                Copy
              </Button>
            </div>
          </Card>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      )}
    </DialogContent>
  );
};

export default FormDialog;