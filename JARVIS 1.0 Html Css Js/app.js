const btn = document.querySelector(".talk");
const content = document.querySelector(".content");
let mediaStream = null; // To keep a reference to the media stream
let mediaRecorder = null; // To keep a reference to the media recorder
let recordedChunks = []; // To store recorded video data

let selectedVoice = null;

// Function to update the selected voice based on the dropdown selection
function updateVoice() {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  const selectedMode = document.getElementById("voiceMode").value;

  switch (selectedMode) {
    case "male":
      selectedVoice = voices.find((voice) =>
        voice.name.toLowerCase().includes("male")
      );
      break;
    case "female":
      selectedVoice = voices.find((voice) =>
        voice.name.toLowerCase().includes("female")
      );
      break;

    default:
      selectedVoice = null;
      break;
  }
}

// Update voice selection when the dropdown changes
document.getElementById("voiceMode").addEventListener("change", updateVoice);

// Function to speak text with the selected voice
function speak(text) {
  const text_speak = new SpeechSynthesisUtterance(text);
  text_speak.rate = 1;
  text_speak.volume = 1;
  text_speak.pitch = 1;

  if (selectedVoice) {
    text_speak.voice = selectedVoice;
  }

  window.speechSynthesis.speak(text_speak);
}

// Initial call to populate voice options
updateVoice();

function wishMe() {
  const day = new Date();
  const hour = day.getHours();

  if (hour >= 0 && hour < 12) {
    speak("Good Morning Sir...");
  } else if (hour >= 12 && hour < 17) {
    speak("Good Afternoon Sir...");
  } else if (hour >= 17 && hour < 21) {
    speak("Good Evening Sir...");
  } else {
    speak("Good Night Sir...");
  }
}

window.addEventListener("load", () => {
  speak("Initializing JARVIS...");
  wishMe();
});

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  speak("Sorry, your browser does not support speech recognition.");
} else {
  const recognition = new SpeechRecognition();

  recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
  };

  recognition.onerror = (event) => {
    speak("There was an error with the speech recognition service.");
    console.error(event.error);
  };

  btn.addEventListener("click", () => {
    content.textContent = "Listening...";
    recognition.start();
  });

  // Add this for mobile support
  document.addEventListener("DOMContentLoaded", function () {
    if ("ontouchstart" in document.documentElement) {
      btn.addEventListener("touchstart", () => {
        content.textContent = "Listening...";
        recognition.start();
      });
    }
  });
}

const questionsAndAnswers = [
  {
    question: "what is your name",
    answer: "My name is JARVIS, your virtual assistant.",
  },
  {
    question: "what can you do",
    answer:
      "I can help you with a variety of tasks such as checking the weather, setting reminders, answering general questions, and much more.",
  },
  {
    question: "tell me a joke",
    answer:
      "Why don't scientists trust atoms? Because they make up everything!",
  },
  {
    question: "tell me a fun fact",
    answer:
      "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
  },
  {
    question: "what's the meaning of life",
    answer:
      "The meaning of life is a philosophical question that has been debated for centuries. Many believe it is to find happiness and purpose.",
  },
  {
    question: "what's the meaning of life?",
    answer:
      "The meaning of life is a philosophical question that has been explored for centuries. Some say it's about seeking happiness, others believe it's about finding purpose or love.",
  },
  {
    question: "tell me a fun fact.",
    answer:
      "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!",
  },
  {
    question: "can you beatbox",
    answer:
      "I can't physically beatbox, but I can try to mimic the sound: 'Boots and cats and boots and cats!'",
  },
  {
    question: "what's your favourite colour",
    answer:
      "As an AI, I don't have personal preferences, but blue is a color often associated with calm and intelligence.",
  },
  {
    question: "tell me a story",
    answer:
      "Once upon a time, in a land far away, there was a magical forest where every tree had a secret. One day, a young explorer discovered a tree that granted wishes. With each wish granted, the explorer learned valuable lessons about kindness, courage, and friendship.",
  },
];

