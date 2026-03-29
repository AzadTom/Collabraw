import { Image } from "react-konva";
import useImage from "use-image";

const URLImage = (props:any) => {

    const {image, onclick, onDragEnd, onTransformEnd} = props;
  
    const [img] = useImage(image.src);
  
    return (
      <Image
        image={img}
        x={image.x}
        y={image.y}
        scaleX={image.scaleX || 1}
        scaleY={image.scaleY || 1}
        rotation={image.rotation || 0}
        offsetX={img ? img.width / 2 : 0}
        offsetY={img ? img.height / 2 : 0}
        draggable
        onClick={onclick}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
      />
    );
  };

export default URLImage;

