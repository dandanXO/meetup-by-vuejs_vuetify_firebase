<template>
  <v-dialog width="350px" persistnet v-model="editDialog">
    <v-btn  accent slot="activator">
      Edit Date
    </v-btn>
    <v-card>
      <v-container>
        <v-layout raw flex>
          <v-flex xs12>
            <v-card-title>Edit Meetup Date</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout raw flex>
          <v-flex xs12>
           <v-date-picker v-model="editableDate" style="width: 100%" actions></v-date-picker>
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
      editableDate: null
    }
  },
  methods: {
    onSaveChange () {
      const newDate = new Date(this.meetup.date)
      const newDay = new Date(this.editableDate).getUTCDate()
      const newMonth = new Date(this.editableDate).getUTCMonth()
      const newYear = new Date(this.editableDate).getUTCFullYear()
      newDate.setUTCDate(newDay)
      newDate.getUTCMonth(newMonth)
      newDate.getUTCFullYear(newYear)
      this.$store.dispatch('updateMeetupData', {
        id: this.meetup.id,
        date: newDate
      })
    },
    created () {
      this.editableDate = new Date(this.meetup.date)
    }
  }
}
</script>