async function getCapitalOfCountry(countryName) {
  const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Could not find information for ${countryName}`);
    }
    const data = await response.json();
    const capital = data[0].capital[0];
    return `The capital of ${countryName} is ${capital}.`;
  } catch (error) {
    console.error(error);
    return `Sorry, I couldn't retrieve the capital for ${countryName}.`;
  }
}

function getAnswer(question) {
  const normalizedQuestion = question.toLowerCase().trim();
  for (const qna of questionsAndAnswers) {
    if (normalizedQuestion.includes(qna.question.toLowerCase())) {
      return qna.answer;
    }
  }
  return "I'm not sure how to answer that.";
}
function extractTime(message) {
  const timePattern = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
  const match = message.match(timePattern);

  if (match) {
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3] ? match[3].toUpperCase() : null;

    console.log(
      `Extracted hours: ${hours}, minutes: ${minutes}, period: ${period}`
    );

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return { hours, minutes, period };
  }

  return null;
}
function setAlarm(time) {
  const { hours, minutes, period } = time;
  const now = new Date();
  const alarmTime = new Date(now);

  alarmTime.setHours(hours);
  alarmTime.setMinutes(minutes);
  alarmTime.setSeconds(0);

  console.log(`Current time: ${now.toLocaleTimeString()}`);
  console.log(`Alarm time: ${alarmTime.toLocaleTimeString()}`);

  if (alarmTime <= now) {
    alarmTime.setDate(alarmTime.getDate() + 1);
  }

  const timeDifference = alarmTime - now;

  setTimeout(() => {
    playAlarmSound();
    speak("Your alarm is ringing!");
  }, timeDifference);

  speak(
    `Alarm set for ${alarmTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`
  );
}

function playAlarmSound() {
  const alarmSound = new Audio("audio/alarm-sound.mp3"); // Ensure the path is correct
  alarmSound.play().catch((error) => {
    console.error("Error playing alarm sound:", error);
  });
}
function processCommand(command) {
  const numbers = command.match(/\d+/g)?.map(Number) || [];
  let result;

  if (numbers.length === 0) {
    // If no numbers are found, return early
    return false;
  }

  if (command.includes("add") || command.includes("+")) {
    result = numbers.reduce((a, b) => a + b);
  } else if (
    command.includes("subtract") ||
    command.includes("minus") ||
    command.includes("-")
  ) {
    result = numbers.reduce((a, b) => a - b);
  } else if (
    command.includes("multiply") ||
    command.includes("times") ||
    command.includes("x")
  ) {
    result = numbers.reduce((a, b) => a * b);
  } else if (command.includes("divide") || command.includes("/")) {
    result = numbers.reduce((a, b) => a / b);
  } else if (command.includes("square")) {
    result = numbers[0] ** 2;
  } else if (command.includes("cube")) {
    result = numbers[0] ** 3;
  } else {
    result = null; // return null if it's not a recognized math operation
  }

  if (result !== null) {
    speakResult(result);
    document.getElementById("result").innerText = `Result: ${result}`;
    return true; // return true if a valid operation was processed
  }

  return false; // return false if no valid operation was processed
}

function speakResult(result) {
  const speech = new SpeechSynthesisUtterance(`The answer is ${result}`);
  speechSynthesis.speak(speech);
}

