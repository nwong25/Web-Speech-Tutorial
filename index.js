const SpeechRecognition =
  window.webkitSpeechRecognition || window.SpeechRecognition

const synth = window.speechSynthesis
const recognition = new SpeechRecognition()
recognition.lang = 'en-US'
recognition.interimResults = false

const button = document.querySelector('button')
let textlog = document.querySelector('textarea')

const reply = text => {
  const utter = new SpeechSynthesisUtterance(text)
  const voices = speechSynthesis.getVoices()
  utter.voice = voices[10]
  synth.speak(utter)
}

const getIngredients = async speech => {
  try {
    const recipes = await fetch(
      `https://api.edamam.com/search?q=${
        speech.split(' ')[5]
      }&app_id=fd721777&app_key=7162062d5e79210452cd7df45c2196b5`
    ).then(function(response) {
      return response.json()
    })
    const ingredients = recipes.hits[0].recipe.ingredientLines
    if (speech.split(' ')[5] === undefined || recipes === undefined) {
      const utter = new SpeechSynthesisUtterance(
        `I could not find the ingredients for ${speech
          .split(' ')
          .slice(5)
          .join(' ')}`
      )
      synth.speak(utter)
      return
    }
    const utter = new SpeechSynthesisUtterance(
      `The ingredients for ${speech
        .split(' ')
        .slice(5)
        .join(' ')} are ${ingredients}`
    )
    synth.speak(utter)
  } catch (error) {
    console.log(error)
  }
}

const logging = () => {
  recognition.start()
  recognition.onresult = event => {
    console.log(event)
    const speechToText = event.results[0][0].transcript

    textlog.innerText = speechToText

    if (event.results[0].isFinal) {
      if (speechToText.includes('what is your favorite food')) {
        reply('I love pizza!')
      }

      if (speechToText.includes('what are the ingredients for')) {
        getIngredients(speechToText)
      }
    }
  }
}

button.addEventListener('click', () => {
  logging()
})
