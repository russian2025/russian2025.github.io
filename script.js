﻿let token = null;
fetch('https://openai-server-8ovt.onrender.com/checka',
{
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({ aaa: new URLSearchParams(window.location.search).get('aaa') })
})
.then(response => response.json())
.then(data => {
 if (data.success) token = data.token;
 else alert('Sorry.');
 //else windows.close();
})
.catch(error => console.error('Eroare:', error));

let sendButton = window.document.getElementById('sendButton');
let inp = window.document.getElementById('textInput');
let outp = window.document.getElementById('textOutput');
let conversation = [];

let speech2text = new webkitSpeechRecognition();
let text2speech = window.speechSynthesis;

const speech = () => {
 speech2text.lang = 'ru-RU';
 speech2text.start();
 sendButton.innerText = 'Говорите...';
}

const talk = (text) => {
 let textToTalk = new SpeechSynthesisUtterance(text);
 textToTalk.onend = function(event) {
 sendButton.innerText = 'Хотите еще что нибудь спросить? Нажмите здесь - и говорите';
 };
 textToTalk.lang = 'ru-RU';
 textToTalk.rate = 0.5;
 textToTalk.pitch = 2.0;
 text2speech.speak(textToTalk);
}

speech2text.onresult = (event) => {                    
 inp.value = event.results[0][0].transcript;
 requestFunc();
}
const requestFunc = () => {
 if (inp.value && token) {
  sendButton.innerText = 'Минуточку...';
  let message = { "role": "user", "content": inp.value };
  conversation.push(message);
  axios.post('https://openai-server-8ovt.onrender.com/api/chat',
  {
   messages: conversation,
   token: token
  })
  .then(response => {
   let aiResponse = response.data.choices[0].message.content;
   outp.value = aiResponse;
   conversation.push({ "role": "assistant", "content": aiResponse });
   talk(aiResponse);
  })
  .catch(error => {
   console.error("Error request:", error.message);
   sendButton.innerText = 'Eroare API_KEY';
  });
 }
}
