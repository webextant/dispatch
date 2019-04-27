<template>
  <div id="component1">

    <div class="container-fluid">
      <div class="row">

        <!-- Left-side panel search by trailer with results -->
        <div class="col-sm-3 col-md-3 sidebar">
          <h2>Call To Dock</h2>

          <div id="search-control" class="input-group">
            <input id="search" v-model="searchQuery" v-on:keyup.enter="performSearch" type="text" class="form-control" placeholder="Search by trailer #...">
            <span class="input-group-btn">
              <button @click="performSearch" class="btn btn-primary" type="button"><strong>Search</strong></button>
            </span>
          </div>
          
          <ul class="nav nav-sidebar">
            <li v-for="(result,index) in searchResults" :ref="`result-${index}`" :key="index" @click="displayRecord(index)">
              <a href="#" style="color:black">
                <div class = "trailer-number-search-record">
                  <span class="Carrier"><strong>{{result.Carrier}}</strong></span><br>
                  <span class="TrailerNumber">{{result.TrailerNumber}}</span>
                  <span class="LoadStatus label" :class="getLoadStatusLabelColor(result.LoadStatus)" style="margin-left:4px">{{result.LoadStatus}}</span>
                  <div class="MoveStatus" style="margin-top:6px">
                    {{result.MoveStatus}} - ({{result.CurrentLocation}})
                  </div>
                </div>
              </a>
            </li>
          </ul>

        </div>

        <!-- Right-side panel form viewer -->
        <div class="col-sm-9 col-sm-offset-3 col-md-9 col-md-offset-3 main">

          <div v-if="!selectedRecord" id="search-required">
            <transition name="fade" mode="out-in">
              <h3 :key="searchRequiredMessage">{{searchRequiredMessage}}</h3>
            </transition>
          </div>
          
          <div v-else>
            <h3 class="page-header"><strong>{{selectedRecord.Carrier}}</strong></h3>
            <h5 class="sub-header">{{selectedRecord.TrailerNumber}}</h5>

              <div id="trailer-record-info" class="well">
                
                <br>
                
                <div class="record-info">
                  <h4>Load Status:</h4>
                  <span class="label" :class="getLoadStatusLabelColor(selectedRecord.LoadStatus)">{{selectedRecord.LoadStatus ? selectedRecord.LoadStatus : 'Unavailable' }}</span> 
                </div>

                <div class="record-info">
                  <h4>Set Point:</h4> 
                  <span class="text-muted">{{selectedRecord.Temperature ? selectedRecord.Temperature : 'Unavailable' }}</span>
                </div>

                <div class="record-info">
                  <h4>Current Location:</h4> 
                  <span class="text-muted">{{selectedRecord.CurrentLocation ? selectedRecord.CurrentLocation : 'Unavailable' }}</span>
                </div>

                <div class="record-info">
                  <h4>Status:</h4> 
                  <span class="text-muted">{{selectedRecord.MoveStatus ? selectedRecord.MoveStatus : 'Unavailable' }}</span>
                </div>
                
                <div class="record-info">
                  <h4>Trailer Class:</h4> 
                  <span class="text-muted">{{selectedRecord.Classification ? selectedRecord.Classification : 'Unavailable' }}</span>
                </div>
                
                <div class="record-info">
                  <h4>Pallets On-Board:</h4> 
                  <span class="text-muted">{{selectedRecord.PalletsOnBoard ? selectedRecord.PalletsOnBoard : 'Unavailable'}}</span>
                </div>

              </div>

              <hr>

              <div id="trailer-record-form" class="well">

                <br>
                
                <div class="record-info record-form-field">
                  <div class="input-group" style="width:35%">
                    <span class="input-group-addon" id="newSetPoint"><strong>New Set Point</strong></span>
                    <input 
                      v-model="form.newSetPoint" 
                      type="number" 
                      class="form-control" 
                      placeholder="Enter Set Point..." 
                      aria-describedby="newSetPoint"
                      min="-50"
                      max="99"
                    >
                  </div>
                </div>

                <div class="record-info record-form-field padded">
                  <br>
                  <div class="input-group">
                    <span style="padding-right:6px"><strong>Priority Move</strong></span>
                    <input v-model="form.priorityMove" type="checkbox" aria-label="Toggle Priority Move">
                  </div>
                </div>

                <div class="record-info record-form-field padded">
                  <br>
                  <label for="instructions">Special Instructions</label><br>
                  <textarea v-model="form.instructions" maxlength="300" rows="5" class="form-control" id="instructions"></textarea>
                  <br>
                </div>

                <div class="record-info record-form-field">
                  <div class="input-group" style="width:35%">
                    <span class="input-group-addon" id="initials"><strong>Initials</strong></span>
                    <input 
                      v-model="form.initials"
                      maxlength="2" 
                      type="text" 
                      class="form-control" 
                      placeholder="Enter Initials..." 
                      aria-describedby="initials"
                    >
                  </div>
                </div>
              
              </div>

              <hr>

              <div style="text-align:center">
                <button @click="submitCallToDock" class="btn btn-lg btn-primary"><strong>Save</strong></button>
              </div>


          </div>
        
        </div>

      </div>
    </div>
  </div>
