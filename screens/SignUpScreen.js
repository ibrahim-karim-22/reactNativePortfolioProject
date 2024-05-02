import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Card } from "react-native-elements";
import { useState } from "react";
import auth from "@react-native-firebase/auth";

const SignUpScreen = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const userCredentials = await auth().createUserWithEmailAndPassword(email, password)
      console.log("User signed up successfully: ", userCredentials.user)
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Card containerStyle={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.btn}>
          <Button
            title="Sign Up"
            color="firebrick"
            onPress={handleSignUp}
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  card: {
    backgroundColor: "silver",
    alignContent: "center",
    margin: 23,
    top: 155,
    borderRadius: 33,
  },
  title: {
    color: "white",
    fontSize: 22,
    marginBottom: 12,
    textAlign: "center",
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    backgroundColor: "gainsboro",
    fontSize: 18,
    padding: 22,
    margin: 5,
    borderRadius: 222,
    shadowColor: "steelblue",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 33,
    elevation: 5,
  },
  btn: {
    padding: 22,
  },
});

export default SignUpScreen;
