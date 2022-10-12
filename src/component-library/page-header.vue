<template>
  <div class="page-header">
    <h1>Component</h1>
    <h2>{{ title }}</h2>
    <h3>{{ this.items[0].code }}</h3>
  </div>
</template>
<script>
export default {
  props: ["title"],
  data(){
    return {
      items: []
    }
  },
  mounted() {
    this.renderData('')
  },
  methods: {
      renderData(){
          this.items = []
          this.$http.get("/inventory/uom",{params:{
                  perpage:100,
                  orderby:'-id',
              }}).then(response => {
              this.items = response.data.data
              if(this.items === null){
                  this.items = []
              }
          });
      },
  }
};
</script>
