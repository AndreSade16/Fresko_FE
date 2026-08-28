import { Image } from "react-bootstrap";

interface LemonImageProps {
  leftToRight?: boolean;
}

function LemonImage({ leftToRight }: LemonImageProps) {
  return (
    <Image
      src="favicon.png"
      className="position-fixed"
      style={{
        width: "450px",
        transform: leftToRight ? "scaleX(1)" : "scaleX(-1)",
        top: "180px",
        left: leftToRight ? "-120px" : undefined,
        right: !leftToRight ? "0px" : undefined,
      }}
    />
  );
}

export default LemonImage;
