<template>
  <b-container>
    <b-row>
      <b-col sm="1"><b-icon-file-text></b-icon-file-text></b-col>
      <b-col><b-form-textarea rows="2" v-model="text"></b-form-textarea></b-col>
    </b-row>
    <b-row>
      <b-col sm="1"><b-icon-map></b-icon-map></b-col>
      <b-col v-if="lat && lon">Lat: {{lat}} Lon:{{lon}}</b-col>
    </b-row>
    <b-row>
      <b-col sm="1"><b-icon-image></b-icon-image></b-col>
      <b-col><b-form-file @change="onFileChange" accept="image/*" ref="fileInput"></b-form-file></b-col>
    </b-row>
    <b-row v-if="url">
      <b-col sm="1"></b-col>
      <b-col sm="3"><img :src="url" style="max-width: 200px; max-height: 200px; object-fit: cover;"/></b-col>
      <b-col><b-button @click="removeImage"><b-icon-trash></b-icon-trash></b-button></b-col>
    </b-row>
    <b-row>
      <b-col sm="1"><b-button @click="upload" :disabled="uploadState.disabled"><b-icon-pencil-square :animation="uploadState.animate"></b-icon-pencil-square></b-button></b-col>
      <b-col sm="1"><b-button @click="fetch" :disabled="fetchState.disabled"><b-icon-arrow-clockwise :animation="fetchState.animate"></b-icon-arrow-clockwise></b-button></b-col>
      <b-col sm="1">
        <b-button @click="changeLocState">
          <b-icon-geo v-if="allowState.loc"></b-icon-geo>
          <b-iconstack v-else>
            <b-icon-geo stacked></b-icon-geo><b-icon-slash-circle stacked scale="1.5"></b-icon-slash-circle>
          </b-iconstack>
        </b-button>
      </b-col>
    </b-row>
    <hr />
  </b-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Field',
  data: () => {
    return {
      uploadState: {
        disabled: false,
        animate: ''
      },
      fetchState: {
        disabled: false,
        animate: ''
      },
      text: '',
      lat: '',
      lon: '',
      url: '',
      blob: null,
      allowState: {
        loc: true
      }
    }
  },
  created: async function () {
    this.getPosition();
    await this.fetch();
  },
  methods: {
    onFileChange(e) {
      this.blob = e.target.files[0];
      this.url = URL.createObjectURL(this.blob);
    },
    getPosition() {
      let vm = this;
      navigator.geolocation.getCurrentPosition(function(pos) {
        vm.lat = pos.coords.latitude;
        vm.lon = pos.coords.longitude;
      }, function(err) {
        console.log(err);
      }, {
        enableHighAccuracy: true
      });
    },
    async upload() {
      this.uploadState.animate = 'fade';
      this.uploadState.disabled = true;

      const formdata = new FormData();
      formdata.append('text', this.text);
      formdata.append('lat', this.lat);
      formdata.append('lon', this.lon);

      if (this.blob) {
        formdata.append('content', this.blob);
      }

      const result = await axios.post(process.env.VUE_APP_UPLOAD_URL, formdata, {headers: {'content-type': 'multipart/form-data'}});

      this.$parent.posts.unshift(result.data);
      
      this.uploadState.animate = '';
      this.uploadState.disabled = false;

      this.text = '';
      this.url = '';
      this.blob = null;
      this.$refs.fileInput.value = '';

      this.getPosition();
    },
    async fetch() {
      this.fetchState.animate = 'spin';
      this.fetchState.disabled = true;

      const result = await axios.get(process.env.VUE_APP_FETCH_URL);

      let items = result.data.result.Items;

      this.$parent.posts = items;
      
      this.fetchState.animate = '';
      this.fetchState.disabled = false;
    },
    removeImage() {
      this.url = '';
      this.blob = null;
      this.$refs.fileInput.value = '';
    },
    changeLocState() {
      this.allowState.loc = !this.allowState.loc;

      if (this.allowState.loc) {
        this.getPosition();
      } else {
        this.lat = '';
        this.lon = '';
      }
    }
  }
}
</script>