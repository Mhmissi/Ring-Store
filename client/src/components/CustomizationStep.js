import React from 'react';
import { Check } from 'lucide-react';

const CustomizationStep = ({ title, description, options, selected, onSelect }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-1.5">
        {options.map((option) => {
          const IconComponent = option.icon;
          const isSelected = selected === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`option-card p-1.5 rounded-md border-2 transition-all duration-200 text-left group hover:scale-102${isSelected ? ' selected' : ''}`}
            >
              <div className="flex items-center space-x-2">
                {/* Icon */}
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isSelected
                    ? 'bg-brilliantBlue text-white shadow-md scale-110'
                    : 'bg-platinumSilver text-charcoalGray hover:bg-softBlush'
                }`}>
                  {IconComponent && <IconComponent className="w-3 h-3" />}
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-charcoalGray text-xs truncate">{option.label}</h4>
                  {option.sublabel && (
                    <p className="text-xs text-gray-500 truncate mt-0.5">{option.sublabel}</p>
                  )}
                </div>
                {/* Check mark */}
                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 bg-brilliantBlue rounded-full flex items-center justify-center">
                      <Check className="w-2 h-2 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-1 p-1 bg-diamondWhite border border-brilliantBlue rounded text-xs">
          <div className="flex items-center">
            <Check className="w-2 h-2 text-brilliantBlue mr-1" />
            <span className="text-brilliantBlue font-medium">
              {options.find(opt => opt.value === selected)?.label} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationStep; 