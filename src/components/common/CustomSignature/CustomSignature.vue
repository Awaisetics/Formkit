<template>
  <div>
    <div v-if="!drawMode">
      <h3>Select a Signature:</h3>
      <div class="signature-grid">
        <div
          v-for="(signature, index) in signatures"
          :key="index"
          class="signature-item"
          @click="selectSignature(signature.url)" 
        >
          <img :src="require(`@/assets/images/${signature.url}`)" class="border rounded" :alt="`Signature ${index + 1}`" />
        </div>
      </div>
      <button type="button" class="btn btn-primary" @click="toggleDrawMode">Draw My Signature Myself</button>
    </div>
    <div v-else>
      <canvas class="border rounded" ref="signatureCanvas" width="400" height="200"></canvas>
      <div class="d-flex gap-2 justify-content-center">
        <button type="button" class="btn btn-success ml-1" @click="saveDrawing">Save Drawing</button>
        <button type="button" class="btn btn-info" @click="toggleDrawMode">Cancel</button>
      </div>
    </div>
    <div v-if="savedDrawingURL" class="saved-signature-preview">
      <h3>Your Saved Signature:</h3>
      <img :src="savedDrawingURL" class="border rounded" alt="Saved Signature">
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      signatures: [
        { url: 's1.png' },
        { url: 's2.png' },
        { url: 's3.png' },
        { url: 's4.png' },
        { url: 's5.png' },
      ],
      selectedSignature: '',
      drawMode: false,
      savedDrawingURL: null,
    };
  },
  methods: {
    selectSignature(signatureUrl) {
      this.selectedSignature = require(`@/assets/images/${signatureUrl}`);
      this.savedDrawingURL = this.selectedSignature;  
    },
    toggleDrawMode() {
      this.drawMode = !this.drawMode;
      if (!this.drawMode) {
        this.savedDrawingURL = null;
      }
    },
    saveDrawing() {
      const canvas = this.$refs.signatureCanvas;
      canvas.toBlob(blob => {
        this.savedDrawingURL = URL.createObjectURL(blob);  
        this.drawMode = false;  
      }, 'image/png');
    },
    setupCanvas() {
      const canvas = this.$refs.signatureCanvas;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  },
  mounted() {
    if (this.drawMode) {
      this.setupCanvas();
    }
  },
};
</script>

<style scoped src="./CustomSignature.css">
</style>
