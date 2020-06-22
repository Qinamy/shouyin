<template>
    <div>
        <div class="cursor blink" style="height: 38px;width: 2px;display: inline-block;">
        </div>
    </div>
</template>
<script>
    export default {
        components: {
        },
        data() {
            return {

            };
        },
    }
</script>
<style>
    @keyframes blink {
        50% {
            color: #000;
            background: #0c0;
            -webkit-box-shadow: 0 0 5px rgba(0,100,0,50);
            box-shadow: 0 0 5px rgba(0,100,0,50);
        }
    }
    @-webkit-keyframes blink {
        50% {
            color: #000;
            background: #0c0;
            -webkit-box-shadow: 0 0 5px rgba(0,100,0,50);
            box-shadow: 0 0 5px rgba(0,100,0,50);
        }
    }
    @-ms-keyframes blink {
        50% {
            color: #000;
            background: #0c0;
            -webkit-box-shadow: 0 0 5px rgba(0,100,0,50);
            box-shadow: 0 0 5px rgba(0,100,0,50);
        }
    }
    @-moz-keyframes blink {
        50% {
            color: #000;
            background: #0c0;
            -webkit-box-shadow: 0 0 5px rgba(0,100,0,50);
            box-shadow: 0 0 5px rgba(0,100,0,50);
        }
    }
    .cursor.blink {
        -webkit-animation: 1s blink infinite;
        animation: 1s blink infinite;
        -webkit-box-shadow: 0 0 0 rgba(0,100,0,50);
        box-shadow: 0 0 0 rgba(0,100,0,50);
        border: none;
        margin: 0;
    }
</style>