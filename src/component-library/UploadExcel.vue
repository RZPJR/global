<template>
  <div>
      <VueFileAgent
          :class="error ? 'upload-excel-error' : ''"
          :multiple="false"
          :theme="themes"
          :deletable="true"
          :meta="true"
          :disabled="disabled"
          :compact="true"
          :accept="'.xls,.xlsx'"
          :helpText="'Choose or Drag excel here'"
          :errorText="{
              type: 'File must be in .xls/.xlsx',
          }"
          v-model="file"
          @select="onSelect($event)"
          @beforedelete="removeFile($event)"
          class="bg-black10"
      >
        <template v-slot:file-preview-new>
          <div class="mt-9" style="min-height:180px; text-align: center;" key="new">
            <img width="60" class="mt15 mb10" src="/icon/upload_new.png" alt=""> <br>
            <span class="text-black60">Choose or drag file here</span>
          </div>
        </template>
      </VueFileAgent>
      <div title="after-outer">
        <div class="fs12" style="color:red">
          {{error}}
        </div>
      </div>
  </div>
</template>
<style>
.upload-excel-error {
    border: 2px solid red;
}
</style>
<script>
  import readXlsxFile from 'read-excel-file'
  
  export default {
    name: 'UploadExcel',
    data: function(){
      return {
        file: '',
      }
    },
    props: ['error', 'clear', 'disabled', 'sendId', 'themes'],
    methods: {
        removeFile(evt){
            this.file = null;
            if(this.sendId){
              this.$emit('onDelete', evt,this.sendId);
            } else {
              this.$emit('onDelete', evt);
            }
        },
        onSelect: function(event){
          let arr = []
          let self = this
          readXlsxFile(this.file.file).then(data => {
              for (let i = 0; i < data.length; i++) {
                  let json = {}
                  for (let x = 0; x < data[i].length; x++) {
                    json[data[0][x]] = data[i][x]
                  }
                  if (i != 0) {
                    arr.push(json)
                  }
              }
          }).then(function(){
              if(self.sendId){
                self.$emit('onSelect', arr,self.sendId);
              } else {
                self.$emit('onSelect', arr);
              }
          })
        },
    },
    watch: {
        clear: {
            handler: function (val) {
                if(val == true){
                    this.file = ''
                }
            },
            deep: true
        },
    }
  }
</script>
<style>
</style>