function takeCommand(message) {
  console.log("Received command:", message);

  const content = document.getElementById("content");

  const mathProcessed = processCommand(message);

  // If a math command was processed, stop further execution
  if (mathProcessed) return;

  const answer = getAnswer(message);
  if (answer !== "I'm not sure how to answer that.") {
    speak(answer);
    content.textContent = answer;
    return;
  }

  if (message.includes("set alarm")) {
    const time = extractTime(message);
    if (time) {
      setAlarm(time);
      const response = `Alarm set for ${time.hours}:${
        time.minutes < 10 ? "0" : ""
      }${time.minutes}`;
      speak(response);
      content.textContent = response;
    } else {
      speak("Please specify a valid time for the alarm.");
      content.textContent = "Please specify a valid time for the alarm.";
    }
    return;
  }

  if (
    message.includes("nearest restaurant") ||
    message.includes("restaurants near me")
  ) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          findNearestRestaurants(location).then((restaurants) => {
            const response = `Here are some restaurants near you:\n${restaurants}`;
            speak(response);
            content.textContent = response;
          });
        },
        () => {
          speak("Could not get your location.");
        }
      );
    } else {
      speak("Geolocation is not supported by this browser.");
    }
  } else if (
    message.includes("today's weather") ||
    message.includes("today weather")
  ) {
    const cityName = message.split("in")[1]?.trim();
    if (cityName) {
      getWeatherReport(cityName).then((weatherInfo) => {
        speak(weatherInfo);
        content.textContent = weatherInfo;
      });
    } else {
      speak("Please specify a city name.");
    }
  } else if (
    message.includes("today's headlines") ||
    message.includes("headline news")
  ) {
    const location = message.split("in")[1]?.trim() || "";
    getTodayHeadlines(location).then((headlines) => {
      speak(
        `Today's headlines${
          location ? ` in ${location}` : ""
        } are:\n${headlines}`
      );
      content.textContent = `Today's headlines${
        location ? ` in ${location}` : ""
      } are:\n${headlines}`;
    });
  } else if (
    message.includes("live cricket score") ||
    message.includes("cricket score") ||
    message.includes("today score")
  ) {
    getLiveCricketScores().then((scores) => {
      speak(`Current cricket scores are:\n${scores}`);
      content.textContent = `Current cricket scores are:\n${scores}`;
    });
  } else if (message.toLowerCase().includes("what sound does a")) {
    const animal = message
      .split("what sound does a")[1]
      ?.trim()
      .replace("make", "")
      .trim();
    if (animal) {
      playAnimalSound(animal);
    } else {
      speak("Please specify an animal.");
    }
  } else if (message.includes("animal sound")) {
    const animal = message.split("sound of")[1]?.trim();
    if (animal) {
      playAnimalSound(animal);
    } else {
      speak("Please specify an animal.");
    }
  } else if (message.includes("set a timer for")) {
    const time = message.split("set a timer for")[1]?.trim();
    if (time) {
      setTimer(time);
    } else {
      speak("Please specify a time for the timer.");
    }
  } else if (
    message.includes("hey") ||
    message.includes("hello") ||
    message.includes("hi jarvis")
  ) {
    speak("Hello Sir, How May I Help You?");
  } else if (
    message.includes("how are you") ||
    message.includes("how are you doing") ||
    message.includes("how do you do") ||
    message.includes("what's up")
  ) {
    speak("I'm fine, Sir. What about you?");
  } else if (message.includes("open google")) {
    window.open("https://google.com", "_blank");
    speak("Opening Google...");
  } else if (message.includes("open youtube")) {
    window.open("https://youtube.com", "_blank");
    speak("Opening YouTube...");
  } else if (message.includes("open facebook")) {
    window.open("https://facebook.com", "_blank");
    speak("Opening Facebook...");
  } else if (message.includes("open whatsapp")) {
    window.open("https://wa.me/", "_blank");
    speak("Opening WhatsApp...");
  } else if (message.includes("open instagram")) {
    window.open("https://instagram.com", "_blank");
    speak("Opening Instagram...");
  } else if (message.includes("map")) {
    window.open("https://maps.google.com", "_blank");
    speak("Opening Google Maps...");
  } else if (message.includes("open camera")) {
    openCamera();
  } else if (message.includes("close camera")) {
    closeCamera();
  } else if (message.includes("click photo")) {
    clickPhoto();
  } else if (message.includes("take video")) {
    startRecording();
  } else if (message.includes("stop video")) {
    stopRecording();
  } else if (message.includes("call")) {
    const name = message.split("call")[1]?.trim();
    if (name) {
      fetch(`http://localhost:3000/api/call-contact/${name}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          const content = document.getElementById("content");
          if (content) {
            if (data.success) {
              speak(data.message);
              content.textContent = data.message;

              if (/Mobi|Android/i.test(navigator.userAgent)) {
                window.location.href = `tel:${data.phoneNumber}`;
              } else {
                alert(
                  `Simulating a call to ${data.phoneNumber}. Please use a mobile device to call.`
                );
              }
            } else {
              speak(data.message || "Failed to initiate call.");
              content.textContent = data.message || "Failed to initiate call.";
            }
          } else {
            console.error("Content element not found!");
          }
        })
        .catch((error) => {
          console.error("Call API error:", error);
          const content = document.getElementById("content");
          if (content) {
            content.textContent =
              "An error occurred while trying to make the call.";
          }
          speak("An error occurred while trying to make the call.");
        });
    } else {
      const content = document.getElementById("content");
      if (content) {
        speak("Please specify a name to call.");
        content.textContent = "Please specify a name to call.";
      } else {
        console.error("Content element not found!");
      }
    }
  } else if (message.includes("play")) {
    playSong(message);
  } else if (message.includes("what is the capital of")) {
    const countryName = message.split("of")[1].trim();
    getCapitalOfCountry(countryName).then((capitalInfo) => {
      speak(capitalInfo);
      content.textContent = capitalInfo;
    });
  } else if (
    message.includes("what is") ||
    message.includes("who is") ||
    message.includes("what are")
  ) {
    window.open(
      `https://www.google.com/search?q=${message.replace(" ", "+")}`,
      "_blank"
    );
    const finalText =
      "This is what I found on the internet regarding " + message;
    speak(finalText);
  } else if (message.includes("wikipedia")) {
    window.open(
      `https://en.wikipedia.org/wiki/${message.replace("wikipedia", "")}`,
      "_blank"
    );
    const finalText = "This is what I found on Wikipedia regarding " + message;
    speak(finalText);
  } else if (message.includes("time")) {
    const time = new Date().toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
    });
    speak(`The time is ${time}`);
  } else if (message.includes("date")) {
    const date = new Date().toLocaleString(undefined, {
      month: "short",
      day: "numeric",
    });
    speak(`Today's date is ${date}`);
  } else if (message.includes("calculator")) {
    window.open("Calculator:///");
    speak("Opening Calculator");
  } else {
    window.open(
      `https://www.google.com/search?q=${message.replace(" ", "+")}`,
      "_blank"
    );
    speak(`I found some information for ${message} on Google`);
  }
}

