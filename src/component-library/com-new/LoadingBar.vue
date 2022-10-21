<template>
    <v-overlay :z-index="12" :value="value">
        <v-progress-circular
            indeterminate
            size="84"
            color="#50ABA3"
            width=15
        ></v-progress-circular>
    </v-overlay>
</template>
<script>
export default {
    name : "LoadingBar",
    data() {
        return {

        }
    },
    props : ["value"]
}
</script>