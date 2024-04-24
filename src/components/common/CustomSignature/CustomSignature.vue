<script setup>
import { ref, onMounted, watch } from 'vue';
const signatures = ref([
  { url: 's1.png' },
  { url: 's2.png' },
  { url: 's3.png' },
  { url: 's4.png' },
  { url: 's5.png' },
]);
const selectedSignature = ref('');
const drawMode = ref(false);
const savedDrawingURL = ref(null);
const signatureCanvas = ref(null);
const isDrawing = ref(false);
const lastPosition = ref({ x: 0, y: 0 });

// Get mouse position relative to the canvas
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
  ctx.strokeStyle = '#000'; // Change as needed
  ctx.lineWidth = 2;       // Change as needed
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
function selectSignature(signatureUrl) {
  selectedSignature.value = require(`@/assets/images/${signatureUrl}`);
  savedDrawingURL.value = selectedSignature.value;  
}
function toggleDrawMode() {
  drawMode.value = !drawMode.value;
  if (!drawMode.value) {
    savedDrawingURL.value = null;
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

// Mounted lifecycle hook
onMounted(() => {
  watch(drawMode, (newVal) => {
    if (newVal) {
      setupCanvas();
    }
  });

  if (drawMode.value) {
    setupCanvas();
  }
});
</script>

<template>
  <div>
    <div v-if="!drawMode">
      <h3>Select a Signature:</h3>
      <div class="signature-grid mb-3">
        <div
          v-for="(signature, index) in signatures"
          :key="index"
          class="signature-item"
          @click="selectSignature(signature.url)" 
        >
          <img :src="require(`@/assets/images/${signature.url}`)" class="border rounded cursor-pointer" :alt="`Signature ${index + 1}`" />
        </div>
      </div>
      <button type="button" class="btn btn-primary" @click="toggleDrawMode">Draw My Signature Myself</button>
    </div>
    <div v-else>
      <canvas class="border rounded" ref="signatureCanvas" width="400" height="200" @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"></canvas>
      <div class="d-flex gap-2 justify-content-center">
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