function playAnimalSound(animal) {
  const sounds = {
    cat: "audio/soundscat.mp3",
    dog: "audio/soundsdog.mp3",
    rabbit: "audio/soundsrabbit.mp3",
    parrot: "audio/soundsparrot.mp3",
    hamster: "audio/soundshamster.mp3",
    pig: "audio/soundspig.mp3",
    lion: "audio/soundslion.mp3",
    elephant: "audio/soundselephant.mp3",
    tiger: "audio/soundstiger.mp3",
    bear: "audio/soundsbear.mp3",
    wolf: "audio/soundswolf.mp3",
    monkey: "audio/soundsmonkey.mp3",
    snake: "audio/soundssnake.mp3",
    leopard: "audio/soundsleopard.mp3",
    deer: "audio/soundsdeer.mp3",
    zebra: "audio/soundszebra.mp3",
    dolphin: "audio/soundsdolphin.mp3",
    whale: "audio/soundswhale.mp3",
    shark: "audio/soundsshark.mp3",
    seal: "audio/soundsseal.mp3",
    fish: "audio/soundsfish.mp3",
    frog: "audio/soundsfrog.mp3",
    otter: "audio/soundsotter.mp3",
    penguin: "audio/soundspenguin.mp3",
    horse: "audio/soundshorse.mp3",
    chicken: "audio/soundschicken.mp3",
    cow: "audio/soundscow.mp3",
    donkey: "audio/soundsdonkey.mp3",
    goat: "audio/soundsgoat.mp3",
    sheep: "audio/soundssheep.mp3",
    camel: "audio/soundscamel.mp3",
    koala: "audio/soundskoala.mp3",
    kangaroo: "audio/soundskangaroo.mp3",
    buffalo: "audio/soundsbuffalo.mp3",
    crocodile: "audio/soundscrocodile.mp3",
    owl: "audio/soundsowl.mp3",
    fox: "audio/soundsfox.mp3",
    peacock: "audio/soundspeacock.mp3",
    turkey: "audio/soundsturkey.mp3",
    flamingo: "audio/soundsflamingo.mp3",
    cheetah: "audio/soundscheetah.mp3",
    gorilla: "audio/soundsgorilla.mp3",
  };

  const soundFile = sounds[animal.toLowerCase()];

  if (soundFile) {
    const audio = new Audio(soundFile);
    audio.play();
  } else {
    speak("Sorry, I don't have the sound for that animal.");
  }
}

