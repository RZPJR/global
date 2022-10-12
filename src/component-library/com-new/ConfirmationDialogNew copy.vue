<template>
    <div>
        <v-dialog
            v-model="sendData.model"
            persistent
            max-width="470px"
        >
            <LoadingBar :value="overlay"/>
            <v-card class="OpenSans">
                <v-card-title>
                    <span class="text-title-modal">{{sendData.title}}</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">{{sendData.text}}</span>
                </v-card-text>
                <v-col cols="12" v-if="sendData.adjustmentNote" class="px20 -mt15">
                    <v-textarea
                        name="adj_note"
                        v-model="adj_note"
                        :rules="val_note_short"
                        counter="100"
                        required
                        rows="3"
                        outlined
                    >
                        <template v-slot:label>
                            <div>
                                {{sendData.adjustmentNote}}<span style="color:red;">*</span>
                            </div>
                        </template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" v-if="sendData.cancelNote" class="px20 -mt15">
                    <v-textarea
                        name="cancellation_note"
                        v-model="note"
                        counter="100"
                        required
                        outlined
                        rows="3"
                        maxlength="100"
                        :error-messages="error.note"
                    >
                        <template v-slot:label>
                            <div>
                                {{sendData.cancelNote}} <span style="color:red;">*</span>
                            </div>
                        </template>
                    </v-textarea>
                </v-col>
                <!-- <pre>{{sendData.data}}</pre> -->
                <v-card-actions class="pb-4">
                <v-spacer></v-spacer>
                    <v-btn
                        @click="sendData.model = false; adj_note = ''; note = ''"
                        depressed
                        outlined
                        color="#EBEBEB"
                        class="main-btn"
                    >
                        <span class="text-black80">No</span>
                    </v-btn>
                    <v-btn
                        v-if="(sendData.adjustmentNote || sendData.cancelNote) && sendData.noDisable == true"
                        @click="actions()"
                        :disabled="disableBtn"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                    >Save</v-btn>
                    <v-btn
                        v-else-if="(sendData.adjustmentNote || sendData.cancelNote) && sendData.noDisable != true"
                        :disabled="disableSave"
                        @click="actions()"
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                    >Save</v-btn>
                    <v-btn
                        v-else
                        class="main-btn white--text"
                        depressed
                        color="#50ABA3"
                        @click="actions()"
                        :disabled="disableBtn"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import Vue from 'vue'
