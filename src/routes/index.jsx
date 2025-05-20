import { createSignal } from "solid-js";

export default function Home() {
  const [includeDigits, setIncludeDigits] = createSignal(true);
  const [includeUppercase, setIncludeUppercase] = createSignal(true);
  const [includeLowercase, setIncludeLowercase] = createSignal(true);
  const [includeSymbols, setIncludeSymbols] = createSignal(false);
  const [length, setLength] = createSignal(12);
  const [results, setResults] = createSignal([]);
  const [copiedIndex, setCopiedIndex] = createSignal(null);

  function generateString() {
    const digitChars = "0123456789";
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    let charset = "";

    if (includeDigits()) charset += digitChars;
    if (includeUppercase()) charset += upperChars;
    if (includeLowercase()) charset += lowerChars;
    if (includeSymbols()) charset += symbolChars;

    if (!charset) {
      setResults(["Please select at least one character set."]);
      return;
    }

    const generatedList = [];
    for (let i = 0; i < 4; i++) {
      let str = "";
      for (let j = 0; j < length(); j++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        str += charset[randomIndex];
      }
      generatedList.push(str);
    }

    setResults(generatedList);
    setCopiedIndex(null); 
  }

  function copyToClipboard(text, index) {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 1500);
  }

  return (
    <div class="container py-4 offset-md-2 col-md-8">
      <h1 class="mb-4 text-center fw-bold">Random String Generator</h1>

      <div className="card border-5 rounded-5 p-md-5 shadow">
        <div className="row gx-md-5">
          <div className="col-md-6 p-md-5 px-5 pt-5 rounded-5">
            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" checked={includeDigits()} onInput={() => setIncludeDigits(!includeDigits())} id="digitsCheck" />
              <label class="form-check-label" for="digitsCheck">
                Include Digits (0-9)
              </label>
            </div>

            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" checked={includeUppercase()} onInput={() => setIncludeUppercase(!includeUppercase())} id="uppercaseCheck" />
              <label class="form-check-label" for="uppercaseCheck">
                Include Uppercase Letters (A-Z)
              </label>
            </div>

            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" checked={includeLowercase()} onInput={() => setIncludeLowercase(!includeLowercase())} id="lowercaseCheck" />
              <label class="form-check-label" for="lowercaseCheck">
                Include Lowercase Letters (a-z)
              </label>
            </div>

            <div class="mb-3 form-check">
              <input type="checkbox" class="form-check-input" checked={includeSymbols()} onInput={() => setIncludeSymbols(!includeSymbols())} id="symbolsCheck" />
              <label class="form-check-label" for="symbolsCheck">
                Include Symbols (!@#...)
              </label>
            </div>

            <div class="mb-3">
              <label for="lengthInput" class="form-label">
                String Length (6-30)
              </label>
              <input
                type="number"
                id="lengthInput"
                class="form-control w-25"
                min="6"
                max="30"
                value={length()}
                onInput={(e) => {
                  let val = parseInt(e.target.value);
                  if (val >= 6 && val <= 30) setLength(val);
                }}
              />
            </div>

            <div class="mb-4 d-flex gap-2">
              <button class="btn btn-primary rounded-3" onClick={generateString}>
                Generate
              </button>
              <button class="btn btn-secondary rounded-3" onClick={() => setResults([])}>
                Reset
              </button>
            </div>
          </div>
          <div className="col-md-6 p-md-4 px-5 pb-4">
            {results().length > 0 && (
              <div class="d-flex flex-column">
                {results().map((str, idx) => (
                  <div class="alert alert-primary d-flex justify-content-between align-items-center rounded-4 border-0" role="alert">
                    <span class="me-3 text-dark">{str}</span>
                    <div class="d-flex align-items-center">
                      {copiedIndex() === idx ? <span class="text-success me-2">Copied!</span> : null}
                      <button class="btn btn-outline-secondary btn-sm" onClick={() => copyToClipboard(str, idx)}>
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
