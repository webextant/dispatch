<template>
  <div id="app">

    <!-- Optional Navbar added -->
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <!-- <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button> -->
          <a class="navbar-brand" href="#" style="pointer-events:none">
            <!-- Webextant | Dispatch -->
            <img width="100px" src="@/assets/webextant_logo_white.png">
          </a>
        </div>
        <!-- <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#">Help</a></li>
          </ul>
        </div> -->
      </div>
    </nav>

    <!-- Here the actual components -->
    
    <!-- <Component1 dockId="ABC123"></Component1> -->
    <Component2 :trailer="trailer"></Component2>


  </div>
</template>

<script>
import Component1 from './components/Component1.vue'
import Component2 from './components/Component2.vue'

export default {
  name: 'app',
  components: {
    Component1,
    Component2
  },
  data: function(){
    return {
      // Just an example of passing a trailer into the component
      // This would be obtained from the API and then sent directly into this component
      trailer: {
        "SystemId": 179390,
        "Carrier": "Brady Express Inc.",
        "Scac": "RLB3",
        "TrailerNumber": "BRAD1234567890",
        "LoadStatus": "COMPLETE",
        "IsLoaded": true,
        "Temperature": "6",
        "CurrentLocation": "LOD",
        "MoveStatus": "Parked on Lot",
        "Classification": "Refrigerated Load",
        "PalletsOnBoard": "Unknown",
        "LoadStatusColorClass": "complete",
        "LoadStatusImage": "content/images/F.png",
        "InDockDoorClass": "kl-parked-on-yard",
        "LatestEvents": []
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
