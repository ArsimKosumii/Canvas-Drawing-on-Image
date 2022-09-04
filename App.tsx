import { SketchCanvas, SketchCanvasRef } from "rn-perfect-sketch-canvas";
import { ImageFormat, ImageShader } from "@shopify/react-native-skia";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  StatusBar,
  PixelRatio,
} from "react-native";

import ViewShot from "react-native-view-shot";
import { captureScreen, captureRef } from "react-native-view-shot";

const COLORS = ["red", "blue", "green", "magenta", "yellow"];

const App = () => {
  const ref = useRef<SketchCanvasRef>(null!);
  const viewRef = useRef();

  const [color, setColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(10);

  const [image, setImage] = useState<any>();
  const [modifiedImage, setModifiedImage] = useState<any>();

  const win = Dimensions.get("window");
  const [imgDimensions, setImgDimensions] = useState<any>();

  async function getImageSize() {
    await Image.getSize(
      "https://picsum.photos/seed/picsum/200/300",
      (width, height) => {
        setImgDimensions({
          ...imgDimensions,
          width: width,
          height: height,
        });
      }
    );
  }

  function testCapture() {
    captureScreen({
      format: "jpg",
      quality: 1,
    }).then((uri) => {
      console.log(uri);
      setModifiedImage(uri);
    });
  }

  useEffect(() => {
    getImageSize();
  }, []);

  useEffect(() => {
    if (image) {
      viewRef?.current?.capture().then((uri) => {
        console.log("do something with ", uri);
        setModifiedImage(uri);
      });
    }
  }, [image]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"transparent"} />

      <ViewShot ref={viewRef}>
        <ImageBackground
          source={{
            uri: "https://picsum.photos/seed/picsum/200/300",
          }}
          resizeMode="contain"
          style={{
            width: imgDimensions?.width,
            height: imgDimensions?.height,
          }}
        >
          <SketchCanvas
            containerStyle={{
              width: imgDimensions?.width,
              height: imgDimensions?.height,
            }}
            ref={ref}
            strokeColor={color}
            strokeWidth={strokeWidth}
          />
        </ImageBackground>
      </ViewShot>

      <View style={styles.btnContainer}>
        <Button title="Undo" onPress={() => ref.current?.undo()} />
        <Button title="Clear" onPress={() => ref.current?.reset()} />
        <Button
          title={`Color (${color})`}
          onPress={() => {
            const randomIndex = Math.floor(Math.random() * COLORS.length);
            setColor(COLORS[randomIndex]);
          }}
        />
        <Button
          title={`Stroke (${strokeWidth})`}
          onPress={() => {
            const randomIndex = Math.floor(Math.random() * COLORS.length);
            setStrokeWidth(randomIndex);
          }}
        />
        <Button
          title="Base 64"
          onPress={() => {
            setImage(ref.current.toBase64(ImageFormat.PNG, 50));
          }}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Image
          resizeMode="contain"
          source={{
            uri: modifiedImage,
          }}
          style={{ width: 300, height: 400 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
  },
  btnContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    flexWrap: "wrap",
    justifyContent: "space-around",
  },

  imageContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    flex: 1,
    width: "100%",
  },
});

export default App;
