import * as firebase from 'firebase'

export default{
  state: {
    user: null
  },
  mutations: {
    setLoadedMeets (state, payload) {
      state.loadedMeetups = payload
    },
    regesterUserForMeetup (state, payload) {
      const id = payload.id
      if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
        return
      }
      state.user.registeredMeetups.push(id)
      state.user.fbKeys[id] = payload.fbkey
    },
    unregesterUserForMeetup (state, payload) {
      const registeredMeetups = state.user.registeredMeetups
      registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {
    regesterUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id).child('/registrations/')
      .push(payload)
      .then(data => {
        commit('regesterUserForMeetup', {id: payload, fbkey: data.key, joinsEmail: 'sdfsdf'})
      })
      .then(() => {
        firebase.database().ref('meetups').child(payload).once('value')
        .then(data => {
          const currentUser = firebase.auth().currentUser
          const email = currentUser.email
          var joinsEmail = data.val().joinsEmail
          var arr = []
          arr.push(email)
          if (joinsEmail !== undefined) {
            arr.push.apply(arr, joinsEmail)
          }
          // console.log(arr)
          firebase.database().ref('meetups').child(payload).update({ joinsEmail: arr })
          firebase.database().ref('meetups').once('value')
          .then((data) => {
            const meetups = []
            const obj = data.val()
            for (let key in obj) {
              meetups.push({
                id: key,
                title: obj[key].title,
                description: obj[key].description,
                imageUrl: obj[key].imageUrl,
                date: obj[key].date,
                location: obj[key].location,
                creatorId: obj[key].creatorId,
                email: obj[key].email,
                joinsEmail: obj[key].joinsEmail
              })
            }
            commit('setLoadedMeets', meetups)
            commit('setLoading', false)
          })
        })
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    unregesterUserForMeetup ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
      .remove()
      .then(() => {
        firebase.database().ref('meetups').child(payload).once('value')
        .then(data => {
          const currentUser = firebase.auth().currentUser
          const email = currentUser.email
          var joinsEmail = data.val().joinsEmail
          var arr = []
          if (joinsEmail !== undefined) {
            arr.push.apply(arr, joinsEmail)
          }
          arr = arr.filter(item => item !== email)
          // console.log(arr)
          firebase.database().ref('meetups').child(payload).update({ joinsEmail: arr })
          firebase.database().ref('meetups').once('value')
          .then((data) => {
            const meetups = []
            const obj = data.val()
            for (let key in obj) {
              meetups.push({
                id: key,
                title: obj[key].title,
                description: obj[key].description,
                imageUrl: obj[key].imageUrl,
                date: obj[key].date,
                location: obj[key].location,
                creatorId: obj[key].creatorId,
                email: obj[key].email,
                joinsEmail: obj[key].joinsEmail
              })
            }
            commit('setLoadedMeets', meetups)
            commit('setLoading', false)
          })
        })
      })
      .then(() => {
        commit('setLoading', false)
        commit('unregesterUserForMeetup', payload)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    signUserUp ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.uid,
              registeredMeetups: [],
              fbKeys: {}
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
            console.log(error)
          }
        )
    },
    signUserIn ({commit}, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(
        user => {
          commit('setLoading', false)
          const newUser = {
            id: user.uid,
            registeredMeetups: [],
            fbKeys: {}
          }
          commit('setUser', newUser)
        }
      )
      .catch(
        error => {
          commit('setLoading', false)
          commit('setError', error)
          console.log(error)
        }
      )
    },
    AutoSignIn ({commit}, payload) {
      commit('setUser', {
        id: payload.uid,
        registeredMeetups: [],
        fbKeys: {}
      })
    },
    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/registrations/')
      .once('value')
      .then(data => {
        const dataPairs = data.val()
        let registerMeetups = []
        let swapperPairs = {}
        for (let key in dataPairs) {
          registerMeetups.push(dataPairs[key])
          swapperPairs[dataPairs[key]] = key
        }
        const updateUser = {
          id: getters.user.id,
          registeredMeetups: registerMeetups,
          fbKeys: swapperPairs
        }
        commit('setLoading', false)
        commit('setUser', updateUser)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    }
  },
  getters: {
    user (state) {
      return state.user
    }
  }
}