</template>

<script>

// Load Webextent Dispatch API Wrapper
import WebextantDispatchAPIWrapper from '../tools/webextant/dispatch'

// Create instance of API wrapper so we can access api method helpers
const api = new WebextantDispatchAPIWrapper();

// UI alerts for better UX
import Swal from 'sweetalert2'

export default {
  name: 'Component1',
  props: ['dockId'],
  directives: {
    'uppercase' : {
      update (el) {
        el.value = el.value.toUpperCase()
      }
    }
  },
  data: function(){
    return {
      searchQuery: '',
      searchResults: [],
      selectedRecord: null,
      searchRequiredMessage: '👋 Search by trailer # to get started.',
      form: {}
    }
  },
  methods: {
    performSearch: function(){
      if(this.searchQuery.trim() === ''){
        Swal.fire(
          'Do you want to search?',
          'Enter a trailer # to perform lookup.',
          'question'
        )
        return;
      }

      // Show loader
      Swal.fire('Please wait');
      Swal.showLoading();

      // Reset any previous searchResults
      this.searchResults = [];
      this.searchRequiredMessage = '👌 Great work! Click a trailer to continue.';
      let self = this;
      api.SearchByTrailerNumber({
        'TrailerNumber': self.searchQuery
      }, (error, response)=>{
        // Hide loader
        Swal.close();
        if(!error){
          if(response.length > 0){
            response.forEach(result=>{
              self.searchResults.push({
                SystemId: result.SystemId,
                Carrier: result.Carrier,
                TrailerNumber: result.TrailerNumber,
                LoadStatus: result.LoadStatus,
                MoveStatus: result.MoveStatus,
                CurrentLocation: result.CurrentLocation
              });
            });
          }
        }
        else{
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          })
        }
      });
    },
    displayRecord: function(index){
      // Clear active class from selected result on left-side panel
      for(let r in this.$refs){
        this.$refs[r][0].classList.remove('active');
      }
      // Add active class to selected result on left-side panel
      this.$refs[`result-${index}`][0].classList.add('active');

      // Set the selected record for viewing on right-side panel
      this.selectedRecord = this.searchResults[index];
      // console.log(this.selectedRecord);
    },
    getLoadStatusLabelColor: function(LoadStatus){
      return {
        'label-warning': LoadStatus === 'PARTIAL',
        'label-default': LoadStatus === 'EMPTY CLEAN',
        'label-success': LoadStatus === 'COMPLETE'
      }
    },
    submitCallToDock: function(){
      // Perform simple validations on the fields to check if they meet POST body requirements
      
      let validationErrors = [];

      if(!this.form.newSetPoint){
        validationErrors.push('New Set Point')
      }
      if(!this.form.initials){
        validationErrors.push('Initials')
      }

      if(validationErrors.length > 0){
        Swal.fire({
          type: 'error',
          title: 'Required fields missing...',
          text: `Please provide the following: (${validationErrors.toString()})`,
        })
        return;
      }

      // Show loader
      Swal.fire('Please wait');
      Swal.showLoading();

      let self = this;
      // Send the form data to the API
      api.CallTrailersToDock({
        "newSetPoint": self.form.newSetPoint,
        "instructions": self.form.instructions,
        "initials": self.form.initials,
        "priorityMove": self.form.priorityMove,
        "changePallets": false,
        "newPalletType": "none",
        "trailerSystemId": self.selectedRecord.SystemId,
        "dockId": self.dockId // This is provided as a prop on component creation 
      }, (error, response) => {
        Swal.close();
        if(response.Status === 'success'){
          self.form = {} // Reset the form
          Swal.fire(
            'Good job!',
            'Your information was saved!',
            'success'
          );
        }
        else{
          Swal.close();
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Problem saving. Please try again!',
          });
        }
      });
    },
    resetComponent: function(){ // This method is optional and only if needed
      this.searchQuery = '';
      this.searchResults = [];
      this.selectedRecord = null,
      this.searchRequiredMessage = '👋 Search by trailer # to get started.',
      this.form = {}
    }
  }
}
</script>

