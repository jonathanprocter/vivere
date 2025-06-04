import React from 'react';
import Button from './Button';

interface ExportOptionsProps {
  onExport: (format: 'pdf' | 'text') => void;
  isExporting?: boolean;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  onExport,
  isExporting = false,
}) => {
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Export Journal</h2>
        <p className="text-gray-600 mb-4">
          Export your journal entries in your preferred format.
        </p>
      </div>
      
      <div className="space-y-6 bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg hover:border-primary transition-colors">
            <h3 className="font-semibold mb-2">PDF Format</h3>
            <p className="text-sm text-gray-500 mb-4">
              Export your journal as a formatted PDF document with entries organized by date.
            </p>
            <Button 
              onClick={() => onExport('pdf')}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export as PDF'}
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg hover:border-primary transition-colors">
            <h3 className="font-semibold mb-2">Text Format</h3>
            <p className="text-sm text-gray-500 mb-4">
              Export your journal as a simple text file that can be easily edited or shared.
            </p>
            <Button 
              variant="secondary"
              onClick={() => onExport('text')}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export as Text'}
            </Button>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 mt-4">
          <p>Note: Exported files contain all your journal entries and are not encrypted.</p>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;
