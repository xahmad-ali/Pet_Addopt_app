import { View, Text } from 'react-native'
import React, { useState } from 'react';
import { auth,db } from './Firebase_File.js';
import { collection, query, where, getDocs } from 'firebase/firestore';



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
  


export {get_currentUser,fetchUser};