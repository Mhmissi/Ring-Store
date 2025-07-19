import React from 'react';
import { Check, Crown, Heart, Diamond, Star } from 'lucide-react';

const ProgressBar = ({ steps, onStepClick }) => {
  const stepIcons = [Crown, Heart, Diamond, Star];
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        {steps.map((step, index) => {
          const IconComponent = stepIcons[index];
          return (
            <React.Fragment key={step.step}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => onStepClick(step.step)}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-medium transition-all duration-150 hover:scale-105 ${
                    step.completed
                      ? 'bg-yellow-500 text-black'
                      : step.current
                      ? 'bg-yellow-400 text-black'
                      : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                  }`}
                >
                  {step.completed ? (
                    <Check className="w-2 h-2" />
                  ) : (
                    <IconComponent className="w-2 h-2" />
                  )}
                </button>
                
                {/* Step Label */}
                <span className={`text-[8px] mt-0.5 font-medium text-center max-w-8 ${
                  step.completed
                    ? 'text-yellow-600'
                    : step.current
                    ? 'text-yellow-500'
                    : 'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-0.5 rounded-full transition-all duration-300 ${
                  steps[index + 1].completed || steps[index + 1].current
                    ? 'bg-yellow-400'
                    : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-0.5 overflow-hidden">
        <div 
          className="bg-yellow-400 h-0.5 rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar; 