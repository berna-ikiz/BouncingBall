import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");
const BALL_SIZE = 60;

const BouncingBall = () => {
  const ballY = useRef(new Animated.Value(0)).current;
  const ballX = useRef(new Animated.Value(0)).current;
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });

  const startBounce = () => {
    const maxBouncing = Math.floor(SCREEN_WIDTH / BALL_SIZE);
    if (ballPosition.y - BALL_SIZE + maxBouncing < 0) {
      Alert.alert("Error", "There is no enough space, the ball can't bounce.");
      return;
    } else {
      ballY.setValue(ballPosition.y);
      ballX.setValue(ballPosition.x);
      const animations = [];
      for (let i = 0; i < maxBouncing; i++) {
        animations.push(
          Animated.timing(ballY, {
            toValue: ballPosition.y + maxBouncing - i * 0.5,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(ballY, {
            toValue: ballPosition.y - BALL_SIZE,
            duration: 300,
            useNativeDriver: true,
          })
        );
      }

      Animated.sequence([
        Animated.timing(ballX, {
          toValue: ballPosition.x,
          duration: 500,
          useNativeDriver: true,
        }),
        ...animations,
      ]).start();
    }
  };

  useEffect(() => {
    startBounce();
  }, [ballPosition.x || ballPosition.y]);

  const handlePress = (event: { nativeEvent: { locationX: any; locationY: any; }; }) => {
    console.log(event);
    const { locationX, locationY } = event.nativeEvent;
    let currentPositionX = locationX - BALL_SIZE / 2;
    let currentPositionY = locationY - BALL_SIZE / 2;
    if (currentPositionX < 0) currentPositionX = 0;
    if (currentPositionY < 0) currentPositionY = 0;
    if (currentPositionX + BALL_SIZE > SCREEN_WIDTH)
      currentPositionX = SCREEN_WIDTH - BALL_SIZE;
    if (currentPositionY + BALL_SIZE > SCREEN_HEIGHT)
      currentPositionY = SCREEN_HEIGHT - BALL_SIZE;

    setBallPosition({
      x: currentPositionX,
      y: currentPositionY,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.ball,
            {
              transform: [{ translateY: ballY }, { translateX: ballX }],
            },
          ]}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  ball: {
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: "purple",
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default BouncingBall;
