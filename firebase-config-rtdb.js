// Firebase Realtime Database Configuration File
// INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing)
// 3. Click "Add app" and choose "Web" (</> icon)
// 4. Copy your Firebase config and replace the firebaseConfig object below
// 5. Enable Authentication: Go to Authentication > Sign-in method > Enable Email/Password
// 6. Enable Realtime Database: Go to Realtime Database > Create database > Start in test mode

// Your Firebase configuration (REPLACE THIS with your actual config from Firebase Console)
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNg9T8WJzi13G-YyNr8NG1pZSAwT76ouo",
  authDomain: "studyhub-4ca9f.firebaseapp.com",
  projectId: "studyhub-4ca9f",
  storageBucket: "studyhub-4ca9f.firebasestorage.app",
  messagingSenderId: "768399524205",
  appId: "1:768399524205:web:b03e62c68ec4f0435e5a64",
  measurementId: "G-71R8VCPE7L"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const database = firebase.database(); // Realtime Database
const storage = firebase.storage();

// Helper function to get current user ID
function getCurrentUserId() {
  return auth.currentUser ? auth.currentUser.uid : null;
}

// Helper function to get current user email
function getCurrentUserEmail() {
  return auth.currentUser ? auth.currentUser.email : null;
}

// Helper function to get current user display name
function getCurrentUserName() {
  return auth.currentUser ? auth.currentUser.displayName : null;
}

// Check authentication state
function checkAuth(redirectTo = 'homepage.html') {
  return new Promise((resolve, reject) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user);
      } else {
        window.location.href = redirectTo;
        reject('Not authenticated');
      }
    });
  });
}

// Sign out function
async function signOutUser() {
  try {
    await auth.signOut();
    localStorage.clear(); // Clear any cached data
    window.location.href = 'homepage.html';
  } catch (error) {
    console.error('Error signing out:', error);
    alert('Error signing out. Please try again.');
  }
}

// Helper: Save user data to Realtime Database
async function saveUserData(path, data) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Not authenticated');
  
  try {
    await database.ref(`users/${userId}/${path}`).set(data);
    return true;
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
}

// Helper: Get user data from Realtime Database
async function getUserData(path) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Not authenticated');
  
  try {
    const snapshot = await database.ref(`users/${userId}/${path}`).once('value');
    return snapshot.val();
  } catch (error) {
    console.error('Error getting data:', error);
    throw error;
  }
}

// Helper: Update user data (merge with existing)
async function updateUserData(path, data) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Not authenticated');
  
  try {
    await database.ref(`users/${userId}/${path}`).update(data);
    return true;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}

// Helper: Listen to real-time changes
function listenToUserData(path, callback) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Not authenticated');
  
  const ref = database.ref(`users/${userId}/${path}`);
  ref.on('value', (snapshot) => {
    callback(snapshot.val());
  });
  
  // Return function to stop listening
  return () => ref.off('value');
}

console.log('Firebase Realtime Database initialized successfully!');
