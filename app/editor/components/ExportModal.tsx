import { useState } from 'react';
import { Level } from '@/app/types';
import {
  validateLevel,
  generateLevelCode,
  generateIndexInstructions,
  ValidationResult,
} from '../lib/editor-utils';
import { X, AlertCircle, AlertTriangle, CheckCircle, Copy, Download } from 'lucide-react';

interface ExportModalProps {
  level: Level;
  onClose: () => void;
}

export function ExportModal({ level, onClose }: ExportModalProps) {
  const [levelNumber, setLevelNumber] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleValidate = () => {
    const result = validateLevel(level);
    setValidationResult(result);
  };

  const handleGenerate = () => {
    const result = validateLevel(level);
    setValidationResult(result);

    if (!result.valid) {
      return; // Don't generate if there are errors
    }

    const num = levelNumber || 'new';
    const code = generateLevelCode(level, num);
    setGeneratedCode(code);
    setShowCode(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const num = levelNumber || 'new';
    const blob = new Blob([generatedCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${num}.ts`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Validate & Export Level</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Level Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level Number/ID
            </label>
            <input
              type="text"
              value={levelNumber}
              onChange={(e) => setLevelNumber(e.target.value)}
              placeholder="e.g., 2, new, tutorial"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              This will be used for the filename (e.g., "2.ts") and constant name (e.g., "LEVEL_2")
            </p>
          </div>

          {/* Validation Button */}
          <div>
            <button
              onClick={handleValidate}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors"
            >
              Validate Level
            </button>
          </div>

          {/* Validation Results */}
          {validationResult && (
            <div className="space-y-3">
              {/* Summary */}
              <div
                className={`p-4 rounded border-2 ${
                  validationResult.valid
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {validationResult.valid ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">
                        Validation passed! Ready to export.
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="font-medium text-red-900">
                        Validation failed. Fix errors before exporting.
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Errors */}
              {validationResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-900">Errors:</h4>
                  <ul className="space-y-1">
                    {validationResult.errors.map((error, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          {error.message}
                          {error.itemId && (
                            <span className="text-xs text-red-600 ml-1">({error.itemId})</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {validationResult.warnings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-amber-900">Warnings:</h4>
                  <ul className="space-y-1">
                    {validationResult.warnings.map((warning, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{warning.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Generated Code */}
          {showCode && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">Generated TypeScript Code</h4>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
              <pre className="p-4 bg-gray-900 text-gray-100 rounded overflow-x-auto text-xs font-mono max-h-64 overflow-y-auto">
                {generatedCode}
              </pre>

              {/* Instructions */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Next Steps:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>
                    Save the code above to{' '}
                    <code className="px-1 py-0.5 bg-blue-100 rounded text-xs">
                      /app/levels/{levelNumber || 'new'}.ts
                    </code>
                  </li>
                  <li>
                    Add the import to{' '}
                    <code className="px-1 py-0.5 bg-blue-100 rounded text-xs">
                      /app/levels/index.ts
                    </code>
                  </li>
                  <li>Add the level to the LEVELS array with a descriptive name</li>
                  <li>
                    Run <code className="px-1 py-0.5 bg-blue-100 rounded text-xs">pnpm build</code>{' '}
                    to verify
                  </li>
                  <li>Test the level in the game!</li>
                </ol>
              </div>

              <details className="text-sm">
                <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                  Show index.ts code snippet
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono overflow-x-auto">
                  {generateIndexInstructions(levelNumber || 'new')}
                </pre>
              </details>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleGenerate}
            disabled={!levelNumber}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded transition-colors"
          >
            Generate Code
          </button>
        </div>
      </div>
    </div>
  );
}
