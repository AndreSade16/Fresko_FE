import { Image } from "react-bootstrap";

function LemonImage() {
  return (
    <Image
      src="favicon.png"
      className="position-fixed"
      style={{
        width: "450px",
        transform: "scaleX(-1)",
        top: "180px",
        right: "0px",
      }}
    />
  );
}

export default LemonImage;
