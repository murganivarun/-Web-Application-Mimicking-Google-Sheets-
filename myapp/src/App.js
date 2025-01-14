import React, { useState } from 'react';
import './App.css';

function App() {
  const [cells, setCells] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);

  const handleInputChange = (cell, value) => {
    setCells((prev) => ({
      ...prev,
      [cell]: value.startsWith('=') ? value : parseValue(value),
    }));
  };

  const parseValue = (value) => {
    return isNaN(value) ? value : parseFloat(value);
  };

  const evaluateFormula = (expression) => {
    if (!expression || typeof expression !== 'string') return expression;
  
    // Check if it's a formula (starts with '=')
    if (expression.startsWith('=')) {
      try {
        const formula = expression.substring(1); // Remove '=' symbol
  
        // Handle functions like MAX(), SUM(), TRIM(), etc.
        const functionMatch = formula.match(/^([A-Za-z]+)\((.*)\)$/);
        if (functionMatch) {
          const functionName = functionMatch[1]; // e.g., MAX, TRIM
          const argsString = functionMatch[2]; // e.g., A1:A3 or "  extra  spaces  "
  
          // Now we need to parse the arguments (ranges or individual values)
          const args = argsString.split(':').map(arg => {
            if (/^[A-Z]+[0-9]+$/.test(arg)) {
              // If it's a cell reference, get its value and treat it as a string
              return String(cells[arg] || ''); // Ensure we return it as a string
            }
            // If it's a string (text), return the value as a string
            return String(arg.trim());
          });
  
          if (functionName === 'MAX') {
            return Math.max(...args); // Return the maximum value
          } else if (functionName === 'SUM') {
            return args.reduce((acc, val) => acc + parseFloat(val), 0); // Return the sum
          } else if (functionName === 'TRIM') {
            return args[0] ? args[0].replace(/\s+/g, ' ').trim() : ''; // Remove extra spaces and trim the string
          }
          // Add more functions here as needed, e.g., MIN, AVERAGE, etc.
  
          return 'Function not supported'; // In case of unsupported function
        }
  
        // If the formula is just an expression like A1 + A2
        const regex = /([A-Z]+[0-9]+)/g;
        const parts = formula.split(/([A-Z]+[0-9]+)/); // Split the formula at cell references
  
        const evaluatedExpression = parts.map(part => {
          if (/^[A-Z]+[0-9]+$/.test(part)) {
            // If it's a cell reference (e.g., A1), get its value
            return cells[part] || 0;  // If cell is empty, use 0
          }
          return part;  // Keep the operators or numbers intact
        }).join('');
  
        // Evaluate the final expression string (e.g., '10 + 20')
        return eval(evaluatedExpression);  // This can now compute the final result
      } catch (error) {
        return 'Error!';
      }
    }
  
    return expression;  // If it's not a formula, return the value as is
  };
  
  
  
  
  

  const getValue = (cell) => {
    return evaluateFormula(cells[cell] || '');
  };

  const renderCell = (row, col) => {
    const cellKey = `${String.fromCharCode(65 + col)}${row + 1}`;
    const value = getValue(cellKey);

    return (
      <td key={cellKey}>
        <input
          type="text"
          value={cells[cellKey] || ''}
          onChange={(e) => handleInputChange(cellKey, e.target.value)}
          onFocus={() => setSelectedCell(cellKey)}
        />
        <div className="value-display">{value}</div>
      </td>
    );
  };

  return (
    <div className="spreadsheet">
      <div className="formula-bar">
        <input
          type="text"
          value={selectedCell ? cells[selectedCell] || '' : ''}
          onChange={(e) => handleInputChange(selectedCell, e.target.value)}
          placeholder="Enter a formula or value"
        />
      </div>
      <table>
        <tbody>
          {[...Array(10)].map((_, row) => (
            <tr key={row}>
              {[...Array(5)].map((_, col) => renderCell(row, col))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

/* App.css */

