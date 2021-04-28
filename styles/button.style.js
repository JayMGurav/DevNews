const buttonStyle = {
  baseStyle: {
    bg: "teal.100",
    color: "gray.900",
    borderRadius: "lg",
    fontWeight: "bold",
    _hover: {
      bg: "teal.200",
    },
    _active:{
      bg: "teal.200",
    },
    _focus:{
      bg: "teal.200",
    },
    _disabled:{
      bg: "teal.200",
    }
  },
  sizes: {
    lg: {
      fontSize: "lg",
      px: "8",
      py: "2",
    },
    sm: {
      fontSize: "sm",
      px: "6",
      py: "1",
    },
    md: {
      fontSize: "md",
      px: "6",
      py: "2",
    },
  },
  variants: {
    "pushable": {
      bg: "teal.200",
      position: "relative",
      willChange: "transform",
      transform: "translateY(-4px)",
      transition: "transform 100ms ease-in-out",
      _hover: {
        transform: "translateY(-6px)"
      },
      _active: {
        transform: "translateY(-2px)",
        transition: "transform 34ms"
      }
    }
  },
  defaultProps: {
    size: "",
    variant: "",
  },
}

export default buttonStyle;