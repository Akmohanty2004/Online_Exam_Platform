import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const Calculator = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  
  const handleNumber = (num) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };
  
  const handleOperator = (op) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };
  
  const calculate = () => {
    try {
      const result = eval(equation + display);
      setDisplay(String(result));
      setEquation('');
    } catch (e) {
      setDisplay('Error');
    }
  };
  
  const clear = () => {
    setDisplay('0');
    setEquation('');
  };
  
  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '80px',
      right: '20px',
      width: '260px',
      background: 'var(--dark-800)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      zIndex: 10000,
      overflow: 'hidden'
    }}>
      <div style={{
        background: 'rgba(15,23,42,0.9)',
        padding: '10px 15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <span style={{ color: 'white', fontWeight: 500, fontSize: '14px' }}>Calculator</span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--dark-400)', cursor: 'pointer' }}>
          <FiX size={18} />
        </button>
      </div>
      
      <div style={{ padding: '15px' }}>
        <div style={{
          background: 'var(--dark-900)',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '15px',
          textAlign: 'right'
        }}>
          <div style={{ color: 'var(--dark-400)', fontSize: '12px', minHeight: '18px' }}>{equation}</div>
          <div style={{ color: 'white', fontSize: '24px', fontWeight: 600, overflow: 'hidden' }}>{display}</div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          <button 
            onClick={clear}
            style={{ gridColumn: 'span 4', padding: '10px', borderRadius: '6px', border: 'none', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', cursor: 'pointer', fontWeight: 600 }}
          >
            Clear
          </button>
          
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={() => {
                if (btn === '=') calculate();
                else if (['+', '-', '*', '/'].includes(btn)) handleOperator(btn);
                else handleNumber(btn);
              }}
              style={{
                padding: '12px 0',
                borderRadius: '6px',
                border: 'none',
                background: ['+', '-', '*', '/', '='].includes(btn) ? 'var(--primary-500)' : 'var(--dark-700)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
