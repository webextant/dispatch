<template>
  <div>
    <div class="container">
      <br>
      <div class="row trailer-info well" style="background-color:white">

        <div class="col-sm-12">
          <div class="col-sm-3">
            <h5>TRAILER</h5>
            <h3><strong>{{trailer.TrailerNumber}}</strong></h3>
          </div>
          <div class="col-sm-4">
            <h5>CURRENT LOCATION</h5>
            <h3><strong>{{trailer.CurrentLocation}}</strong></h3>
          </div>
          <div class="col-sm-3">
            <h5>NEXT LOCATION</h5>
            <a href="#" style="text-decoration:none" data-toggle="modal" data-target="#CallOutLocationsModal">
              <h3>
                <strong style="color:red">{{selectedNextLocation}}</strong>
              </h3>
            </a>

            <!-- Call Out Locations Modal Window -->
            <div class="modal fade" id="CallOutLocationsModal" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h4 class="modal-title" id="myModalLabel">Call Out Locations</h4>
                  </div>
                  <div class="modal-body">
                    <h2 style="text-align:center"><strong>Next Location</strong></h2>
                    <label>Select Location</label>

                    <ul class="list-group" style="overflow-y:">
                      <a 
                        v-for="(dock,index) in docks" 
                        :ref="`result-${index}`" 
                        :key="index" 
                        href="#" 
                        class="list-group-item"
                        @click="selectedNextLocation = docks[index]"
                      >
                        {{dock}}
                      </a>
                    </ul>

                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
                  </div>
                </div>
              </div>
            </div>


          </div>
          <div class="col-sm-2">
            <img width="144px" class="img-responsive" src="@/assets/trailer1.png">
          </div>
        </div>

        <div class="col-sm-12">
          <div class="col-sm-3">
            <h5>LOAD STATUS</h5>
            <h3><strong>{{trailer.LoadStatus}}</strong></h3>
          </div>
          <div class="col-sm-3">
            <h5>RE-CALL LOCATION</h5>
            <h3><strong>NONE</strong></h3>
          </div>
        </div>

        <div class="col-sm-12">

          <div class="col-sm-4">
            <h5>SPECIAL INSTRUCTIONS TO DRIVER</h5>
            <textarea v-model="specialInstructions" maxlength="300" rows="3" class="form-control"></textarea>
            <br>
            <div class="col-sm-12">
              <div class="row">
                <h5>
                  ENTER YOUR INITIALS 
                  <span style="color:red; font-weight:600; padding-left:6px">REQUIRED</span>
                </h5>
                <input
                  v-model="calloutUserInitials" 
                  type="text" 
                  class="form-control" 
                  placeholder="Initials..." 
                  aria-describedby="initials"
                  maxlength="2"
                  style="width:100%"
                >
              </div>
            </div>
            
            <div class="col-sm-7" style="margin-top:20px;">
              <div class="row">
                <input type="checkbox" v-model="priorityMove" name="priority Move"><strong style="color: red; padding-left:8px">Priority Move</strong>
              </div>
            </div>
            <br>
          </div>

          <div class="col-sm-3 col-sm-offset-1">
            <fieldset class="well" style="background-color:white">
            <legend class="well-legend">New Load Status</legend>
              <div class="radio">
                <label>
                  <input 
                    type="radio" 
                    name="newloadstatus"
                    value="Complete Load"
                    v-model="newLoadStatus"
                    v-on:change="
                      trailerClassificationMessageHeading=`Complete Load of ???`;
                      newClassification = null;
                      bottomLegendName = `Trailer Classification`
                    "
                  ><strong>Complete Load</strong>
                </label>
                <br><br>
                <label>
                  <input 
                    type="radio" 
                    name="newloadstatus"
                    value="Partial Load"
                    v-model="newLoadStatus" 
                    v-on:change="
                      trailerClassificationMessageHeading=`Partial Load of ???`;
                      newClassification = null;
                      bottomLegendName = `Trailer Classification`;
                    "
                    >
                    <strong>Partial Load</strong>
                </label>
                <br><br>
                <label>
                  <input 
                    type="radio" 
                    name="newloadstatus"
                    value="Empty Load"
                    v-model="newLoadStatus"
                    v-on:change="
                      rewashTrailerCheckbox=true,
                      doNotWashTrailerCheckboxEnabled=false,
                      doNotWashWarningInitials='',
                      showInitialsWarning=false;                     
                      bottomLegendName=`Trailer Re-Wash Status`;
                    "
                  >
                  <strong>Empty Load</strong>
                </label>
              </div>
            </fieldset>
          </div>

          <div class="col-sm-3 col-sm-offset-1 well" style="text-align:center; background-color:white">
            <h4>TEMPERATURE</h4>
            <h3 style="color:red;font-weight:bold;">{{trailer.Temperature}}</h3>
            <h4>PALLETS ON BOARD</h4>
            <h3 style="color:green;font-weight:bold;">{{trailer.PalletsOnBoard}}</h3>
            <h4>PALLETS REQUESTED</h4>
            <h3 style="color:green;font-weight:bold;">None</h3>
          </div>

          <fieldset class="well" style="background-color:white">
            <legend class="well-legend">{{bottomLegendName}}</legend>

         
            <div v-if="newLoadStatus === 'Empty Load'" style="padding-bottom:425px;">

              <div class="col-sm-5" style="border-right:3px solid gray">
                
                <span style="margin-left: 6px; color:green; font-weight:600">RECOMMENDED</span>
                
                <br>
                



                <!-- RE-WASH TRAILER CHECKBOX -->
                <div class="row" :class="{disableReWashStatus:doNotWashTrailerCheckboxEnabled}">
                  <input @click="rewashTrailerCheckbox=!rewashTrailerCheckbox"
                    checked 
                    type="checkbox" 
                    name="rewash">
                  <h4 style="display:inline"><strong style="font-weight:1.4em; padding-left:8px">RE-WASH TRAILER</strong></h4>
                  <br>
                  <small style="margin-left:21px">Trailer will be re-washed.</small>
                </div>

                <br>
                
                <!-- DO NOT WASH CHECKBOX -->
                <div class="row">
                  <input @click="doNotWashTrailerCheckboxEnabled = !doNotWashTrailerCheckboxEnabled" 
                  type="checkbox" 
                  name="nowash">
                  <h4 style="display:inline"><strong style="font-weight:1.4em; padding-left:8px">DO NOT WASH</strong></h4>
                  <br>
                  <small style="margin-left:21px">Trailer will show as clean.</small>
                </div>






              </div>

              <div v-if="showInitialsWarning" class="col-sm-7">
                <h3 style="color:red">WARNING</h3>
                <p>
                BY NOT checking RE-WASH Cargill is taking full responsibility for cleanliness of this trailer.                
                </p>
                <div class="input-group" style="width:60%">
                  <span class="input-group-addon" id="initials"><strong>ENTER YOUR INITIALS</strong></span>
                  <input
                    v-model="doNotWashWarningInitials" 
                    maxlength="2" 
                    type="text" 
                    class="form-control" 
                    placeholder="Enter Initials..." 
                    aria-describedby="initials"
                  >
                </div>
                <br>
                <!-- <button @click="newLoadStatus=!newLoadStatus" class="btn btn-default">OK</button> -->
              </div>

            </div>

            <div v-else style="text-align:center; padding-bottom:50px;">
              <h4 style="color:green">{{trailerClassificationMessageHeading}}</h4>
              <br>

              <div class="radio row">
                <div class="col-sm-4">
                  <input 
                    type="radio" 
                    name="classificationOption"
                    value="Pallets"
                    v-model="newClassification" 
                    v-on:change="
                      if(newLoadStatus){
                        trailerClassificationMessageHeading=`${newLoadStatus.replace('???','')} of Pallets`;
                      }
                      bottomLegendName = `Trailer Classification`
                    "
                  >
                  <br>
                  <center><img width="96px" class="img-responsive" src="@/assets/pallet1.png"></center>
                  <span style="color:blue">Pallets</span>
                </div>
                <div class="col-sm-4">
                  <input 
                    type="radio" 
                    name="classificationOption"
                    value="Non-Refrigerated Product"
                    v-model="newClassification" 
                    v-on:change="
                      if(newLoadStatus){
                        trailerClassificationMessageHeading=`${newLoadStatus.replace('???','')} of Non-Refrigerated Product`;
                      }
                      bottomLegendName = `Trailer Classification`
                    "
                  >
                  <br>
                  <center><img width="96px" class="img-responsive" src="@/assets/trailer1.png"></center>
                  <span style="color:blue">Non-Refrigerated Product</span><br>
                  <span style="color:red">Temperature NOT Monitored</span>
                </div>
                <div class="col-sm-4">
                  <input 
                    type="radio" 
                    name="classificationOption"
                    value="Refrigerated Product"
                    v-model="newClassification" 
                    v-on:change="
                      if(newLoadStatus){
                        trailerClassificationMessageHeading=`${newLoadStatus.replace('???','')} of Refrigerated Product`;
                        bottomLegendName = `Trailer Classification`
                      }
                    "
                  >
                  <br>
                  <center><img width="96px" class="img-responsive" src="@/assets/trailer2.png"></center>
                  <span style="color:blue">Refrigerated Product</span><br>
                  <span style="color:red">Temperature WILL BE Monitored</span>
                  <br>
                  <div id="referUnitMode" class="btn-group dropdown" style="margin-top:8px;">
                    <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">{{referUnitMode}}
                    <span class="caret"></span></button>
                    <ul class="dropdown-menu">
                      <li><a>Continuous Mode</a></li>
                      <li><a>Cycle Mode</a></li>
                    </ul>
                  </div>
                </div>

              </div>


            <hr>

            <div class="row" style="text-align:left">
              <div class="col-sm-2">
                <h5><strong>Seal 1</strong></h5>
                <input 
                  v-model="seal1"
                  type="number" 
                  class="form-control" 
                  placeholder="Enter Seal" 
                  aria-describedby="seal1"
                  min="1"
                  maxlength="1000000000" 
                >
                <span style="display:block;margin-top:10px; color:red; font-weight:600">REQUIRED: Seal 1</span>
              </div>
              <div class="col-sm-2">
                <h5><strong>Seal 2</strong></h5>
                <input 
                  v-model="seal2"
                  type="number" 
                  class="form-control" 
                  placeholder="Enter Seal" 
                  aria-describedby="seal2"
                  min="1"
                  maxlength="1000000000" 
                >
              </div>
              <div class="col-sm-2">
                <h5><strong>Seal 3</strong></h5>
                <input
                  v-model="seal3" 
                  type="number" 
                  class="form-control" 
                  placeholder="Enter Seal" 
                  aria-describedby="seal3"
                  min="1"
                  maxlength="1000000000" 
                >
              </div>
              <div class="col-sm-1"></div>
              <div class="col-sm-4">
                <h5>
                  <strong>Load Number</strong>
                  <span style="padding-left:14px; color:red; font-weight:600">REQUIRED</span>
                </h5>
                <input
                  v-model="loadNumber"
                  type="number" 
                  class="form-control" 
                  placeholder="Enter Load Number" 
                  aria-describedby="loadNumber"
                  min="1"
                  maxlength="1000000000" 
                >
              </div>
            </div>


            </div>

          </fieldset>

          <!-- <button style="float:left" class="btn btn-default btn-lg"><strong>Cancel</strong></button> -->
          <button @click="callOutButton" style="float:right" class="btn btn-primary btn-lg"><strong>Call Out</strong></button>

        </div>

      </div>

      <div class="row trailer-classification">
          <div class="col-xs-12"></div>
      </div>
    </div>
  </div>
