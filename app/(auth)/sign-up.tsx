
import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, TextInput, View, Text } from "react-native";

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    try {
      await signUp.create({
        firstName,
        emailAddress,
        password,
      });

      await signUp.verifications.sendEmailCode();
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });
    if (signUp.status === "complete") {
      await signUp.finalize({
        // Redirect the user to the home page after signing up
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else {
      // Check why the sign-up is not complete
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoLogo}>
            <Text style={styles.logoText}>R</Text>
          </View>
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoTitle}>Recurly</Text>
            <Text style={styles.logoSubtitle}>SMART BILLING</Text>
          </View>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Verify your email</Text>
          <Text style={styles.welcomeSubtitle}>
            Please enter the verification code sent to your email
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Verification Code</Text>
            <TextInput
              style={styles.input}
              value={code}
              placeholder="Enter your code"
              placeholderTextColor="#7D8A9F"
              onChangeText={(code) => setCode(code)}
              keyboardType="numeric"
            />
            {errors.fields.code && (
              <Text style={styles.error}>{errors.fields.code.message}</Text>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              fetchStatus === "fetching" && styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleVerify}
            disabled={fetchStatus === "fetching"}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => signUp.verifications.sendEmailCode()}
          >
            <Text style={styles.secondaryButtonText}>I need a new code</Text>
          </Pressable>
        </View>

        <View nativeID="clerk-captcha" id="clerk-captcha" />
      </View>
    );
  }

  return (
      <View style={styles.container}>
        {/* Header / Logo Area */}
        <View style={styles.header}>
          <View style={styles.logoLogo}>
            <Text style={styles.logoText}>R</Text>
          </View>
          <View style={styles.logoTextContainer}>
            <Text style={styles.logoTitle}>Recurly</Text>
            <Text style={styles.logoSubtitle}>SMART BILLING</Text>
          </View>
        </View>

        {/* Welcome Area */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Create account</Text>
          <Text style={styles.welcomeSubtitle}>
            Join us to start managing your subscriptions easily
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              placeholder="Enter your first name"
              placeholderTextColor="#7D8A9F"
              onChangeText={setFirstName}
            />
            {errors.fields.firstName && (
              <Text style={styles.error}>{errors.fields.firstName.message}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter your email"
              placeholderTextColor="#7D8A9F"
              onChangeText={setEmailAddress}
              keyboardType="email-address"
            />
            {errors.fields.emailAddress && (
              <Text style={styles.error}>{errors.fields.emailAddress.message}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              placeholder="Enter your password"
              placeholderTextColor="#7D8A9F"
              secureTextEntry
              onChangeText={setPassword}
            />
            {errors.fields.password && (
              <Text style={styles.error}>{errors.fields.password.message}</Text>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              (!firstName || !emailAddress || !password || fetchStatus === "fetching") &&
                styles.buttonDisabled,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleSubmit}
            disabled={!firstName || !emailAddress || !password || fetchStatus === "fetching"}
          >
            <Text style={styles.buttonText}>Sign up</Text>
          </Pressable>

          <View style={styles.linkContainer}>
            <Text style={styles.linkTextRegular}>Already have an account? </Text>
            <Link href="/sign-in">
              <Text style={styles.linkTextOrange}>Sign in</Text>
            </Link>
          </View>
        </View>

        <View nativeID="clerk-captcha" id="clerk-captcha" />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FDFCF7",
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    marginBottom: 40,
  },
  logoLogo: {
    backgroundColor: "#E67A5A",
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logoText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontFamily: "sans-semibold",
  },
  logoTextContainer: {
    justifyContent: "center",
  },
  logoTitle: {
    fontSize: 22,
    fontFamily: "sans-bold",
    color: "#0A1128",
    lineHeight: 28,
  },
  logoSubtitle: {
    fontSize: 11,
    fontFamily: "sans-medium",
    color: "#526071",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: "sans-bold",
    color: "#0A1128",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    fontFamily: "sans-regular",
    color: "#526071",
    textAlign: "center",
  },
  card: {
    borderWidth: 1,
    borderColor: "#EBE3D5",
    borderRadius: 16,
    padding: 24,
    backgroundColor: "#FDFDFADC",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: "sans-semibold",
    color: "#0A1128",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E1D5C1",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: "sans-regular",
    color: "#0A1128",
    backgroundColor: "transparent",
  },
  button: {
    backgroundColor: "#0A1128", // Changed to dark navy to differentiate from sign-in
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "sans-semibold",
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#E67A5A",
    fontSize: 15,
    fontFamily: "sans-semibold",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  linkTextRegular: {
    fontSize: 15,
    fontFamily: "sans-regular",
    color: "#526071",
  },
  linkTextOrange: {
    fontSize: 15,
    fontFamily: "sans-medium",
    color: "#E67A5A",
  },
  error: {
    color: "#D32F2F",
    fontSize: 12,
    fontFamily: "sans-medium",
    marginTop: 6,
  },
});