<style>

.swal2-popup {
  font-size: 1.6rem !important;
}

</style>

<style scoped>

#search-control {
  margin-bottom: 20px;
}

.page-header {
  text-align: left;
}

/* Override of default Bootstrap active color on selected result (left-side panel) */
.nav-sidebar > .active > a,
.nav-sidebar > .active > a:hover, 
.nav-sidebar > .active > a:focus {
  color: white !important;
  font-weight:800;
}

#search-required {
  text-align: center;
  margin-top:280px;
}

#search-required h3 {
    font-weight: 300;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .9s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

#trailer-record-info, #trailer-record-form{
  background-color: white !important; 
}

#trailer-record-info h4 , #trailer-record-form h4 {
  display: inline;
  margin-right: 6px;
  font-weight: 600;
}

#trailer-record-info .record-info {
  margin-bottom:20px;
}

#record-form-field .padded {
  padding-left: 2px;
}

#newSetPoint, #initials {
  text-decoration: underline;  
}

/* Color labels to match vuejs_form.JPG example */

/* 
.label-warning {
  background-color: lightgreen;
  color: black;
  border: 1px solid #5cb85c;
}

.label-default {
  background-color: white;
  color: black;
  border: 1px solid black;
}

.label-success {
  color: black;
  border: 1px solid lightgreen;
} */

/*
 * Base structure
 */

/* Move down content because we have a fixed navbar that is 50px tall */
body {
  padding-top: 50px;
}


/*
 * Global add-ons
 */

.sub-header {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

/*
 * Top navigation
 * Hide default border to remove 1px line.
 */
.navbar-fixed-top {
  border: 0;
}

/*
 * Sidebar
 */

/* Hide for mobile, show later */
.sidebar {
  display: none;
  text-align: left;
}
@media (min-width: 768px) {
  .sidebar {
    position: fixed;
    top: 51px;
    bottom: 0;
    left: 0;
    z-index: 1000;
    display: block;
    padding: 20px;
    overflow-x: hidden;
    overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
    background-color: #f5f5f5;
    border-right: 1px solid #eee;
  }
}

/* Sidebar navigation */
.nav-sidebar {
  margin-right: -21px; /* 20px padding + 1px border */
  margin-bottom: 20px;
  margin-left: -20px;
}
.nav-sidebar > li > a {
  padding-right: 20px;
  padding-left: 20px;
}
.nav-sidebar > .active > a,
.nav-sidebar > .active > a:hover,
.nav-sidebar > .active > a:focus {
  color: #fff;
  background-color: #428bca;
}


/*
 * Main content
 */

.main {
  padding: 20px;
}
@media (min-width: 768px) {
  .main {
    padding-right: 40px;
    padding-left: 40px;
  }
}
.main .page-header {
  margin-top: 0;
}


/*
 * Placeholder dashboard ideas
 */

.placeholders {
  margin-bottom: 30px;
  text-align: center;
}
.placeholders h4 {
  margin-bottom: 0;
}
.placeholder {
  margin-bottom: 20px;
}
.placeholder img {
  display: inline-block;
  border-radius: 50%;
}
</style>