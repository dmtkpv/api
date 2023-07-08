<!--
    Styles
-->

<style>


</style>


<!--
    Template
-->

<template>
    <div>App</div>

</template>


<!--
    Scripts
-->

<script setup>

    import { shallowReactive, computed, watch } from "vue";
    // import { useRouter } from 'vue-router'
    import { useApi } from '@dmtkpv/api'

    const { cancel, onCancel } = useApi();

    console.dir(onCancel(() => {}))

    // api.cancel().onCancel(() => console.log('done'))();

    // console.dir(api.onFetch(() => {}).onFetch(() => {}).onFetch(() => {}))





</script>