export default {
    name : "ConfirmationDialogNew",
    data () {
        return {
            disableBtn: false,
            disableSave: true,
            adj_note:'',
            note: '',
            overlay: false,
            error:{}
        }
    },
    props: {
        sendData:{
            data : {
                adj_note : "",
                note: "",
            },
            withJobs: false,
            image : "",
            label: ""
        },
        updateNote: ""
    },
    created(){
        if(this.updateNote){
            this.adj_note = this.updateNote
            this.sendData.data.adj_note =  this.updateNote
        }
    },
    methods: {
        successToast() {
            let msg = 'Data has been saved successfully'
            if (this.sendData.statusMsg) {
                msg = this.sendData.statusMsg
            }
            Vue.$toast.open({
                position: 'top-right',
                message: msg,
                type: 'success',
            });
        },
        errorToast(data) {
            for (var key in data) {
                Vue.$toast.open({
                    position: 'top-right',
                    message: data[key],
                    type: 'error',
                });
            }
        },
        errorServerToast() {
            Vue.$toast.open({
                position: 'top-right',
                message: 'Internal Server Error',
                type: 'error',
            });
        },
        actions() {
            let self = this
            self.disableBtn = true
            self.overlay = true
            setTimeout(function () {
                self.sendData.model = true
            }, 50);
            if (this.sendData.label == 'URL_2') { // condition for using API URL 2
                if (this.sendData.post) {
                    this.$http2.post(this.sendData.urlApi, this.sendData.data).then(response => {
                        if (self.sendData.withJobs) {
                            let timer = setInterval(function () {
                                self.$http2.get("/jobs/" + response.data.data.id).then(responses => {
                                    if (responses.data.data.status === 4) {
                                        clearTimeout(timer);
                                        let url = self.sendData.nextPage
                                        self.$router.push(url)
                                        if (self.sendData.image) {
                                            self.$root.$emit('event_img', true)
                                        }
                                        self.disableBtn = false
                                        self.overlay = false
                                        self.note = ''
                                        self.successToast()
                                    } else if (responses.data.data.status === 5) {
                                        clearTimeout(timer);
                                        self.overlay = false
                                        self.disableBtn = false
                                        self.note = ''
                                        self.sendData.model = false
                                        self.$root.$emit('event_error', e.errors)
                                    }
                                });

                            }, 2000);
                        } else {
                            let url = self.sendData.nextPage
                            if (url.includes(':id')) {
                                let push = url.replace(":id", response.data.data.id)
                                self.$router.push(push)
                                self.disableBtn = false
                                self.overlay = false
                            } else {
                                self.$router.push(url)
                            }
                            if (self.sendData.image) {
                                self.$root.$emit('event_img', true)
                            }
                            self.disableBtn = false
                            self.overlay = false
                            self.note = ''
                            self.successToast()
                        }
                    })
                    .catch(e => {
                        self.overlay = false
                        self.disableBtn = false
                        self.note = ''
                        self.sendData.model = false
                        self.$root.$emit('event_error', e.errors)
                    })
                } else if (this.sendData.status) {
                    this.$http2.put(this.sendData.urlApi, this.sendData.data)
                        .then(response => {
                            if (self.sendData.withJobs) {
                                let timer = setInterval(function () {
                                    self.$http2.get("/jobs/" + response.data.data.id).then(responses => {
                                        if (responses.data.data.status === 4) {
                                            clearTimeout(timer);
                                            if (self.sendData.nextPage) {
                                                let url = self.sendData.nextPage
                                                if (url.includes(':id')) {
                                                    let push = url.replace(":id", response.data.data.id)
                                                    self.$router.push(push)
                                                } else {
                                                    self.$router.push(url)
                                                }
                                            }
                                            self.$root.$emit('event_success', true)
                                            self.sendData.model = false
                                            self.disableBtn = false
                                            self.overlay = false
                                            self.note = ''
                                            self.successToast()
                                        } else if (responses.data.data.status === 5) {
                                            clearTimeout(timer);
                                            self.overlay = false
                                            self.disableBtn = false
                                            self.note = ''
                                            self.sendData.model = false
                                            if (!e.errors.id) {
                                                self.errorServerToast()
                                            } else {
                                                self.$root.$emit('event_error', e.errors)
                                            }
                                        }
                                    });

                                }, 2000);
                            } else {
                                if (self.sendData.nextPage) {
                                    let url = this.sendData.nextPage
                                    if (url.includes(':id')) {
                                        let push = url.replace(":id", response.data.data.id)
                                        self.$router.push(push)
                                    } else {
                                        self.$router.push(url)
                                    }
                                }
                                self.$root.$emit('event_success', true)
                                self.sendData.model = false
                                self.disableBtn = false
                                self.overlay = false
                                self.note = ''
                                self.successToast()
                            }
                        })
                        .catch(e => {
                            self.overlay = false
                            self.disableBtn = false
                            self.note = ''
                            self.sendData.model = false
                            if (!e.errors.id) {
                                self.errorServerToast()
                            } else {
                                self.$root.$emit('event_error', e.errors)
                            }
                        });
                } else if (this.sendData.noDisable) {
                    this.$http2.put(this.sendData.urlApi, this.sendData.data)
                        .then(response => {
                            if (self.sendData.withJobs) {
                                let timer = setInterval(function () {
                                    self.$http2.get("/jobs/" + response.data.data.id).then(responses => {
                                        if (responses.data.data.status === 4) {
                                            clearTimeout(timer);
                                            self.disableBtn = false
                                            self.overlay = false
                                            self.note = ''
                                            self.successToast()
                                            let url = self.sendData.nextPage
                                            if (url.includes(':id')) {
                                                let push = url.replace(":id", response.data.data.id)
                                                window.location.reload(push)
                                                self.disableBtn = false
                                                self.overlay = false
                                            } else {
                                                self.$router.push(url)
                                            }
                                            if (self.sendData.image) {
                                                self.$root.$emit('event_img', true)
                                            }
                                        } else if (responses.data.data.status === 5) {
                                            clearTimeout(timer);
                                            self.overlay = false
                                            self.error = e.errors
                                            self.disableBtn = false
                                            self.note = ''
                                            self.sendData.model = true
                                        }
                                    });

                                }, 2000);
                            } else {
                                self.disableBtn = false
                                self.overlay = false
                                self.note = ''
                                self.successToast()
                                let url = self.sendData.nextPage
                                if (url.includes(':id')) {
                                    let push = url.replace(":id", response.data.data.id)
                                    window.location.reload(push)
                                    self.disableBtn = false
                                    self.overlay = false
                                } else {
                                    self.$router.push(url)
                                }
                                if (self.sendData.image) {
                                    self.$root.$emit('event_img', true)
                                }
                            }
                        })
                        .catch(e => {
                            self.overlay = false
                            self.error = e.errors
                            self.disableBtn = false
                            self.note = ''
                            self.sendData.model = true
                        });
                } else {
                    this.$http2.put(this.sendData.urlApi, this.sendData.data)
                        .then(response => {
                            if (self.sendData.withJobs) {
                                let timer = setInterval(function () {
                                    self.$http2.get("/jobs/" + response.data.data.id).then(responses => {
                                        if (responses.data.data.status === 4) {
                                            clearTimeout(timer);
                                            self.$router.push(self.sendData.nextPage)
                                            self.disableBtn = false
                                            self.overlay = false
                                            self.note = ''
                                            self.successToast()
                                            if (self.sendData.image) {
                                                self.$root.$emit('event_img', true)
                                            }
                                        } else if (responses.data.data.status === 5) {
                                            clearTimeout(timer);
                                            self.overlay = false
                                            self.disableBtn = false
                                            self.note = ''
                                            self.sendData.model = false
                                            self.$root.$emit('event_error', e.errors)
                                        }
                                    });

                                }, 2000);
                            } else {
                                self.$router.push(self.sendData.nextPage)
                                self.disableBtn = false
                                self.overlay = false
                                self.note = ''
                                self.successToast()
                                if (self.sendData.image) {
                                    self.$root.$emit('event_img', true)
                                }
                            }
                        })
                        .catch(e => {
                            self.overlay = false
                            self.disableBtn = false
                            self.note = ''
                            self.sendData.model = false
                            self.$root.$emit('event_error', e.errors)
                        });
                }
            } else { // for using CORE API
                if (this.sendData.post) {
                    this.$http.post(this.sendData.urlApi, this.sendData.data).then(response => {
                        if (self.sendData.withJobs) {
                            let timer = setInterval(function () {
                                self.$http.get("/jobs/" + response.data.data.id).then(responses => {
                                    if (responses.data.data.status === 4) {
                                        clearTimeout(timer);
                                        let url = self.sendData.nextPage
                                        self.$router.push(url)
                                        if (self.sendData.image) {
                                            self.$root.$emit('event_img', true)
                                        }
                                        self.disableBtn = false
                                        self.overlay = false
                                        self.note = ''
                                        self.successToast()
                                    } else if (responses.data.data.status === 5) {
                                        clearTimeout(timer);
                                        self.overlay = false
                                        self.disableBtn = false
                                        self.note = ''
                                        self.sendData.model = false
                                        self.$root.$emit('event_error', e.errors)
                                    }
                                });

                            }, 2000);
                        } else {
                            let url = self.sendData.nextPage
                            if (url.includes(':id')) {
                                let push = url.replace(":id", response.data.data.id)
                                self.$router.push(push)
                                self.disableBtn = false
                                self.overlay = false
                            } else {
                                self.$router.push(url)
                            }
                            if (self.sendData.image) {
                                self.$root.$emit('event_img', true)
                            }
                            self.disableBtn = false
                            self.overlay = false
                            self.note = ''
                            self.successToast()
                        }
                    })
                    .catch(e => {
                        self.overlay = false
                        self.disableBtn = false
                        self.note = ''
                        self.sendData.model = false
                        self.$root.$emit('event_error', e.errors)
                    })
                } else if (this.sendData.status) {
                    this.$http.put(this.sendData.urlApi, this.sendData.data)
                        .then(response => {
                            if (self.sendData.withJobs) {
                                let timer = setInterval(function () {
                                    self.$http.get("/jobs/" + response.data.data.id).then(responses => {
                                        if (responses.data.data.status === 4) {
                                            clearTimeout(timer);
                                            if (self.sendData.nextPage) {
                                                let url = self.sendData.nextPage
                                                if (url.includes(':id')) {
                                                    let push = url.replace(":id", response.data.data.id)
                                                    self.$router.push(push)
                                                } else {
                                                    self.$router.push(url)
                                                }
                                            }
                                            self.$root.$emit('event_success', true)
                                            self.sendData.model = false
                                            self.disableBtn = false
                                            self.overlay = false
                                            self.note = ''
                                            self.successToast()
                                        } else if (responses.data.data.status === 5) {
                                            clearTimeout(timer);
                                            self.overlay = false
                                            self.disableBtn = false
                                            self.note = ''
                                            self.sendData.model = false
                                            if (!e.errors.id) {
                                                self.errorServerToast()
                                            } else {
                                                self.$root.$emit('event_error', e.errors)
                                            }
                                        }
                                    });

                                }, 2000);
                            } else {
                                if (self.sendData.nextPage) {
                                    let url = this.sendData.nextPage
                                    if (url.includes(':id')) {
                                        let push = url.replace(":id", response.data.data.id)
                                        self.$router.push(push)
                                    } else {
                                        self.$router.push(url)
                                    }
                                }
                                self.$root.$emit('event_success', true)
                                self.sendData.model = false
                                self.disableBtn = false
                                self.overlay = false
                                self.note = ''
                                self.successToast()
                            }
                        })
                        .catch(e => {
                            self.overlay = false
                            self.disableBtn = false
                            self.note = ''
                            self.sendData.model = false
                            if (!e.errors.id) {
                                self.errorServerToast()
                            } else {
                                self.$root.$emit('event_error', e.errors)
                            }
                        });
                } else if (this.sendData.noDisable) {
                    this.$http.put(this.sendData.urlApi, this.sendData.data)
                        .then(response => {
                            if (self.sendData.withJobs) {
                                let timer = setInterval(function () {
                                    self.$http.get("/jobs/" + response.data.data.id).then(responses => {
                                        if (responses.data.data.status === 4) {
                                            clearTimeout(timer);
                                            self.disableBtn = false
                                            self.overlay = false
                                            self.note = ''
                                            self.successToast()
                                            let url = self.sendData.nextPage
                                            if (url.includes(':id')) {
                                                let push = url.replace(":id", response.data.data.id)
                                                window.location.reload(push)
                                                self.disableBtn = false
                                                self.overlay = false
                                            } else {
                                                self.$router.push(url)
                                            }
                                            if (self.sendData.image) {
                                                self.$root.$emit('event_img', true)
                                            }
                                        } else if (responses.data.data.status === 5) {
                                            clearTimeout(timer);
                                            self.overlay = false
                                            self.error = e.errors
                                            self.disableBtn = false
                                            self.note = ''
                                            self.sendData.model = true
                                        }
                                    });

                                }, 2000);
                            } else {
                                self.disableBtn = false
                                self.overlay = false
                                self.note = ''
                                self.successToast()
                                let url = self.sendData.nextPage
                                if (url.includes(':id')) {
                                    let push = url.replace(":id", response.data.data.id)
                                    window.location.reload(push)
                                    self.disableBtn = false
                                    self.overlay = false
                                } else {
                                    self.$router.push(url)
                                }
                                if (self.sendData.image) {
                                    self.$root.$emit('event_img', true)
                                }
                            }
                        })
                        .catch(e => {
                            self.overlay = false
                            self.error = e.errors
                            self.disableBtn = false
                            self.note = ''
                            self.sendData.model = true
                        });
                } else {
                    this.$http.put(this.sendData.urlApi, this.sendData.data)
                        .then(response => {
                            if (self.sendData.withJobs) {
                                let timer = setInterval(function () {
                                    self.$http.get("/jobs/" + response.data.data.id).then(responses => {
                                        if (responses.data.data.status === 4) {
                                            clearTimeout(timer);
                                            self.$router.push(self.sendData.nextPage)
                                            self.disableBtn = false
                                            self.overlay = false
                                            self.note = ''
                                            self.successToast()
                                            if (self.sendData.image) {
                                                self.$root.$emit('event_img', true)
                                            }
                                        } else if (responses.data.data.status === 5) {
                                            clearTimeout(timer);
                                            self.overlay = false
                                            self.disableBtn = false
                                            self.note = ''
                                            self.sendData.model = false
                                            self.$root.$emit('event_error', e.errors)
                                        }
                                    });

                                }, 2000);
                            } else {
                                self.$router.push(self.sendData.nextPage)
                                self.disableBtn = false
                                self.overlay = false
                                self.note = ''
                                self.successToast()
                                if (self.sendData.image) {
                                    self.$root.$emit('event_img', true)
                                }
                            }
                        })
                        .catch(e => {
                            self.overlay = false
                            self.disableBtn = false
                            self.note = ''
                            self.sendData.model = false
                            self.$root.$emit('event_error', e.errors)
                        });
                }
            }
        },
    },
    watch: {
        'adj_note': {
            handler: function (val) {
                if (val) {
                    this.sendData.data.adj_note = val
                    this.disableSave = false
                } else {
                    this.sendData.data.adj_note = ''
                    this.disableSave = true
                }
            },
            deep: true
        },
        'note': {
            handler: function (val) {
                if (val) {
                    this.sendData.data.note = val
                    this.disableSave = false
                } else {
                    if (this.sendData.noDisable == true) {
                        this.sendData.data.note = ''
                        this.disableSave = false
                    } else {
                        this.sendData.data.note = ''
                        this.disableSave = true
                    }
                }
            },
            deep: true
        },
    },
}
</script>