<template>
  <v-row>
    <v-col cols="12" sm="10" md="8">
      <v-sheet class="py-4 px-1">
        <v-chip-group mandatory active-class="primary--text" class="state">
          <v-chip v-for="tag in tags" :key="tag" @click="getTag(tag)">
            {{ tag }}
          </v-chip>
        </v-chip-group>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ["tags", "getTag"],
};
</script>

<style lang="scss" scoped>
.state {
  padding-left: 10px;
}
</style>
