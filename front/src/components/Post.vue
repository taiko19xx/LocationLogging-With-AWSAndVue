<template>
  <b-container>
    <b-row>
      <b-col sm="1"><b-icon-watch></b-icon-watch></b-col>
      <b-col>{{datetime | unixtodate}}</b-col>
    </b-row>
    <b-row>
      <b-col sm="1"><b-icon-file-text></b-icon-file-text></b-col>
      <b-col>{{text}}</b-col>
    </b-row>
    <b-row v-if="lat && lon">
      <b-col sm="1"><b-icon-map></b-icon-map></b-col>
      <b-col>Lat: {{lat}} Lon:{{lon}}</b-col>
    </b-row>
    <b-row v-if="lat && lon">
      <b-col sm="1"></b-col>
      <b-col>
        <iframe
          height="100px"
          width="100%"
          frameborder="0" style="border:0"
          :src="'https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&zoom=15&q=' + lat + ',' + lon">
        </iframe>
      </b-col>
    </b-row>
    <b-row v-if="image">
      <b-col sm="1"><b-icon-image></b-icon-image></b-col>
      <b-col>
        <div>
          <img :src="'/'+image" style="max-height: 200px; object-fit: cover;" />
        </div>
      </b-col>
    </b-row>
    <hr />
  </b-container>
</template>

<script>
import {DateTime} from 'luxon';

export default {
  name: 'Post',
  props: {
    datetime: Number,
    text: String,
    lat: String,
    lon: String,
    image: String
  },
  filters: {
      unixtodate: function (date) {
          return DateTime.fromSeconds(date).toFormat('yyyy/LL/dd HH:mm:ss');
      }
  }
}
</script>