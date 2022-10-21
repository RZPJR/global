<template>
    <v-hover>
        <template v-slot:default="{ hover }">
            <div>
                <v-img 
                    v-if="large_img"
                    :src="src"
                    height="182px"
                    max-width="250px"
                    min-width="100px"
                    aspect-ratio="1"
                    hover
                    class="rounded-form"
                >
                    <v-fade-transition>
                        <v-overlay v-if="hover" absolute color="#000000">
                            <v-row justify="center">
                                <v-icon small color="white" v-on:click="displayPicture">
                                    visibility
                                </v-icon>
                            </v-row>
                            <v-row>
                                <span v-on:click="displayPicture">Preview</span>
                            </v-row>
                        </v-overlay>
                    </v-fade-transition>
                </v-img>
                <v-img 
                    v-else
                    :src="src"
                    height="100px"
                    max-width="100px"
                    min-width="100px"
                    aspect-ratio="1"
                    hover
                    class="rounded-form-sm"
                >
                    <v-fade-transition>
                        <v-overlay v-if="hover" absolute color="#000000">
                            <v-row justify="center">
                                <v-icon small color="white" v-on:click="displayPicture">
                                    visibility
                                </v-icon>
                            </v-row>
                            <v-row>
                                <span v-on:click="displayPicture">Preview</span>
                            </v-row>
                        </v-overlay>
                    </v-fade-transition>
                </v-img>
                <v-overlay :z-index="12" :value="overlayBG">
                    <v-btn
                        class="mx-2 close-overlay"
                        fab
                        small
                        dark
                        color="white"
                        @click="overlayBG = false"
                    >
                        <v-img src="/icon/close-new.png" max-height="24px" max-width="24px"></v-img>
                    </v-btn>
                    <v-img
                        :src="src"
                        hover
                        class="image-overlay-full"
                    />
                </v-overlay>
            </div>
        </template>
    </v-hover>
</template>
<script>
    export default {
        name: "DisplayPhotoOverlay",
        data() {
            return {
                overlay: false,
                overlayBG: false,
            };
        },
        props: {
            src: "",
            large_img: false,
        },
        methods: {
            displayPicture() {
                this.overlayBG = true
            },
        },
    };
</script>
