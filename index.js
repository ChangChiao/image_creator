// const fileType = ["png", "jpg", "jpeg"];
const mark = "https://hexschool.github.io/escape-cropper/photo.png";
let cropper = null;
let downloadUrl = "";
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
    cropper = null;
    carousel.scrollTo(0, 0);
  });

  const createImage = (url) => {
    const image = document.createElement("img");
    image.setAttribute("src", url);
    document.querySelector("#cropped").replaceChildren(image);
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
    const imageData = cropper.getImageData();
    console.log("imageData", imageData);
    console.log("    imageData.rotate;", imageData.rotate);
    const angle = dir > 0 ? 90 : -90;
    // let result = imageData.rotate + angle;
    // if( result > 360 && result < 0 ){
    //     result = 0;
    // }
    cropper.rotate(angle);
    watermarkImage(cropper.getCroppedCanvas(), mark).then((url) => {
      cover.src = url;
    });
  };

  document.querySelector("#download").addEventListener(
    "click",
    () => {
      console.log("#download");
      const cover = document.querySelector("#cover");
      const link = document.createElement("a");
      link.download = "download.png";
      link.href = cover.src;
      link.click();
      link.delete;
    },
    false
  );

  const loadImage = (path) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        resolve(img);
      };
      img.onerror = (e) => {
        reject(e);
      };
    });
  };

  const watermarkImage = async (originalImage, watermarkImagePath) => {
    const canvas = originalImage;
    const context = canvas.getContext("2d");
    console.log("context", context);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    console.log("canvasWidth", canvasWidth);
    console.log("canvasHeight", canvasHeight);

    // context.drawImage(tempImage, 0, 0, canvasWidth, canvasHeight);
    // console.log("tempImage", tempImage)
    // initializing the canvas with the original image

    // loading the watermark image and transforming it into a pattern
    const result = await fetch(watermarkImagePath);
    const blob = await result.blob();
    const image = await createImageBitmap(blob);
    const pattern = context.createPattern(image, "no-repeat");
    // context.drawImage(image, 0, 0, 50, 50, canvasWidth - 50, canvasHeight - 50);
    // translating the watermark image to the bottom right corner
    const rate = ( 0.001 * (canvasWidth / 4)).toFixed(2);
    context.translate(
      canvasWidth - image.width * rate,
      canvasHeight - image.height * rate
    );
    context.rect(0, 0, canvasWidth, canvasHeight);
    // context.translate(canvasWidth - image.width, canvasHeight - image.height);
    // context.rect(0, 0, canvasWidth, canvasHeight);
    // context.rect(0, 0, 300, 300);
    context.scale(rate, rate);
    context.fillStyle = pattern;
    context.fill();
    return canvas.toDataURL("image/png");
  };

  const initCropper = () => {
    const croppedImage = document.querySelector("#cropped img");
    const uploadImage = document.querySelector("#uploaded-img");
    const cover = document.querySelector("#cover");
    if (cropper) return;
    cropper = new Cropper(croppedImage, {
      aspectRatio: 16 / 9,
      preview: "#previewBox",
      replace(url) {
        console.log("url", url);
      },
      ready() {
        watermarkImage(cropper.getCroppedCanvas(), mark).then((url) => {
          cover.src = url;
        });
      },
      cropstart() {
        const previewImage = document.querySelector("#previewBox img");
        cover.src = "";
      },
      cropend(event) {
        console.log("cropend");
        watermarkImage(cropper.getCroppedCanvas(), mark).then((url) => {
          cover.src = url;
        });
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
      watermarkImage(cropper.getCroppedCanvas(), mark).then((url) => {
        cover.src = url;
      });
    },
    false
  );

  document.querySelector("#ratio-rec").addEventListener(
    "click",
    () => {
      cropper.setAspectRatio(16 / 9);
      watermarkImage(cropper.getCroppedCanvas(), mark).then((url) => {
        cover.src = url;
      });
    },
    false
  );

  document.querySelector("#ratio-free").addEventListener(
    "click",
    () => {
      cropper.setAspectRatio(NaN);
      watermarkImage(cropper.getCroppedCanvas(), mark).then((url) => {
        cover.src = url;
      });
    },
    false
  );
};

// ???????????? codepen????????? cropperjs ?????????????????? canvas ?????????????????????????????????????????????????????????????????????????????????

// ?????????????????????????????????

// ????????????????????????????????????png???jpg???jpeg???OK
// ???????????????????????????????????? 16:9????????? 1:1???free???OK
// ?????????????????????-???????????????????????????????????????????????????????????????????????????????????????????????????
// ?????????????????????????????? png???ok

// ????????????????????????????????? #uploaded-img???
// Cropper????????? #upload ??????????????????
// ?????? img???????????? #cropped???
// ????????????????????????????????? #preview???
