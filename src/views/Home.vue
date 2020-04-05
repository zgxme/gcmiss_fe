<template >
  <v-app id="inspire">
    <v-row>
      <v-col
        cols="12"
        sm="8"
        justify="center"
        class="mx-auto"
      >
        <v-lazy transition="fade-transition">
          <v-card
            class="post-list"
            tile
            width="750px"
          >
            <v-list
              two-line
              subheade
              :disabled=false
            >
              <template v-for="item in post_items">

                <v-list-item
                  :key="item.post_id"
                  v-if="item.post_id"
                  @click="renderPost(item.post_id)"
                >
                  <v-list-item-avatar>
                    <v-img :src="item.poster_avatar"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content class="post-list">
                    <v-list-item-title><span style="font-size:16px">{{item.title}}</span></v-list-item-title>
                    <v-list-item-subtitle><span style="font-size:14px">{{item.content}}</span></v-list-item-subtitle>
                    <v-list-item-subtitle><span style="font-size:12px">{{item.post_lable}}</span></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-card>
        </v-lazy>
      </v-col>
    </v-row>
    <v-btn
      bottom
      color="pink"
      dark
      fab
      fixed
      right
      @click="dialog = !dialog"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      width="800px"
    >
      <v-card>
        <v-card-title class="grey darken-2">
          Create contact
        </v-card-title>
        <v-container>
          <v-row class="mx-2">
            <v-col
              class="align-center justify-space-between"
              cols="12"
            >
              <v-row
                align="center"
                class="mr-0"
              >
                <v-avatar
                  size="40px"
                  class="mx-3"
                >
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  >
                </v-avatar>
                <v-text-field placeholder="Name" />
              </v-row>
            </v-col>
            <v-col cols="6">
              <v-text-field
                prepend-icon="business"
                placeholder="Company"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field placeholder="Job title" />
            </v-col>
            <v-col cols="12">
              <v-text-field
                prepend-icon="mail"
                placeholder="Email"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                type="tel"
                prepend-icon="phone"
                placeholder="(000) 000 - 0000"
              />
            </v-col>
            <v-col cols="12">
              <v-text-field
                prepend-icon="notes"
                placeholder="Notes"
              />
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-btn
            text
            color="primary"
          >More</v-btn>
          <v-spacer />
          <v-btn
            text
            color="primary"
            @click="dialog = false"
          >Cancel</v-btn>
          <v-btn
            text
            @click="dialog = false"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String
  },
  data: () => ({
    dialog: false,
    post_items: [],
    REQUIRE: true,
    loading: false,
    tips: '努力加载中...',
    cursor: 10,
    limit: 20,
    has_more: true,
  }),
  created: function () {
    var _this = this
    //TODO fix sort 
    _this.$axios.get('/api/v1/post/get', {
      params: {
        cursor: 0,
        limit: 20,
        desc: 1
      }
    }).then(function (res) {
      let errno = res.data.errno
      if (errno !== 0) {
        console.log(errno)
      }
      _this.cursor = _this.cursor + 10
      _this.has_more = res.data.has_more
      // console.log(res.data.post_list)
      for (let i in res.data.post_list) {
        _this.post_items.push(res.data.post_list[i])
      }
      // console.log(_this.post_items)

    })
  },
  methods: {
    // ...
    scroll(post_item) {
      let isLoading = false
      let _this = this
      window.onscroll = () => {
        // 距离底部200px时加载一次
        let bottomOfWindow = document.documentElement.offsetHeight - document.documentElement.scrollTop - window.innerHeight <= 200
        if (bottomOfWindow && isLoading === false && _this.has_more === true) {
          isLoading = true
          _this.$axios.get('/api/v1/post/get', {
            params: {
              cursor: _this.cursor + 10,
              limit: 10,
              desc: 1
            }
          }).then(response => {
            _this.cursor += 10
            // console.log(response.data.post_list)
            _this.post_items.push(response.data.post_list)
            for (let i in response.data.post_list) {
              if (response.data.post_list[i].post_id !== null) {
                _this.post_items.push(response.data.post_list[i])
              }

            }
            if (response.data.has_more === false)
              _this.has_more = false
            isLoading = false
          })
        }
      }
    },
    renderPost(post_id) {
      let _this = this
      _this.$router.push({ path: '/post', query: { id: post_id } })
    },
  },
  mounted() {
    this.scroll(this.post_items)
  },


}
</script>
<style>
.post-list span {
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  overflow: hidden;
}
</style>