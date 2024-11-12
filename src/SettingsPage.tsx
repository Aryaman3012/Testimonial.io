import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SettingsPageProps {
  onComplete: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: localStorage.getItem('userName') || '',
    company: localStorage.getItem('userCompany') || ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userName', formData.name);
    localStorage.setItem('userCompany', formData.company);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onComplete();
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          {showSuccess && (
            <Alert className="mb-4 bg-green-50 text-green-800">
              <AlertDescription>
                Settings saved successfully! Redirecting...
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter your company"
                className="w-full"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
