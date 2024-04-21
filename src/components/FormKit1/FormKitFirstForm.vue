<template>
  <div class="container">
    <div class="row jumbotron box8 rounded">
      <div class="col-sm-12 mx-t3 mb-5">
        <h2 class="text-center text-info">FORMKIT PRO</h2>
      </div>
      <FormKit  type="form" @submit="onFormSubmit" :plugins="[castRangeToNumber]">
       <div class="row col-sm-12">
        <div class="col-sm-4 form-group">
        <FormKit
        type="text"
        name="name"
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
              validation="required"
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
              <ul>
                <li v-for="file in files" :key="file.name">{{ file.name }}</li>
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
      <div class="col-sm-10 form-group mb-5">
        <custom-signature />
      </div>
       </div>
      </FormKit>

    </div>
</div>
</template>

<script>
import CustomSignature from '../common/CustomSignature/CustomSignature.vue';
import { getCookie } from '@/utils/cookieReader';
import { getUtmParameters } from '@/utils/urlParams'; 

export default {
  name: "FormKitFirstForm",
  components: { CustomSignature },
  data() {
    return {
      radioOptions: {
        x: 'Option X',
        y: 'Option Y',
        z: 'Option Z'
      },
      files: [],  
      cookies: null,
      utmParams: null,
      formData: {}
    }
  },
  mounted() {
    this.setupDragAndDrop();
    this.fetchCookiesAndParams();
  },
  methods: {
    fetchCookiesAndParams() {
      this.cookies = getCookie('session_id'); 
      this.utmParams = getUtmParameters();
      this.formData = {
        ...this.formData,
        _meta: {
          cookieData: this.cookies,
          utmData: JSON.stringify(this.utmParams)
        }
      };
    },
    async onFormSubmit() {
      this.$provideGlobals.setLocalStorageItem('formSubmission', true);
      this.processFiles();
      alert("Form submitted successfully!");
      console.log("Form Data:", this.formData);
    },
    castRangeToNumber(node) {
      if (node.props.type !== 'range') return;
      node.hook.input((value, next) => next(Number(value)));
    },
    setupDragAndDrop() {
      const dropArea = document.getElementById('profile');
      const component = this; 

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
      });

      function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
      }

      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
      });

      dropArea.addEventListener('drop', handleDrop, false);

      function highlight() {
        dropArea.classList.add('highlight');
      }

      function unhighlight() {
        dropArea.classList.remove('highlight');
      }

      function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;
        component.files = Array.from(files); 
        component.handleFiles(component.files); 
      }
    },
    handleFiles(files) {
      console.log(files); // Just for demonstration
    },
    processFiles() {
      console.log('Processing files:', this.files);
    }
  }
}
</script>



<style scoped src="./FormKitFirstForm.css"></style>