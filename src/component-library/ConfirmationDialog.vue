<template>
    <div>
        <v-dialog
                v-model="sendData.model"
                persistent
                max-width="470px"
        >
            <v-overlay style="z-index: 6 !important;" :value="overlay">
                <v-progress-circular
                        indeterminate
                        size="84"
                        color="green"
                        width=15
                ></v-progress-circular>
            </v-overlay>

            <v-card class="Heiti" style="border-radius: 15px;">
                <v-card-title>
                    <span class="fs25 second-color mt-1">{{sendData.title}}</span>
                </v-card-title>
                <v-card-text>
                    <span class="fs16 mt-1">{{sendData.text}}</span>
                </v-card-text>
                <v-col cols="12" v-if="sendData.adjustmentNote">
                    <v-textarea
                            name="adj_note"
                            v-model="adj_note"
                            :rules="val_note_short"
                            counter="100"
                            required
                            outlined
                            class="rounded-form"
                    >
                        <template v-slot:label>
                            <div>
                                {{sendData.adjustmentNote}}<span style="color:red;">*</span>
                            </div>
                        </template>
                    </v-textarea>
                </v-col>
                <v-col cols="12" v-if="sendData.cancelNote">
                    <v-textarea
                            name="cancellation_note"
                            v-model="note"
                            counter="100"
                            required
                            outlined
                            class="rounded-form"
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
                            rounded
                            elevation="0"
                            class="no-caps px-7"
                            @click="sendData.model = false; adj_note = ''; note = ''"
                            style="background: #E6E9ED;color:#768F9C;height:45px"
                    >No
                    </v-btn>
                    <v-btn
                            v-if="(sendData.adjustmentNote || sendData.cancelNote) && sendData.noDisable == true"
                            class="px-7 ml-2 no-caps white--text"
                            @click="actions()"
                            elevation="0"
                            rounded
                            :disabled="disableBtn"
                            style="background: #768f9c; height:45px"
                    >Save
                    </v-btn>
                    <v-btn
                            v-else-if="(sendData.adjustmentNote || sendData.cancelNote) && sendData.noDisable != true"
                            class="px-7 ml-2 no-caps white--text"
                            @click="actions()"
                            elevation="0"
                            :disabled="disableSave"
                            rounded
                            style="background: #768f9c; height:45px"
                    >Save
                    </v-btn>
                    <v-btn
                            v-else
                            class="px-7 ml-2 no-caps white--text"
                            @click="actions()"
                            elevation="0"
                            rounded
                            :disabled="disableBtn"
                            style="background: #768f9c; height:45px"
                    >Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<style scoped>
    .v-overlay .v-overlay--active .theme--dark {
        z-index: 6 !important;
    }
</style>
<script>
    import Vue from 'vue'

    export default {
        name: "ConfirmationDialog",
        data() {
            return {
                disableBtn: false,
                disableSave: true,
                adj_note: '',
                note: '',
                overlay: false,
                error: {}
            }
        },
        props: {
            sendData: {
                data: {
                    adj_note: "",
                    note: "",
                },
                withJobs: false,
                image: ""
            },
            updateNote: ""
        },
        created() {
            if (this.updateNote) {
                this.adj_note = this.updateNote
                this.sendData.data.adj_note = this.updateNote
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
                if (this.sendData.post) {
                    this.$http.post(this.sendData.urlApi, this.sendData.data)
                        .then(response => {
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