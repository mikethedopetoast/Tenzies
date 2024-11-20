import React from "react"

export default function Die(props) {
    // Assign `dieFace` dynamically according to props
    let dieFace = ""
    switch (props.value) {
      case 1:
        dieFace = "images/dieFace1.png"
        break
      case 2:
        dieFace = "images/dieFace2.png"
        break
      case 3:
        dieFace = "images/dieFace3.png"
        break
      case 4:
        dieFace = "images/dieFace4.png"
        break
      case 5:
        dieFace = "images/dieFace5.png"
        break
      case 6:
        dieFace = "images/dieFace6.png"
        break
      default:
        break
    }

    return (
      // if `isHeld` === true, its background color changes to light green
      <div
        className={props.isHeld ? "die-face isHeld" : "die-face"}
        onClick={props.holdDice}
        // Set a background image using the absolute URL method
        style={{
          backgroundImage: `url(${dieFace})`,
          backgroundSize: "cover"
        }}
      >
      </div>
    )
}