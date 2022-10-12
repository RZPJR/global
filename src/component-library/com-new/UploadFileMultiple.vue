<template>
    <div>
        <div>{{ title }}<span style="color:red">*</span></div>
        <v-row class="mt-1">
            <div class="ma-3" v-for="(item, idx) in arrFile" :key="idx">
                <v-file-input :id="`fileUpload${idx}`" style="display:none;" type="file" accept=".jpeg,.pdf" v-model="item.file" @change="verifyFileUpload(idx)"/>
                <v-tooltip top v-if="idx==0">
                    <template v-slot:activator="{ on: tooltip }">
                        <div v-on="{ ...tooltip}">
                            <!-- Upload File png-->
                            <div
                                class="rounded-form image-box-error pt18 fs12 text-black60"
                                v-if="item.file == null && item.fileError !== ''"
                                @click="chooseFiles(idx)"
                            >
                                <v-flex class="hello-text mt-2">
                                    <div class="center"> 
                                        Min. resolution 360 x 180 pixels
                                    </div> 
                                    <v-icon x-large>mdi-camera</v-icon> 
                                    <span><b>Upload Image/PDF</b></span>
                                    <span>Max : 2 Mb</span>
                                </v-flex>
                            </div>
                            <div
                                class="rounded-form image-box pt18 fs12 text-black60"
                                v-if="item.file == null && item.fileError == ''"
                                @click="chooseFiles(idx)"
                                style="color:#768F9C;"
                            >
                                <v-flex class="hello-text mt-2">
                                    <div class="center"> 
                                        Min. resolution 360 x 180 pixels
                                    </div> 
                                    <v-icon x-large>mdi-camera</v-icon> 
                                    <span><b>Upload Image/PDF</b></span>
                                    <span>Max : 2 Mb</span>
                                </v-flex>
                            </div>
                            <div v-if="item.file">
                                <div 
                                    v-if="item.type === 'image/jpeg'"
                                    class="rounded-form image-box" 
                                    style="position:relative;"
                                >
                                    <v-btn
                                        style="position:absolute;"
                                        class="btn-remove"
                                        fab
                                        x-small
                                        plain
                                        @click="onRemove(idx)"
                                    >
                                        <v-icon dark>
                                            mdi-close
                                        </v-icon>
                                    </v-btn>
                                    <v-img
                                        :src="item.fileUrl"
                                        class="rounded-form"
                                        height="178"
                                        width="250"
                                    />
                                </div>
                                <div
                                    v-else
                                    class="rounded-form pdf-box" 
                                    style="position:relative;"
                                >
                                    <v-btn
                                        style="position:absolute;"
                                        class="btn-remove"
                                        fab
                                        x-small
                                        plain
                                        @click="onRemove(idx)"
                                    >
                                        <v-icon dark>
                                            mdi-close
                                        </v-icon>
                                    </v-btn>
                                    <div>
                                        <span class="text-pdf-title fs16 ma10">{{ item.nameFile }}</span>
                                        <img class="pdf-icon" src="/icon/pdf-icon.png" alt="">
                                    </div>
                                </div>
                            </div>
                            <div class="text-red fs12">{{item.fileError}}</div>
                        </div>
                    </template>
                    <span>Upload Image/PDF</span>
                </v-tooltip>
                <div v-else>
                    <div
                        class="rounded-form image-box-error pt18 fs12 text-black60"
                        v-if="item.file == null && item.fileError !== ''"
                        @click="chooseFiles(idx)"
                    >
                        <v-flex class="hello-text mt-2">
                            <div class="center"> 
                                Min. resolution 360 x 180 pixels
                            </div> 
                            <v-icon x-large>mdi-camera</v-icon> 
                            <span><b>Upload Image/PDF</b></span>
                            <span>Max : 2 Mb</span>
                        </v-flex>
                    </div>
                    <div
                        class="rounded-form image-box pt18 fs12 text-black60"
                        v-if="item.file == null && item.fileError == ''"
                        @click="chooseFiles(idx)"
                        style="color:#768F9C;"
                    >
                        <v-flex class="hello-text mt-2">
                            <div class="center"> 
                                Min. resolution 360 x 180 pixels
                            </div> 
                            <v-icon x-large>mdi-camera</v-icon> 
                            <span><b>Upload Image/PDF</b></span>
                            <span>Max : 2 Mb</span>
                        </v-flex>
                    </div>
                    <div v-if="item.file">
                        <div 
                            v-if="item.type === 'image/jpeg'"
                            class="rounded-form image-box" 
                            style="position:relative;"
                        >
                            <v-btn
                                style="position:absolute;"
                                class="btn-remove"
                                fab
                                x-small
                                plain
                                @click="onRemove(idx)"
                            >
                                <v-icon dark>
                                    mdi-close
                                </v-icon>
                            </v-btn>
                            <v-img
                                :src="item.fileUrl"
                                class="rounded-form"
                                height="178"
                                width="250"
                            />
                        </div>
                        <div 
                            v-else
                            class="rounded-form pdf-box" 
                            style="position:relative;"
                        >
                            <v-btn
                                style="position:absolute;"
                                class="btn-remove"
                                fab
                                x-small
                                plain
                                @click="onRemove(idx)"
                            >
                                <v-icon dark>
                                    mdi-close
                                </v-icon>
                            </v-btn>
                            <div>
                                <span class="text-pdf-title fs16 ma10">{{ item.nameFile }}</span>
                                <img class="pdf-icon" src="/icon/pdf-icon.png" alt="">
                            </div>
                        </div>
                        <div class="text-red">{{item.fileError}}</div>
                    </div>
                </div>
            </div>
            <div class="ma-3" v-if="maxFile">
                <img v-if="fileAddEnable" class="img-add" @click="addFile()" src="/img/AddImageOrFileEnable.png" alt="">
                <img v-else class="img-add" src="/img/AddImageOrFile.png" alt="">
            </div>
        </v-row>
    </div>
</template>
<script>
    export default {
        name: 'UploadFileMultiple',
        data() {
            return {
                arrFile: [
                    {
                        file: null,
                        fileUrl: null,
                        nameFile: "",
                        fileError: "",
                        type: ""
                    }
                ],
                fileRemove: [],
                currentTime: this.$moment(new Date()).format('YYYY-MM-DD_HH-mm-ss')
            }
        },
        props: {
            name: "",
            error: "",
            data: "",
            title: "",
            directory: "",
        },
        watch: {
            error: {
                handler: function (val) {
                    this.arrFile[0].fileError = val
                },
                deep: true
            },
            data: {
                handler: function (val) {
                    this.arrFile = val
                },
                deep: true
            },
        },
        mounted() {
            let self = this
            this.$root.$on('event_img', function (err) {
                if (err == true) {
                    self.realRemove()
                }
            });
            setInterval(() => {
                this.currentTime = this.$moment(new Date()).format('YYYY-MM-DD_HH-mm-ss')
            }, 1000);
        },
        computed: {
            fileAddEnable() {
                if (this.arrFile[this.arrFile.length - 1].file !== null) {
                    return true
                } else {
                    return false
                }
            },
            maxFile() {
                if (this.arrFile.length < 5) {
                    return true
                } else {
                    return false
                }
            }
        },
        methods: {
            pushModel() {
                let array = []
                for (let i = 0; i < this.arrFile.length; i++) {
                    if (this.arrFile[i].fileUrl != null) {
                        array.push(this.arrFile[i].fileUrl)
                    }
                }
                this.$root.$emit('event_multipleFile', array)
            },
            addFile() {
                if (this.arrFile[this.arrFile.length - 1].file !== null) {
                    this.arrFile.push(
                        {
                            file: null,
                            fileError: "",
                            fileUrl: null,
                            nameFile: "",
                            type: ""
                        }
                    )
                }
            },
            chooseFiles(id) {
                document.getElementById("fileUpload" + id).click()
            },
            verifyFileUpload(id) {
                let that = this
                var file = document.getElementById("fileUpload" + id);
                if (file && file.files.length > 0) {
                    var img = new Image();
                    var reader = new FileReader()
                    var resp = file.files[0]
                    if (resp.type === "image/jpeg") {
                        img.src = window.URL.createObjectURL(file.files[0]);
                        img.onload = function () {
                            var width = this.naturalWidth,
                                height = this.naturalHeight;
                            if (width < 360 || height < 180) {
                                that.arrFile[id].fileError = "Min resolution: 360 x 180 pixels";
                                that.arrFile[id].file = null;
                            } else {
                                that.arrFile[id].fileError = "";
                                const isLt2M = resp.size / 1024 / 1024 < 2;
                                if (!isLt2M) {
                                    that.arrFile[id].file = null;
                                    that.arrFile[id].fileError = "Max file size: 2 Mb";
                                } else {
                                    that.arrFile[id].fileError = "";
                                    that.arrFile[id].nameFile = (that.name + "-" + that.currentTime).replace(/\//g, "");
                                    that.arrFile[id].type = resp.type
                                    let datas = new FormData();
                                    var blob = resp.slice(0, resp.size, resp.type);
                                    let newFile = new File([blob], that.arrFile[id].nameFile + '.jpeg', {type: resp.type});
                                    datas.append('file', newFile);
                                    datas.append('type', that.directory);
                                    that.$http.post('/upload/img', datas, {
                                        headers: {
                                            'Content-Type': 'multipart/form-data'
                                        }
                                    }).then(response => {
                                        that.arrFile[id].fileUrl = response.data.data;
                                        that.pushModel()
                                    });
                                }
                            }
                        };
                        return
                    }
                    if (resp.type === "application/pdf") {
                        that.arrFile[id].fileError = "";
                        const isLt2M = resp.size / 1024 / 1024 < 2;
                        if (!isLt2M) {
                            that.arrFile[id].file = null;
                            that.arrFile[id].fileError = "Max file size: 2 Mb";
                        } else {
                            that.arrFile[id].fileError = "";
                            that.arrFile[id].nameFile = resp.name;
                            that.arrFile[id].type = resp.type
                            let datas = new FormData();
                            var blob = resp.slice(0, resp.size, resp.type);
                            let newFile = new File([blob], resp.name, {type: resp.type});
                            datas.append('file', newFile);
                            datas.append('type', that.directory);
                            that.$http.post('/upload/pdf', datas, {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then(response => {
                                that.arrFile[id].fileUrl = response.data.data;
                                that.pushModel()
                            });
                        }
                    }
                }
            },
            realRemove() {
                let that = this
                if (this.fileRemove.length > 0) {
                    for (let id = 0; id < this.fileRemove.length; id++) {
                        bucket.deleteObject({
                            Key: 'ktp/' + that.fileRemove[id].nameFile + '.png'
                        }, function (err, data) {
                            if (err) {
                                results.innerHTML = 'ERROR: ' + err;
                            } else {
                                that.fileRemove.splice(id, 1)
                            }
                        })
                    }
                }
            },
            onRemove(id) {
                if (this.arrFile.length > 1) {
                    this.fileRemove.push(this.arrFile[id])
                    this.arrFile.splice(id, 1)
                } else {
                    this.arrFile = [
                        {
                            file: null,
                            fileError: "",
                            fileUrl: null,
                            nameFile: "",
                            type: ""
                        }
                    ]
                }
                this.pushModel()
            },
        }
    }
</script>

<style scoped>
    .hello-text { 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
    } 
    .image-box { 
        width:180px; 
        height:180px; 
        background: #EBEBEB; 
        border-style:dashed; 
        border-color:gray; 
        border-width:1px; 
    } 
    .pdf-box { 
        width:180px; 
        height:180px; 
        background: #B1311D; 
        border-style:dashed; 
        border-color:gray; 
        border-width:1px; 
    }
    .text-pdf-title {
        width: 120px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
        color:  white;
    }
    .image-box-error { 
        width:180px; 
        height:180px; 
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
    .img-add {
        margin-left: 70px;
        margin-right: 70px;
        margin-top: 45px;
    }
    .pdf-icon {
        margin-left: 55px;
        margin-right: 55px;
        margin-top: 25px;
    }
</style>