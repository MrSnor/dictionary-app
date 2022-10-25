

const wordInfoContainer = document.getElementById('word-info-container')
const searchedWordDiv = document.getElementById('searchedWord')
const wordDefinition = document.getElementById('word-definitions')
const wordLoading = document.querySelector('.word-loading')
const wordSearch = document.querySelector('#word-input-container input')
const wordSearchBtn = document.querySelector('#word-input-container .input-button')
let prevWord = null

const headersList = {
  "Accept": "*/*"
}

async function insert_data(word) {
  // if loader contains 'opacity-0' and isn't visible, make it visible 
  if (wordLoading.classList.contains('opacity-0')) { wordLoading.classList.remove('opacity-0') }

  // take value from search input
  const searchWord = word

  try {

    let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`, {
      method: "GET",
      headers: headersList
    });

    // console.log("🚀 ~ response", response);

    const data = await response.json();
    // console.log("🚀 ~ data", data);

    if (response.status === 200) {

      searchedWordDiv.innerHTML = `
      ${data[0].word}
      <span class="text-2xl text-gray-400">
        ${data[0]?.phonetic ?? ''}
      </span>
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

          // using ternary operator to check for undefined values (can also use 'Nullish coalescing operator (??)' for the same)
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

      // set value of previous word(last searched word) to currently searched word
      prevWord = searchWord
      // empty word-input after a successful search
      wordSearch.value = ''
    }
    // if word meaning is not found 
    else if (response.status === 404) {

      searchedWordDiv.innerHTML = `
      <span class="text-warning">
        ${data.title}
      </span>
      `

      wordDefinition.innerHTML = `
      <div class="">
          Sorry pal, we couldn't find definitions for the word you were looking for.
          You can try the search again at later time or head to the web instead.
      </div>
      `

    }

  } catch (error) {
    
    if (error.message === 'Failed to fetch') {
      searchedWordDiv.innerHTML = `
      <span class="text-error">
        Error!
      </span>
      `

      wordDefinition.innerHTML = `
      <div class="font-bold">
        Failed to fetch data :(
        <ul class="list-inside list-disc">
          <li>Server might be down</li>
          <li>Try connecting to the internet again</li>
        </ul>
      </div>
      `

    } else {
      console.error(error)
    }

  } finally {
    // if 'wordInfoContainer contains 'hidden' and isn't visible, make it visible 
    if (wordInfoContainer.classList.contains('hidden')) { wordInfoContainer.classList.remove('hidden') }
    // if loader doesnt contain 'opacity-0' and is visible, make it invisible
    if (!wordLoading.classList.contains('opacity-0')) { wordLoading.classList.add('opacity-0') }
  }
}

// add eventlistener to search button
wordSearchBtn.addEventListener('click', () => {
  // remove starting and ending spaces of the word
  const word = wordSearch.value.trim()
  // prevent searching the last searched word successively
  // only search the currently searched item if it isn't the same as last searched word
  if (word != prevWord) {
    // prevent input of empty values
    if (word != '') {
      insert_data(word)
    }
  }
})

// Execute a function when the user presses a key on the keyboard
wordSearch.addEventListener("keypress", (event) => {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    wordSearchBtn.click();
  }
});
