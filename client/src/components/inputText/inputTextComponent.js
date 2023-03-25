import React, { useState } from 'react';

function InputTextComponent() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
    </div>
  );
}

export default InputTextComponent;
