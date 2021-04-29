import { extendTheme } from "@chakra-ui/react"
import buttonStyle from "./button.style"
// import inputStyle from "./input.style";

export default extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: "#080808",
        fontFamily: "Avenir, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif",
        color: "white",
      },
      // styles for the `a`
      // a: {
      //   color: "teal.500",
      //   _hover: {
      //     textDecoration: "underline",
      //   },
      // },
    },
  },
  components: {
    Button: buttonStyle,
    // Input: inputStyle
  },
  colors: {
    brand: {
      50: "teal.50",
      100: "teal.100",
      200: "teal.200",
    },
    black: {
      10: "#666666",
      25: "#4c4c4c",
      50: "#323232",
      100: "#292929",
      200: "#242424",
      300: "#1c1c1c",
      400: "#171717",
      450: "#141414",
      500: "#0f0f0f",
    }
  },
})