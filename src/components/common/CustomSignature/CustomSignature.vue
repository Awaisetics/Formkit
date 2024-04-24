<script setup>
import { ref, onMounted, watch, watchEffect } from 'vue';
const drawMode = ref(false);
const savedDrawingURL = ref(null);
const signatureCanvas = ref(null);
const isDrawing = ref(false);
const lastPosition = ref({ x: 0, y: 0 });

const userName = ref('');
function loadUserName() {
  const storedName = localStorage.getItem('username');
  if (storedName) {
    userName.value = storedName;
  }
}
function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

// Start drawing
function startDrawing(event) {
  const canvas = signatureCanvas.value;
  if (!canvas) return;

  isDrawing.value = true;
  lastPosition.value = getMousePos(canvas, event);
}

// Draw on canvas
function draw(event) {
  if (!isDrawing.value) return;
  const canvas = signatureCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const mousePos = getMousePos(canvas, event);

  ctx.beginPath();
  ctx.strokeStyle = '#000'; 
  ctx.lineWidth = 2;  
  ctx.moveTo(lastPosition.value.x, lastPosition.value.y);
  ctx.lineTo(mousePos.x, mousePos.y);
  ctx.stroke();
  ctx.closePath();

  lastPosition.value = mousePos;
}

// Stop drawing
function stopDrawing() {
  isDrawing.value = false;
}

// Setup canvas
onMounted(() => {
  const canvas = signatureCanvas.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white'; // Default canvas background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
});
function toggleDrawMode() {
  drawMode.value = !drawMode.value;
  if (!drawMode.value) {
    savedDrawingURL.value = null;
  }
}

function clearSignature(){
  const canvas = signatureCanvas.value;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

function saveDrawing() {
  signatureCanvas.value.toBlob(blob => {
    savedDrawingURL.value = URL.createObjectURL(blob);  
    drawMode.value = false;  
  }, 'image/png');
}

function setupCanvas() {
  if (signatureCanvas.value) {
    const ctx = signatureCanvas.value.getContext('2d');
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height);
  }
}

function drawSignature() {
  clearSignature();
  const canvas = signatureCanvas.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000000';
  ctx.fillText(userName.value, canvas.width / 2, canvas.height / 2);
}

watchEffect(() => {
  if (userName.value) {
    drawSignature();
  }
});
// Mounted lifecycle hook
onMounted(() => {
  watch(drawMode, (newVal) => {
    if (newVal) {
      setupCanvas();
    }
  });
  loadUserName();
  if (drawMode.value) {
    setupCanvas();
  }
  if (userName.value) {
    drawSignature();
  }
});
</script>

<template>
  <div>
    <div>
      <canvas class="border rounded" ref="signatureCanvas" width="400" height="200" @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"></canvas>
      <div class="d-flex gap-2 justify-content-center">
        <button type="button" class="btn btn-primary" @click="clearSignature">Draw My Signature Myself</button>
        <button type="button" class="btn btn-success ml-1" @click="saveDrawing">Save Drawing</button>
        <button type="button" class="btn btn-info" @click="toggleDrawMode">Cancel</button>
      </div>
    </div>
    <div v-if="savedDrawingURL" class="saved-signature-preview mt-4 align-items-center">
      <h3>Your Saved Signature:</h3>
      <img :src="savedDrawingURL" class="border rounded" alt="Saved Signature">
    </div>
  </div>
</template>

<style scoped src="./CustomSignature.css">
</style>
