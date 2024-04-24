<script setup>
import { ref, reactive, onMounted, watch  } from 'vue';
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import CustomSignature from '../common/CustomSignature/CustomSignature.vue';
import { getCookie } from '@/utils/cookieReader';
import { getUtmParameters } from '@/utils/urlParams';

const radioOptions = reactive({
  x: 'Option X',
  y: 'Option Y',
  z: 'Option Z'
});

const userName = ref('');
const files = ref([]);
const cookies = ref(null);
const utmParams = ref(null);
const formData = reactive({});

const [parent, dragAndDropFiles] = useDragAndDrop(files);

watch(files, (newFiles) => {
  dragAndDropFiles.value = newFiles;
}, { deep: true });

// Fetch cookies and UTM parameters
function fetchCookiesAndParams() {
  cookies.value = getCookie('session_id');
  utmParams.value = getUtmParameters();
  formData._meta = {
    cookieData: cookies.value,
    utmData: JSON.stringify(utmParams.value)
  };
}

// Form submission handling
async function onFormSubmit() {
  this.$provideGlobals.setLocalStorageItem('formSubmission', true);
  processFiles();
  alert("Form submitted successfully!");
  console.log("Form Data:", formData);
}

const setUserName = (newName) => {
  userName.value = newName;
  localStorage.setItem('username', newName);
};

// Drag and drop setup
function setupDragAndDrop() {
  const dropArea = document.getElementById('profile');

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
  });

  dropArea.addEventListener('drop', handleDrop, false);

  function handleDrop(e) {
    let dt = e.dataTransfer;
    let droppedFiles = dt.files;
    files.value = Array.from(droppedFiles);
    handleFiles(files.value);
  }
}

function handleFiles(files) {
  console.log(files);
}

function processFiles() {
  console.log('Processing files:', files.value);
}

onMounted(() => {
  setupDragAndDrop();
  fetchCookiesAndParams();
});
</script>
<template>
  <div class="container">
    <div class="row jumbotron box8 rounded">
      <div class="col-sm-12 mx-t3 mb-5">
        <h2 class="text-center text-info">FORMKIT PRO</h2>
      </div>
      <FormKit  type="form" @submit="onFormSubmit">
       <div class="row col-sm-12">
        <div class="col-sm-4 form-group">
        <FormKit
        type="text"
        name="name"
        v-model="userName"
        @input="setUserName"
        id="name"
        validation="required|not:Admin"
        label="Name"
        help="Enter your full name"
        placeholder="Scarlet Sword"
      />
      </div>
       <div class="col-sm-4 form-group">
        <FormKit
        type="email"
        name="email"
        id="email"
        validation="required"
        label="Email"
        help="Enter your email"
        
      />
      </div>
      <div class="col-sm-4 form-group">
        <FormKit
        type="tel"
        name="tel"
        id="tel"
        validation="required|phone"
        label="Phone Number"
        help="Enter your phone"
        
      />
      </div>
      <div class="col-sm-4 form-group">
        <FormKit
        type="date"
        name="date"
        id="date"
        validation="date"
        label="Select Date"
        
      />
      </div>
      <div class="col-sm-4 form-group">
        <FormKit
        type="number"
        name="quantity"
        id="quantity"
        validation="required"
        label="Quantity"
        help="Enter your quantity"
        min="1"
        max="1000"
        
      />
      </div>
       <div class="col-sm-4 form-group">
            <FormKit
              type="file"
              name="profile"
              id="profile"
              label="Choose a file"
              help="Drag and drop your file here or click to browse"
              :config="{ 
                plugins: ['file'],
                accepts: 'image/*', 
                multiple: true
              }"
            />
            <div v-if="files.length > 0" class="uploaded-files">
              <p>Uploaded Files:</p>
              <ul ref="parent">
                <li v-for="file in files" :key="file.name" class="draggable">{{ file.name }}</li>
              </ul>
            </div>
          </div>

      <div class="col-sm-4 form-group">
        <FormKit
          type="select"
          label="Class"
          name="class"
          id="class"
          placeholder="Select a class"
          :options="['Warrior', 'Mage', 'Assassin']"
        />
      </div>
      <div class="col-sm-4 form-group">
        <FormKit
        type="textarea" 
        name="description"
        id="description"
        label="Description"
      />
      </div>
      <div class="col-sm-4 form-group">
        <FormKit
        type="radio" 
        name="option"
        id="option"
        label="Choose One" 
        :options="radioOptions"
        
      />
      </div>

      <div class="col-sm-2 form-group">
        <FormKit
        type="checkbox"
        name="feature"
        id="feature"
        label="Enable Feature"
      />
      </div>
      <div class="col-sm-10 form-group mb-5" v-if="userName">
        <CustomSignature />
      </div>
       </div>
      </FormKit>

    </div>
</div>
</template>

<style scoped src="./FormKitFirstForm.css"></style>