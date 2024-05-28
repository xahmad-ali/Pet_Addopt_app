import { collection, query, addDoc, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase_File";
import { fetchUserDataById, fetch_media_fireStorage } from "../UserFunctions";
import React, { useState, useCallback, useEffect } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { useRoute } from "@react-navigation/native";
import { View, Text, Image } from "react-native";


const Chatting = () => {
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const route = useRoute();
  const senderId = route.params.senderId;
  const ownerId = route.params.ownerId;

  useEffect(() => {
    const chatId = [senderId, ownerId].sort().join("_");
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const allMessages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return { ...data, createdAt: data.createdAt.toDate() };
      });
      setMessages(allMessages);
    });




    const fetchOtherUserData = async () => {
      try {
        const userData = await fetchUserDataById(ownerId);
        console.log("Other user data:", userData);
        console.log("user Name:", userData.UserName);
    
        const profilePic = await fetch_media_fireStorage(ownerId);
        setOtherUser({
          ...userData,
          profilePic: profilePic,
        });
      } catch (error) {
        console.error("Error fetching other user data:", error);
      }
    };
    

    fetchOtherUserData();

    return () => unsubscribe();
  }, [senderId, ownerId]);

  const onSend = useCallback(
    async (messageArray = []) => {
      const msg = messageArray[0];
      const Mymsg = {
        ...msg,
        sendBy: senderId,
        receiverId: ownerId,
        createdAt: msg.createdAt,
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, Mymsg)
      );

      const chatId = [senderId, ownerId].sort().join("_");

      try {
        await addDoc(collection(db, "chats", chatId, "messages"), Mymsg);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [senderId, ownerId]
  );

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{ right: { backgroundColor: "pink" } }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {otherUser && (
        <View style={{ flexDirection: "row", padding: 30, top: 20 }}>
          {otherUser.profilePic && (
            <Image
              source={{ uri: otherUser.profilePic }}
              style={{ width: 50, height: 50, borderRadius: 30, marginRight: 10 }}
            />
          )}
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{otherUser.UserName}</Text>
        </View>
      )}
      <GiftedChat
        style={{ flex: 1, backgroundColor: "yellow" }}
        messages={messages}
        onSend={onSend}
        user={{ _id: senderId }}
        renderBubble={renderBubble}
      />
    </View>
  );
};
  
export { Chatting };