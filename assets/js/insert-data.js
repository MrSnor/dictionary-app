

const wordInfoContainer = document.getElementById('word-info-container')
const searchedWordDiv = document.getElementById('searchedWord')
const wordDefinition = document.getElementById('word-definitions')

// TODO improve loading/ prolly add a loading circle through css classes
wordDefinition.innerHTML = `
Loading...
`
const headersList = {
  "Accept": "*/*"
}

const searchWord = 'help'

let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`, {
  method: "GET",
  headers: headersList
});
// console.log("🚀 ~ response", response);

const data = await response.json();
console.log("🚀 ~ data", data);
searchedWordDiv.innerHTML = `
${data[0].word}
<span class="text-2xl text-gray-400">${data[0].phonetic}</span>
`

// extract defintions from nested object/arrays and structure them all into an array
const meanings = []
data.forEach(element => {
  element['meanings'].forEach(definition => {
    meanings.push(definition)
  })
})
// console.log("🚀 ~ meanings ~ meanings", meanings);

// data to be put inside 'wordDefinition' div
let wordDefinitionInput = ``

// iterate through array and set values in the 'wordDefinitionInput'
meanings.forEach(defnObj => {

  const definitionsArray = defnObj.definitions
  // console.log("🚀 ~ definitionsArray", definitionsArray);

  // a html div which will contain html list of definitions and examples
  let defAndExampleListDiv = ``

  // set definition and example in a html list template
  definitionsArray.forEach(element => {

    // using ternary operator to check for undefined values
    defAndExampleListDiv += `
    <li>
    <div class="definition">
      ${element.definition}
    </div>
    <div class="example text-gray-500 text-sm italic">
    ${(element.example ? element.example : '')}
    </div>
  </li>
    `
  });
  // console.log("🚀 ~ defAndExampleListDiv", defAndExampleListDiv);

  wordDefinitionInput += `
  <div class="word-definition">
    <div>
      <div class="part-of-speech">
        ${defnObj.partOfSpeech}
      </div>
      <ol class="pl-8 space-y-2">
        ${defAndExampleListDiv}
      </ol>
    </div>
  </div>
  `
});


wordDefinition.innerHTML = wordDefinitionInput