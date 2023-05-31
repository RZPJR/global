<template>
    <div>
		<v-file-input
			dense
			:label="label"
			accept="application/pdf"
			@change="onFileSelected"
			outlined
			:error-messages="error"
			:id="label"
		></v-file-input>
        <v-overlay style="z-index: 6 !important;" :value="overlay">
            <v-progress-circular
                indeterminate
                size="84"
                color="green"
                width=15
            ></v-progress-circular>
            <div class="-ml20 mt10">Uploading File</div>
        </v-overlay>
    </div>
</template>
  
<script>
  export default {
    name: 'UploadPDF',
	props: ['label','error','max_size','type','extention','name'],
    data() {
		return {
			file: null,
			file_name: '',
            currentTime: this.$moment().valueOf(),
            overlay: false,
		}
    },
    methods: {
		onFileSelected(d) {
            let that = this;
			if(d !== null){
				let file = document.getElementById(this.label);
				let resp = file.files[0]
				if(resp.type === 'application/pdf'){
					if(resp.size/1000 <  this.max_size*1000){
						let blob = resp.slice(0, resp.size, resp.type);
						let data = new FormData();
						this.file_name = (this.name + "-" + this.currentTime).replace(/ /g, "");
						let new_file = new File([blob], this.file_name + '.' + this.extention, {type: resp.type});
						data.append('file', new_file);
						data.append('type', this.type);

						this.overlay = true;
						this.$http.post('/storage/v1/upload/file', data, {
							headers: {
								'Content-Type': 'multipart/form-data'
							}
						}).then(response => {
							that.$emit('onSelect', response.data.data.url);
							this.overlay = false;
						}).catch(function (error) {
							that.$emit('onSelect', '');
							this.overlay = false;
						});
					}else{
						this.error = "Max file size: 2 Mb"
					}
				}else{
					this.error = "Please upload .pdf file"
				}
			}else{
				that.$emit('onSelect', '');
			}
		},
    },
  }
</script>