function playSong(message) {
  const songQuery = message.replace("play", "").trim();
  if (songQuery) {
    window.open(
      `https://www.youtube.com/results?search_query=${songQuery}`,
      "_blank"
    );
    speak(`Playing ${songQuery} on YouTube.`);
  } else {
    speak("Please specify a song to play.");
  }
}

function openCamera() {
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    if (/Android/i.test(navigator.userAgent)) {
      window.location.href =
        "intent://#Intent;action=android.media.action.IMAGE_CAPTURE;end";
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = "camera://";
    }
  } else {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        mediaStream = stream;
        const videoElement = document.createElement("video");
        videoElement.id = "cameraStream";
        videoElement.srcObject = stream;
        videoElement.play();
        document.body.appendChild(videoElement);
        speak("Camera opened on your device.");
      })
      .catch((error) => {
        console.error(error);
        speak("There was an error opening the camera on your device.");
      });
  }
}

function closeCamera() {
  const videoElement = document.getElementById("cameraStream");
  if (videoElement) {
    const stream = videoElement.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    videoElement.srcObject = null;
    document.body.removeChild(videoElement);
    speak("Camera closed.");
  } else {
    speak("Camera is not currently open.");
  }
}

function clickPhoto() {
  const videoElement = document.getElementById("cameraStream");
  if (videoElement) {
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const img = document.createElement("img");
    img.src = canvas.toDataURL("image/png");
    document.body.appendChild(img);

    speak("Photo clicked.");
  } else {
    speak("Camera is not currently open.");
  }
}

function startRecording() {
  if (!mediaRecorder) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        mediaStream = stream;
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, {
            type: "video/webm",
          });
          const url = URL.createObjectURL(blob);
          const videoElement = document.createElement("video");
          videoElement.controls = true;
          videoElement.src = url;
          document.body.appendChild(videoElement);
          speak("Recording stopped and video saved.");
          recordedChunks = [];
        };

        mediaRecorder.start();
        speak("Recording started.");
      })
      .catch((error) => {
        console.error("Error accessing camera/microphone: ", error);
        speak("Could not access camera/microphone.");
      });
  } else {
    speak("Recording is already in progress.");
  }
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
    mediaStream.getTracks().forEach((track) => track.stop());
    mediaRecorder = null;
    mediaStream = null;
    speak("Recording stopped.");
  } else {
    speak("No recording is currently in progress.");
  }
}

async function getWeatherReport(cityName) {
  const apiKey = "2a0dde5968511fe8fbb9c91ec2591df8";
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},IN&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Weather data not available for ${cityName}`);
    }
    const data = await response.json();
    const weatherDescription = data.weather[0].description;
    const temperature = data.main.temp;
    return `The weather in ${cityName} is currently ${weatherDescription} with a temperature of ${temperature} degrees Celsius.`;
  } catch (error) {
    console.error(error);
    return `Sorry, I couldn't retrieve the weather information for ${cityName}.`;
  }
}

