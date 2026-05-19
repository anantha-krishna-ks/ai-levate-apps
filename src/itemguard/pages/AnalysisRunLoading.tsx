import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Brain, Check, Target, Shield, Cpu, Database, ScanSearch, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const AnalysisRunLoading = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const folder = params.get('folder') || 'Selected Folder';
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Loading Item Bank', subtitle: `Indexing items in "${folder}"` },
    { title: 'Applying Guidelines & Ruleset', subtitle: 'Loading active ruleset and qualification specs' },
    { title: 'Analysing Items with AI Agents', subtitle: 'Running validation across content, fairness, and key accuracy' },
    { title: 'Scoring & Aggregation', subtitle: 'Computing per-item and folder-level scores' },
    { title: 'Finalising Analysis Run', subtitle: 'Preparing your analysis report' },
  ];

  const features = [
    { icon: <Brain className="w-6 h-6" />,       title: 'Content Analysis',   subtitle: 'Stem & distractor logic',   bgColor: 'from-blue-500 to-blue-600' },
    { icon: <Shield className="w-6 h-6" />,      title: 'Bias & Fairness',    subtitle: 'Inclusive language check',  bgColor: 'from-purple-500 to-purple-600' },
    { icon: <ScanSearch className="w-6 h-6" />,  title: 'Answer Key Audit',   subtitle: 'Defensible correct option', bgColor: 'from-green-500 to-green-600' },
    { icon: <Database className="w-6 h-6" />,    title: 'Specification Match',subtitle: 'LO & Bloom alignment',      bgColor: 'from-orange-500 to-orange-600' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 2;
        if (next >= 20 && currentStep < 1) setCurrentStep(1);
        if (next >= 40 && currentStep < 2) setCurrentStep(2);
        if (next >= 60 && currentStep < 3) setCurrentStep(3);
        if (next >= 80 && currentStep < 4) setCurrentStep(4);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate(`/item-validation/analysis-runs?folder=${encodeURIComponent(folder)}`);
          }, 800);
          return 100;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [currentStep, navigate, folder]);

  const getStepStatus = (i: number) => (i < currentStep ? 'complete' : i === currentStep ? 'processing' : 'pending');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full opacity-50 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-100 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-100 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="bg-white border-b border-gray-200 px-6 py-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-medium text-sm">AL</span>
          </div>
          <span className="text-sm font-semibold text-slate-800">Item Validation</span>
          <span className="text-sm text-gray-400">•</span>
          <span className="text-sm text-blue-600 font-medium">Running analysis on "{folder}"...</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-5xl w-full space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="relative w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="w-16 h-16 text-white animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <h1 className="text-4xl font-medium text-gray-900 animate-fade-in">AI Agents are Analysing Your Items</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Validating every item in <span className="font-semibold text-slate-800">{folder}</span> across content,
              fairness, key accuracy, and qualification alignment.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-800">Analysis Progress</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-medium text-blue-600">{progress}%</span>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                </div>
              </div>
              <Progress value={progress} className="h-3 bg-gray-200" />

              <div className="space-y-3 mt-6">
                {steps.map((step, index) => {
                  const status = getStepStatus(index);
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                        status === 'complete' ? 'bg-green-50 border border-green-200'
                        : status === 'processing' ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        status === 'complete' ? 'bg-green-500'
                        : status === 'processing' ? 'bg-blue-500'
                        : 'bg-gray-400'
                      }`}>
                        {status === 'complete' ? <Check className="w-6 h-6 text-white" />
                          : status === 'processing' ? <Target className="w-6 h-6 text-white animate-spin" />
                          : <Check className="w-6 h-6 text-white opacity-50" />}
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-base font-medium mb-1 ${
                          status === 'complete' ? 'text-green-900'
                          : status === 'processing' ? 'text-blue-900' : 'text-gray-500'
                        }`}>{step.title}</h3>
                        <p className={`text-sm ${
                          status === 'complete' ? 'text-green-700'
                          : status === 'processing' ? 'text-blue-700' : 'text-gray-400'
                        }`}>{step.subtitle}</p>
                      </div>
                      {status === 'complete' && (
                        <div className="text-sm font-medium text-green-600 flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                          <Check className="w-3 h-3" />Complete
                        </div>
                      )}
                      {status === 'processing' && (
                        <div className="text-sm font-medium text-blue-600 flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm">
                <div className="flex justify-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${f.bgColor} rounded-xl flex items-center justify-center`}>
                    <div className="text-white">{f.icon}</div>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.subtitle}</p>
              </div>
            ))}
          </div>

          <div className="text-center bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <p className="text-gray-600 font-medium inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              Our AI agents are reviewing every item. This may take a few moments...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisRunLoading;
