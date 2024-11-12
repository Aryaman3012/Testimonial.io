import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormData {
  id: string;
  title: string;
  description: string;
  questions: string[];
}

const FormResponse: React.FC = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!formId) return;

    const forms = JSON.parse(localStorage.getItem('forms') || '[]');
    const currentForm = forms.find((f: FormData) => f.id === formId);
    
    if (currentForm) {
      setForm(currentForm);
      setAnswers(new Array(currentForm.questions.length).fill(''));
    } else {
      setError('Form not found');
    }
  }, [formId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form || !formId) return;

    const response = {
      formId,
      timestamp: new Date().toISOString(),
      answers: answers.map((answer, index) => ({
        question: form.questions[index],
        answer
      }))
    };

    const existingResponses = JSON.parse(localStorage.getItem(`responses_${formId}`) || '[]');
    localStorage.setItem(`responses_${formId}`, JSON.stringify([...existingResponses, response]));
    
    setSubmitted(true);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-4">
            <Alert className="bg-red-50">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 space-y-4">
            <Alert className="bg-green-50">
              <AlertDescription>Thank you for your response!</AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{form.title}</CardTitle>
          <p className="text-gray-600">{form.description}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.questions.map((question, index) => (
              <div key={index} className="space-y-2">
                <Label htmlFor={`question-${index}`}>{question}</Label>
                <Input
                  id={`question-${index}`}
                  value={answers[index]}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[index] = e.target.value;
                    setAnswers(newAnswers);
                  }}
                  required
                  placeholder="Your answer"
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">Submit Response</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormResponse;