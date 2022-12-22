<template>
    <div>
        <div v-if="notUseLabel!=true">Image<span class="text-red">*</span></div>
        <v-file-input id="fileUpload" type="file" v-model="image" :accept="accept" style="display:none;" @change="verifyFileUpload()"/>
        <div
            class="rounded-form image-box-error fs12 text-black60"
            :class="notUseLabel? '':'mt-2'"
            :style="'width:'+minWidth+'px;height:'+minHeight+'px;padding-top:'+minHeight/3+'px'"
            v-if="image == null && imageError !== ''"
            @click="chooseFiles()"
        >
            <div class="center fs12">
                Min. resolution {{minWidth}} x {{minHeight}}
            </div>
            <v-flex class="hello-text mt-2">
                <v-icon x-large>mdi-camera</v-icon>
                <span>Upload Image</span>
                <span v-if="maxSize">
                   <span v-if="maxSize <1000">Max : {{maxSize}} Kb</span>
                   <span v-else>Max : {{maxSize/1000}} Mb</span>
                </span>
                <span v-else>Max : 300 Kb</span>
            </v-flex>
        </div>
        <div
            class="rounded-form image-box fs12 text-black60"
            :style="'width:'+minWidth+'px;height:'+minHeight+'px;padding-top:'+minHeight/3+'px'"
            :class="notUseLabel? '':'mt-2'"
            v-if="image == null && imageError == ''"
            @click="chooseFiles()"
        >
            <div class="center">
                Min. resolution {{minWidth}} x {{minHeight}}
            </div>
            <v-flex class="hello-text mt-2">
                <v-icon x-large>mdi-camera</v-icon>
                <span>Upload Image</span>
                <span v-if="maxSize">
                   <span v-if="maxSize <1000">Max : {{maxSize}} Kb</span>
                   <span v-else>Max : {{maxSize/1000}} Mb</span>
                </span>
                <span v-else>Max : 300 Kb</span>
            </v-flex>
        </div>
        <div 
            v-if="image !== null" 
            class="rounded-form image-box relative" 
            :style="'width:'+minWidth+'px;height:'+minHeight+'px'"
            :class="notUseLabel? '':'mt-2'">
            <v-btn
                class="btn-remove absolute -mt40"
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
                :width="minWidth"
                :height="minHeight"
            />
            <v-img
                v-else
                :src="url"
                class="rounded-form -mt33"
                :width="minWidth"
                :height="minHeight"
            />
        </div>
        <div class="text-red fs12">{{imageError}}</div>
        <v-overlay style="z-index: 6 !important;" :value="overlay">
            <v-progress-circular
                indeterminate
                size="84"
                color="green"
                width=15
            ></v-progress-circular>
            <div class="-ml20 mt10">Uploading Image</div>
        </v-overlay>
    </div>
</template>

<script>
    export default {
        name: 'UploadImageCustomize',
        props: ['forImgName', 'errorMsg', 'imageFromUpdate', 'maxSize', 'extention', 'minWidth', 'minHeight', 'type', 'accept', 'notUseLabel'],
        data() {
            return {
                image: null,
                imageError: '',
                disable: true,
                currentTime: this.$moment().valueOf(),
                nameFile: '',
                imgUrl: null,
                overlay: false,
            }
        },
        methods: {
            //For choosing file
            chooseFiles() {
                if (this.forImgName) {
                    this.imageError = ""
                    document.getElementById("fileUpload").click()
                } else {
                    this.imageError = "Please input name before upload image"
                }
            },
            //For veryfying the uploaded file
            verifyFileUpload() {
                let that = this;
                let file = document.getElementById("fileUpload");
                if (!that.accept) {
                    that.accept = "image/png, image/jpeg, image/bmp";
                }
                if (!that.maxSize) {
                    that.maxSize = 0.3
                }
                if (!that.extention) {
                    that.extention = 'png'
                }

                if (file && file.files.length > 0) {
                    let img = new Image();
                    let resp = file.files[0]

                    img.src = window.URL.createObjectURL(file.files[0]);
                    img.onload = function () {
                        if (this.naturalWidth < that.minWidth || this.naturalHeight < that.minHeight) {
                            that.imageError = "Min resolution: " + that.minWidth + " x " + that.minHeight + " pixels";
                            that.image = null;
                        } else {
                            that.imageError = "";
                            const isLt2M = resp.size / 1000 < that.maxSize;
                            if (!isLt2M) {
                                that.image = null;
                                if (resp.size / 1000 < 1000) {
                                    that.imageError = "Max file size: " + that.maxSize + "kb";
                                } else {
                                    that.imageError = "Max file size: " + that.maxSize / 1000 + "Mb";

                                }
                            } else {
                                that.imageError = "";
                                that.nameFile = (that.forImgName + "-" + that.currentTime).replace(/ /g, "");

                                let datas = new FormData();
                                let blob = resp.slice(0, resp.size, resp.type);
                                let newFile = new File([blob], that.nameFile + '.' + that.extention, {type: resp.type});
                                datas.append('file', newFile); // file = data from File client or upload
                                datas.append('type', that.type); // name of directory (voucher,courier dll)
                                that.overlay = true;
                                that.$http.post('/storage/v1/upload/image', datas, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }).then(response => {
                                    that.overlay = false
                                    if (response.data.data && response.data.data != null) {
                                        that.imgUrl = response.data.data.url;
                                        that.$root.$emit('event_uploadImage', that.imgUrl)
                                    } else {
                                        that.imgUrl = null
                                    }
                                }).catch(function (error) {
                                    that.overlay = false;
                                    that.image = null;
                                });
                            }
                        }
                    };
                }
            },
            //To remove file
            onRemove() {
                let that = this
                that.image = null;
                that.imgUrl = null;
                that.$root.$emit('event_uploadImage', '')
            },
        },
        computed: {
            //For updating url to variable
            url() {
                if (!this.image) return;
                return URL.createObjectURL(this.image);
            }
        },
        mounted (){
            setInterval(() => {
                this.currentTime = this.$moment().valueOf()
            }, 1000);
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
                    if (val) {
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
        max-width:100%;
        background: #EBEBEB;
        border-style:dashed;
        border-color:gray;
        border-width:1px;
    }
    .image-box-error {
        max-width:100%;
        border-style:dashed;
        background: #EBEBEB;
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
