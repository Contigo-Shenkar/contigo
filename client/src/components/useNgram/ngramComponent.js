import React, { useState } from 'react';


function NgramModel() {
  const [inputValue, setInputValue] = useState('');
  const [n, setN] = useState(2); // default to bigrams
  const [ngrams, setNgrams] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleNChange = (event) => {
    setN(event.target.value);
  };

  const handleGenerateNgrams = () => {
    setNgrams(generateNgrams(inputValue, n));
  };

  const generateNgrams = (text, n) => {
    const words = text.split(' ');
    const ngrams = [];

    for (let i = 0; i < words.length - n + 1; i++) {
      ngrams.push(words.slice(i, i + n));
    }

    return ngrams;
  };

  return (
    <div>
      <label>
        Input text:
        <input type="text" value={inputValue} onChange={handleInputChange} />
      </label>

      <label>
        N:
        <select value={n} onChange={handleNChange}>
          <option value="1">Unigrams</option>
          <option value="2">Bigrams</option>
          <option value="3">Trigrams</option>
        </select>
      </label>

      <button onClick={handleGenerateNgrams}>Generate {n}-grams</button>

      <ul>
        {ngrams.map((ngram, index) => (
          <li key={index}>{ngram.join(' ')}</li>
        ))}
      </ul>
    </div>
  );
}

export default NgramModel;
