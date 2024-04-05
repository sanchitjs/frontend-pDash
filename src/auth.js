import { auth, firestore } from './firebase.js';
import { collection, getDocs } from "firebase/firestore";

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

export const fetchUserRoleFromFirestore = async (userId) => {
  try {
    const userDoc = await getDocs(collection(firestore, 'users'));
    let userRole = 'user'; // Default role in case the user is not found

    userDoc.docs.forEach((doc) => {
      const user = { ...doc.data(), id: doc.id };
      if (user.id === userId) {
        userRole = user.role; // Set the userRole if the user is found
      }
    });
    // console.log(userRole);
    return userRole;
  } catch (error) {
    console.error('Error fetching user role:', error.message);
    return 'user'; // Return a default role in case of an error
  }
};

export const fetchPlantIDAndPlantNameFromFirestore = async (userId) => {
  try {
    const userDoc = await getDocs(collection(firestore, 'users'));
    let plantID = 'Plant0'; // Default role in case the user is not found
    let plantName = 'Default';
    let userName = 'xx@gmail.com';

    userDoc.docs.forEach((doc) => {
      const user = { ...doc.data(), id: doc.id };
      if (user.id === userId) {
        plantID = user.PlantID; // Set the userRole if the user is found
        plantName = user.PlantName;
        userName = user.email;
      }
    });
    // console.log(plantID);
    return { plantID, plantName, userName };
  } catch (error) {
    console.error('Error fetching Plant ID:', error.message);
    return 'Plant0'; // Return a default role in case of an error
  }
}
