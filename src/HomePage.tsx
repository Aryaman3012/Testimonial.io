import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import FormDialog from './FormDialog';
import ResponsesDialog from './ResponsesDialog';

interface Form {
  id: string;
  title: string;
  description: string;
  questions: string[];
}

const HomePage: React.FC = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isResponsesDialogOpen, setIsResponsesDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const userName = localStorage.getItem('userName');
  const userCompany = localStorage.getItem('userCompany');

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem('forms') || '[]');
    setForms(savedForms);
  }, [isFormDialogOpen]);

  const copyShareableLink = (formId: string) => {
    const link = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const getResponseCount = (formId: string) => {
    const responses = JSON.parse(localStorage.getItem(`responses_${formId}`) || '[]');
    return responses.length;
  };

  return (
    <div className="p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Welcome, {userName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Company: {userCompany}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Forms</h2>
          <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create New Form</Button>
            </DialogTrigger>
            <FormDialog onClose={() => setIsFormDialogOpen(false)} />
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.id} className="p-4">
              <h3 className="font-semibold mb-2">{form.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{form.description}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  {form.questions.length} questions | {getResponseCount(form.id)} responses
                </p>
                <Button
                  variant="outline"
                  onClick={() => copyShareableLink(form.id)}
                  className="w-full"
                >
                  Copy Shareable Link
                </Button>
                <Dialog 
                  open={isResponsesDialogOpen && selectedForm?.id === form.id}
                  onOpenChange={(open) => {
                    setIsResponsesDialogOpen(open);
                    if (open) setSelectedForm(form);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button className="w-full">View Responses</Button>
                  </DialogTrigger>
                  {selectedForm?.id === form.id && (
                    <ResponsesDialog formId={form.id} formTitle={form.title} />
                  )}
                </Dialog>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;