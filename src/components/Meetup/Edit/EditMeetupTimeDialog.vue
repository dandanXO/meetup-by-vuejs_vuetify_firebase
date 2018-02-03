<template>
  <v-dialog width="350px" persistnet v-model="editDialog">
    <v-btn  accent slot="activator">
      Edit Time
    </v-btn>
    <v-card>
      <v-container>
        <v-layout raw flex>
          <v-flex xs12>
            <v-card-title>Edit Meetup Time</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout raw flex>
          <v-flex xs12>
           <v-time-picker v-model="editableTime" style="width: 100%" actions format="24hr"></v-time-picker>
           <template >
             <v-btn
                  class="blue--text darken-1"
                  block
                  flat
                  @click.native="editDialog = false">Close</v-btn>
                <v-btn
                  class="blue--text darken-1"
                  block
                  flat
                  @click.native="onSaveChange">Save</v-btn>
           </template>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['meetup'],
  data () {
    return {
      editDialog: false,
      editableTime: null
    }
  },
  methods: {
    onSaveChange () {
      const newDate = new Date(this.meetup.date)
      const hours = this.editableTime.match(/^(\d+)/)[1]
      const minutes = this.editableTime.match(/:(\d+)/)[1]
      newDate.setHours(hours)
      newDate.setMinutes(minutes)
      this.$store.dispatch('updateMeetupData', {
        id: this.meetup.id,
        date: newDate
      })
    },
    created () {
      this.editableTime = new Date(this.meetup.date).toTimeString()
    }
  }
}
</script>