async function getTodayHeadlines() {
  const apiKey = "a6a2fda95e0a4d8d964da2ba88a46b2e"; // Your NewsAPI key
  const apiUrl = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }
    const data = await response.json();
    const articles = data.articles.slice(0, 5); // Get the top 5 headlines
    if (articles.length === 0) {
      return "No headlines available at the moment.";
    }
    return articles
      .map((article, index) => `${index + 1}. ${article.title}`)
      .join("\n");
  } catch (error) {
    console.error(error);
    return "Sorry, I couldn't retrieve today's headlines.";
  }
}

async function getLiveCricketScores() {
  const apiKey = "54848ea3-db0d-4189-9068-59386c0b1e2b"; // Replace with your Cricket API key
  const apiUrl = `https://api.cricapi.com/v1/countries?apikey=54848ea3-db0d-4189-9068-59386c0b1e2b&offset=0`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch live scores");
    }
    const data = await response.json();
    if (!data || !data.matches || data.matches.length === 0) {
      return "No live cricket matches at the moment.";
    }
    const scores = data.matches
      .map((match) => {
        const { team1, team2, score1, score2, status } = match;
        return `${team1} vs ${team2}: ${score1} - ${score2} (${status})`;
      })
      .join("\n");
    return scores;
  } catch (error) {
    console.error(error);
    return "Sorry, I couldn't retrieve live cricket scores.";
  }
}

function setTimer(timeString) {
  let totalSeconds = 0;
  const timeParts = timeString.toLowerCase().split(" ");

  // Iterate over the time parts to calculate total seconds
  for (let i = 0; i < timeParts.length; i++) {
    const value = parseInt(timeParts[i]);

    if (isNaN(value)) continue; // Skip if the part is not a number

    const nextPart = timeParts[i + 1] || ""; // Get the next part to check for unit

    // Check for minutes
    if (nextPart.includes("minute") || nextPart.includes("min")) {
      totalSeconds += value * 60;
      i++; // Skip the next part as it's the unit
    }
    // Check for seconds
    else if (nextPart.includes("second") || nextPart.includes("sec")) {
      totalSeconds += value;
      i++;
    }
    // Check for hours
    else if (nextPart.includes("hour") || nextPart.includes("hr")) {
      totalSeconds += value * 3600;
      i++;
    }
  }

  // Provide feedback and set the timer
  if (totalSeconds > 0) {
    speak(`Setting a timer for ${timeString}.`);
    content.textContent = `Timer set for ${timeString}.`;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const remainingSeconds = totalSeconds - elapsedSeconds;

      if (remainingSeconds > 0) {
        if (remainingSeconds % 60 === 0) {
          const minutesLeft = Math.floor(remainingSeconds / 60);
          const secondsLeft = remainingSeconds % 60;
          const timeLeft = `${
            minutesLeft > 0
              ? minutesLeft + " minute" + (minutesLeft > 1 ? "s" : "")
              : ""
          } ${
            secondsLeft > 0
              ? secondsLeft + " second" + (secondsLeft > 1 ? "s" : "")
              : ""
          }`.trim();
          speak(`You have ${timeLeft} left on your timer.`);
          content.textContent = `Remaining time: ${timeLeft}`;
        }
      } else {
        clearInterval(interval);
        speak("Time's up!");
        content.textContent = "Time's up!";
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      speak("Time's up!");
      content.textContent = "Time's up!";
    }, totalSeconds * 1000);
  } else {
    speak("Sorry, I couldn't understand the time duration.");
  }
}
async function findNearestRestaurants(location) {
  const apiUrl = `http://localhost:3000/api/nearby-restaurants?location=${location.lat},${location.lng}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch restaurants");
    }
    const data = await response.json();
    const results = data.results;

    if (results.length === 0) {
      return "No restaurants found near your location.";
    }

    return results
      .map((place, index) => `${index + 1}. ${place.name} - ${place.vicinity}`)
      .join("\n");
  } catch (error) {
    console.error(error);
    return "Sorry, I couldn't retrieve restaurant information.";
  }
}
