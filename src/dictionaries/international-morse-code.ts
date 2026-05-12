// M.1677: International Morse code
// Recommendation M.1677-1 (10/2009)
// Approved in 2009-10-03

/*
UNSUPPORTED:

"Understood": "...-.",
"Error": "........",
"Invitation to transmit": "-.-",
"Wait": ".-...",
"End of work": "...-.-",
"Starting signal": "-.-.-", 
*/

export const internationalMorseCode = {
  // Letters
  "A": ".-",
  "B": "-...",
  "C": "-.-.",
  "D": "-..",
  "E": ".",
  "É": "..-..", // Accented E
  "F": "..-.",
  "G": "--.",
  "H": "....",
  "I": "..",
  "J": ".---",
  "K": "-.-",
  "L": ".-..",
  "M": "--",
  "N": "-.",
  "O": "---",
  "P": ".--.",
  "Q": "--.-",
  "R": ".-.",
  "S": "...",
  "T": "-",
  "U": "..-",
  "V": "...-",
  "W": ".--",
  "X": "-..-",
  "Y": "-.--",
  "Z": "--..",

  // Figures
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",

  // Punctuation marks and miscellaneous signs
  ".": ".-.-.-",
  ",": "--..--",
  ":": "---...",
  "?": "..--..",
  "'": ".----.", // Apostrophe
  '"': ".-..-.", // Inverted commas (quotation marks) (before and after the words)
  "@": ".--.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
};
