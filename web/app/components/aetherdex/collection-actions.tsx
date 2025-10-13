import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Download, Upload } from 'lucide-react';
import { useRef } from 'react';

interface CollectionActionsProps {
  collectedIds: string[];
  onLoad: (ids: string[]) => void;
}

interface CollectionData {
  version: string;
  exportDate: string;
  collectedIds: string[];
}

export function CollectionActions({
  collectedIds,
  onLoad,
}: CollectionActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const data: CollectionData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      collectedIds,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aetherdex-collection-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as CollectionData;

        // Validate the data structure
        if (!data.collectedIds || !Array.isArray(data.collectedIds)) {
          throw new Error('Invalid collection file format');
        }

        // Validate that all IDs are strings
        if (!data.collectedIds.every((id) => typeof id === 'string')) {
          throw new Error('Invalid collection data');
        }

        onLoad(data.collectedIds);

        // Reset the file input so the same file can be loaded again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error loading collection:', error);
        alert('Failed to load collection. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Collection Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground mb-3">
          Save or load your collection data
        </p>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            className="justify-start"
          >
            <Download className="h-4 w-4 mr-2" />
            Save Collection
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadClick}
            className="justify-start"
          >
            <Upload className="h-4 w-4 mr-2" />
            Load Collection
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
}
