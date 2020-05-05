import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    avatar_url:"",
    current_id:0,
  },
  mutations: {
    set_avatar(state,url){
      state.avatar_url = url
    },
    set_current_id(state, id){
      state.current_id = id
    }
  },
  actions: {
  },
  modules: {
  }
})
