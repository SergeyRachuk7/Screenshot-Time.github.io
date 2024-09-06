

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

// Ваші конфігурації Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAcVk5A6uypL5YcaRQpPQblTkYkeovX9oQ",
  authDomain: "screenshot-time-d3455.firebaseapp.com",
  projectId: "screenshot-time-d3455",
  storageBucket: "screenshot-time-d3455.appspot.com",
  messagingSenderId: "482205183848",
  appId: "1:482205183848:web:ea2935d5e02afe8e7e30dd"
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const provider = new GoogleAuthProvider();

const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
const message = document.getElementById("message");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

// Сховати кнопку виходу та повідомлення спочатку
signOutButton.style.display = "none";
message.style.display = "none";
const userSignIn = async => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user
      console.log(user);
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message
    })
}

const userSignOut = async () => {
  signOut(auth).then(() => {
    alert("ви вийшли з системи успішно!")
  }).catch((error) => { })
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    signOutButton.style.display = "block";
    message.style.display = "block";
    userName.innerHTML = user.displayName;
    userEmail.innerHTML = user.email
  } else {
    signOutButton.style.display = "none";
    message.style.display = "none";

  }
})

signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener('click', userSignOut);


document.getElementById('themeToggle').addEventListener('click', function () {
  const container = document.querySelector('.dark-theme, .light-theme');
  container.classList.toggle('dark-theme');
  container.classList.toggle('light-theme');

  // Зміна тексту кнопки
  this.textContent = container.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
});





const TOKEN = "7440822288:AAEDdkHYIniFfuObO7II_M7cyGNCmwP85Uo";
const CHAT_ID = "-1002238772738";
const SEND_API = `https://api.telegram.org/bot${TOKEN}/sendPhoto`;

let captureStream;
let screenshotInterval;

async function startCapture(displayMediaOptions) {
  try {
    captureStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
    document.getElementById('stopButton').style.display = 'block';
    document.getElementById('startButton').style.display = 'none';
  } catch (err) {
    console.error(`Error: ${err}`);
    alert("Не вдалося отримати доступ до екрана.");
  }
  return captureStream;
}

function takeScreenshot() {
  const videoElement = document.createElement('video');
  videoElement.autoplay = true;

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const displayMediaOptions = { video: true };

  if (isMobile) {
    // Для мобільних пристроїв використовуємо getUserMedia
    startCapture({ video: true }).then(stream => {
      videoElement.srcObject = stream;
      captureScreenshots(videoElement);
    });
  } else {
    // Для комп'ютерів використовуємо getDisplayMedia
    startCapture(displayMediaOptions).then(stream => {
      videoElement.srcObject = stream;
      captureScreenshots(videoElement);
    });
  }
}

function captureScreenshots(videoElement) {
  const intervalValue = parseInt(document.getElementById('interval').value) * 60 * 1000; // Перетворюємо в мс 
  screenshotInterval = setInterval(() => {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoElement, 0, 0);

    canvas.toBlob((blob) => {
      sendScreenshot(blob);
      console.log(blob);
    }, 'image/png');
  }, intervalValue);
}

function sendScreenshot(screenshot) {
  const formData = new FormData();
  formData.append("chat_id", CHAT_ID);
  formData.append("photo", screenshot); // Додаємо скрін до formData

  axios.post(SEND_API, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then((res) => {
      console.log("Скріншот надіслано!", res.data);
    })
    .catch((error) => {
      console.error('Error sending screenshot:', error.response ? error.response.data : error.message);
    });
}


function stopScreenshots() {
  clearInterval(screenshotInterval);
  if (captureStream) {
    captureStream.getTracks().forEach(track => track.stop());
  }
  document.getElementById('stopButton').style.display = 'none';
  document.getElementById('startButton').style.display = 'block';
}

document.getElementById('startButton').addEventListener('click', takeScreenshot);
document.getElementById('stopButton').addEventListener('click', stopScreenshots);




document.getElementById('capture').addEventListener('click', () => {
  html2canvas(document.querySelector('#screenshotArea')).then(canvas => {
    const img = document.getElementById('screenshot');
    img.src = canvas.toDataURL();
    img.style.display = 'block';
  });
});