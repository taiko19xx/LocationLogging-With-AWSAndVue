<template>
  <div id="app">
    <Field></Field>
    <Post v-for="data in posts" :key="data.datetime" :datetime="data.datetime" :text="data.text" :lat="data.lat" :lon="data.lon" :image="data.image"></Post>
  </div>
</template>

<script>
import Post from './components/Post'
import Field from './components/Field'

export default {
  name: 'App',
  components: {
    Post, 
    Field
  },
  data: () => {
    return {
      posts: []
    }
  }
}
</script>

<style>
.row {
  margin: 0.75em;
}
</style>