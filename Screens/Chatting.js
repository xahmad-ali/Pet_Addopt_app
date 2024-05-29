import { collection, query, addDoc, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase_File";
import { fetchUserDataById, fetch_media_fireStorage } from "../UserFunctions";
import React, { useState, useCallback, useEffect } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { useRoute } from "@react-navigation/native";
import { View, Text, Image,StyleSheet,ImageBackground } from "react-native";


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
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/c0.jpg')}
        style={styles.backgroundImage}
        blurRadius={4}
      >
        {otherUser && (
          <View style={styles.userInfoContainer}>
            {otherUser.profilePic && (
              <Image
                source={{ uri: otherUser.profilePic }}
                style={styles.profileImage}
              />
            )}
            <Text style={styles.userName}>{otherUser.UserName}</Text>
          </View>
        )}
        <GiftedChat
          style={styles.giftedChat}
          messages={messages}
          onSend={onSend}
          user={{ _id: senderId }}
          renderBubble={renderBubble}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  userInfoContainer: {
    flexDirection: "row",
    padding: 30,
    paddingTop: 20,
    backgroundColor:'blanchedalmond'
  },
  profileImage: {
    width: 49,
    height: 50,
    borderRadius: 30,
    marginRight: 10,
    top:20
  },
  userName: {
    fontSize: 35,
    fontWeight: "300",
    color: "chocolate",
    top: 30,
    left: 10,
  },
  giftedChat: {
    flex: 1,
    backgroundColor: "white",
  },
});

export { Chatting };
