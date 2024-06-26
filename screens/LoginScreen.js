import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { useEffect, useState } from "react";
import { Card, CheckBox } from "react-native-elements";
import { FIREBASE_APP, FIREBASE_AUTH } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setLevel } from "../Progress/CourseSlice";
import * as SecureStore from "expo-secure-store";
import { FIRESTORE_DB } from "../firebaseConfig";

const auth = FIREBASE_AUTH;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    SecureStore.getItemAsync("userinfo").then((userdata) => {
      const userInfo = JSON.parse(userdata);
      if (userInfo) {
        setEmail(userInfo.email);
        setPassword(userInfo.password);
        setRemember(true);
      }
    });
  }, []);

  const Login = async () => {
    console.log("Email: ", email);
    console.log("Password: ", password);
    console.log("remember: ", remember);

    if (remember) {
      try {
        await SecureStore.setItemAsync(
          "userinfo",
          JSON.stringify({
            email,
            password,
          })
        );
        console.log("User info saved.");
      } catch (error) {
        console.log("Could not save user info", error);
      }
    } else {
      try {
        await SecureStore.deleteItemAsync("userinfo");
        console.log("User info deleted.");
      } catch (error) {
        console.log("Could not delete user info", error);
      }
    }

    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      const db = FIRESTORE_DB;
      const userRef = doc(db, "users", response.user.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      console.log("user data fetched from firestore:", userData);

      const completedLevel = userData.completedLevel;
      console.log(
        "completedLevel data fetched from firestore:",
        completedLevel
      );
      dispatch(setLevel(completedLevel));

      navigation.navigate("Main");
    } catch (error) {
      console.error(error);
      alert("Login failed " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView behavior="padding">
        <Card containerStyle={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            autoCapitalize="none"
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            autoCapitalize="none"
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          {loading ? (
            <ActivityIndicator size="large" color="hotpink" />
          ) : (
            <>
              <CheckBox
                title="Remember Me"
                center
                checked={remember}
                onPress={() => setRemember(!remember)}
                containerStyle={styles.formCheckbox}
              />
            </>
          )}
          <View style={styles.btnContainer}>
            <Button
              color={"rgba(124, 252, 0, .7)"}
              title="Login"
              onPress={Login}
            />
          </View>
        </Card>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  card: {
    backgroundColor: "rgba(245, 245, 220, .5)",
    alignContent: "center",
    margin: 23,
    borderRadius: 22,
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
    shadowColor: "rgba(125, 0, 0, .9)",
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 33,
    elevation: 3,
  },
  btnContainer: {
    margin: -7,
    padding: 16,
    color: "rgba(240, 255, 240, .3)",
  },
  formCheckbox: {
    padding: 2,
    backgroundColor: "rgba(240, 255, 240, .3)",
  },
});

export default LoginScreen;