</template>

<script>

import WebextantDispatchAPIWrapper from '../tools/webextant/dispatch'

const api = new WebextantDispatchAPIWrapper();

// UI alerts for better UX
import Swal from 'sweetalert2'

export default {
  name: 'Component2',
  props: ['trailer'],
  created(){
    // Get Docks Collection from API
    api.ListAllDocks(null,(error,response)=>{
      if(!error){
        this.docks = response;

      } else{
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        })
      }
    })

  },
  updated(){
      // The bootstrap dropdown for selecting the option "Continous Mode" or "Cycle Mode"
      // behaving very odd with the Vue re-rendering. Added this logic into the update lifecycle hook.
      let self = this;
      let modeDropdown = document.querySelectorAll('#referUnitMode li a');
      if(modeDropdown.length > 0){
        // Dropdown Option - Continuous Mode
        modeDropdown[0].addEventListener('click',function(e){self.referUnitMode=e.target.text});
        // Dropdown Option - Cycle Mode 
        modeDropdown[1].addEventListener('click',function(e){self.referUnitMode=e.target.text});
      }
  },
  data: function(){
    return {
      docks: [],
      selectedNextLocation: 'LOT',
      calloutUserInitials: '',
      specialInstructions: '',
      newLoadStatus: null,
      trailerClassificationMessageHeading: 'Trailer Options',
      bottomLegendName: 'Trailer Classification',
      rewashTrailerCheckbox:true,
      doNotWashTrailerCheckboxEnabled: false,
      doNotWashWarningInitials: '',
      priorityMove: false,
      seal1: '',
      seal2: '',
      seal3: '',
      loadNumber: '',
      showInitialsWarning: false,
      newClassification: null,
      referUnitMode: 'Choose Mode'
    }
  },
  watch:{
    'rewashTrailerCheckbox':function(){
      if(this.rewashTrailerCheckbox){
        // If the rewash is enabled
        // Enable the do not wash trailer checkbox option
        // this.doNotWashTrailerCheckboxEnabled = true;
      }
      else{
        // this.doNotWashTrailerCheckboxEnabled = false;
      }
    },
    'doNotWashTrailerCheckboxEnabled':function(){
      if(this.doNotWashTrailerCheckboxEnabled){
        // this.rewashTrailerCheckbox = false;
        this.showInitialsWarning = true;
      }
      else{
        this.showInitialsWarning = false;
      }
    }
  },
  methods:{
    callOutButton: function(){

      // Perform simple validations on the fields to check if they meet POST body requirements

      let validationErrors = [];

      if(this.calloutUserInitials === ''){
        validationErrors.push('Initials');
      }
      if(this.newLoadStatus === null){
        validationErrors.push('New Load Status');
      }
      if(this.seal1 === ''){
        validationErrors.push('Seal 1');
      }
      if(this.loadNumber === ''){
        validationErrors.push('Load Number');
      }
      if(this.newLoadStatus === 'Empty Load'){
        validationErrors.push('DO NOT Wash Initials');
      }
      if(this.newClassification === null){
        validationErrors.push('Trailer Classification');
      }
      if(this.newClassification === 'Refrigerated Product'){
        if(this.referUnitMode === 'Choose Mode'){
          validationErrors.push('Choose Mode');
        }
      }
    
      let errorMessageObj = {
        type: 'error',
        title: 'Required fields missing...',
        text: `Please provide the following: `,
      }

      if(validationErrors.length > 0){
        if(this.newLoadStatus === 'Empty Load'){
          if(this.calloutUserInitials === ''){
            errorMessageObj.text += 'Initials.'
            Swal.fire(errorMessageObj); return;
          } 
          if(this.doNotWashTrailerCheckboxEnabled && this.doNotWashWarningInitials === ''){
            errorMessageObj.text += '(DO NOT Wash Initials).'
            Swal.fire(errorMessageObj); return;
          }
        }
        else{
          errorMessageObj.text += `(${validationErrors.toString()})`;
          Swal.fire(errorMessageObj); return;
        }
      }

      let self = this;
      
      let formData = {
        loadNumber: this.loadNumber,
        calloutUserInitials: this.calloutUserInitials,
        specialInstructions: this.specialInstructions,
        priorityMove: this.priorityMove,
        newClassification: this.newClassification,
        newLoadStatus: (function(){
          if(self.newLoadStatus === 'Empty Load' && self.rewashTrailerCheckbox){
            return 'Empty Clean'
          }
          else if(self.newLoadStatus === 'Empty Load' && self.doNotWashTrailerCheckboxEnabled){
            return 'Empty Dirty'
          }
          else {
            return self.newLoadStatus;
          }
        })(),
        referUnitMode: this.referUnitMode === 'Choose Mode' ? 'not-set' : this.referUnitMode,
        rewashTrailer: this.rewashTrailerCheckbox
      }

      // Combine this formData object with the prop that was passed into the component
      // The prop contains all of the remaining properties about this record.
      // ES6 spread {...} operator will allow for this ability to combine objects
      
      const masterPayload = {...formData, ...this.trailer}

      // Show loader
      Swal.fire('Please wait');
      Swal.showLoading();

      // Send the form data to the API
      api.CallTrailerOutOfDock(masterPayload, (error, response) => {
        Swal.close();
        if(response.Status === 'success'){
          // self.form = {} // Reset the form
          Swal.fire(
            'Good job!',
            'Your Call Out was Successful!',
            'success'
          );
        }
        else{
          Swal.close();
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: 'Problem. Please try again!',
          });
        }
      });

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
.list-group{
    max-height: 300px;
    margin-bottom: 10px;
    overflow:scroll;
    -webkit-overflow-scrolling: touch;
}

.disableReWashStatus, .disableDoNotWashStatus {
  opacity:0.4; 
  pointer-events:none;
}


fieldset {
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0;
}
.well {
  min-height: 20px;
  padding: 19px;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
}
.well-legend {
  display: block;
  font-size: 14px;
  width: auto;
  padding: 2px 7px 2px 5px;
  margin-bottom: 20px;
  line-height: inherit;
  color: #333;
  background: #fff;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .05);
}

</style>
