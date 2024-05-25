import { View, Text } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { useRoute } from "@react-navigation/native";
import {
  collection,
  query,
  addDoc,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../Firebase_File";

const Chatting = () => {
  const [messages, setMessages] = useState([]);
  const route = useRoute();
  const senderId = route.params.senderId;
  const ownerId = route.params.ownerId

  useEffect(() => {
    console.log(senderId)
    console.log(ownerId)

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
    <GiftedChat
      style={{ flex: 1, backgroundColor: "yellow" }}
      messages={messages}
      onSend={onSend}
      user={{ _id: senderId }}
      renderBubble={renderBubble}
    />
  );
};

export { Chatting };
