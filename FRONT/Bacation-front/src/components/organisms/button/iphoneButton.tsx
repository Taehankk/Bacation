import React from 'react';

interface IphoneButtonProps {
  isChecked: boolean;
  onToggle: () => void;
}

const IphoneButton: React.FC<IphoneButtonProps> = ({ isChecked, onToggle }) => {
  return (
    <label className="switch">
      <input type="checkbox" checked={isChecked} onChange={onToggle} />
      <span className="slider round"></span>

      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 34px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: '';
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #f97316;
        }

        input:checked + .slider:before {
          transform: translateX(16px);
        }
      `}</style>
    </label>
  );
};

export default IphoneButton;
