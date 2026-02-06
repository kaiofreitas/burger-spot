import React from 'react';

interface AdminToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const AdminToggle: React.FC<AdminToggleProps> = ({ checked, onChange }) => {
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'relative',
        width: 44,
        height: 24,
        flexShrink: 0,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          position: 'absolute',
          opacity: 0,
          width: 0,
          height: 0,
        }}
      />
      <span
        style={{
          display: 'block',
          width: 44,
          height: 24,
          borderRadius: 12,
          backgroundColor: checked ? '#F97316' : '#333333',
          transition: 'background-color 0.2s ease',
          position: 'relative',
        }}
      >
        <span
          style={{
            display: 'block',
            width: 18,
            height: 18,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            position: 'absolute',
            top: 3,
            left: checked ? 23 : 3,
            transition: 'left 0.2s ease',
          }}
        />
      </span>
    </label>
  );
};
