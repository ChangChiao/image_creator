const fileType = [ "png", "jpg", "jpeg"]
let cropper = null
window.onload = () => {
  const prevBtn = document.querySelector("#btn-previous");
  const nextBtn = document.querySelector("#btn-next");
  const uploadInput = document.querySelector("#upload");
  // step into editing
  nextBtn.addEventListener("click", () => {
    carousel.scrollTo(document.body.clientWidth, 0);
  });

  prevBtn.addEventListener("click", () => {
    carousel.scrollTo(0, 0);
  });

  uploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if(!fileType.includes(file.type)) return;
    document.querySelector("#uploaded-img").src = URL.createObjectURL(file);
  })

  const rotate = (dir) => {
    const imageData = cropper.getImageData();
    imageData.rotate
    const angle = dir > 0 ? 45 : -45;
    let result = imageData.rotate + dir
    // if( result > 360 && result < 0 ){
    //     result = 0;
    // }
    cropper.rotate(result)
  }

  const initCropper = () => {
    const image = document.querySelector('#cropped img');
    cropper = new Cropper(image, {
      aspectRatio: 16 / 9,
      crop(event) {
        console.log(event.detail.x);
        console.log(event.detail.y);
        console.log(event.detail.width);
        console.log(event.detail.height);
        console.log(event.detail.rotate);
        console.log(event.detail.scaleX);
        console.log(event.detail.scaleY);
      },
    });
  }

  document.querySelector(".editing_button-group").addEventListener("click", function(e){
    const target = e.target
    switch(true){
        case (target.getAttribute('id') === "ratio-sqaure"):{
            cropper.setAspectRatio(1)
        }
        case (target.getAttribute('id') === "ratio-rec"):{
            cropper.setAspectRatio(16 / 9)
        }
        case (target.getAttribute('id') === "ratio-free"):{
            cropper.setAspectRatio(1)
        }
        case (target.getAttribute('id') === "rotate-left"):{
            rotate(-1)
        }
        case (target.getAttribute('id') === "rotate-right"):{
            rotate(1)
        }
    }
    // if(target.getAttribute('id') === "ratio-sqaure"){

    // }
    // if(target.getAttribute('id') === "ratio-rec"){
        
    // }
    // if(target.getAttribute('id') === "ratio-free"){
        
    // }
  }, false)

};



// 請複製此 codepen，使用 cropperjs 裁切套件加上 canvas 來完成圖片上傳裁切以及添加浮水印的功能，可參考此影片。

// 以下四個條件都要做到：

// 上傳圖片（限制圖片種類：png、jpg、jpeg）
// 圖片裁切尺寸（預設比例為 16:9，還有 1:1、free）
// 添加圖片浮水印-線上空間：（更改裁切尺寸以及調整裁切位置後，浮水印都需要正確顯示）
// 下載圖片（限制圖片為 png）


// 上傳的預覽照片：存放在 #uploaded-img。
// Cropper：寫在 #upload 監聽函式中。
// 裁切 img：添加在 #cropped。
// 裁切的預覽照片：存放在 #preview。