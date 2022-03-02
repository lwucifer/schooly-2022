<template>
    <div>
        <div class="evlc-item__body bg-input-gray">
            <div class="d-flex align-items-center py-3">
            <div class="d-flex align-items-center mr-4">
                <IconPlay 
                    width="16px" height="16px"
                    v-if="lesson.type == 'VIDEO'"
                    class="mr-2 fill-primary"/>

                <IconLibraryBooks 
                    v-else
                    width="16px" height="16px"
                    class="fill-primary mr-2" 
                   />

                Bài {{ lesson.index }}: {{ lesson.name }}
            </div>
            
            <div class="ml-auto">{{ lesson.duration }}</div>
            </div>
            <app-divider class="my-0" />
        </div>
    </div>
</template>

<script>
import IconPlay from '~/assets/svg/icons/play.svg?inline';
import IconLibraryBooks from '~/assets/svg/icons/library-books.svg?inline';
export default {
    props: {
        lesson: Object
    },

    components: {
        IconPlay,
        IconLibraryBooks
    }
}
</script>

<style>

</style>