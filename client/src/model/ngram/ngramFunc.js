function generateBigrams(text) {
    const words = text.split(' ');
    const bigrams = [];
  
    for (let i = 0; i < words.length - 1; i++) {
      bigrams.push([words[i], words[i+1]]);
    }
  
    return bigrams;
  }
  