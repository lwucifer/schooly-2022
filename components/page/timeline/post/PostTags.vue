<template>
  <!--prettyhtml-ignore-->
  <!-- prettier-ignore -->
  <span class="post__tags"><!--
    --> cùng với <!--
    --><n-link class="font-weight-bold" :to="`/account/${tags[0].id}`">{{
      tags[0].fullname
    }}</n-link><!--

    --><template v-if="tags.length > 1"><!--
      --> và <!--
      --><n-link
        v-if="tags.length === 2"
        class="font-weight-bold"
        :to="`social/account/${tags[1].id}`"
        >{{ tags[1].fullname }}</n-link
      >

      <v-popover v-else class="d-inline-block" trigger="hover">
        <span class="font-weight-bold text-dark"
          >{{ tags.slice(1).length }} người khác</span
        >

        <template slot="popover">
          <div
            v-for="item in tags.slice(1)"
            :key="item.id"
            class="post__tags-popover-item"
          >
            <n-link :to="`social/account/${item.id}`">{{ item.fullname }}</n-link>
          </div>
        </template>
      </v-popover>
    </template>
  </span>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
