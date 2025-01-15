const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.database().ref("messages");
const storage = firebase.storage().ref();

const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");
const fileInput = document.getElementById("file-input");
const uploadBtn = document.getElementById("upload-btn");
const messagesContainer = document.getElementById("messages");

sendBtn.addEventListener("click", () => {
  const message = messageInput.value;
  if (message) {
    db.push().set({
      user: "Josiah",
      text: message,
      timestamp: Date.now(),
    });
    messageInput.value = "";
  }
});

db.on("child_added", (snapshot) => {
  const message = snapshot.val();
  const messageElement = document.createElement("div");
  messageElement.textContent = message.text;
  messagesContainer.appendChild(messageElement);
});

uploadBtn.addEventListener("click", () => {
  const file = fileInput.files[0];
  if (file) {
    const fileRef = storage.child(`files/${file.name}`);
    fileRef.put(file).then(() => {
      fileRef.getDownloadURL().then((url) => {
        db.push().set({
          user: "Josiah",
          text: url, // Store the file URL in the database
          timestamp: Date.now(),
        });
      });
    });
  }
});

// Play notification sound
const notificationSound = new Audio("notification.mp3");

db.on("child_added", () => {
  notificationSound.play();
  if (document.hidden) {
    document.title = "New message!";
  }
});
