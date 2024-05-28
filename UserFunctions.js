import { auth, db } from "./Firebase_File.js";
import {
  collection,
  getDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import React, { useState } from "react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// Function to get the current user's ID
const get_currentUser = async () => {
  return new Promise((resolve, reject) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log("from getUser:->", currentUser.email);
      console.log("Current user id->", currentUser.uid);
      resolve(currentUser.email); // Resolve with the email of the current user
    } else {
      reject(new Error("No user is logged in")); // Reject with an error if no user is logged in
    }
  });
};

const fetchUser = async (email) => {
  try {
    email = email.toLowerCase(); // Ensure the email is in lowercase
    console.log("Fetching user with email:", email);

    const q = query(collection(db, "users"), where("Email", "==", email));
    const querySnapshot = await getDocs(q);

    console.log(`Query Snapshot: ${querySnapshot.size} documents found`);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    let userData = null;

    querySnapshot.forEach((doc) => {
      // Log entire document data to see structure
      console.log("Document data:", doc.data());
      // Assuming your user document structure contains 'UserName' and 'id' fields
      userData = {
        id: doc.id,
        userName: doc.data().UserName,
        DOB: doc.data()?.DOB || "",
        City: doc.data()?.City || "",
      };
    });

    if (userData) {
      console.log("User found:", userData);
      return userData;
    } else {
      console.log("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }
};

const fetchAllAnimals = async (ownerId) => {
  try {
    // Fetch all animalInfo documents for the specified owner from Firestore
    const animalInfoCollectionRef = collection(
      db,
      "owner",
      ownerId,
      "animalinfo"
    );
    const animalInfoQuerySnapshot = await getDocs(animalInfoCollectionRef);

    const allAnimalInfo = [];

    // Iterate over each animalInfo document
    animalInfoQuerySnapshot.forEach((animalDoc) => {
      allAnimalInfo.push({
        ownerId: ownerId,
        animalId: animalDoc.id,
        ...animalDoc.data(),
      });
    });

    console.log("All animal info:", allAnimalInfo);
    return allAnimalInfo;
  } catch (error) {
    console.error("Error fetching animal information:", error.message);
    return [];
  }
};



/*
const fetchAnimalData = (setAnimals, setAnimalIds) => {
  console.log("Setting up real-time Firestore listener");
  const q = query(collection(db, "animalinfo"));

  // Listen for real-time updates
  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      console.log(`Query Snapshot: ${querySnapshot.size} documents found`);

      if (querySnapshot.empty) {
        console.log("No matching documents.");
        setAnimals([]);
        setAnimalIds([]);
        return;
      }

      const animalData = [];
      const animalIds = [];

      querySnapshot.forEach((doc) => {
        const animal = {
          id: doc.id,
          ...doc.data(),
        };
        animalData.push(animal);
        animalIds.push(doc.id);
      });

      console.log("Animal data: from real-time listener", animalData);
      setAnimals(animalData);
      setAnimalIds(animalIds);
    },
    (error) => {
      console.error("Error fetching animal data:", error.message);
      setAnimals([]);
      setAnimalIds([]);
    }
  );

  // Return the unsubscribe function to stop listening for updates when the component unmounts
  return unsubscribe;
};
*/

const fetchAnimalData = async (setAnimals, setAnimalIds) => {
  console.log("Fetching data from Firestore");

  const q = query(collection(db, "animalinfo"));

  try {
    const querySnapshot = await getDocs(q);
    console.log(`Query Snapshot: ${querySnapshot.size} documents found`);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      setAnimals([]);
      setAnimalIds([]);
      return;
    }

    const animalData = [];
    const animalIds = [];

    querySnapshot.forEach((doc) => {
      const animal = {
        id: doc.id,
        ...doc.data(),
      };
      animalData.push(animal);
      animalIds.push(doc.id);
    });

    console.log("Animal data:", animalData);
    setAnimals(animalData);
    setAnimalIds(animalIds);
  } catch (error) {
    console.error("Error fetching animal data:", error.message);
    setAnimals([]);
    setAnimalIds([]);
  }
};



const storage = getStorage();
const fetch_media_fireStorage = async (userId) => {
  try {
    // Create a reference to the image in Firebase Storage
    const storageRef = ref(storage, `UserImage/${userId}`);

    // Get the download URL of the image
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Image download URL:", downloadURL);

    // setImageUri(downloadURL);
    // Return the download URL
    return downloadURL;
  } catch (error) {
    if (error.code === "storage/object-not-found") {
      console.log("Image does not exist");
    } else {
      console.error("Error retrieving image download URL:", error);
    }
    return null;
  }
};

const fetchUserDataById = async (userId) => {
  try {
    console.log("=> in fuction", userId);
    const userDocRef = doc(collection(db, "users"), userId);
    const userDoc = await getDoc(userDocRef);
    console.log("i a in the function ");

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("User data:", userData);
      return {
        id: userDoc.id,
        ...userData,
      };
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null;
  }
};


const removeAnimal =async(myAnimalId)=>{
  try {
    console.log("animal id to be deleted",myAnimalId)
    const animalInfoRef = doc(db, "animalinfo", myAnimalId)
    // Delete the animalinfo document
    await deleteDoc(animalInfoRef);

    console.log(
      `Animal info for animal with ID ${myAnimalId} deleted successfully`
    );
    return true;
  } catch (error) {
    console.error("Error deleting animal info:", error);
  }
};

export {
  get_currentUser,
  fetchUser,
  fetchAnimalData,
  fetch_media_fireStorage,
  fetchUserDataById,
  removeAnimal
};
