// const fileType = ["png", "jpg", "jpeg"];
const mark = "https://hexschool.github.io/escape-cropper/photo.png";
let cropper = null;

window.onload = () => {
  const prevBtn = document.querySelector("#btn-previous");
  const nextBtn = document.querySelector("#btn-next");
  const uploadInput = document.querySelector("#upload");
  const previewBox = document.querySelector("#previewBox");
  // step into editing
  nextBtn.addEventListener("click", () => {
    carousel.scrollTo(document.body.clientWidth, 0);
    initCropper();
  });

  prevBtn.addEventListener("click", () => {
    carousel.scrollTo(0, 0);
  });

  const createImage = (url) => {
    const image = document.createElement("img");
    image.setAttribute("src", url);
    document.querySelector("#cropped").appendChild(image);
  };

  uploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    console.log("change==", file);
    // if (!fileType.includes(file.type)) return;
    const url = URL.createObjectURL(file);
    document.querySelector("#uploaded-img").src = url;
    document.querySelector("#upload-btn").classList.add("hidden");
    document.querySelector("#uploaded-img").classList.remove("hidden");
    createImage(url);
  });

  const rotate = (dir) => {
    console.log(dir, 999);
    const imageData = cropper.getImageData();
    console.log("imageData", imageData)
    console.log("    imageData.rotate;", imageData.rotate);
    const angle = dir > 0 ? 90 : -90;
    // let result = imageData.rotate + angle;
    // if( result > 360 && result < 0 ){
    //     result = 0;
    // }
    cropper.rotate(angle);
  };

  document.querySelector("#download").addEventListener(
    "click",
    () => {
        console.log("#download")
      
      const link = document.createElement('a');
        link.download = 'download.png';
        link.href = cropper.getCroppedCanvas().toDataURL("image/png");
        link.click();
        link.delete;
    },
    false
  );

  const watermarkImage = async (originalImage, watermarkImagePath) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const canvasWidth = originalImage.width;
    const canvasHeight = originalImage.height;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // initializing the canvas with the original image
    context.drawImage(originalImage, 0, 0, canvasWidth, canvasHeight);

    // loading the watermark image and transforming it into a pattern
    const result = await fetch(watermarkImagePath);
    const blob = await result.blob();
    const image = await createImageBitmap(blob);
    const pattern = context.createPattern(image, "no-repeat");

    // translating the watermark image to the bottom right corner
    context.translate(canvasWidth - image.width, canvasHeight - image.height);
    context.rect(0, 0, canvasWidth, canvasHeight);
    context.fillStyle = pattern;

    return canvas.toDataURL();
  };

  const initCropper = () => {
    const croppedImage = document.querySelector("#cropped img");
    if (cropper) return;
    cropper = new Cropper(croppedImage, {
      aspectRatio: 16 / 9,
      preview: "#previewBox",
      crop(event) {
        // watermarkImage(croppedImage, mark).then((url) => {
        //   previewBox.src = url;
        // });
        // console.log(event.detail.x);
        // console.log(event.detail.y);
        // console.log(event.detail.width);
        // console.log(event.detail.height);
        // console.log(event.detail.rotate);
        // console.log(event.detail.scaleX);
        // console.log(event.detail.scaleY);
      },
    });
  };


  document.querySelector("#upload-btn").addEventListener(
    "click",
    () => {
      console.log("click");
      document.querySelector("#upload").click();
    },
    false
  );

  document.querySelector("#btn-reupload").addEventListener(
    "click",
    () => {
      document.querySelector("#upload").click();
    },
    false
  );

  document.querySelector("#rotate-left").addEventListener(
    "click",
    () => {
      rotate(-1);
    },
    false
  );

  document.querySelector("#rotate-right").addEventListener(
    "click",
    () => {
      rotate(1);
    },
    false
  );

  document.querySelector("#ratio-sqaure").addEventListener(
    "click",
    () => {
      cropper.setAspectRatio(1);
    },
    false
  );

  document.querySelector("#ratio-rec").addEventListener(
    "click",
    () => {
      cropper.setAspectRatio(16 / 9);
    },
    false
  );

  document.querySelector("#ratio-free").addEventListener(
    "click",
    () => {
      cropper.setAspectRatio(NaN);
    },
    false
  );
};

// 請複製此 codepen，使用 cropperjs 裁切套件加上 canvas 來完成圖片上傳裁切以及添加浮水印的功能，可參考此影片。

// 以下四個條件都要做到：

// 上傳圖片（限制圖片種類：png、jpg、jpeg）OK
// 圖片裁切尺寸（預設比例為 16:9，還有 1:1、free）OK
// 添加圖片浮水印-線上空間：（更改裁切尺寸以及調整裁切位置後，浮水印都需要正確顯示）
// 下載圖片（限制圖片為 png）ok

// 上傳的預覽照片：存放在 #uploaded-img。
// Cropper：寫在 #upload 監聽函式中。
// 裁切 img：添加在 #cropped。
// 裁切的預覽照片：存放在 #preview。
