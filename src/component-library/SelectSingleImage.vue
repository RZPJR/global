<template>
    <v-container>
        <v-col style="margin-top:-20px">Image<span style="color:red">*</span></v-col>
        <v-file-input id="fileUpload" type="file" v-model="image" accept="image/png, image/jpeg, image/bmp" style="display:none;" @change="verifyFileUpload()"/>
        <div
            class="rounded-form image-box-error pt-2"
            v-if="image == null && imageError !== ''"
            @click="chooseFiles()"
            style="color:#768F9C;"
        >
            <span v-if="!maxSize" style="font-size:80%;" class="ml-3">Min Resolution : 250 x 250 pixels</span>
            <span v-else style="font-size:80%;" class="ml-3"></span>
            <v-flex class="hello-text mt-5" style="text-transform: capitalize;">
                <v-icon style="font-size:80px;">mdi-camera</v-icon>
                <span><b>Upload Image</b></span>
                <span v-if="maxSize" style="font-size:80%;">
                   <span v-if="maxSize < 1" style="font-size:80%;">Max : {{maxSize*1000}} Kb</span>
                   <span v-else style="font-size:80%;">Max : {{maxSize}} Mb</span>
                </span>
                <span v-else style="font-size:80%;">Max : 300 Kb</span>
            </v-flex>
        </div>
        <div
            class="rounded-form image-box pt-2"
            v-if="image == null && imageError == ''"
            @click="chooseFiles()"
            style="color:#768F9C;"
        >
            <span v-if="!maxSize" style="font-size:80%;" class="ml-3">Min Resolution : 250 x 250 pixels</span>
            <span v-else style="font-size:80%;" class="ml-3"></span>
            <v-flex class="hello-text mt-5" style="text-transform: capitalize;">
                <v-icon style="font-size:80px;">mdi-camera</v-icon>
                <span><b>Upload Image</b></span>
                <span v-if="maxSize" style="font-size:80%;">
                   <span v-if="maxSize < 1" style="font-size:80%;">Max : {{maxSize*1000}} Kb</span>
                   <span v-else style="font-size:80%;">Max : {{maxSize}} Mb</span>
                </span>
                <span v-else style="font-size:80%;">Max : 300 Kb</span>
            </v-flex>
        </div>
        <div v-if="image !== null" class="rounded-form image-box" style="position:relative;">
            <v-btn
                style="position:absolute;"
                class="btn-remove"
                fab
                x-small
                plain
                @click="onRemove()"
            >
                <v-icon dark>
                    mdi-close
                </v-icon>
            </v-btn>
            <v-img
                v-if="imageFromUpdate"
                :src="imageFromUpdate"
                class="rounded-form"
                style="width:299px;height:198px;"
            />
            <v-img
                v-else
                :src="url"
                class="rounded-form"
                style="width:299px;height:198px;"
            />
        </div>
        <div class="mt-1 ml-3" style="color:red;">{{imageError}}</div>
        <v-overlay style="z-index: 6 !important;" :value="overlay">
            <v-progress-circular
                indeterminate
                size="84"
                color="green"
                width=15
            ></v-progress-circular>
            <div style="margin-left:-20px;margin-top:10px">Uploading Image</div>
        </v-overlay>
    </v-container>
</template>

<script>
    export default {
        name: 'SelectSingleImage',
        props: ['forImgName','errorMsg','imageFromUpdate', 'maxSize', 'extention'],
        data () {
            return {
                image: null,
                imageError: '',
                disable: true,
                currentTime: this.$moment().format('YYYY-MM-DD_HH-mm-ss'),
                nameFile:'',
                imgUrl : null,
                overlay : false,
            }
        },
        methods:{
            chooseFiles() {
                if(this.forImgName){
                    this.imageError=""
                    this.errorMsg = ""
                    document.getElementById("fileUpload").click()
                }else{
                    this.imageError="Please input name before upload image"
                }
            },
            verifyFileUpload(){
                let that = this
                var file = document.getElementById("fileUpload");
                
                if (!that.maxSize) {
                    that.maxSize = 0.3
                }
                if (!that.extention) {
                    that.extention = 'png'
                }

                if (file && file.files.length > 0)
                {
                    var img = new Image();
                    var resp = file.files[0]

                    img.src = window.URL.createObjectURL( file.files[0] );
                    img.onload = function(){
                        var width = this.naturalWidth,
                            height = this.naturalHeight;
                        if(width < 250 && height < 250){
                            that.imageError = "Min resolution: 250 x 250 pixels";
                            that.image = null;
                        }else{
                            that.imageError = "";
                            const isLt2M = resp.size / 1024 / 1024 < that.maxSize;
                            if (!isLt2M) {
                                that.image = null;
                                that.imageError = "Max file size: 300kb";
                            }else {
                                that.imageError = "";
                                that.nameFile = (that.forImgName + "-" + that.currentTime).replace(/ /g, "");

                                let datas = new FormData();
                                var blob = resp.slice(0, resp.size, resp.type);
                                let newFile = new File([blob], that.nameFile+'.'+that.extention, {type: resp.type});
                                datas.append('file',newFile); // file = data from File client or upload
                                datas.append('type',"/product-tag/"); // name of directory (report,product, product-tag) sales-payment
                                that.overlay = true
                                that.$http.post('/upload',  datas, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }).then(response => {
                                    that.overlay = false
                                    that.imgUrl = response.data.data;
                                    that.$root.$emit('event_singleImage', that.imgUrl)
                                });
                            }
                        }
                    };
                }
            },
            onRemove() {
                let that = this
                that.image = null;
                that.imgUrl = null;
                that.$root.$emit('event_singleImage', '')
            },
        },
        computed: {
            url() {
            if (!this.image) return;
                return URL.createObjectURL(this.image);
            }
        },
        watch: {
            'errorMsg': {
                handler: function (val) {
                    this.imageError = val;
                },
                deep: true
            },
            'imageFromUpdate': {
                handler: function (val) {
                    if(val){
                        this.image = val;
                    }
                },
                deep: true
            },
        },
    }
</script>
<style scoped>
    .hello-text {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .image-box {
        width:300px;
        height:200px;
        border-style:solid;
        border-color:gray;
        border-width:1px;
    }
    .image-box-error {
        width:300px;
        height:200px;
        border-style:solid;
        border-color:red;
        border-width:2px;
    }
    .btn-remove {
        z-index:1;
        background:#FC7079;
        color:white;
        right:10px;
        top:10px
    }
</style>
