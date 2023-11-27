const saveBtn = document.querySelector("#save_btn");
const textAttach = document.querySelector("#text_attach");
const imgAttach = document.querySelector("#img_attach");
const modeBtn = document.querySelector("#mode_btn");
const destroyBtn = document.querySelector("#destroy_btn");
const eraserBtn = document.querySelector("#eraser_btn");
const colorOption = Array.from(
    document.querySelectorAll(".color_option")
);
const color = document.querySelector(".select_color");
const lineWidth = document.querySelector("#line_width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const CANVAS_W = 399;
const CANVAS_H = 300;

canvas.width = CANVAS_W;
canvas.height = CANVAS_H;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round"
let isPainting = false;
let isFilling = false;

function onMove(event) { // 마우스를 움직일 때
    if (isPainting) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }
    ctx.moveTo(event.offsetX, event.offsetY);
}

function startPainting() { // 마우스 클릭 시
    isPainting = true;
}

function cancelPainting() { // 마우스를 뗄 때
    isPainting = false;
}

function onLineWidthChange(event) { // 선 두께 조절
    ctx.beginPath();
    ctx.lineWidth = event.target.value;
}

function onColorChange(event) { // 선 색상 변경
    ctx.beginPath();
    ctx.strokeStyle = event.target.value;
    ctx.fillStyle = event.target.value;
}

function onColorClick(event) { // 컬러 팔레트 선택
    const colorValue = event.target.dataset.color
    ctx.beginPath();
    ctx.strokeStyle = colorValue;
    ctx.fillStyle = colorValue;
    color.value = colorValue;
}

function onModeClick() { // 버튼 텍스트 컨트롤
    if (isFilling) {
        isFilling = false;
        modeBtn.className = "fill";
        //modeBtn.innerText = "Fill";
    } else {
        isFilling = true;
        modeBtn.className = "draw";
        //modeBtn.innerText = "Draw";
    }
}

function onCanvasClick() { // 캔버스 영역 채우기
    if (isFilling) {
        ctx.beginPath();
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
}

function onDestroyClick() { // 캔버스 초기화
    ctx.beginPath();
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
}

function onEraserClick() { // 지우개
    ctx.beginPath();
    ctx.strokeStyle = "white";
    isFilling = false;
    modeBtn.className = "fill";
    color.value = ctx.strokeStyle;
}

function onImgChange(event) { // 이미지 삽입하기
    const imgFile = event.target.files[0];
    const imgUrl = URL.createObjectURL(imgFile);
    const image = new Image();
    image.src = imgUrl;
    image.onload = function() {
        ctx.drawImage(image, 0, 0, CANVAS_W, CANVAS_H);
        imgAttach.value = null;
    }
}

function onDoubleClick(event) { // 글자 삽입하기
    const text = textAttach.value;
    if (text !== "") {
        ctx.save();
        ctx.lineWidth = 1;
        ctx.font = "30px san-serif"
        ctx.fillText(text, event.offsetX, event.offsetY);
        console.log(event.offsetX, event.offsetY);
        ctx.restore();
    }
}

function onSaveClick() {
    const saveUrl = canvas.toDataURL();
    const downloadA = document.createElement("a");
    downloadA.href = saveUrl;
    downloadA.download = "myDrawing.png";
    downloadA.click();
}

canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

console.log(colorOption);
colorOption.forEach(color => color.addEventListener("click", onColorClick));
modeBtn.addEventListener("click", onModeClick);
canvas.addEventListener("click", onCanvasClick);

destroyBtn.addEventListener("click", onDestroyClick);
eraserBtn.addEventListener("click", onEraserClick);

imgAttach.addEventListener("change", onImgChange);
saveBtn.addEventListener("click", onSaveClick);