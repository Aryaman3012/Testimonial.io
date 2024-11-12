import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';

interface Response {
  formId: string;
  timestamp: string;
  answers: {
    question: string;
    answer: string;
  }[];
}

interface ResponsesDialogProps {
  formId: string;
  formTitle: string;
}

const ResponsesDialog: React.FC<ResponsesDialogProps> = ({ formId, formTitle }) => {
  const [responses, setResponses] = useState<Response[]>([]);

  useEffect(() => {
    const savedResponses = JSON.parse(localStorage.getItem(`responses_${formId}`) || '[]');
    setResponses(savedResponses);
  }, [formId]);

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Responses for {formTitle}</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        {responses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No responses yet</p>
        ) : (
          responses.map((response, index) => (
            <Card key={index} className="p-4 space-y-2">
              <p className="text-sm text-gray-500">
                Submitted on: {new Date(response.timestamp).toLocaleString()}
              </p>
              <div className="space-y-3">
                {response.answers.map((answer, i) => (
                  <div key={i}>
                    <p className="font-medium">{answer.question}</p>
                    <p className="text-gray-600">{answer.answer}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>
    </DialogContent>
  );
};

export default ResponsesDialog;